import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { tryResolveBundledNoemaBinary } from '../lib/bundled-binary.js'
import { NoemaServerManager } from '../lib/server-manager.js'
import { NOEMA_MEMORY_SETTINGS_DEFAULTS } from '../lib/settings.js'

const explicitBinary = process.env.NOEMA_MCP_BINARY?.trim()
const binary = explicitBinary === undefined || explicitBinary === ''
  ? tryResolveBundledNoemaBinary()
  : explicitBinary
const requireBinary = process.env.REQUIRE_NOEMA_E2E === '1'

test('NoemaServerManager roundtrip against the bundled noema-mcp server', { skip: binary === undefined && !requireBinary }, async () => {
  assert.ok(binary !== undefined, 'bundled noema-mcp is required for this test run')
  const root = await mkdtemp(join(tmpdir(), 'dsh-noema-e2e-'))
  const config = {
    ...NOEMA_MEMORY_SETTINGS_DEFAULTS,
    ...(explicitBinary === undefined || explicitBinary === '' ? {} : { command: explicitBinary }),
    noemaRoot: root,
    autoStart: false,
    idleTimeoutMs: 0,
  }
  const manager = new NoemaServerManager(() => config, { info() {}, warn() {} })
  try {
    const status = await manager.call('noema_status', {}, {})
    assert.ok(status.text.length > 0, 'noema_status must return text')
    assert.doesNotThrow(() => JSON.parse(status.text))

    const remembered = await manager.call('noema_remember', {
      text: 'dsh-noema e2e: the workspace build uses bun',
      tags: ['e2e', 'dsh-noema'],
      accept: true,
    }, {})
    const rememberedValue = JSON.parse(remembered.text)
    assert.ok(
      'Accepted' in rememberedValue || rememberedValue.Accepted !== undefined || JSON.stringify(rememberedValue).includes('memory_id'),
      'remember must produce an acceptance outcome: ' + remembered.text,
    )

    const recall = await manager.call('noema_recall', { query: 'what does the workspace build use?', budget_tokens: 1200 }, {})
    assert.ok(recall.text.length > 0, 'recall must return a pack')
  } finally {
    await manager.dispose()
    await rm(root, { recursive: true, force: true })
  }
})
