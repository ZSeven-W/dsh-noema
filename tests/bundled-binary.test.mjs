import assert from 'node:assert/strict'
import { join } from 'node:path'
import { test } from 'node:test'
import {
  NOEMA_PLATFORM_PACKAGES,
  bundledNoemaCandidates,
  noemaPlatformPackage,
  resolveBundledNoemaBinary,
} from '../lib/bundled-binary.js'

const EXPECTED = {
  'darwin-arm64': ['@zseven-w/dsh-noema-darwin-arm64', 'aarch64-apple-darwin', 'noema-mcp'],
  'darwin-x64': ['@zseven-w/dsh-noema-darwin-x64', 'x86_64-apple-darwin', 'noema-mcp'],
  'linux-arm64': ['@zseven-w/dsh-noema-linux-arm64', 'aarch64-unknown-linux-gnu', 'noema-mcp'],
  'linux-x64': ['@zseven-w/dsh-noema-linux-x64', 'x86_64-unknown-linux-gnu', 'noema-mcp'],
  'win32-arm64': ['@zseven-w/dsh-noema-win32-arm64', 'aarch64-pc-windows-msvc', 'noema-mcp.exe'],
  'win32-x64': ['@zseven-w/dsh-noema-win32-x64', 'x86_64-pc-windows-msvc', 'noema-mcp.exe'],
}

test('native package table covers exactly the six published platforms', () => {
  assert.deepEqual(Object.keys(NOEMA_PLATFORM_PACKAGES).sort(), Object.keys(EXPECTED).sort())
  for (const [id, expected] of Object.entries(EXPECTED)) {
    const [platform, arch] = id.split('-')
    const descriptor = noemaPlatformPackage(platform, arch)
    assert.deepEqual(
      [descriptor?.packageName, descriptor?.rustTarget, descriptor?.binaryName],
      expected,
    )
  }
})

test('source checkout builds take precedence over an installed native package', () => {
  const projectRoot = join('/', 'workspace', 'dsh-noema')
  const packageJson = join('/', 'node_modules', '@zseven-w', 'native', 'package.json')
  const candidates = bundledNoemaCandidates({
    platform: 'darwin',
    arch: 'arm64',
    projectRoot,
    resolvePackageJson: () => packageJson,
  })
  assert.equal(candidates[0], join(projectRoot, 'noema', 'target', 'aarch64-apple-darwin', 'release', 'noema-mcp'))
  assert.equal(candidates.at(-1), join(packageJson, '..', 'bin', 'noema-mcp'))
})

test('resolver accepts installed package and git-submodule candidates', () => {
  const packageJson = join('/', 'node_modules', '@zseven-w', 'native', 'package.json')
  const packageBinary = join(packageJson, '..', 'bin', 'noema-mcp')
  assert.equal(resolveBundledNoemaBinary({
    platform: 'darwin',
    arch: 'arm64',
    projectRoot: join('/', 'missing'),
    resolvePackageJson: () => packageJson,
    isFile: candidate => candidate === packageBinary,
  }), packageBinary)

  const projectRoot = join('/', 'workspace', 'dsh-noema')
  const debugBinary = join(projectRoot, 'noema', 'target', 'debug', 'noema-mcp')
  assert.equal(resolveBundledNoemaBinary({
    platform: 'darwin',
    arch: 'arm64',
    projectRoot,
    resolvePackageJson: () => { throw new Error('not installed') },
    isFile: candidate => candidate === debugBinary,
  }), debugBinary)
})

test('resolver reports unsupported and missing platform packages clearly', () => {
  assert.throws(
    () => resolveBundledNoemaBinary({ platform: 'freebsd', arch: 'x64' }),
    /no bundled noema-mcp build exists for freebsd-x64/,
  )
  assert.throws(
    () => resolveBundledNoemaBinary({
      platform: 'linux',
      arch: 'x64',
      projectRoot: join('/', 'missing'),
      resolvePackageJson: () => { throw new Error('not installed') },
      isFile: () => false,
    }),
    /--include=optional.*build:noema:dev/,
  )
})
