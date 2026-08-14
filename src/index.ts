/**
 * @zseven-w/dsh-noema — long-term memory for DSH, backed by Noema.
 *
 * Plugin lifecycle: register the settings namespace, the model-facing
 * noema_* tools, a system-prompt guidance section, and a loopback status
 * route for the settings panel. Everything is registered through
 * ctx.effect / ctx.inject (or the returned disposer) so unloading the
 * plugin removes every contribution.
 *
 * The Noema engine itself runs out of process: the plugin spawns the
 * noema-mcp stdio server (command configured in settings) and speaks
 * newline-delimited JSON-RPC to it.
 * @module @zseven-w/dsh-noema
 */
import type { Context } from '@deepseek-ai/cordis'
import type ToolRegistry from '@deepseek-ai/dsh-tools'
import type { SystemPrompt } from '@deepseek-ai/dsh-system-prompt'
import type WebServer from '@deepseek-ai/dsh-host-webserver'
import { PLUGIN_NAME, NOEMA_TOOL_NAMES } from './names.js'
import {
  Config,
  installNoemaMemorySettings,
  resolveNoemaMemorySettings,
  type NoemaMemorySettings,
} from './settings.js'
import { NoemaServerManager } from './server-manager.js'
import { MemoryImportService } from './import-service.js'
import { createNoemaTools } from './tools.js'
import { noemaGuidanceText, NOEMA_GUIDANCE_SECTION } from './guidance.js'
import { registerNoemaStatusRoute } from './status-route.js'

export { PLUGIN_NAME, NOEMA_TOOL_NAMES, NOEMA_MEMORY_SETTINGS_NAMESPACE, NOEMA_STATUS_ROUTE } from './names.js'
export { NOEMA_MEMORY_SETTINGS_NS, NOEMA_MEMORY_SETTINGS_SCHEMA, NOEMA_MEMORY_SETTINGS_DEFAULTS, type NoemaMemorySettings } from './settings.js'
export { McpStdioClient, McpStdioError, MCP_PROTOCOL_VERSION } from './mcp-stdio.js'
export { DSH_NOEMA_VERSION } from './version.js'
export { NoemaServerManager, resolveNoemaLaunch, tokenizeCommand, type NoemaServerStatus } from './server-manager.js'
export { BUNDLED_NOEMA_COMMAND, NOEMA_PLATFORM_PACKAGES, bundledNoemaCandidates, noemaPlatformKey, noemaPlatformPackage, resolveBundledNoemaBinary, tryResolveBundledNoemaBinary } from './bundled-binary.js'
export { createNoemaTools, type NoemaToolResult } from './tools.js'
export { noemaGuidanceText } from './guidance.js'
export { registerNoemaStatusRoute } from './status-route.js'

/** Stable plugin name (the loader entry id in cordis.patch.yml). */
export const name = PLUGIN_NAME

/** Services this plugin's root fiber requires. */
export const inject = ['tools']

/** Entry-config face accepted by the cordis loader. */
export { Config }

type HostContext = Context & {
  tools: ToolRegistry
}

interface SystemPromptContext extends Context {
  systemPrompt: SystemPrompt
}

interface WebServerContext extends Context {
  webServer: WebServer
}

/**
 * Plugin entry: mount every contribution and return the aggregate disposer.
 * The memory server itself starts lazily (first tool call) or at mount when
 * autoStart is enabled; start failures degrade to tool-call errors instead of
 * breaking profile boot.
 */
export async function apply(ctx: Context, config?: Partial<NoemaMemorySettings>): Promise<() => Promise<void>> {
  const hostCtx = ctx as HostContext
  const entry = config ?? {}
  let settingsSource = () => resolveNoemaMemorySettings(entry)
  let settingsWriter: ((patch: Partial<NoemaMemorySettings>) => Promise<void>) | undefined

  installNoemaMemorySettings(ctx, entry, {
    setSource: source => {
      settingsSource = source
    },
    setWriter: writer => {
      settingsWriter = writer
    },
    onChange: () => {
      // Guidance text and tool defaults read resolved per use, so every
      // live-facing aspect reacts without extra work here.
    },
  })

  const manager = new NoemaServerManager(() => settingsSource(), ctx.logger)
  const importService = new MemoryImportService(manager, () => settingsSource(), ctx.logger)
  const disposers: Array<() => void | Promise<void>> = []

  for (const tool of createNoemaTools(manager, () => settingsSource(), importService)) {
    disposers.push(ctx.effect(
      () => hostCtx.tools.register(tool),
      'dsh-noema: ' + tool.name + ' tool',
    ))
  }

  // Guidance section: only mounted when a systemPrompt service exists.
  ctx.inject(['systemPrompt'], (promptCtx) => {
    const systemPrompt = (promptCtx as SystemPromptContext).systemPrompt
    systemPrompt.section({
      name: NOEMA_GUIDANCE_SECTION.name,
      order: NOEMA_GUIDANCE_SECTION.order,
      text: () => noemaGuidanceText(settingsSource()),
    })
  })

  // Status route: only mounted when a webServer service exists (headless
  // profiles never attach; the settings panel then hides the status card).
  ctx.inject(['webServer'], (webCtx) => {
    const webServer = (webCtx as WebServerContext).webServer
    return registerNoemaStatusRoute(
      webServer,
      manager,
      () => settingsSource(),
      () => settingsWriter,
      importService,
    )
  })

  const initial = settingsSource()
  if (initial.enabled && initial.autoStart) {
    manager.ensureRunning().catch((error: unknown) => {
      ctx.logger.warn('dsh-noema: ' + (error instanceof Error ? error.message : String(error)))
    })
  }
  manager.startKeepAlive()

  // Startup import pass: best-effort, ledger-deduplicated, never blocks boot.
  if (initial.enabled && initial.importEnabled && initial.importOnStartup) {
    importService.run({}).catch((error: unknown) => {
      ctx.logger.warn('dsh-noema startup import: ' + (error instanceof Error ? error.message : String(error)))
    })
  }

  ctx.logger.info('dsh-noema mounted (' + NOEMA_TOOL_NAMES.length + ' memory tools; settings: ' + (initial.enabled ? 'enabled' : 'disabled') + ')')
  return async () => {
    for (const dispose of disposers.reverse()) await dispose()
    await manager.dispose()
  }
}
