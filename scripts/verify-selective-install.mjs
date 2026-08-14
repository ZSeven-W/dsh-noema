import { spawnSync } from 'node:child_process'
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, join, resolve } from 'node:path'
import { platforms } from './platforms.mjs'

const artifactRoot = resolve(process.argv[2] ?? 'artifacts')
const reports = await readReports(artifactRoot)
const rootReport = reports.find(report => report.name === '@zseven-w/dsh-noema')
if (rootReport === undefined) throw new Error('root package tarball is missing')
const nativeReports = new Map()
for (const report of reports) {
  const platform = platforms.find(candidate => candidate.packageName === report.name)
  if (platform !== undefined) nativeReports.set(platform.id, report)
}
if (nativeReports.size !== platforms.length) {
  throw new Error(`expected six native tarballs, found ${nativeReports.size}`)
}

const optionalDependencies = Object.fromEntries(platforms.map(platform => {
  const report = nativeReports.get(platform.id)
  return [platform.packageName, 'file:' + join(report.directory, report.filename)]
}))

for (const platform of platforms) {
  await verifySelection(platform, optionalDependencies, rootReport)
}
await verifyOmitted(optionalDependencies, rootReport)
process.stdout.write('verified npm selective installation for six platforms and --omit=optional\n')

async function verifySelection(platform, dependencies, root) {
  const directory = await createConsumer(dependencies, root)
  try {
    const args = [
      'install',
      '--ignore-scripts',
      '--package-lock=false',
      '--no-audit',
      '--no-fund',
      '--legacy-peer-deps',
      `--os=${platform.os}`,
      `--cpu=${platform.cpu}`,
    ]
    if (platform.libc !== undefined) args.push(`--libc=${platform.libc}`)
    runNpm(args, directory)
    const installed = await installedNativePackages(directory)
    const expected = [basename(platform.packageName)]
    if (installed.length !== 1 || installed[0] !== expected[0]) {
      throw new Error(`${platform.id}: expected ${expected[0]}, installed ${installed.join(', ') || 'nothing'}`)
    }
    const binary = resolveInstalledBinary(directory, platform)
    const expectedSuffix = join('node_modules', '@zseven-w', expected[0], 'bin', platform.binaryName)
    if (!binary.endsWith(expectedSuffix)) {
      throw new Error(`${platform.id}: root resolver selected ${binary}, expected suffix ${expectedSuffix}`)
    }
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}

async function verifyOmitted(dependencies, root) {
  const directory = await createConsumer(dependencies, root)
  try {
    runNpm(['install', '--ignore-scripts', '--package-lock=false', '--no-audit', '--no-fund', '--legacy-peer-deps', '--omit=optional'], directory)
    const installed = await installedNativePackages(directory)
    if (installed.length !== 0) throw new Error(`--omit=optional installed ${installed.join(', ')}`)
    if (resolveInstalledBinary(directory, platforms[0], true) !== '') {
      throw new Error('--omit=optional unexpectedly resolved a native binary')
    }
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}

async function createConsumer(optionalDependencies, root) {
  const directory = await mkdtemp(join(tmpdir(), 'dsh-noema-install-'))
  await writeFile(join(directory, 'package.json'), JSON.stringify({
    name: 'dsh-noema-install-smoke',
    private: true,
    version: '0.0.0',
    dependencies: {
      '@zseven-w/dsh-noema': 'file:' + join(root.directory, root.filename),
    },
    optionalDependencies,
  }, null, 2) + '\n')
  return directory
}

function runNpm(args, cwd) {
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  const result = spawnSync(npm, args, { cwd, encoding: 'utf8', shell: process.platform === 'win32' })
  if (result.status !== 0) throw new Error(`npm ${args.join(' ')} failed:\n${result.stderr || result.stdout}`)
}

function resolveInstalledBinary(directory, platform, allowMissing = false) {
  const source = [
    "const { dirname, join } = require('node:path')",
    "const { pathToFileURL } = require('node:url')",
    "const manifest = require.resolve('@zseven-w/dsh-noema/package.json', { paths: [process.cwd()] })",
    "import(pathToFileURL(join(dirname(manifest), 'lib', 'bundled-binary.js')).href).then(mod => {",
    `  const value = mod.tryResolveBundledNoemaBinary({ platform: ${JSON.stringify(platform.os)}, arch: ${JSON.stringify(platform.cpu)}, projectRoot: join(process.cwd(), 'no-source-checkout') })`,
    "  process.stdout.write(value ?? '')",
    "})",
  ].join(';')
  const result = spawnSync(process.execPath, ['-e', source], { cwd: directory, encoding: 'utf8' })
  if (result.status !== 0) throw new Error(`root resolver failed for ${platform.id}:\n${result.stderr || result.stdout}`)
  const value = result.stdout.trim()
  if (!allowMissing && value === '') throw new Error(`${platform.id}: root resolver did not find the installed native package`)
  return value
}

async function installedNativePackages(directory) {
  try {
    return (await readdir(join(directory, 'node_modules', '@zseven-w')))
      .filter(name => name.startsWith('dsh-noema-'))
      .sort()
  } catch {
    return []
  }
}

async function readReports(directory) {
  const output = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) output.push(...await readReports(path))
    else if (entry.name.endsWith('.tgz.json')) {
      output.push({ ...JSON.parse(await readFile(path, 'utf8')), directory })
    }
  }
  return output
}
