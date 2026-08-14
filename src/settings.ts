/**
 * Memory configuration namespace: schema, defaults, validation, and the
 * optional-settings wiring shared by the plugin root.
 *
 * While a settings service exists the user layer is read and written live;
 * without one the composition entry stays in force and remains read-only.
 * @module @zseven-w/dsh-noema/settings
 */
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import { settingsNamespace } from '@deepseek-ai/dsh-settings'
import { IMPORTER_IDS } from './importers.js'
import { NOEMA_MEMORY_SETTINGS_NAMESPACE } from './names.js'

/** Memory configuration as resolved for the running plugin. */
export interface NoemaMemorySettings {
  /** Master switch. When false every tool fails fast with a clear message. */
  enabled: boolean
  /** Launch command/path for the Noema MCP stdio server (whitespace-split). */
  command: string
  /** Working directory for the server process (e.g. the noema repo for cargo). */
  workingDirectory: string
  /** NOEMA_ROOT override; empty keeps Noema's default (~/.agent-memory). */
  noemaRoot: string
  /** Spawn the server when the plugin mounts instead of on first use. */
  autoStart: boolean
  /** Stop the server after this many idle milliseconds (0 = never). */
  idleTimeoutMs: number
  /** Restart the server in the background when it crashes or exits. */
  keepAlive: boolean
  /** Minimum interval between keep-alive health checks. */
  keepAliveIntervalMs: number
  /** Per-tool-call deadline in milliseconds. */
  callTimeoutMs: number
  /** Minimum delay between a crash/stop and the next auto-restart. */
  restartDelayMs: number
  /** Default token budget applied to noema_recall when omitted. */
  recallBudgetTokens: number
  /** noema_remember auto-accepts candidates into durable memory by default. */
  acceptByDefault: boolean
  /** Include the memory-usage guidance section in the system prompt. */
  guidance: boolean
  /** Master switch for the foreign-agent memory import feature. */
  importEnabled: boolean
  /** Run an import pass automatically when the plugin mounts. */
  importOnStartup: boolean
  /** Include the session workspace's AGENTS.md/CLAUDE.md/rules files. */
  importWorkspaceFiles: boolean
  /** Per-file byte cap applied while reading foreign memory files. */
  importMaxBytes: number
  /** Enabled importer ids (Codex, Claude Code, opencode, Cursor, Grok, WorkBuddy). */
  importSources: string[]
}

/** Schema defaults — the single source of truth the schema is built from. */
export const NOEMA_MEMORY_SETTINGS_DEFAULTS: NoemaMemorySettings = {
  enabled: true,
  command: 'bundled',
  workingDirectory: '',
  noemaRoot: '',
  autoStart: true,
  idleTimeoutMs: 0,
  keepAlive: true,
  keepAliveIntervalMs: 5_000,
  callTimeoutMs: 30_000,
  restartDelayMs: 1_000,
  recallBudgetTokens: 1_200,
  acceptByDefault: true,
  guidance: true,
  importEnabled: true,
  importOnStartup: false,
  importWorkspaceFiles: true,
  importMaxBytes: 65_536,
  importSources: ['codex', 'claude-code', 'opencode', 'cursor', 'grok', 'workbuddy', 'antigravity', 'trae', 'qoder'],
}

/** Branded settings namespace. */
export const NOEMA_MEMORY_SETTINGS_NS = settingsNamespace(NOEMA_MEMORY_SETTINGS_NAMESPACE)

/** Schemastery schema of the settings section. */
export const NOEMA_MEMORY_SETTINGS_SCHEMA = z.object({
  enabled: z.boolean().default(NOEMA_MEMORY_SETTINGS_DEFAULTS.enabled),
  command: z.string().default(NOEMA_MEMORY_SETTINGS_DEFAULTS.command),
  workingDirectory: z.string().default(NOEMA_MEMORY_SETTINGS_DEFAULTS.workingDirectory),
  noemaRoot: z.string().default(NOEMA_MEMORY_SETTINGS_DEFAULTS.noemaRoot),
  autoStart: z.boolean().default(NOEMA_MEMORY_SETTINGS_DEFAULTS.autoStart),
  idleTimeoutMs: z.number().default(NOEMA_MEMORY_SETTINGS_DEFAULTS.idleTimeoutMs),
  keepAlive: z.boolean().default(NOEMA_MEMORY_SETTINGS_DEFAULTS.keepAlive),
  keepAliveIntervalMs: z.number().default(NOEMA_MEMORY_SETTINGS_DEFAULTS.keepAliveIntervalMs),
  callTimeoutMs: z.number().default(NOEMA_MEMORY_SETTINGS_DEFAULTS.callTimeoutMs),
  restartDelayMs: z.number().default(NOEMA_MEMORY_SETTINGS_DEFAULTS.restartDelayMs),
  recallBudgetTokens: z.number().default(NOEMA_MEMORY_SETTINGS_DEFAULTS.recallBudgetTokens),
  acceptByDefault: z.boolean().default(NOEMA_MEMORY_SETTINGS_DEFAULTS.acceptByDefault),
  guidance: z.boolean().default(NOEMA_MEMORY_SETTINGS_DEFAULTS.guidance),
  importEnabled: z.boolean().default(NOEMA_MEMORY_SETTINGS_DEFAULTS.importEnabled),
  importOnStartup: z.boolean().default(NOEMA_MEMORY_SETTINGS_DEFAULTS.importOnStartup),
  importWorkspaceFiles: z.boolean().default(NOEMA_MEMORY_SETTINGS_DEFAULTS.importWorkspaceFiles),
  importMaxBytes: z.number().default(NOEMA_MEMORY_SETTINGS_DEFAULTS.importMaxBytes),
  importSources: z.array(z.string()).default(NOEMA_MEMORY_SETTINGS_DEFAULTS.importSources),
})

/** Entry-config face accepted by the cordis loader for this plugin. */
export const Config = NOEMA_MEMORY_SETTINGS_SCHEMA

type NumericSettingField = 'idleTimeoutMs' | 'callTimeoutMs' | 'restartDelayMs'

const NON_NEGATIVE_FIELDS: ReadonlyArray<readonly [NumericSettingField, string]> = [
  ['idleTimeoutMs', 'idle timeout'],
  ['callTimeoutMs', 'call timeout'],
  ['restartDelayMs', 'restart delay'],
] as const

/**
 * Cross-field validation the schema cannot express: numeric ranges and the
 * recall budget floor. Throwing here refuses the write before anything is
 * persisted (dsh-settings contract). Accepts a partial section because the
 * settings register hook validates resolved candidates of any shape.
 */
export function validateNoemaMemorySettings(value: Partial<NoemaMemorySettings>): void {
  for (const [field, label] of NON_NEGATIVE_FIELDS) {
    const current = value[field]
    if (current !== undefined && (!Number.isFinite(current) || current < 0)) {
      throw new Error('Noema memory: ' + label + ' (' + String(field) + ') must be a non-negative number of milliseconds')
    }
  }
  if (value.recallBudgetTokens !== undefined && (!Number.isInteger(value.recallBudgetTokens) || value.recallBudgetTokens < 1)) {
    throw new Error('Noema memory: recall budget must be a positive integer number of tokens')
  }
  if (value.command !== undefined && value.command.trim() === '') {
    throw new Error('Noema memory: server command must not be empty')
  }
  if (value.keepAliveIntervalMs !== undefined && (!Number.isInteger(value.keepAliveIntervalMs) || value.keepAliveIntervalMs < 1000)) {
    throw new Error('Noema memory: keep-alive interval must be at least 1000 milliseconds')
  }
  if (value.importMaxBytes !== undefined && (!Number.isInteger(value.importMaxBytes) || value.importMaxBytes < 1024)) {
    throw new Error('Noema memory: import file cap must be at least 1024 bytes')
  }
  if (value.importSources !== undefined) {
    const known = new Set(IMPORTER_IDS)
    for (const source of value.importSources) {
      if (!known.has(source)) {
        throw new Error('Noema memory: unknown import source ' + JSON.stringify(source))
      }
    }
  }
}

/**
 * Install the optional-settings wiring. `entry` is the plugin's composition
 * entry config, used as the `base` layer; `setSource` points the caller's
 * resolution thunk at the live resolved value and `onChange` fires when it
 * moves.
 */
export function installNoemaMemorySettings(
  ctx: Context,
  entry: Partial<NoemaMemorySettings>,
  hooks: {
    setSource: (source: () => NoemaMemorySettings) => void
    setWriter: (writer: ((patch: Partial<NoemaMemorySettings>) => Promise<void>) | undefined) => void
    onChange: () => void
  },
): void {
  const fallback = resolveNoemaMemorySettings(entry)
  hooks.setSource(() => fallback)
  hooks.setWriter(undefined)
  ctx.inject(['settings'], (settingsCtx) => {
    const scope = settingsCtx.settings.register(NOEMA_MEMORY_SETTINGS_NS, NOEMA_MEMORY_SETTINGS_SCHEMA, {
      base: entry,
      validate: validateNoemaMemorySettings,
    })
    hooks.setSource(() => scope.get())
    hooks.setWriter(patch => scope.update(patch))
    hooks.onChange()
    const unwatch = scope.watch(() => hooks.onChange())
    settingsCtx.effect(() => () => {
      unwatch()
      hooks.setWriter(undefined)
      hooks.setSource(() => fallback)
    })
  })
}

export { IMPORTER_IDS } from './importers.js'

/** Resolve an entry config against the schema defaults. */
export function resolveNoemaMemorySettings(entry: Partial<NoemaMemorySettings> | undefined): NoemaMemorySettings {
  return { ...NOEMA_MEMORY_SETTINGS_DEFAULTS, ...(entry ?? {}) }
}
