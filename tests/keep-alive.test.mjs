import assert from 'node:assert/strict'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { NoemaServerManager } from '../lib/server-manager.js'
import { NOEMA_MEMORY_SETTINGS_DEFAULTS } from '../lib/settings.js'

const FAKE_SERVER = [
  "import { createInterface } from 'node:readline'",
  "const rl = createInterface({ input: process.stdin })",
  "const send = value => process.stdout.write(JSON.stringify(value) + '\\n')",
  "rl.on('line', raw => {",
  "  let msg",
  "  try { msg = JSON.parse(raw) } catch { process.exit(3) }",
  "  if (msg.method === 'notifications/initialized') return",
  "  if (msg.method === 'initialize') {",
  "    send({ jsonrpc: '2.0', id: msg.id, result: { protocolVersion: '2024-11-05', capabilities: {}, serverInfo: { name: 'fake-noema', version: '0' } } })",
  "    return",
  "  }",
  "  if (msg.method === 'tools/call') {",
  "    send({ jsonrpc: '2.0', id: msg.id, result: { content: [{ type: 'text', text: JSON.stringify({ tenant: 'personal' }) }] } })",
  "  }",
  "})",
].join('\n')

/** Write the fake server to a temp script and return its command line. */
async function fakeCommand() {
  const dir = await mkdtemp(join(tmpdir(), 'dsh-noema-keepalive-'))
  const script = join(dir, 'fake-server.mjs')
  await writeFile(script, FAKE_SERVER, 'utf8')
  return {
    command: process.execPath + ' ' + script,
    cleanup: async () => rm(dir, { recursive: true, force: true }),
  }
}

async function waitFor(predicate, timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs
  for (;;) {
    if (await predicate()) return
    if (Date.now() > deadline) throw new Error('timed out waiting for condition')
    await new Promise(resolve => setTimeout(resolve, 250))
  }
}

test('keep-alive restarts a crashed memory server in the background', async () => {
  const fake = await fakeCommand()
  const flattened = {
    ...NOEMA_MEMORY_SETTINGS_DEFAULTS,
    command: fake.command,
    keepAlive: true,
    keepAliveIntervalMs: 1000,
    restartDelayMs: 500,
    idleTimeoutMs: 0,
    enabled: true,
  }
  const manager = new NoemaServerManager(() => flattened, { info() {}, warn() {} })
  try {
    manager.startKeepAlive()
    await manager.ensureRunning()
    const first = await manager.status()
    assert.equal(first.state, 'running')
    assert.ok(first.pid !== undefined)

    // Crash the child hard; the keep-alive loop must bring it back up.
    process.kill(first.pid, 'SIGKILL')
    await waitFor(async () => (await manager.status()).state === 'running' && (await manager.status()).pid !== first.pid)
    const second = await manager.status()
    assert.notEqual(second.pid, first.pid)
  } finally {
    await manager.dispose()
    await fake.cleanup()
  }
})

test('keep-alive off leaves a crashed server down', async () => {
  const fake = await fakeCommand()
  const flattened = {
    ...NOEMA_MEMORY_SETTINGS_DEFAULTS,
    command: fake.command,
    keepAlive: false,
    keepAliveIntervalMs: 1000,
    restartDelayMs: 500,
    idleTimeoutMs: 0,
    enabled: true,
  }
  const manager = new NoemaServerManager(() => flattened, { info() {}, warn() {} })
  try {
    manager.startKeepAlive()
    await manager.ensureRunning()
    const first = await manager.status()
    process.kill(first.pid, 'SIGKILL')
    await waitFor(async () => (await manager.status()).state !== 'running')
    await new Promise(resolve => setTimeout(resolve, 2500))
    const after = await manager.status()
    assert.equal(after.state, 'stopped', 'no keep-alive restart without the setting')
  } finally {
    await manager.dispose()
    await fake.cleanup()
  }
})
