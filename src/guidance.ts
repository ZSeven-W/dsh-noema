/**
 * System-prompt guidance section: teaches the model when and how to use the
 * Noema memory tools. Rendered per assembly from the live settings source,
 * so disabling the plugin or the guidance toggle drops it immediately.
 * @module @zseven-w/dsh-noema/guidance
 */
import type { NoemaMemorySettings } from './settings.js'
import {
  NOEMA_GUIDANCE_SECTION_NAME,
  NOEMA_GUIDANCE_SECTION_ORDER,
  NOEMA_STATUS_ROUTE,
} from './names.js'

/**
 * Render the guidance text for one assembly. Empty text contributes nothing
 * (the system-prompt assembler drops empty sections).
 */
export function noemaGuidanceText(config: NoemaMemorySettings): string {
  if (!config.enabled || !config.guidance) return ''
  return [
    '<noema-memory>',
    'A Noema long-term memory system is available through the noema_* tools. ' +
      'Memories persist across sessions and are stored as inspectable files.',
    '',
    'Use it this way:',
    '- At the start of a session or before starting a new task, call noema_recall with a query that describes the request, to load durable context from earlier sessions.',
    '- When the user states a durable fact, decision, constraint, or preference (e.g. "remember ...", "记住 ...", "记住 21 点不能提交"), save it with noema_remember so it persists.',
    '- Use noema_search / noema_browse for precise lookups, and noema_catalog to see the full memory inventory.',
    '- Use noema_recall_graph + noema_neighbors when an answer spans several connected memories.',
    '- New candidates appear in the review queue; check noema_review_list when asked, and decide with noema_review_decide.',
    '- Delete on request with noema_forget; audit recall decisions with noema_explain.',
    '- When the user wants memories from other AI coding tools (Codex, Claude Code, opencode, Cursor, Grok, WorkBuddy, Antigravity, Trae, Qoder), call noema_import with the tool id to read that tool\'s AGENTS.md / CLAUDE.md / rules files into Noema.',
    '',
    'Configure the memory system under Settings → Noema Memory (health route: ' + NOEMA_STATUS_ROUTE + ').',
    '</noema-memory>',
  ].join('\n')
}

/** Registration descriptor for the system-prompt service. */
export const NOEMA_GUIDANCE_SECTION = {
  name: NOEMA_GUIDANCE_SECTION_NAME,
  order: NOEMA_GUIDANCE_SECTION_ORDER,
}

