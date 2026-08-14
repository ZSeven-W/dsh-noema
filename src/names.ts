/**
 * Shared constants between the host and client halves of the plugin.
 * Kept free of any @deepseek-ai imports so the client tsconfig can include it
 * without pulling host-only module resolution.
 * @module @zseven-w/dsh-noema/names
 */

/** Stable plugin name (the loader entry id in cordis.patch.yml). */
export const PLUGIN_NAME = '@zseven-w/dsh-noema'

/** Settings namespace the memory configuration lives under. */
export const NOEMA_MEMORY_SETTINGS_NAMESPACE = 'noema-memory'

/** Web route the settings panel uses to read server health and restart it. */
export const NOEMA_STATUS_ROUTE = '/_dsh/dsh-noema/status'

/** The Noema MCP tools surfaced to the model, in registration order. */
export const NOEMA_TOOL_NAMES = [
  'noema_recall',
  'noema_search',
  'noema_browse',
  'noema_catalog',
  'noema_recall_graph',
  'noema_neighbors',
  'noema_explain',
  'noema_remember',
  'noema_review_list',
  'noema_review_decide',
  'noema_forget',
  'noema_policy_get',
  'noema_policy_set',
  'noema_status',
  'noema_import',
] as const

/** Name of the system-prompt guidance section (tool guidance band 100–199). */
export const NOEMA_GUIDANCE_SECTION_NAME = 'noema:memory-guidance'

/** Order of the guidance section inside the system prompt. */
export const NOEMA_GUIDANCE_SECTION_ORDER = 120
