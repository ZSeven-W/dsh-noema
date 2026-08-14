/**
 * Loopback-only status route for the settings panel: reports server lifecycle
 * plus the Noema engine status, and accepts lifecycle/configuration actions.
 * @module @zseven-w/dsh-noema/status-route
 */
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { WebServer } from '@deepseek-ai/dsh-host-webserver'
import type { NoemaServerManager } from './server-manager.js'
import type { MemoryImportService } from './import-service.js'
import type { NoemaMemorySettings } from './settings.js'
import { NOEMA_STATUS_ROUTE } from './names.js'

const WRITABLE_FIELDS = new Set<keyof NoemaMemorySettings>([
  'enabled',
  'command',
  'workingDirectory',
  'noemaRoot',
  'autoStart',
  'idleTimeoutMs',
  'keepAlive',
  'keepAliveIntervalMs',
  'callTimeoutMs',
  'restartDelayMs',
  'recallBudgetTokens',
  'acceptByDefault',
  'guidance',
  'importEnabled',
  'importOnStartup',
  'importWorkspaceFiles',
  'importMaxBytes',
  'importSources',
])

function isIpv4LoopbackAddress(address: string): boolean {
  const parts = address.split('.')
  return parts.length === 4
    && parts[0] === '127'
    && parts.every(part => /^\d{1,3}$/u.test(part) && Number(part) <= 255)
}

/** Trust the transport peer, including Node's IPv4-mapped IPv6 forms. */
export function isLoopbackRemoteAddress(address: string | undefined): boolean {
  if (address === undefined) return false
  const normalized = address.toLowerCase().split('%', 1)[0]!
  if (normalized === '::1' || isIpv4LoopbackAddress(normalized)) return true
  if (!normalized.startsWith('::ffff:')) return false
  const mapped = normalized.slice('::ffff:'.length)
  if (isIpv4LoopbackAddress(mapped)) return true
  const hexadecimal = /^([a-f0-9]{1,4}):([a-f0-9]{1,4})$/u.exec(mapped)
  return hexadecimal !== null && (Number.parseInt(hexadecimal[1]!, 16) >>> 8) === 127
}

function isLoopbackHostname(hostname: string): boolean {
  if (hostname === 'localhost' || hostname === '[::1]' || hostname === '::1') return true
  return isIpv4LoopbackAddress(hostname)
}

function requestAuthority(req: IncomingMessage): URL | undefined {
  const host = req.headers.host
  if (typeof host !== 'string') return undefined
  try {
    const parsed = new URL('http://' + host)
    if (parsed.pathname !== '/' || parsed.search !== '' || parsed.hash !== '' || parsed.username !== '' || parsed.password !== '') {
      return undefined
    }
    return parsed
  } catch {
    return undefined
  }
}

/** Reject remote peers and DNS-rebinding Host headers before serving data. */
function isLoopbackRequest(req: IncomingMessage): boolean {
  if (!isLoopbackRemoteAddress(req.socket?.remoteAddress)) return false
  const authority = requestAuthority(req)
  return authority !== undefined && isLoopbackHostname(authority.hostname)
}

/** Apply Fetch-Metadata/Origin checks; mutations require an Origin. */
function isTrustedBrowserRequest(req: IncomingMessage, requireOrigin: boolean): boolean {
  if (req.headers['sec-fetch-site'] === 'cross-site') return false
  const origin = req.headers.origin
  if (origin === undefined) return !requireOrigin
  if (typeof origin !== 'string') return false
  const authority = requestAuthority(req)
  if (authority === undefined) return false
  try {
    const parsed = new URL(origin)
    return (parsed.protocol === 'http:' || parsed.protocol === 'https:')
      && parsed.host === authority.host
  } catch {
    return false
  }
}

function isJsonRequest(req: IncomingMessage): boolean {
  const contentType = req.headers['content-type']
  return typeof contentType === 'string' && /^application\/json(?:\s*;|$)/iu.test(contentType)
}

function sendJson(res: ServerResponse, status: number, value: unknown, headers: Record<string, string> = {}): void {
  const body = JSON.stringify(value)
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'content-length': Buffer.byteLength(body),
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    'cross-origin-resource-policy': 'same-origin',
    'referrer-policy': 'no-referrer',
    ...headers,
  })
  res.end(body)
}

class StatusRouteError extends Error {
  constructor(readonly status: number, message: string) {
    super(message)
  }
}

async function readBody(req: IncomingMessage, maxBytes = 16 * 1024): Promise<string> {
  const contentLength = req.headers['content-length']
  if (typeof contentLength === 'string') {
    const declared = Number(contentLength)
    if (!Number.isSafeInteger(declared) || declared < 0) throw new StatusRouteError(400, 'invalid content-length')
    if (declared > maxBytes) throw new StatusRouteError(413, 'request body too large')
  }
  const chunks: Buffer[] = []
  let total = 0
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    total += buffer.length
    if (total > maxBytes) throw new StatusRouteError(413, 'request body too large')
    chunks.push(buffer)
  }
  return Buffer.concat(chunks).toString('utf8')
}

/** Register the status route; returns the route disposer. */
export function registerNoemaStatusRoute(
  webServer: WebServer,
  manager: NoemaServerManager,
  resolveConfig: () => NoemaMemorySettings,
  resolveConfigWriter: () => ((patch: Partial<NoemaMemorySettings>) => Promise<void>) | undefined = () => undefined,
  importService?: MemoryImportService,
): () => void {
  const snapshot = async (): Promise<Record<string, unknown>> => {
    const { ok: _ok, ...status } = await manager.status()
    return {
      ok: true,
      ...status,
      config: resolveConfig(),
      writable: resolveConfigWriter() !== undefined,
      ...(importService?.lastSummary === undefined ? {} : { lastImport: importService.lastSummary }),
    }
  }
  return webServer.register({
    kind: 'exact',
    path: NOEMA_STATUS_ROUTE,
    handler: async (req, res) => {
      if (!isLoopbackRequest(req)) {
        sendJson(res, 403, { ok: false, error: 'the Noema status route is loopback-only' })
        return
      }
      if (!isTrustedBrowserRequest(req, req.method === 'POST')) {
        sendJson(res, 403, { ok: false, error: 'the Noema status route requires a same-origin DSH browser context' })
        return
      }
      if (req.method === 'GET') {
        sendJson(res, 200, await snapshot())
        return
      }
      if (req.method === 'POST') {
        if (!isJsonRequest(req)) {
          sendJson(res, 415, { ok: false, error: 'Noema settings writes require application/json' })
          return
        }
        let payload: Record<string, unknown>
        try {
          const body = await readBody(req)
          const parsed: unknown = body.trim() === '' ? {} : JSON.parse(body)
          payload = typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
            ? parsed as Record<string, unknown>
            : {}
        } catch (error) {
          const status = error instanceof StatusRouteError ? error.status : 400
          sendJson(res, status, { ok: false, error: 'invalid JSON body: ' + (error instanceof Error ? error.message : String(error)) })
          return
        }
        const action = payload.action
        if (action === 'restart') {
          try {
            await manager.restart()
            sendJson(res, 200, await snapshot())
          } catch (error) {
            sendJson(res, 502, { ok: false, error: error instanceof Error ? error.message : String(error) })
          }
          return
        }
        if (action === 'stop') {
          await manager.stop()
          sendJson(res, 200, await snapshot())
          return
        }
        if (action === 'configure') {
          const field = payload.field
          if (typeof field !== 'string' || !WRITABLE_FIELDS.has(field as keyof NoemaMemorySettings)) {
            sendJson(res, 400, { ok: false, error: 'unknown Noema memory settings field' })
            return
          }
          const updateConfig = resolveConfigWriter()
          if (updateConfig === undefined) {
            sendJson(res, 409, { ok: false, error: 'Noema memory settings are not writable in this session' })
            return
          }
          try {
            await updateConfig({ [field]: payload.value })
            sendJson(res, 200, await snapshot())
          } catch (error) {
            sendJson(res, 422, { ok: false, error: error instanceof Error ? error.message : String(error) })
          }
          return
        }
        if (action === 'memory') {
          const op = payload.op
          const call = (tool: string, args: Record<string, unknown>): Promise<{ text: string }> =>
            manager.call(tool, args, {})
          try {
            if (op === 'search') {
              if (typeof payload.query !== 'string' || payload.query.trim() === '') {
                sendJson(res, 400, { ok: false, error: 'memory search needs a query' })
                return
              }
              const result = await call('noema_recall', { query: payload.query.trim(), budget_tokens: 1500 })
              sendJson(res, 200, { ok: true, text: result.text })
              return
            }
            if (op === 'catalog') {
              const result = await call('noema_catalog', {})
              sendJson(res, 200, { ok: true, text: result.text })
              return
            }
            if (op === 'browse') {
              if (typeof payload.query !== 'string' || payload.query.trim() === '') {
                sendJson(res, 400, { ok: false, error: 'memory browse needs a query' })
                return
              }
              const limit = typeof payload.limit === 'number' && Number.isInteger(payload.limit) ? Math.min(Math.max(payload.limit, 1), 50) : 30
              const result = await call('noema_browse', { query: payload.query.trim(), limit })
              sendJson(res, 200, { ok: true, text: result.text })
              return
            }
            if (op === 'add') {
              if (typeof payload.text !== 'string' || payload.text.trim() === '') {
                sendJson(res, 400, { ok: false, error: 'memory add needs text' })
                return
              }
              const result = await call('noema_remember', {
                text: payload.text.trim(),
                tags: ['ui-added', ...(Array.isArray(payload.tags) ? payload.tags.filter((tag): tag is string => typeof tag === 'string') : [])],
                ...(Array.isArray(payload.entities) ? { entities: payload.entities.filter((entity): entity is string => typeof entity === 'string') } : {}),
                accept: true,
              })
              sendJson(res, 200, { ok: true, text: result.text })
              return
            }
            if (op === 'forget') {
              if (typeof payload.memory_id !== 'string' || payload.memory_id === '') {
                sendJson(res, 400, { ok: false, error: 'memory forget needs a memory_id' })
                return
              }
              const result = await call('noema_forget', { memory_id: payload.memory_id, hard: payload.hard === true })
              sendJson(res, 200, { ok: true, text: result.text })
              return
            }
            if (op === 'review') {
              const result = await call('noema_review_list', {})
              sendJson(res, 200, { ok: true, text: result.text })
              return
            }
            if (op === 'review_decide') {
              if (typeof payload.candidate_id !== 'string' || typeof payload.decision !== 'string') {
                sendJson(res, 400, { ok: false, error: 'memory review needs a candidate_id and decision' })
                return
              }
              const result = await call('noema_review_decide', {
                candidate_id: payload.candidate_id,
                decision: payload.decision,
                ...(typeof payload.reason === 'string' ? { reason: payload.reason } : {}),
                ...(typeof payload.body === 'string' ? { body: payload.body } : {}),
                ...(typeof payload.target_memory_id === 'string' ? { target_memory_id: payload.target_memory_id } : {}),
              })
              sendJson(res, 200, { ok: true, text: result.text })
              return
            }
            sendJson(res, 400, { ok: false, error: 'unknown memory op; expected search, catalog, add, forget, review, or review_decide' })
          } catch (error) {
            sendJson(res, 502, { ok: false, error: error instanceof Error ? error.message : String(error) })
          }
          return
        }
        if (action === 'import') {
          if (importService === undefined) {
            sendJson(res, 409, { ok: false, error: 'the memory import service is unavailable in this deployment' })
            return
          }
          const sources = Array.isArray(payload.sources) && payload.sources.every(source => typeof source === 'string')
            ? payload.sources as string[]
            : undefined
          const workspaceRoot = typeof payload.path === 'string' && payload.path !== '' ? payload.path : undefined
          try {
            const summary = await importService.run({
              sources,
              workspaceRoot,
              force: payload.force === true,
            })
            const snap = await snapshot()
            sendJson(res, 200, { ...snap, import: summary })
          } catch (error) {
            sendJson(res, 502, { ok: false, error: error instanceof Error ? error.message : String(error) })
          }
          return
        }
        sendJson(res, 400, { ok: false, error: 'unknown action; expected restart, stop, configure, or import' })
        return
      }
      sendJson(res, 405, { ok: false, error: 'method not allowed' }, { allow: 'GET, POST' })
    },
  })
}
