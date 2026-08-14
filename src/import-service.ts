/**
 * Memory import service: reads foreign-agent memory files (Codex, Claude
 * Code, opencode, Cursor, Grok, WorkBuddy), splits them into bounded items,
 * deduplicates through a local ledger, and submits each item as an accepted
 * Noema memory through the MCP bridge.
 * @module @zseven-w/dsh-noema/import-service
 */
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import type { NoemaLogger, NoemaServerManager } from './server-manager.js'
import { resolveImporters, type Importer } from './importers.js'
import type { NoemaMemorySettings } from './settings.js'

export interface ImportOptions {
  /** Importer ids to run; undefined or ['all'] runs every importer. */
  sources?: string[]
  /** Workspace root for project-scoped files; undefined skips project files. */
  workspaceRoot?: string
  /** Re-import items even when the ledger already contains them. */
  force?: boolean
}

export interface ImportSourceSummary {
  source: string
  files: number
  items: number
  imported: number
  skipped: number
  errors: string[]
}

export interface ImportSummary {
  ok: boolean
  at: number
  sources: ImportSourceSummary[]
  totalFiles: number
  totalItems: number
  imported: number
  skipped: number
  errors: string[]
}

export interface ImportItem {
  sourceId: string
  sourceLabel: string
  path: string
  heading: string
  /** Raw section content; the ledger key ignores the source attribution prefix. */
  body: string
  /** Model-facing memory text (source attribution prefix + body). */
  text: string
}

/** Split a markdown memory file into items at heading boundaries. */
export function splitMarkdown(sourceId: string, sourceLabel: string, path: string, content: string): ImportItem[] {
  const lines = content.split(/\r?\n/)
  const items: ImportItem[] = []
  let heading = '(top)'
  let section: string[] = []
  const flush = (): void => {
    const body = section.join('\n').trim()
    section = []
    if (body === '') return
    const text = 'Imported from ' + sourceLabel + ' — ' + path + ' (section: ' + heading + ')\n\n' + body
    items.push({ sourceId, sourceLabel, path, heading, body, text })
  }
  for (const line of lines) {
    const match = /^(#{1,3})\s+(.+)$/.exec(line)
    if (match !== null && section.some(part => part.trim() !== '')) {
      flush()
      heading = match[2].trim()
    }
    section.push(line)
  }
  flush()
  if (items.length === 0) {
    items.push({
      sourceId,
      sourceLabel,
      path,
      heading,
      body: '',
      text: 'Imported from ' + sourceLabel + ' — ' + path + ' (empty file)',
    })
  }
  return items
}

/** Parse a Cursor .mdc rule: frontmatter metadata plus the rule body. */
export function ruleItem(sourceId: string, sourceLabel: string, path: string, content: string): ImportItem {
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(content)
  let body = content
  let metadata = ''
  if (frontmatter !== null) {
    body = content.slice(frontmatter[0].length)
    const fields: string[] = []
    for (const line of frontmatter[1].split(/\r?\n/)) {
      const pair = /^([A-Za-z][A-Za-z0-9_-]*):\s*(.+)$/.exec(line)
      if (pair !== null) fields.push(pair[1] + ': ' + pair[2].trim())
    }
    metadata = fields.join('; ')
  }
  const heading = path.split('/').slice(-1)[0] ?? path
  const trimmed = body.trim()
  const text = 'Imported from ' + sourceLabel + ' rule — ' + path +
    (metadata === '' ? '' : ' (' + metadata + ')') + '\n\n' + trimmed
  return { sourceId, sourceLabel, path, heading, body: trimmed, text }
}

/** Stable ledger key: one hash per unique file+section content. The body
 * (without the source-attribution prefix) is what dedupes, so several tools
 * sharing one project AGENTS.md import that section exactly once. */
function itemKey(item: ImportItem): string {
  return createHash('sha256').update(item.path).update('\u0000').update(item.heading).update('\u0000').update(item.body).digest('hex')
}

interface ImportLedger {
  keys: Record<string, number>
}

const LEDGER_MAX_ENTRIES = 2000

/** Resolve the ledger file under $DSH_HOME/storages. */
export function importLedgerPath(): string {
  const home = process.env.DSH_HOME !== undefined && process.env.DSH_HOME !== '' ? process.env.DSH_HOME : join(homedir(), '.dsh')
  return join(home, 'storages', 'dsh-noema-imports.json')
}

async function loadLedger(path: string): Promise<ImportLedger> {
  try {
    const value: unknown = JSON.parse(await readFile(path, 'utf8'))
    if (typeof value === 'object' && value !== null && typeof (value as { keys?: unknown }).keys === 'object') {
      return value as ImportLedger
    }
  } catch {
    // Missing or malformed ledger starts empty; the next write replaces it.
  }
  return { keys: {} }
}

async function saveLedger(path: string, ledger: ImportLedger): Promise<void> {
  const entries = Object.entries(ledger.keys)
  if (entries.length > LEDGER_MAX_ENTRIES) {
    const kept = entries.sort((a, b) => b[1] - a[1]).slice(0, LEDGER_MAX_ENTRIES)
    ledger.keys = Object.fromEntries(kept)
  }
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, JSON.stringify(ledger, null, 2) + '\n', { mode: 0o600 })
}

/** Expand one candidate file into import items (rules dirs are walked). */
async function collectItems(
  importer: Importer,
  path: string,
  kind: 'markdown' | 'rules' | 'markdown-dir',
  label: string,
  maxBytes: number,
  errors: string[],
): Promise<ImportItem[]> {
  try {
    const info = await stat(path)
    if (!info.isFile() && !info.isDirectory()) return []
    if (info.isDirectory()) {
      if (kind !== 'rules' && kind !== 'markdown-dir') return []
      // Recursive walk with a depth cap; .git and index files stay out.
      const items: ImportItem[] = []
      const walk = async (dir: string, depth: number): Promise<void> => {
        if (depth > 3) return
        let entries: string[]
        try {
          entries = await readdir(dir)
        } catch {
          return
        }
        for (const entry of entries.sort()) {
          if (entry === '.git') continue
          const child = join(dir, entry)
          let childInfo
          try {
            childInfo = await stat(child)
          } catch {
            continue
          }
          if (childInfo.isDirectory()) {
            await walk(child, depth + 1)
            continue
          }
          const isMarkdown = entry.endsWith('.md')
          const isRule = kind === 'rules' && entry.endsWith('.mdc')
          if (kind === 'markdown-dir' ? isMarkdown : isRule) {
            items.push(...await collectItems(
              importer,
              child,
              kind === 'rules' ? 'rules' : 'markdown',
              entry,
              maxBytes,
              errors,
            ))
          }
        }
      }
      await walk(path, 0)
      return items
    }
    let content = await readFile(path, 'utf8')
    if (Buffer.byteLength(content, 'utf8') > maxBytes) {
      content = content.slice(0, maxBytes) + '\n\n… (truncated at ' + maxBytes + ' bytes)'
    }
    if (content.trim() === '') return []
    if (kind === 'rules') {
      return [ruleItem(importer.id, importer.label, path, content)]
    }
    return splitMarkdown(importer.id, importer.label, path, content)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
    errors.push(label + ': ' + (error instanceof Error ? error.message : String(error)))
    return []
  }
}

/** Owns one import pass: ledger dedup plus submission through the bridge. */
export class MemoryImportService {
  private lastImport: ImportSummary | undefined

  constructor(
    private readonly manager: NoemaServerManager,
    private readonly resolveConfig: () => NoemaMemorySettings,
    private readonly logger?: NoemaLogger,
  ) {}

  /** Last completed pass, for the status route and settings panel. */
  get lastSummary(): ImportSummary | undefined {
    return this.lastImport
  }

  /** Run one import pass and return its summary. */
  async run(options: ImportOptions = {}): Promise<ImportSummary> {
    const config = this.resolveConfig()
    if (!config.importEnabled) {
      const summary: ImportSummary = {
        ok: false, at: Date.now(), sources: [], totalFiles: 0, totalItems: 0,
        imported: 0, skipped: 0, errors: ['memory import is disabled in settings'],
      }
      this.lastImport = summary
      return summary
    }
    const sources = options.sources ?? config.importSources
    const importers = resolveImporters(sources)
    const ledgerPath = importLedgerPath()
    const ledger = await loadLedger(ledgerPath)
    const summaries: ImportSourceSummary[] = []
    let imported = 0
    let skipped = 0
    let totalFiles = 0
    let totalItems = 0
    const allErrors: string[] = []
    const at = Date.now()

    for (const importer of importers) {
      const sourceSummary: ImportSourceSummary = {
        source: importer.id, files: 0, items: 0, imported: 0, skipped: 0, errors: [],
      }
      const candidates = [
        ...importer.globalCandidates(),
        ...(config.importWorkspaceFiles && options.workspaceRoot !== undefined && options.workspaceRoot !== ''
          ? importer.workspaceCandidates(options.workspaceRoot)
          : []),
      ]
      const seen = new Set<string>()
      for (const candidate of candidates) {
        if (!existsSync(candidate.path)) continue
        if (seen.has(candidate.path)) continue
        seen.add(candidate.path)
        const items = await collectItems(importer, candidate.path, candidate.kind, candidate.label, config.importMaxBytes, sourceSummary.errors)
        if (items.length === 0) continue
        sourceSummary.files += 1
        totalFiles += 1
        for (const item of items) {
          sourceSummary.items += 1
          totalItems += 1
          const key = itemKey(item)
          if (!options.force && ledger.keys[key] !== undefined) {
            // The section is already represented (possibly claimed by another
            // source sharing this file); record the key so later runs stay quiet.
            ledger.keys[key] = at
            skipped += 1
            sourceSummary.skipped += 1
            continue
          }
          try {
            await this.manager.call('noema_remember', {
              text: item.text,
              tags: ['imported', 'source:' + importer.id],
              accept: true,
            }, {})
            ledger.keys[key] = at
            imported += 1
            sourceSummary.imported += 1
          } catch (error) {
            const message = importer.id + ' ' + item.path + ': ' + (error instanceof Error ? error.message : String(error))
            sourceSummary.errors.push(message)
            allErrors.push(message)
          }
        }
      }
      summaries.push(sourceSummary)
    }

    try {
      await saveLedger(ledgerPath, ledger)
    } catch (error) {
      allErrors.push('ledger: ' + (error instanceof Error ? error.message : String(error)))
    }

    const summary: ImportSummary = {
      ok: allErrors.length === 0,
      at,
      sources: summaries,
      totalFiles,
      totalItems,
      imported,
      skipped,
      errors: allErrors,
    }
    this.lastImport = summary
    this.logger?.info('dsh-noema import: ' + imported + ' imported, ' + skipped + ' skipped, ' + allErrors.length + ' errors')
    return summary
  }
}
