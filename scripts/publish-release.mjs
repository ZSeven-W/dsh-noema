import { spawnSync } from 'node:child_process'
import { readFile, readdir } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { publishAndVerify } from './registry-convergence.mjs'
import { platforms } from './platforms.mjs'

const artifactRoot = resolve(process.argv[2] ?? 'artifacts')
const reports = await readReports(artifactRoot)
const root = reports.find(report => report.name === '@zseven-w/dsh-noema')
if (root === undefined) throw new Error('root package tarball is missing')
const native = platforms.map(platform => {
  const report = reports.find(candidate => candidate.name === platform.packageName)
  if (report === undefined) throw new Error(`${platform.packageName} tarball is missing`)
  return report
})
for (const report of [...native, root]) {
  if (report.version !== root.version) throw new Error(`${report.name} version differs from root ${root.version}`)
}

// Every release takes `latest`, prereleases included (see release.yml).
const tag = 'latest'
for (const report of [...native, root]) await publishOrVerify(report, tag)

async function publishOrVerify(report, tag) {
  const specifier = `${report.name}@${report.version}`
  const existing = registryIntegrity(specifier)
  if (existing !== undefined) {
    if (existing !== report.integrity) {
      throw new Error(`${specifier} already exists with different integrity (${existing} != ${report.integrity})`)
    }
    process.stdout.write(`${specifier} already published with matching integrity; skipping\n`)
    return
  }

  const tarball = join(report.directory, report.filename)
  await publishAndVerify({
    specifier, version: report.version, integrity: report.integrity, tag,
    publish: () => npmResult(['publish', tarball, '--access=public', `--tag=${tag}`, '--provenance']),
    readState: () => ({ integrity: registryIntegrity(specifier), tag: registryTag(report.name, tag) }),
  })
}

function registryIntegrity(specifier) {
  const result = npmResult(['view', specifier, 'dist.integrity', '--json'])
  if (result.status === 0) {
    const value = JSON.parse(result.stdout)
    return typeof value === 'string' ? value : undefined
  }
  const output = result.stderr + result.stdout
  if (/E404|404 Not Found/u.test(output)) return undefined
  throw new Error(`npm view ${specifier} failed:\n${output}`)
}

function registryTag(name, tag) {
  const result = npmResult(['view', name, 'dist-tags', '--json'])
  if (result.status !== 0) {
    if (/E404|404 Not Found/u.test(result.stderr + result.stdout)) return undefined
    throw new Error(`npm view ${name} dist-tags failed: ${result.stderr || result.stdout}`)
  }
  return JSON.parse(result.stdout)?.[tag]
}

function npmResult(args) {
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  return spawnSync(npm, args, { encoding: 'utf8', shell: process.platform === 'win32' })
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
