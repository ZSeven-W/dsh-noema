import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import vm from 'node:vm'

test('client bundle registers its section without touching the generic settingsScope API', async () => {
  let loaderEntry
  const source = await readFile(new URL('../lib/client.js', import.meta.url), 'utf8')
  vm.runInNewContext(source, {
    window: {
      __ModuleLoader__: {
        load(entry) { loaderEntry = entry },
      },
    },
  })
  assert.ok(loaderEntry !== undefined)
  const client = loaderEntry.factory(createRequire(import.meta.url))
  assert.deepEqual([...client.inject], ['slots', 'locale'])
  assert.equal(source.includes('settingsScope.bind'), false)

  let registeredSection
  client.apply({
    slots: {
      inject(name, install) {
        assert.equal(name, 'settings.section')
        return install()
      },
      register(descriptor) {
        registeredSection = descriptor.id
        return () => {}
      },
    },
    locale: { getLocale: () => ({ active: 'en' }) },
  })
  assert.equal(registeredSection, 'noema-memory')
})

test('client declaration only injects packages that exist on DSH 0.1.5', async () => {
  // @deepseek-ai/dsh-client-runtime was removed in 0.1.5 (ctx.slots now comes
  // from dsh-client-ui-renderer); the inject list must not name it.
  const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
  const inject = manifest.dsh.client.inject
  assert.equal(inject.includes('@deepseek-ai/dsh-client-runtime'), false)
  assert.ok(inject.includes('@deepseek-ai/dsh-client-ui-renderer'))
  assert.equal(Object.hasOwn(manifest.peerDependencies, '@deepseek-ai/dsh-client-runtime'), false)
})
