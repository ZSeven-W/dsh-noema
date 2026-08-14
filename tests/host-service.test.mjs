import assert from 'node:assert/strict'
import { Readable } from 'node:stream'
import { test } from 'node:test'

async function callRoute(route, method, body, options = {}) {
  const req = Readable.from(body === undefined ? [] : [JSON.stringify(body)])
  req.method = method
  const host = options.host ?? '127.0.0.1:3080'
  req.headers = {
    host,
    ...(method === 'POST' ? { 'content-type': options.contentType ?? 'application/json' } : {}),
    ...(options.origin !== undefined
      ? { origin: options.origin }
      : method === 'POST' ? { origin: `http://${host}` } : {}),
    ...(options.secFetchSite === undefined ? {} : { 'sec-fetch-site': options.secFetchSite }),
  }
  Object.defineProperty(req, 'socket', {
    configurable: true,
    value: { remoteAddress: options.remoteAddress ?? '127.0.0.1' },
  })
  const chunks = []
  let statusCode
  const res = {
    writeHead(status) { statusCode = status },
    end(chunk) { if (chunk !== undefined) chunks.push(Buffer.from(chunk)) },
  }
  await route.handler(req, res)
  return {
    statusCode,
    body: JSON.parse(Buffer.concat(chunks).toString('utf8')),
  }
}

test('plugin mounts settings, tools, guidance, and the status route', async () => {
  const registeredTools = []
  const toolDisposers = []
  const injectedServices = []
  const sections = []
  const routeRegistrations = []
  let settingsRegistered = null
  let settingsValue

  const ctx = {
    tools: {
      register(tool) {
        registeredTools.push(tool)
        return () => { toolDisposers.push(tool.name) }
      },
    },
    effect(install) {
      return install()
    },
    inject(services, install) {
      injectedServices.push([...services])
      if (services.includes('settings')) {
        const settingsScope = {
          get() {
            return settingsValue
          },
          watch() { return () => {} },
          async update(patch) {
            const next = { ...settingsValue, ...patch }
            settingsRegistered?.options.validate?.(next)
            settingsValue = next
          },
          async replace(section) {
            const next = { ...defaults, ...entry, ...section }
            settingsRegistered?.options.validate?.(next)
            settingsValue = next
          },
        }
        install({
          settings: {
            register(ns, schema, options) {
              settingsRegistered = { ns, options }
              return settingsScope
            },
          },
          effect(innerInstall) { return innerInstall() },
        })
      }
      if (services.includes('systemPrompt')) {
        install({
          systemPrompt: {
            section(section) {
              sections.push(section)
              return () => {}
            },
          },
        })
      }
      if (services.includes('webServer')) {
        install({
          webServer: {
            register(route) {
              routeRegistrations.push(route)
              return () => {}
            },
          },
        })
      }
    },
    on() { return () => {} },
    logger: { info() {}, warn() {} },
  }

  const { NOEMA_MEMORY_SETTINGS_DEFAULTS: defaults } = await import('../lib/settings.js')
  const entry = { autoStart: false }
  settingsValue = { ...defaults, ...entry }
  const { apply, inject } = await import('../lib/index.js')
  const disposePlugin = await apply(ctx, entry)

  assert.deepEqual(inject, ['tools'])
  assert.deepEqual(injectedServices.filter(list => list.includes('settings')).length, 1)
  assert.ok(settingsRegistered !== null, 'settings namespace must be registered')
  assert.equal(settingsRegistered.ns, 'noema-memory')
  assert.equal(settingsRegistered.options.base, entry)

  assert.equal(registeredTools.length, 15)
  assert.deepEqual(registeredTools.map(tool => tool.name), [
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
  ])

  const recall = registeredTools[0]
  // defineTool compiles the author parameter map into a JSON-Schema object:
  // requiredness moves to the root 'required' array.
  assert.deepEqual(recall.parameters.required, ['query'])
  assert.equal(recall.parameters.properties.query.type, 'string')
  assert.equal(recall.output.schema.properties.ok.type, 'boolean')
  assert.ok(recall.output.schema.required.includes('ok'))
  assert.ok(recall.output.schema.required.includes('tool'))
  assert.ok(recall.output.schema.required.includes('text'))
  assert.equal(recall.output.schema.additionalProperties, false)

  // Guidance section is registered when a systemPrompt service exists.
  assert.equal(sections.length, 1)
  assert.equal(sections[0].name, 'noema:memory-guidance')
  assert.equal(sections[0].order, 120)
  const guidanceText = sections[0].text()
  assert.ok(guidanceText.includes('noema_recall'), 'guidance must teach recall')
  assert.ok(guidanceText.includes('noema_remember'), 'guidance must teach remember')

  // Status route is registered when a webServer service exists.
  assert.equal(routeRegistrations.length, 1)
  assert.deepEqual(
    { kind: routeRegistrations[0].kind, path: routeRegistrations[0].path },
    { kind: 'exact', path: '/_dsh/dsh-noema/status' },
  )

  const before = await callRoute(routeRegistrations[0], 'GET')
  assert.equal(before.statusCode, 200)
  assert.equal(before.body.config.command, 'bundled')
  assert.equal(before.body.writable, true)

  const configured = await callRoute(routeRegistrations[0], 'POST', {
    action: 'configure',
    field: 'recallBudgetTokens',
    value: 2048,
  })
  assert.equal(configured.statusCode, 200)
  assert.equal(configured.body.config.recallBudgetTokens, 2048)
  assert.equal(settingsValue.recallBudgetTokens, 2048)

  const rejected = await callRoute(routeRegistrations[0], 'POST', {
    action: 'configure',
    field: 'recallBudgetTokens',
    value: 0,
  })
  assert.equal(rejected.statusCode, 422)
  assert.match(rejected.body.error, /recall budget/)

  const crossOrigin = await callRoute(routeRegistrations[0], 'POST', {
    action: 'configure',
    field: 'command',
    value: '/tmp/attacker-command',
  }, { origin: 'https://attacker.example' })
  assert.equal(crossOrigin.statusCode, 403)
  assert.equal(settingsValue.command, 'bundled')

  const crossOriginRead = await callRoute(routeRegistrations[0], 'GET', undefined, {
    origin: 'https://attacker.example',
  })
  assert.equal(crossOriginRead.statusCode, 403)

  const crossSite = await callRoute(routeRegistrations[0], 'POST', {
    action: 'restart',
  }, { secFetchSite: 'cross-site' })
  assert.equal(crossSite.statusCode, 403)

  const noCorsBody = await callRoute(routeRegistrations[0], 'POST', {
    action: 'configure',
    field: 'command',
    value: '/tmp/attacker-command',
  }, { contentType: 'text/plain' })
  assert.equal(noCorsBody.statusCode, 415)
  assert.equal(settingsValue.command, 'bundled')

  const remotePeer = await callRoute(routeRegistrations[0], 'GET', undefined, {
    remoteAddress: '192.0.2.44',
  })
  assert.equal(remotePeer.statusCode, 403)

  const reboundHost = await callRoute(routeRegistrations[0], 'GET', undefined, {
    host: 'attacker.example:3080',
  })
  assert.equal(reboundHost.statusCode, 403)

  const mappedLoopback = await callRoute(routeRegistrations[0], 'GET', undefined, {
    remoteAddress: '::ffff:127.23.4.5',
  })
  assert.equal(mappedLoopback.statusCode, 200)

  const hexadecimalLoopback = await callRoute(routeRegistrations[0], 'GET', undefined, {
    remoteAddress: '::ffff:7f00:1',
  })
  assert.equal(hexadecimalLoopback.statusCode, 200)

  await disposePlugin()
  assert.deepEqual(toolDisposers.length, 15, 'all tool disposers must run')
})

test('tools fail fast with a clear message when memory is disabled', async () => {
  const registeredTools = []
  let source = () => ({ enabled: false, command: 'noema-mcp' })

  const ctx = {
    tools: { register(tool) { registeredTools.push(tool); return () => {} } },
    effect(install) { return install() },
    inject(services, install) {
      if (services.includes('settings')) {
        install({
          settings: {
            register() {
              return {
                get: () => source(),
                watch() { return () => {} },
                update: async () => {},
                replace: async () => {},
              }
            },
          },
          effect(innerInstall) { return innerInstall() },
        })
      }
    },
    on() { return () => {} },
    logger: { info() {}, warn() {} },
  }

  const { apply } = await import('../lib/index.js')
  await apply(ctx, { autoStart: false })
  const recall = registeredTools.find(tool => tool.name === 'noema_recall')
  await assert.rejects(
    () => recall.execute({ query: 'anything' }, { signal: undefined }),
    /Noema memory is disabled/,
  )
})

test('guidance text is empty when guidance is disabled', async () => {
  const { noemaGuidanceText } = await import('../lib/guidance.js')
  const { NOEMA_MEMORY_SETTINGS_DEFAULTS } = await import('../lib/settings.js')
  assert.equal(noemaGuidanceText({ ...NOEMA_MEMORY_SETTINGS_DEFAULTS, enabled: false }), '')
  assert.equal(noemaGuidanceText({ ...NOEMA_MEMORY_SETTINGS_DEFAULTS, guidance: false }), '')
  assert.ok(noemaGuidanceText(NOEMA_MEMORY_SETTINGS_DEFAULTS).includes('</noema-memory>'))
})

test('launch resolution tokenizes commands and expands homes', async () => {
  const { resolveNoemaLaunch, tokenizeCommand } = await import('../lib/server-manager.js')
  const { NOEMA_MEMORY_SETTINGS_DEFAULTS } = await import('../lib/settings.js')
  assert.deepEqual(tokenizeCommand('noema-mcp'), ['noema-mcp'])
  assert.deepEqual(tokenizeCommand('cargo run -p noema-mcp'), ['cargo', 'run', '-p', 'noema-mcp'])
  assert.deepEqual(tokenizeCommand('my "quoted command"'), ['my', 'quoted command'])
  const bundled = resolveNoemaLaunch(NOEMA_MEMORY_SETTINGS_DEFAULTS, () => '/opt/dsh-noema/noema-mcp')
  assert.equal(bundled.command, '/opt/dsh-noema/noema-mcp')
  assert.deepEqual(bundled.args, [])
  const launch = resolveNoemaLaunch({ ...NOEMA_MEMORY_SETTINGS_DEFAULTS, command: 'noema-mcp', noemaRoot: '~/memories' })
  assert.equal(launch.command, 'noema-mcp')
  assert.ok(launch.env.NOEMA_ROOT.endsWith('/memories'))
  assert.equal(launch.env.NOEMA_ROOT.startsWith('/'), true)
})

test('settings schema validates ranges and the recall budget', async () => {
  const { validateNoemaMemorySettings, NOEMA_MEMORY_SETTINGS_DEFAULTS } = await import('../lib/settings.js')
  validateNoemaMemorySettings(NOEMA_MEMORY_SETTINGS_DEFAULTS)
  assert.throws(() => validateNoemaMemorySettings({ ...NOEMA_MEMORY_SETTINGS_DEFAULTS, recallBudgetTokens: 0 }), /recall budget/)
  assert.throws(() => validateNoemaMemorySettings({ ...NOEMA_MEMORY_SETTINGS_DEFAULTS, idleTimeoutMs: -1 }), /idle timeout/)
  assert.throws(() => validateNoemaMemorySettings({ ...NOEMA_MEMORY_SETTINGS_DEFAULTS, command: '  ' }), /command/)
})

test('MCP client metadata follows the npm package version', async () => {
  const { DSH_NOEMA_VERSION } = await import('../lib/index.js')
  const manifest = await import('../package.json', { with: { type: 'json' } })
  assert.equal(DSH_NOEMA_VERSION, manifest.default.version)
})
