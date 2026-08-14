import assert from 'node:assert/strict'
import { test } from 'node:test'
import { spawn } from 'node:child_process'
import { McpStdioClient, McpStdioError } from '../lib/mcp-stdio.js'
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
  "    const name = msg.params.name",
  "    if (name === 'boom') {",
  "      send({ jsonrpc: '2.0', id: msg.id, result: { content: [{ type: 'text', text: 'kaboom' }], isError: true } })",
  "      return",
  "    }",
  "    if (name === 'exit') { process.exit(7); return }",
  "    if (name === 'silent') return",
  "    send({ jsonrpc: '2.0', id: msg.id, result: { content: [{ type: 'text', text: JSON.stringify({ name, args: msg.params.arguments }) }] } })",
  "  }",
  "})",
].join('\n')

function startFakeServer() {
  return spawn(process.execPath, ['--input-type=module', '-e', FAKE_SERVER], { stdio: ['pipe', 'pipe', 'pipe'] })
}

function fakeServerCommand(source) {
  const encoded = Buffer.from(source).toString('base64')
  return `"${process.execPath}" --input-type=module -e "import('data:text/javascript;base64,${encoded}')"`
}

test('initialize + tools/call roundtrip over newline-delimited JSON', async () => {
  const server = startFakeServer()
  const client = new McpStdioClient({ command: server.spawnargs[0], args: server.spawnargs.slice(1) })
  try {
    await client.start()
    assert.equal(client.state, 'running')
    const result = await client.callTool('noema_recall', { query: 'hello' }, { timeoutMs: 5000 })
    assert.deepEqual(JSON.parse(result.text), { name: 'noema_recall', args: { query: 'hello' } })
  } finally {
    await client.dispose()
    server.kill()
  }
  assert.equal(client.state, 'stopped')
})

test('concurrent manager calls share one in-progress server start', async () => {
  const delayedServer = FAKE_SERVER.replace(
    "    send({ jsonrpc: '2.0', id: msg.id, result: { protocolVersion: '2024-11-05', capabilities: {}, serverInfo: { name: 'fake-noema', version: '0' } } })",
    "    setTimeout(() => send({ jsonrpc: '2.0', id: msg.id, result: { protocolVersion: '2024-11-05', capabilities: {}, serverInfo: { name: 'fake-noema', version: '0' } } }), 100)",
  )
  const config = {
    ...NOEMA_MEMORY_SETTINGS_DEFAULTS,
    command: fakeServerCommand(delayedServer),
    autoStart: false,
    idleTimeoutMs: 0,
  }
  const manager = new NoemaServerManager(() => config)
  try {
    const [first, second] = await Promise.all([
      manager.call('first', { order: 1 }),
      manager.call('second', { order: 2 }),
    ])
    assert.equal(JSON.parse(first.text).name, 'first')
    assert.equal(JSON.parse(second.text).name, 'second')
  } finally {
    await manager.dispose()
  }
})

test('isError results reject with the server text', async () => {
  const server = startFakeServer()
  const client = new McpStdioClient({ command: server.spawnargs[0], args: server.spawnargs.slice(1) })
  try {
    await client.start()
    await assert.rejects(
      () => client.callTool('boom', {}, { timeoutMs: 5000 }),
      error => error instanceof McpStdioError && /kaboom/.test(error.message),
    )
  } finally {
    await client.dispose()
    server.kill()
  }
})

test('server exit rejects in-flight calls', async () => {
  const server = startFakeServer()
  const client = new McpStdioClient({ command: server.spawnargs[0], args: server.spawnargs.slice(1) })
  try {
    await client.start()
    const pending = client.callTool('exit', {}, { timeoutMs: 5000 })
    await assert.rejects(pending, /exited \(code 7\)/)
    assert.equal(client.state, 'exited')
  } finally {
    await client.dispose()
    server.kill()
  }
})

test('call timeout rejects and the connection survives for reuse', async () => {
  const server = startFakeServer()
  const client = new McpStdioClient({ command: server.spawnargs[0], args: server.spawnargs.slice(1) })
  try {
    await client.start()
    await assert.rejects(
      () => client.callTool('silent', {}, { timeoutMs: 150 }),
      /timed out/,
    )
    // The server is still healthy: a later call completes.
    const result = await client.callTool('noema_status', {}, { timeoutMs: 5000 })
    assert.equal(JSON.parse(result.text).name, 'noema_status')
  } finally {
    await client.dispose()
    server.kill()
  }
})

test('initialize timeout rejects startup', async () => {
  const silent = spawn(process.execPath, ['--input-type=module', '-e', "process.stdin.resume()"], { stdio: ['pipe', 'pipe', 'pipe'] })
  const client = new McpStdioClient({
    command: silent.spawnargs[0],
    args: silent.spawnargs.slice(1),
    initializeTimeoutMs: 200,
  })
  try {
    await assert.rejects(() => client.start(), /timed out/)
  } finally {
    await client.dispose()
    silent.kill()
  }
})
