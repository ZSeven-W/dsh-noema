/**
 * Noema memory tools: the model-facing surface of the plugin.
 *
 * Each Noema MCP tool is wrapped in a typed DSH tool. Results are normalized
 * into a uniform envelope ({ ok, tool, text }) where text carries the full
 * server output (pretty JSON or catalog markdown), so the canonical output
 * schema stays strict while the payload stays free-form.
 * @module @zseven-w/dsh-noema/tools
 */
import { defineTool, type ParameterSchemaSpec, type ToolDefinition } from '@deepseek-ai/dsh-tools'
import type { ToolCallView } from '@deepseek-ai/dsh-tools'
import type { NoemaServerManager } from './server-manager.js'
import type { MemoryImportService } from './import-service.js'
import type { NoemaMemorySettings } from './settings.js'
import { NOEMA_TOOL_NAMES } from './names.js'

/** Canonical envelope returned by every Noema tool. */
export interface NoemaToolResult {
  ok: true
  tool: string
  text: string
}

interface NoemaToolSpec {
  name: string
  description: string
  parameters: ParameterSchemaSpec
  /** Fill server-side defaults from the resolved settings section. */
  buildArgs?: (args: Record<string, unknown>, config: NoemaMemorySettings) => Record<string, unknown>
  /** Short human title for the pending call card. */
  title?: (args: Record<string, unknown>) => string
}

const MEMORY_USAGE_HINT =
  ' Noema is the durable long-term memory for this DSH instance. ' +
  'Use the memory tools to recall relevant past context before important work, ' +
  'and to save durable facts, decisions, constraints, and user preferences.'

const NOEMA_TOOL_SPECS: readonly NoemaToolSpec[] = [
  {
    name: 'noema_recall',
    description:
      'Recall relevant long-term memories for a query. Call this at the start of a session or before a new task, ' +
      'using a query that describes the user request, to load durable context remembered from earlier sessions.' +
      MEMORY_USAGE_HINT,
    parameters: {
      query: { type: 'string', required: true, description: 'What to remember: a natural-language query describing the current task or question.' },
      budget_tokens: { type: 'integer', description: 'Token budget for the recalled pack. Omit to use the configured default.' },
    },
    buildArgs: (args, config) => ({ ...args, ...(args.budget_tokens === undefined ? { budget_tokens: config.recallBudgetTokens } : {}) }),
    title: args => 'Recall ' + String(args.query ?? ''),
  },
  {
    name: 'noema_search',
    description: 'Full-text search over durable memories. Use for precise lookups when recall alone does not surface what you need.' + MEMORY_USAGE_HINT,
    parameters: {
      query: { type: 'string', required: true, description: 'Search query over stored memories.' },
    },
    title: args => 'Search ' + String(args.query ?? ''),
  },
  {
    name: 'noema_browse',
    description: 'Browse the PageIndex catalog for entity/topic-associated memories. Use to explore what is remembered around a subject.' + MEMORY_USAGE_HINT,
    parameters: {
      query: { type: 'string', required: true, description: 'Entity or topic to browse memories for.' },
      limit: { type: 'integer', description: 'Maximum number of memories to return (default 8).' },
    },
    title: args => 'Browse ' + String(args.query ?? ''),
  },
  {
    name: 'noema_catalog',
    description: 'Render the PageIndex memory catalog as markdown — an index over everything remembered. Use to see the full memory inventory.' + MEMORY_USAGE_HINT,
    parameters: {},
  },
  {
    name: 'noema_recall_graph',
    description:
      'Multi-hop recall: lexical seed, then walk links + shared entities outward up to max_hops. Use for questions whose answer spans several connected memories.' +
      MEMORY_USAGE_HINT,
    parameters: {
      query: { type: 'string', required: true, description: 'Seed query for the multi-hop walk.' },
      max_hops: { type: 'integer', description: 'How many hops to walk outward from the lexical seeds (default 3).' },
    },
    title: args => 'Recall graph ' + String(args.query ?? ''),
  },
  {
    name: 'noema_neighbors',
    description: 'One graph hop from a memory: the memories it links to or shares an entity with. Step through these for guided multi-hop retrieval.' + MEMORY_USAGE_HINT,
    parameters: {
      memory_id: { type: 'string', required: true, description: 'The memory id to expand from.' },
    },
    title: args => 'Neighbors of ' + String(args.memory_id ?? ''),
  },
  {
    name: 'noema_explain',
    description: 'Explain why a specific memory was or was not recalled for a query — for auditing and tuning recall.' + MEMORY_USAGE_HINT,
    parameters: {
      memory_id: { type: 'string', required: true, description: 'The memory id to explain.' },
      query: { type: 'string', required: true, description: 'The query to explain recall against.' },
    },
    title: args => 'Explain ' + String(args.memory_id ?? ''),
  },
  {
    name: 'noema_remember',
    description:
      'Submit a memory candidate for review (auto-accepted by default). Use whenever the user shares a durable fact, decision, constraint, or preference ' +
      'that should persist across sessions — for example "remember that we deploy with pnpm" or "remember not to commit before 21:00".' +
      MEMORY_USAGE_HINT,
    parameters: {
      text: { type: 'string', required: true, description: 'The memory text: a self-contained durable fact, decision, constraint, or preference.' },
      tags: { type: 'array', items: { type: 'string' }, description: 'Optional tags for retrieval.' },
      entities: { type: 'array', items: { type: 'string' }, description: 'Optional entity names (projects, people, tools) for graph links.' },
      code: { type: 'json', description: 'Optional code anchor: { paths, symbols, lang, ... } with repo-root-relative paths.' },
      accept: { type: 'boolean', description: 'Persist immediately instead of leaving it in review. Omit to use the configured default.' },
    },
    buildArgs: (args, config) => ({ ...args, ...(args.accept === undefined ? { accept: config.acceptByDefault } : {}) }),
    title: () => 'Remember a durable fact',
  },
  {
    name: 'noema_review_list',
    description: 'List pending review candidates (memories still waiting for a decision).' + MEMORY_USAGE_HINT,
    parameters: {},
  },
  {
    name: 'noema_review_decide',
    description: 'Decide a pending candidate: accept, reject, edit, or merge into an existing memory.' + MEMORY_USAGE_HINT,
    parameters: {
      candidate_id: { type: 'string', required: true, description: 'The review candidate id.' },
      decision: { type: 'string', required: true, enum: ['accept', 'reject', 'edit', 'merge'], description: 'One of: accept, reject, edit, merge.' },
      reason: { type: 'string', description: 'Reason for reject/edit/merge decisions.' },
      body: { type: 'string', description: 'Replacement memory text when decision is edit.' },
      target_memory_id: { type: 'string', description: 'Existing memory to merge into when decision is merge.' },
    },
    title: () => 'Review a memory candidate',
  },
  {
    name: 'noema_forget',
    description: 'Permanently remove or tombstone a memory. Use when the user asks to delete or undo something remembered.' + MEMORY_USAGE_HINT,
    parameters: {
      memory_id: { type: 'string', required: true, description: 'The memory id to forget.' },
      hard: { type: 'boolean', description: 'Hard-delete instead of tombstoning (default false).' },
    },
    title: args => 'Forget ' + String(args.memory_id ?? ''),
  },
  {
    name: 'noema_policy_get',
    description: 'Get the current write policy and sensitivity settings of the memory system.' + MEMORY_USAGE_HINT,
    parameters: {},
  },
  {
    name: 'noema_policy_set',
    description: 'Update the write policy: "manual", "review", "auto-safe", or "auto".' + MEMORY_USAGE_HINT,
    parameters: {
      write: { type: 'string', required: true, enum: ['manual', 'review', 'auto-safe', 'auto'], description: 'The new write policy.' },
    },
  },
  {
    name: 'noema_status',
    description: 'Server and tenant status of the memory system — memory counts, index health, and storage root.' + MEMORY_USAGE_HINT,
    parameters: {},
  },
  {
    name: 'noema_import',
    description:
      'Import memories from other AI coding tools (Codex, Claude Code, opencode, Cursor, Grok, WorkBuddy, Antigravity, Trae, Qoder) into Noema. ' +
      'Reads their AGENTS.md / CLAUDE.md / .mdc rules memory files, splits them into items, and saves each as a durable memory. ' +
      'Use when the user wants to bring in what other agents remember. Re-runs skip already-imported items.' +
      MEMORY_USAGE_HINT,
    parameters: {
      source: { type: 'string', description: 'Tool id to import: codex, claude-code, opencode, cursor, grok, workbuddy, antigravity, trae, qoder, or all. Omit to run every enabled source.' },
      path: { type: 'string', description: 'Workspace root for project-scoped files (defaults to the session workspace).' },
      force: { type: 'boolean', description: 'Re-import items the import ledger already recorded. Default false.' },
    },
    title: () => 'Import memories from other tools',
  },
]

const NOEMA_RESULT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    ok: { type: 'boolean', required: true },
    tool: { type: 'string', required: true },
    text: { type: 'string', required: true },
  },
} as const

/** Pretty-print a server result as the model-facing text. */
function resultText(tool: string, text: string): string {
  if (text.trim() === '') return 'Noema ' + tool + ' returned an empty result.'
  let decoded: unknown = text
  try {
    decoded = JSON.parse(text)
  } catch {
    return text
  }
  return JSON.stringify(decoded, null, 2)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Session workspace the import tool resolves project paths against. */
function sessionWorkspace(exec: { agent?: { session?: { header?: { cwd?: string } } } }): string {
  return exec.agent?.session?.header?.cwd ?? process.cwd()
}

/** Create one tool definition bound to the manager and live settings source. */
function createNoemaTool(
  spec: NoemaToolSpec,
  manager: NoemaServerManager,
  resolveConfig: () => NoemaMemorySettings,
  importService: MemoryImportService | undefined,
): ToolDefinition {
  return defineTool({
    name: spec.name,
    description: spec.description,
    parameters: spec.parameters,
    output: {
      schema: NOEMA_RESULT_SCHEMA,
      render: (_args, value: unknown) => {
        const result = value as NoemaToolResult
        return [{ type: 'text', text: result.text }]
      },
    },
    async execute(args: Record<string, unknown>, exec): Promise<NoemaToolResult> {
      const config = resolveConfig()
      if (!config.enabled) {
        throw new Error('Noema memory is disabled. Enable it under Settings → Noema Memory, or call noema_status for details.')
      }
      if (spec.name === 'noema_import') {
        if (importService === undefined) {
          throw new Error('noema_import: the import service is unavailable in this deployment')
        }
        const source = typeof args.source === 'string' && args.source !== '' ? args.source : undefined
        const workspaceRoot = typeof args.path === 'string' && args.path !== '' ? args.path : sessionWorkspace(exec)
        const summary = await importService.run({
          sources: source === undefined ? undefined : [source],
          workspaceRoot,
          force: args.force === true,
        })
        return { ok: true, tool: spec.name, text: JSON.stringify(summary, null, 2) }
      }
      const built = spec.buildArgs === undefined ? { ...args } : spec.buildArgs(args, config)
      const result = await manager.call(spec.name, built, { signal: exec.signal })
      return { ok: true, tool: spec.name, text: resultText(spec.name, result.text) }
    },
    presentCall: (args: Record<string, unknown>): ToolCallView | undefined => {
      if (spec.title === undefined) return undefined
      return {
        card: 'generic',
        kind: 'execute',
        title: spec.title(isRecord(args) ? args : {}),
      }
    },
  })
}

/** All Noema tool definitions in stable order. */
export function createNoemaTools(
  manager: NoemaServerManager,
  resolveConfig: () => NoemaMemorySettings,
  importService?: MemoryImportService,
): ToolDefinition[] {
  return NOEMA_TOOL_SPECS.map(spec => createNoemaTool(spec, manager, resolveConfig, importService))
}

export { NOEMA_TOOL_NAMES }
