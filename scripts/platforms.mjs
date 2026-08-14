import { readFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

export const platforms = Object.freeze(
  JSON.parse(await readFile(join(projectRoot, 'platforms.json'), 'utf8')),
)

export function platformById(id) {
  const platform = platforms.find(candidate => candidate.id === id)
  if (platform === undefined) {
    throw new Error(`unsupported platform ${JSON.stringify(id)}; expected one of ${platforms.map(item => item.id).join(', ')}`)
  }
  return platform
}

export function argumentValue(name) {
  const index = process.argv.indexOf(name)
  if (index === -1) return undefined
  const value = process.argv[index + 1]
  if (value === undefined || value.startsWith('--')) throw new Error(`${name} requires a value`)
  return value
}
