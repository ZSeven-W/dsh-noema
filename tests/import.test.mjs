import assert from 'node:assert/strict'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { IMPORTERS, importerById, resolveImporters } from '../lib/importers.js'
import { MemoryImportService, importLedgerPath, ruleItem, splitMarkdown } from '../lib/import-service.js'
import { NOEMA_MEMORY_SETTINGS_DEFAULTS } from '../lib/settings.js'

test('importers declare the ten supported sources', () => {
  assert.deepEqual(IMPORTERS.map(importer => importer.id), ['codex', 'claude-code', 'opencode', 'cursor', 'grok', 'workbuddy', 'antigravity', 'trae', 'qoder', 'hermes'])
  assert.equal(resolveImporters(undefined).length, 10)
  assert.equal(resolveImporters([]).length, 10)
  assert.equal(resolveImporters(['all']).length, 10)
  assert.deepEqual(resolveImporters(['grok']).map(importer => importer.id), ['grok'])
  assert.deepEqual(resolveImporters(['cursor', 'codex']).map(importer => importer.id), ['codex', 'cursor'])
  assert.equal(importerById('nope'), undefined)
})

test('global candidates expand home paths', () => {
  const codex = importerById('codex')
  const candidates = codex.globalCandidates()
  assert.equal(candidates.length, 5)
  assert.ok(candidates[0].path.endsWith(join('.codex', 'AGENTS.md')))
  assert.ok(candidates.some(candidate => candidate.kind === 'markdown-dir' && candidate.path.endsWith('rollout_summaries')))
  assert.ok(candidates.some(candidate => candidate.path.endsWith(join('memories', 'MEMORY.md'))))
  const cursor = importerById('cursor')
  assert.equal(cursor.globalCandidates().length, 2)
  const grok = importerById('grok')
  assert.equal(grok.globalCandidates().length, 2)
  assert.ok(grok.globalCandidates().some(candidate => candidate.kind === 'markdown-dir'))
  const claude = importerById('claude-code')
  assert.equal(claude.globalCandidates().length, 3)
  assert.ok(claude.globalCandidates().some(candidate => candidate.path.endsWith(join('.claude', 'MEMORY.md'))))
  const workbuddy = importerById('workbuddy')
  assert.equal(workbuddy.globalCandidates().length, 5)
  assert.ok(workbuddy.globalCandidates().some(candidate => candidate.path.endsWith(join('.codebuddy', 'CODEBUDDY.md'))))
  assert.equal(workbuddy.workspaceCandidates('/ws').length, 2)
  const antigravity = importerById('antigravity')
  assert.equal(antigravity.globalCandidates().length, 3)
  assert.equal(antigravity.workspaceCandidates('/ws').length, 2)
  const trae = importerById('trae')
  assert.equal(trae.globalCandidates().length, 6)
  assert.ok(trae.globalCandidates().some(candidate => candidate.path.endsWith(join('.trae', 'memory'))))
  assert.equal(trae.workspaceCandidates('/ws').length, 2)
  const qoder = importerById('qoder')
  assert.equal(qoder.globalCandidates().length, 8)
  assert.ok(qoder.globalCandidates().some(candidate => candidate.path.endsWith(join('.qoder-cn', 'AGENTS.md'))))
  assert.ok(qoder.globalCandidates().some(candidate => candidate.path.endsWith(join('.qoder-cn', 'projects'))))
  assert.equal(qoder.workspaceCandidates('/ws').length, 3)
  const hermes = importerById('hermes')
  assert.equal(hermes.globalCandidates().length, 2)
  assert.ok(hermes.globalCandidates().some(candidate => candidate.kind === 'markdown-dir' && candidate.path.endsWith(join('.hermes', 'memories'))))
  assert.ok(hermes.globalCandidates().some(candidate => candidate.path.endsWith(join('.hermes', 'SOUL.md'))))
  assert.equal(hermes.workspaceCandidates('/ws').length, 4)
  assert.ok(hermes.workspaceCandidates('/ws').some(candidate => candidate.path.endsWith('.hermes.md')))
  assert.ok(hermes.workspaceCandidates('/ws').some(candidate => candidate.path.endsWith('HERMES.md')))
})

test('splitMarkdown splits headings and prefixes the source', () => {
  const items = splitMarkdown('codex', 'Codex', '/tmp/AGENTS.md', [
    'Intro line',
    '## Build system',
    'We use bun everywhere.',
    '## Commits',
    'No commits before 21:00.',
  ].join('\n'))
  assert.equal(items.length, 3)
  assert.equal(items[0].heading, '(top)')
  assert.ok(items[0].text.includes('Imported from Codex — /tmp/AGENTS.md'))
  assert.equal(items[1].heading, 'Build system')
  assert.ok(items[1].text.includes('We use bun everywhere.'))
  assert.ok(!items[1].text.includes('No commits'))
})

test('ruleItem extracts mdc frontmatter metadata', () => {
  const item = ruleItem('cursor', 'Cursor', '/tmp/rules/react.mdc', [
    '---',
    'description: React conventions',
    'alwaysApply: true',
    '---',
    'Use function components.',
  ].join('\n'))
  assert.ok(item.text.includes('description: React conventions'))
  assert.ok(item.text.includes('Use function components.'))
  assert.equal(item.heading, 'react.mdc')
})

test('import service reads fixtures, dedupes via ledger, and tags items', async () => {
  const root = await mkdtemp(join(tmpdir(), 'dsh-noema-import-'))
  const home = join(root, 'home')
  const workspace = join(root, 'ws')
  await mkdir(join(home, '.codex'), { recursive: true })
  await mkdir(join(home, '.grok'), { recursive: true })
  await mkdir(workspace, { recursive: true })
  await writeFile(join(home, '.codex', 'AGENTS.md'), '# Codex memory\n\n## Build\nUse pnpm.\n\n## Deploy\nFly.io.', 'utf8')
  await writeFile(join(home, '.grok', 'AGENTS.md'), 'Grok global memory.', 'utf8')
  await writeFile(join(workspace, 'AGENTS.md'), 'Workspace AGENTS.md', 'utf8')

  const previousDshHome = process.env.DSH_HOME
  process.env.DSH_HOME = home
  process.env.HOME = home
  const remembered = []
  const manager = {
    async call(name, args) {
      remembered.push({ name, args })
      return { text: JSON.stringify({ Accepted: { memory_id: 'mem_' + remembered.length } }) }
    },
  }
  const config = {
    ...NOEMA_MEMORY_SETTINGS_DEFAULTS,
    importEnabled: true,
    importWorkspaceFiles: true,
    importSources: ['codex', 'grok'],
  }
  const service = new MemoryImportService(manager, () => config, { info() {}, warn() {} })
  try {
    const first = await service.run({ workspaceRoot: workspace })
    assert.equal(first.ok, true)
    assert.equal(first.imported, 5, 'codex 3 sections + grok 1 + shared workspace AGENTS.md claimed once')
    assert.equal(first.skipped, 1, 'grok meets the already-imported workspace file')

    // Second run: every section is already represented.
    const second = await service.run({ workspaceRoot: workspace })
    assert.equal(second.imported, 0)
    assert.equal(second.skipped, 6)

    // Force re-imports every item, cross-source duplicates included.
    const third = await service.run({ workspaceRoot: workspace, force: true })
    assert.equal(third.imported, 6)

    // Every remembered item carries the import tags.
    for (const call of remembered) {
      assert.equal(call.name, 'noema_remember')
      assert.ok(call.args.tags.includes('imported'))
      assert.ok(call.args.tags.some(tag => tag.startsWith('source:')))
      assert.equal(call.args.accept, true)
    }
  } finally {
    process.env.DSH_HOME = previousDshHome
    await rm(root, { recursive: true, force: true })
  }
})

test('import service refuses when disabled', async () => {
  const manager = { async call() { throw new Error('must not be called') } }
  const service = new MemoryImportService(manager, () => ({ ...NOEMA_MEMORY_SETTINGS_DEFAULTS, importEnabled: false }), { info() {}, warn() {} })
  const summary = await service.run({})
  assert.equal(summary.ok, false)
  assert.equal(summary.imported, 0)
  assert.ok(summary.errors[0].includes('disabled'))
})

test('ledger path resolves under DSH_HOME', async () => {
  const previous = process.env.DSH_HOME
  process.env.DSH_HOME = '/tmp/fake-dsh-home'
  assert.equal(importLedgerPath(), '/tmp/fake-dsh-home/storages/dsh-noema-imports.json')
  process.env.DSH_HOME = previous
})
test('markdown-dir importer walks nested memory files and skips others', async () => {
  const root = await mkdtemp(join(tmpdir(), 'dsh-noema-walk-'))
  const memory = join(root, '.grok', 'memory')
  await mkdir(join(memory, 'project-a', 'sessions'), { recursive: true })
  await mkdir(join(memory, '.git'), { recursive: true })
  await writeFile(join(memory, 'MEMORY.md'), '## Global\nPref one.', 'utf8')
  await writeFile(join(memory, 'project-a', 'MEMORY.md'), 'Project memory.', 'utf8')
  await writeFile(join(memory, 'project-a', 'sessions', '2026-08-14.md'), 'Session summary.', 'utf8')
  await writeFile(join(memory, '.git', 'index.md'), 'not imported', 'utf8')
  await writeFile(join(memory, 'index.sqlite'), 'not imported', 'utf8')

  const { MemoryImportService } = await import('../lib/import-service.js')
  const { NOEMA_MEMORY_SETTINGS_DEFAULTS } = await import('../lib/settings.js')
  const remembered = []
  const manager = { async call(name, args) { remembered.push(args.text); return { text: '{}' } } }

  const previousHome = process.env.HOME
  process.env.HOME = root
  const config = { ...NOEMA_MEMORY_SETTINGS_DEFAULTS, importEnabled: true, importWorkspaceFiles: false, importSources: ['grok'] }
  const service = new MemoryImportService(manager, () => config, { info() {}, warn() {} })
  try {
    const summary = await service.run({})
    assert.equal(summary.imported, 3, 'global MEMORY.md (1 section) + project MEMORY.md + session log')
    const texts = remembered.join('\n')
    assert.ok(texts.includes('Pref one.'))
    assert.ok(texts.includes('Project memory.'))
    assert.ok(texts.includes('Session summary.'))
    assert.ok(!texts.includes('not imported'))
  } finally {
    process.env.HOME = previousHome
    await rm(root, { recursive: true, force: true })
  }
})

