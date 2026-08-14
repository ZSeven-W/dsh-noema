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
