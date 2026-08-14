import { spawnSync } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { argumentValue, projectRoot } from './platforms.mjs'

const packagePath = argumentValue('--package') ?? '.'
const destination = resolve(argumentValue('--destination') ?? 'artifacts')
await mkdir(destination, { recursive: true })

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const result = spawnSync(npm, [
  'pack',
  '--json',
  '--ignore-scripts',
  '--pack-destination',
  destination,
  packagePath,
], {
  cwd: projectRoot,
  encoding: 'utf8',
  shell: process.platform === 'win32',
})
if (result.status !== 0) throw new Error(result.stderr || result.stdout || `npm pack exited ${result.status}`)
const reports = JSON.parse(result.stdout)
if (!Array.isArray(reports) || reports.length !== 1) throw new Error('npm pack returned an unexpected report')
const report = reports[0]
await writeFile(resolve(destination, report.filename + '.json'), JSON.stringify(report, null, 2) + '\n')
process.stdout.write(`${report.name}@${report.version} -> ${resolve(destination, report.filename)}\n`)
