import { chmod, copyFile, mkdir, stat } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { argumentValue, platformById, projectRoot } from './platforms.mjs'

const id = argumentValue('--platform') ?? `${process.platform}-${process.arch}`
const platform = platformById(id)
const explicitSource = argumentValue('--source')
const targetRoot = join(projectRoot, 'noema', 'target')
const sourceCandidates = explicitSource === undefined
  ? [
      join(targetRoot, platform.rustTarget, 'release', platform.binaryName),
      join(targetRoot, 'release', platform.binaryName),
      join(targetRoot, platform.rustTarget, 'debug', platform.binaryName),
      join(targetRoot, 'debug', platform.binaryName),
    ]
  : [resolve(explicitSource)]

let source
for (const candidate of sourceCandidates) {
  try {
    if ((await stat(candidate)).isFile()) {
      source = candidate
      break
    }
  } catch {
    // Continue to the next deterministic build location.
  }
}
if (source === undefined) {
  throw new Error(`no noema-mcp binary found for ${id}; checked ${sourceCandidates.join(', ')}`)
}

const destinationDirectory = join(projectRoot, 'npm', id, 'bin')
const destination = join(destinationDirectory, platform.binaryName)
await mkdir(destinationDirectory, { recursive: true })
await copyFile(source, destination)
if (platform.os !== 'win32') await chmod(destination, 0o755)
process.stdout.write(`${source} -> ${destination}\n`)
