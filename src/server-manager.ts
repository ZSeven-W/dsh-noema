/**
 * Pull-based lifecycle manager for the Noema MCP stdio server.
 *
 * The manager spawns on first use (or at mount when autoStart is set), keeps
 * one connection, applies an idle timeout, backs off restarts after crashes,
 * and exposes a small status face for the settings route.
 * @module @zseven-w/dsh-noema/server-manager
 */
import { expandHome } from './util.js'
import { McpStdioClient, McpStdioError, type McpToolResult } from './mcp-stdio.js'
import type { NoemaMemorySettings } from './settings.js'
import { BUNDLED_NOEMA_COMMAND, resolveBundledNoemaBinary } from './bundled-binary.js'

export interface NoemaServerCallOptions {
  signal?: AbortSignal
}

export interface NoemaServerStatus {
  ok: boolean
  state: 'stopped' | 'starting' | 'running' | 'unavailable'
  pid?: number
  startedAt?: number
  lastError?: string
  /** Noema-side tenant/engine status, present when connected. */
  server?: unknown
}

export interface NoemaLogger {
  info(message: string): void
  warn(message: string): void
}

export interface NoemaLaunch {
  command: string
  args: string[]
  cwd?: string
  env: Record<string, string | undefined>
}

/** Split a configured command into argv without shell quoting rules. */
export function tokenizeCommand(command: string): string[] {
  const tokens: string[] = []
  const source = command.trim()
  let current = ''
  let quote: '"' | "'" | undefined
  for (const character of source) {
    if (quote !== undefined) {
      if (character === quote) quote = undefined
      else current += character
      continue
    }
    if (character === '"' || character === "'") {
      quote = character
      continue
    }
    if (/\s/.test(character)) {
      if (current !== '') {
        tokens.push(current)
        current = ''
      }
      continue
    }
    current += character
  }
  if (current !== '') tokens.push(current)
  return tokens
}

/** Resolve a settings section into a spawn descriptor. */
export function resolveNoemaLaunch(
  config: NoemaMemorySettings,
  resolveBundledBinary: () => string = resolveBundledNoemaBinary,
): NoemaLaunch {
  const configuredCommand = config.command.trim()
  const tokens = configuredCommand === BUNDLED_NOEMA_COMMAND
    ? [resolveBundledBinary()]
    : tokenizeCommand(configuredCommand)
  if (tokens.length === 0) throw new Error('Noema memory: server command must not be empty')
  const launch: NoemaLaunch = {
    command: tokens[0],
    args: tokens.slice(1),
    env: {},
  }
  if (config.workingDirectory.trim() !== '') launch.cwd = expandHome(config.workingDirectory.trim())
  if (config.noemaRoot.trim() !== '') launch.env.NOEMA_ROOT = expandHome(config.noemaRoot.trim())
  return launch
}

function sleep(milliseconds: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

/** Owns the Noema server child and its restart/idle/keep-alive policy. */
export class NoemaServerManager {
  private client: McpStdioClient | undefined
  private starting: Promise<void> | undefined
  private lastError: string | undefined
  private idleTimer: ReturnType<typeof setTimeout> | undefined
  private keepAliveTimer: ReturnType<typeof setInterval> | undefined
  private keepAliveRunning = false
  private lastKeepAliveCheckAt = 0
  private lastStopAt = 0
  private disposed = false

  constructor(
    private readonly resolveConfig: () => NoemaMemorySettings,
    private readonly logger?: NoemaLogger,
  ) {}

  /**
   * Start the crash keep-alive loop. While enabled, an exited/crashed server
   * is restarted in the background; intentional idle stops and manual stops
   * are never fought (state 'stopped' stays stopped).
   */
  startKeepAlive(): void {
    if (this.keepAliveRunning || this.disposed) return
    this.keepAliveRunning = true
    const tick = (): void => {
      if (this.disposed || !this.keepAliveRunning) return
      void this.keepAliveTick().catch(() => {})
    }
    this.keepAliveTimer = setInterval(tick, 1000)
    this.keepAliveTimer.unref?.()
  }

  /** Stop the keep-alive loop (restarting the plugin or manual control). */
  stopKeepAlive(): void {
    this.keepAliveRunning = false
    if (this.keepAliveTimer !== undefined) clearInterval(this.keepAliveTimer)
    this.keepAliveTimer = undefined
  }

  private async keepAliveTick(): Promise<void> {
    const now = Date.now()
    const config = this.resolveConfig()
    if (!config.enabled || !config.keepAlive) return
    if (now - this.lastKeepAliveCheckAt < config.keepAliveIntervalMs) return
    this.lastKeepAliveCheckAt = now
    if (this.client?.state !== 'exited') return
    const sinceExit = now - (this.client.exitAt ?? now)
    if (sinceExit < config.restartDelayMs) return
    this.logger?.warn('dsh-noema keep-alive: memory server exited; restarting in the background')
    await this.ensureRunning()
    this.logger?.info('dsh-noema keep-alive: memory server restarted')
  }

  /** Bring the server up if it is down; concurrent callers share one spawn. */
  async ensureRunning(): Promise<void> {
    if (this.disposed) throw new Error('Noema memory plugin is disposed')
    const state = this.client?.state
    if (state === 'running') return
    if (this.starting !== undefined) {
      await this.starting
      return
    }
    this.starting = this.start()
    try {
      await this.starting
    } finally {
      this.starting = undefined
    }
  }

  /** Call one Noema MCP tool, starting the server on demand. */
  async call(name: string, args: Record<string, unknown>, options: NoemaServerCallOptions = {}): Promise<McpToolResult> {
    if (options.signal?.aborted === true) throw new McpStdioError('call aborted', { cause: options.signal.reason })
    await this.ensureRunning()
    const client = this.client
    if (client === undefined || client.state !== 'running') {
      throw new McpStdioError('Noema memory server is not running')
    }
    const config = this.resolveConfig()
    try {
      const result = await client.callTool(name, args, { timeoutMs: config.callTimeoutMs, signal: options.signal })
      this.armIdle(config)
      return result
    } catch (error) {
      // The const's state was narrowed to 'running' before the await; read it
      // freshly through the manager field, which the call may have replaced.
      if (this.client === undefined || (this.client.state as string) === 'exited') {
        this.lastError = error instanceof Error ? error.message : String(error)
      }
      throw error
    }
  }

  /** Stop (if running) and start again; used by the settings route. */
  async restart(): Promise<void> {
    this.lastStopAt = Date.now()
    await this.stop()
    await this.ensureRunning()
  }

  /** Stop the server and clear idle state. */
  async stop(): Promise<void> {
    this.clearIdle()
    const client = this.client
    this.client = undefined
    this.lastStopAt = Date.now()
    if (client !== undefined) await client.dispose()
  }

  /** Snapshot for the settings route: lifecycle state plus engine status. */
  async status(): Promise<NoemaServerStatus> {
    const config = this.resolveConfig()
    if (!config.enabled) {
      return { ok: false, state: 'unavailable', lastError: 'Noema memory is disabled in settings' }
    }
    const client = this.client
    if (client === undefined || client.state !== 'running') {
      return {
        ok: false,
        state: client?.state === 'starting' ? 'starting' : 'stopped',
        ...(this.lastError === undefined ? {} : { lastError: this.lastError }),
      }
    }
    let server: unknown
    try {
      const result = await client.callTool('noema_status', {}, { timeoutMs: config.callTimeoutMs })
      try {
        server = JSON.parse(result.text)
      } catch {
        server = result.text === '' ? undefined : { text: result.text }
      }
    } catch (error) {
      server = { error: error instanceof Error ? error.message : String(error) }
    }
    return {
      ok: true,
      state: 'running',
      pid: client.pid,
      startedAt: client.startedAt,
      server,
    }
  }

  /** Tear down for plugin disposal: stop the child and refuse new work. */
  async dispose(): Promise<void> {
    this.disposed = true
    this.stopKeepAlive()
    await this.stop()
  }

  private async start(): Promise<void> {
    const config = this.resolveConfig()
    const sinceStop = Date.now() - this.lastStopAt
    if (sinceStop < config.restartDelayMs) await sleep(config.restartDelayMs - sinceStop)
    const launch = resolveNoemaLaunch(config)
    const client = new McpStdioClient({
      command: launch.command,
      args: launch.args,
      ...(launch.cwd === undefined ? {} : { cwd: launch.cwd }),
      env: launch.env,
      stderr: line => this.logger?.warn('dsh-noema server: ' + line),
    })
    this.client = client
    try {
      await client.start()
      this.lastError = undefined
      this.armIdle(config)
      this.logger?.info('dsh-noema: Noema memory server started (' + launch.command + ')')
    } catch (error) {
      this.client = undefined
      this.lastError = error instanceof Error ? error.message : String(error)
      await client.dispose().catch(() => {})
      const remedy = config.command.trim() === BUNDLED_NOEMA_COMMAND
        ? 'Reinstall @zseven-w/dsh-noema so npm can select its native optional package, or run npm run build:noema:dev in a source checkout.'
        : 'Check the server command under Settings → Noema Memory.'
      throw new Error(
        'Noema memory server failed to start: ' + this.lastError +
        '. ' + remedy,
      )
    }
  }

  private armIdle(config: NoemaMemorySettings): void {
    this.clearIdle()
    if (config.idleTimeoutMs <= 0) return
    this.idleTimer = setTimeout(() => {
      this.logger?.info('dsh-noema: Noema memory server idle; stopping')
      void this.stop()
    }, config.idleTimeoutMs)
    this.idleTimer.unref?.()
  }

  private clearIdle(): void {
    if (this.idleTimer !== undefined) clearTimeout(this.idleTimer)
    this.idleTimer = undefined
  }
}
