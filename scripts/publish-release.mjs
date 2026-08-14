import { spawnSync } from 'node:child_process'
import { readFile, readdir } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
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

const tag = root.version.includes('-') ? 'next' : 'latest'
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
  runNpm(['publish', tarball, '--access=public', `--tag=${tag}`, '--provenance'])
  for (let attempt = 1; attempt <= 12; attempt += 1) {
    const visible = registryIntegrity(specifier)
    if (visible === report.integrity) {
      process.stdout.write(`${specifier} published with dist-tag ${tag}\n`)
      return
    }
    await delay(5_000)
  }
  throw new Error(`${specifier} was published but did not become visible with the expected integrity`)
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

function runNpm(args) {
  const result = npmResult(args)
  if (result.status !== 0) throw new Error(`npm ${args.join(' ')} failed:\n${result.stderr || result.stdout}`)
}

function npmResult(args) {
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  return spawnSync(npm, args, { encoding: 'utf8' })
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
