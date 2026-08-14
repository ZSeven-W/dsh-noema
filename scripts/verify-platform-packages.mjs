import { readFile, stat } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { join } from 'node:path'
import { argumentValue, platformById, platforms, projectRoot } from './platforms.mjs'

const selectedId = argumentValue('--platform')
const requireBinaries = process.argv.includes('--require-binaries')
const selectedPlatforms = selectedId === undefined ? platforms : [platformById(selectedId)]
const rootManifest = JSON.parse(await readFile(join(projectRoot, 'package.json'), 'utf8'))

function packDryRun(packagePath) {
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  const result = spawnSync(npm, ['pack', '--dry-run', '--json', '--ignore-scripts', packagePath], {
    cwd: projectRoot,
    encoding: 'utf8',
    shell: process.platform === 'win32',
  })
  if (result.status !== 0) throw new Error(`npm pack failed for ${packagePath}: ${result.stderr || result.stdout}`)
  const reports = JSON.parse(result.stdout)
  if (!Array.isArray(reports) || reports.length !== 1) throw new Error(`npm pack returned an unexpected report for ${packagePath}`)
  return reports[0]
}

for (const platform of selectedPlatforms) {
  const manifestPath = join(projectRoot, 'npm', platform.id, 'package.json')
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  if (manifest.name !== platform.packageName) throw new Error(`${platform.id}: unexpected package name`)
  if (manifest.version !== rootManifest.version) throw new Error(`${platform.id}: version must match root package`)
  if (manifest.os?.length !== 1 || manifest.os[0] !== platform.os) throw new Error(`${platform.id}: invalid os selector`)
  if (manifest.cpu?.length !== 1 || manifest.cpu[0] !== platform.cpu) throw new Error(`${platform.id}: invalid cpu selector`)
  if (platform.libc !== undefined && (manifest.libc?.length !== 1 || manifest.libc[0] !== platform.libc)) {
    throw new Error(`${platform.id}: invalid libc selector`)
  }
  if (rootManifest.optionalDependencies?.[platform.packageName] !== rootManifest.version) {
    throw new Error(`${platform.id}: root optional dependency must use the exact release version`)
  }
  if (manifest.bin !== undefined) throw new Error(`${platform.id}: native helper packages must not expose a global bin link`)
  if (manifest.preferUnplugged !== true) throw new Error(`${platform.id}: native package must prefer unpacked installation`)
  if (manifest.publishConfig?.access !== 'public') throw new Error(`${platform.id}: scoped package must publish publicly`)
  if (manifest.engines?.node !== rootManifest.engines?.node) throw new Error(`${platform.id}: Node engine must match root package`)
  if (!manifest.files?.includes('bin') || !manifest.files?.includes('LICENSE')) throw new Error(`${platform.id}: files must include binary and license`)
  if (platform.libc === undefined && manifest.libc !== undefined) throw new Error(`${platform.id}: non-Linux package must not declare libc`)
  if (!requireBinaries) continue
  const binaryPath = join(projectRoot, 'npm', platform.id, 'bin', platform.binaryName)
  const binary = await stat(binaryPath)
  if (!binary.isFile() || binary.size < 100_000) throw new Error(`${platform.id}: staged binary is missing or implausibly small`)
  if (platform.os !== 'win32' && (binary.mode & 0o111) === 0) throw new Error(`${platform.id}: staged binary is not executable`)

  const packed = packDryRun('./npm/' + platform.id)
  const packedFiles = packed.files.map(file => file.path).sort()
  assertSameList(packedFiles, ['LICENSE', `bin/${platform.binaryName}`, 'package.json'], `${platform.id}: packed files`)
  const packedBinary = packed.files.find(file => file.path === `bin/${platform.binaryName}`)
  if (platform.os !== 'win32' && packedBinary?.mode !== 0o755) throw new Error(`${platform.id}: packed binary must retain mode 0755`)
}

if (selectedId === undefined && Object.keys(rootManifest.optionalDependencies ?? {}).length !== platforms.length) {
  throw new Error('root package must declare exactly six native optional dependencies')
}
if (rootManifest.bundleDependencies !== undefined || rootManifest.bundledDependencies !== undefined) {
  throw new Error('root package must not bundle all native dependencies')
}

const rootPack = packDryRun('.')
const forbiddenRootEntries = rootPack.files
  .map(file => file.path)
  .filter(path => /^(?:noema|npm|node_modules|target|\.git)(?:\/|$)/u.test(path))
if (forbiddenRootEntries.length > 0) throw new Error(`root tarball leaked development/native files: ${forbiddenRootEntries.join(', ')}`)
if (rootPack.bundled?.length > 0) throw new Error('root tarball unexpectedly bundles native dependencies')
process.stdout.write(`verified ${selectedPlatforms.length} platform package(s)\n`)

function assertSameList(actual, expected, label) {
  if (actual.length !== expected.length || actual.some((item, index) => item !== expected[index])) {
    throw new Error(`${label}: expected ${expected.join(', ')}, got ${actual.join(', ')}`)
  }
}
