import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { platforms, projectRoot } from './platforms.mjs'

const requested = process.argv[2]?.replace(/^v/u, '')
const rootPath = join(projectRoot, 'package.json')
const rootManifest = JSON.parse(await readFile(rootPath, 'utf8'))
const version = requested ?? rootManifest.version
if (typeof version !== 'string' || !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/u.test(version)) {
  throw new Error(`invalid release version ${JSON.stringify(version)}`)
}

rootManifest.version = version
rootManifest.optionalDependencies = Object.fromEntries(
  platforms.map(platform => [platform.packageName, version]),
)
await writeFile(rootPath, JSON.stringify(rootManifest, null, 2) + '\n')

for (const platform of platforms) {
  const manifestPath = join(projectRoot, 'npm', platform.id, 'package.json')
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  manifest.version = version
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
}

const lockPath = join(projectRoot, 'package-lock.json')
const lock = JSON.parse(await readFile(lockPath, 'utf8'))
lock.name = rootManifest.name
lock.version = version
lock.packages[''].name = rootManifest.name
lock.packages[''].version = version
lock.packages[''].optionalDependencies = rootManifest.optionalDependencies
for (const platform of platforms) {
  lock.packages['node_modules/' + platform.packageName] = { optional: true }
}
await writeFile(lockPath, JSON.stringify(lock, null, 2) + '\n')
process.stdout.write(`synchronized seven npm packages to ${version}\n`)
