import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { platforms, projectRoot } from './platforms.mjs'

const requested = process.argv[2]?.replace(/^v/u, '')
if (requested === undefined) throw new Error('usage: node scripts/check-release-version.mjs <version>')

const root = JSON.parse(await readFile(join(projectRoot, 'package.json'), 'utf8'))
if (root.version !== requested) throw new Error(`tag version ${requested} does not match package.json ${root.version}`)
try {
  // npm lockfiles are optional since the pnpm migration; validate only when one exists.
  const lock = JSON.parse(await readFile(join(projectRoot, 'package-lock.json'), 'utf8'))
  if (lock.version !== requested || lock.packages?.['']?.version !== requested) {
    throw new Error(`package-lock.json is not synchronized to ${requested}`)
  }
} catch (error) {
  if (error?.code !== 'ENOENT') throw error
}
for (const platform of platforms) {
  const manifest = JSON.parse(await readFile(join(projectRoot, 'npm', platform.id, 'package.json'), 'utf8'))
  if (manifest.version !== requested) throw new Error(`${platform.packageName} is not synchronized to ${requested}`)
  if (root.optionalDependencies?.[platform.packageName] !== requested) {
    throw new Error(`root optional dependency ${platform.packageName} is not pinned to ${requested}`)
  }
}
process.stdout.write(requested + '\n')
