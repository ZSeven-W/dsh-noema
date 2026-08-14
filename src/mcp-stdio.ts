/**
 * Minimal MCP stdio client for one Noema memory server.
 *
 * Speaks newline-delimited JSON-RPC over the child's stdin/stdout — the
 * framing rmcp 1.7's stdio transport uses — and performs the required
 * initialize → notifications/initialized handshake before tools/call.
 * @module @zseven-w/dsh-noema/mcp-stdio
 */
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process'
import { DSH_NOEMA_VERSION } from './version.js'

/** Bounded protocol envelope sizes, generous for full catalogs. */
export const MAX_MCP_MESSAGE_BYTES = 8 * 1024 * 1024

/** MCP protocol version negotiated during initialize. */
export const MCP_PROTOCOL_VERSION = '2024-11-05'

/** How long the initialize handshake may take before the server is rejected. */
export const DEFAULT_INITIALIZE_TIMEOUT_MS = 15_000

export interface McpStdioOptions {
  command: string
  args?: string[]
  cwd?: string
  env?: Record<string, string | undefined>
  initializeTimeoutMs?: number
  /** Each stderr line the server prints; used for diagnostics, never protocol. */
  stderr?: (line: string) => void
}

export interface McpToolResult {
  /** Joined text content of the tool result; '' when the result had none. */
  text: string
}

interface PendingCall {
  resolve: (value: unknown) => void
  reject: (error: Error) => void
}

/** One client lifecycle error (spawn, protocol, tool, or exit). */
export class McpStdioError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options)
    this.name = 'McpStdioError'
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Extract joined text content from a tools/call result envelope. */
function textFromContent(value: unknown): string {
  if (!isRecord(value) || !Array.isArray(value.content)) return ''
  const parts: string[] = []
  for (const item of value.content) {
    if (isRecord(item) && item.type === 'text' && typeof item.text === 'string') parts.push(item.text)
  }
  return parts.join('\n')
}

function errorMessageFrom(value: unknown): string {
  if (isRecord(value) && isRecord(value.error)) {
    if (typeof value.error.message === 'string' && value.error.message !== '') return value.error.message
    return JSON.stringify(value.error)
  }
  return JSON.stringify(value)
}

/**
 * One Noema MCP stdio connection. Pull-based: the owner starts it, calls
 * tools, and disposes it; a server exit rejects every in-flight call.
 */
export class McpStdioClient {
  private child: ChildProcessWithoutNullStreams | undefined
  private nextId = 1
  private readonly pending = new Map<number | string, PendingCall>()
  private buffer = ''
  private disposed = false

  /** Observed lifecycle state for the manager and status route. */
  state: 'stopped' | 'starting' | 'running' | 'exited' = 'stopped'
  /** Child pid while spawned; undefined otherwise. */
  get pid(): number | undefined {
    return this.child?.pid
  }
  exitCode: number | null | undefined
  exitSignal: string | null | undefined
  startedAt: number | undefined
  /** When the process exited; drives the keep-alive backoff window. */
  exitAt: number | undefined

  constructor(private readonly options: McpStdioOptions) {}

  /** Spawn (if needed) and complete the initialize handshake. */
  async start(): Promise<void> {
    if (this.disposed) throw new McpStdioError('client is disposed')
    if (this.child !== undefined && this.state === 'running') return
    if (this.child !== undefined && this.state === 'starting') {
      throw new McpStdioError('start already in progress')
    }
    await this.spawn()
    try {
      await this.request(
        'initialize',
        {
          protocolVersion: MCP_PROTOCOL_VERSION,
          capabilities: {},
          clientInfo: { name: 'dsh-noema', version: DSH_NOEMA_VERSION },
        },
        this.options.initializeTimeoutMs ?? DEFAULT_INITIALIZE_TIMEOUT_MS,
      )
      this.notify('notifications/initialized')
    } catch (error) {
      // Dispose the still-referenced child (SIGTERM, then SIGKILL) instead of
      // dropping the reference: a failed handshake must not orphan a process.
      await this.dispose().catch(() => {})
      throw error
    }
    this.state = 'running'
    this.startedAt = Date.now()
  }

  /** Call one MCP tool and return its joined text content. */
  async callTool(name: string, args: Record<string, unknown>, options: { timeoutMs: number; signal?: AbortSignal }): Promise<McpToolResult> {
    if (this.child === undefined || this.state !== 'running') {
      throw new McpStdioError('Noema memory server is not running; start it or check the memory settings')
    }
    if (options.signal?.aborted === true) {
      throw new McpStdioError('call aborted', { cause: options.signal.reason })
    }
    const response = await this.request('tools/call', { name, arguments: args ?? {} }, options.timeoutMs, options.signal)
    if (!isRecord(response)) {
      throw new McpStdioError('Noema MCP ' + name + ' returned an invalid response')
    }
    if (response.isError === true) {
      const text = textFromContent(response)
      throw new McpStdioError('Noema MCP ' + name + ' failed' + (text === '' ? '' : ': ' + text))
    }
    return { text: textFromContent(response) }
  }

  /** Stop the child (SIGTERM, then SIGKILL) and reject all in-flight calls. */
  async dispose(): Promise<void> {
    if (this.disposed) return
    this.disposed = true
    const child = this.child
    this.child = undefined
    this.rejectPending(new McpStdioError('Noema memory server was stopped'))
    if (child === undefined) {
      this.state = this.state === 'exited' ? 'exited' : 'stopped'
      return
    }
    const TIMEOUT = 'timeout'
    const exited = new Promise<void>(resolve => {
      child.once('exit', () => resolve())
      if (child.exitCode !== null || child.signalCode !== null) resolve()
    })
    child.kill('SIGTERM')
    const outcome = await Promise.race([
      exited.then(() => 'exited' as const),
      new Promise<'timeout'>(resolve => setTimeout(() => resolve(TIMEOUT), 1_500)),
    ])
    if (outcome === TIMEOUT) {
      child.kill('SIGKILL')
      await Promise.race([exited, new Promise<void>(resolve => setTimeout(resolve, 1_000))])
    }
    if (this.state !== 'exited') this.state = 'stopped'
  }

  private async spawn(): Promise<void> {
    const child = spawn(this.options.command, this.options.args ?? [], {
      cwd: this.options.cwd,
      env: { ...process.env, ...this.options.env },
      stdio: ['pipe', 'pipe', 'pipe'],
      windowsHide: true,
    })
    this.child = child
    this.state = 'starting'
    this.exitCode = undefined
    this.exitSignal = undefined
    await new Promise<void>((resolve, reject) => {
      const onError = (error: Error): void => {
        child.off('spawn', onSpawn)
        child.off('error', onError)
        this.child = undefined
        this.state = 'stopped'
        reject(new McpStdioError('failed to spawn ' + this.options.command + ': ' + error.message, { cause: error }))
      }
      const onSpawn = (): void => {
        child.off('spawn', onSpawn)
        child.off('error', onError)
        resolve()
      }
      child.once('error', onError)
      child.once('spawn', onSpawn)
    })
    child.on('exit', (code, signal) => this.handleExit(code, signal))
    child.stdout.setEncoding('utf8')
    child.stdout.on('data', (chunk: string) => this.onStdout(chunk))
    child.stderr.setEncoding('utf8')
    child.stderr.on('data', (chunk: string) => {
      for (const line of chunk.split('\n')) {
        if (line.trim() !== '') this.options.stderr?.(line)
      }
    })
  }

  private handleExit(code: number | null, signal: string | null): void {
    if (this.disposed) return
    this.markExited()
    this.exitCode = code
    this.exitSignal = signal
    this.exitAt = Date.now()
    this.rejectPending(new McpStdioError('Noema memory server exited' + (code === null ? '' : ' (code ' + code + ')')))
  }

  private markExited(): void {
    this.child = undefined
    if (this.state !== 'exited') this.state = 'exited'
  }

  private onStdout(chunk: string): void {
    this.buffer += chunk
    for (;;) {
      const newline = this.buffer.indexOf('\n')
      if (newline < 0) break
      const line = this.buffer.slice(0, newline)
      this.buffer = this.buffer.slice(newline + 1)
      if (line.trim() !== '') this.onLine(line)
    }
    if (this.buffer.length > MAX_MCP_MESSAGE_BYTES) {
      this.rejectPending(new McpStdioError('Noema MCP response exceeded the message size limit'))
      void this.dispose()
    }
  }

  private onLine(line: string): void {
    if (line.length > MAX_MCP_MESSAGE_BYTES) {
      this.rejectPending(new McpStdioError('Noema MCP response exceeded the message size limit'))
      void this.dispose()
      return
    }
    let message: unknown
    try {
      message = JSON.parse(line)
    } catch {
      this.rejectPending(new McpStdioError('Noema MCP server emitted an invalid JSON line'))
      void this.dispose()
      return
    }
    if (!isRecord(message) || (typeof message.id !== 'number' && typeof message.id !== 'string')) return
    const pending = this.pending.get(message.id as number | string)
    if (pending === undefined) return
    this.pending.delete(message.id)
    if (isRecord(message.error)) {
      pending.reject(new McpStdioError('Noema MCP error: ' + errorMessageFrom(message)))
    } else {
      pending.resolve(message.result)
    }
  }

  private request(method: string, params: unknown, timeoutMs: number, signal?: AbortSignal): Promise<unknown> {
    if (this.child === undefined || this.child.stdin.destroyed) {
      return Promise.reject(new McpStdioError('Noema memory server is not running'))
    }
    const id = this.nextId++
    return new Promise<unknown>((resolve, reject) => {
      const timer = setTimeout(() => {
        if (!this.pending.delete(id)) return
        reject(new McpStdioError('Noema MCP ' + method + ' timed out after ' + timeoutMs + 'ms'))
      }, timeoutMs)
      const onAbort = (): void => {
        if (!this.pending.delete(id)) return
        reject(new McpStdioError('Noema MCP ' + method + ' aborted'))
      }
      signal?.addEventListener('abort', onAbort, { once: true })
      this.pending.set(id, {
        resolve: value => {
          clearTimeout(timer)
          signal?.removeEventListener('abort', onAbort)
          resolve(value)
        },
        reject: error => {
          clearTimeout(timer)
          signal?.removeEventListener('abort', onAbort)
          reject(error)
        },
      })
      this.send({ jsonrpc: '2.0', id, method, params })
    })
  }

  private notify(method: string, params?: unknown): void {
    this.send({ jsonrpc: '2.0', method, ...(params === undefined ? {} : { params }) })
  }

  private send(message: Record<string, unknown>): void {
    const child = this.child
    if (child === undefined) throw new McpStdioError('Noema memory server is not running')
    child.stdin.write(JSON.stringify(message) + '\n')
  }

  private rejectPending(error: Error): void {
    for (const [, pending] of this.pending) pending.reject(error)
    this.pending.clear()
  }
}
