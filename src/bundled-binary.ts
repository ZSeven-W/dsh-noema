/**
 * Resolve the platform-specific noema-mcp executable shipped as an optional
 * npm dependency. Source checkouts fall back to the Noema git submodule so
 * contributors can build and run without publishing the native packages.
 */
import { statSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const BUNDLED_NOEMA_COMMAND = 'bundled'

export interface NoemaPlatformPackage {
  packageName: string
  rustTarget: string
  binaryName: string
}

interface NoemaPlatformDefinition extends NoemaPlatformPackage {
  id: string
}

const requireFromPlugin = createRequire(import.meta.url)
const platformDefinitions = requireFromPlugin('../platforms.json') as NoemaPlatformDefinition[]

export const NOEMA_PLATFORM_PACKAGES: Readonly<Record<string, NoemaPlatformPackage>> = Object.freeze(
  Object.fromEntries(platformDefinitions.map(({ id, packageName, rustTarget, binaryName }) => [
    id,
    { packageName, rustTarget, binaryName },
  ])),
)

export interface BundledNoemaResolutionOptions {
  platform?: string
  arch?: string
  projectRoot?: string
  resolvePackageJson?: (specifier: string) => string
  isFile?: (path: string) => boolean
}

function defaultIsFile(path: string): boolean {
  try {
    return statSync(path).isFile()
  } catch {
    return false
  }
}

/** Stable npm selector key for the current Node platform and architecture. */
export function noemaPlatformKey(platform: string = process.platform, arch: string = process.arch): string {
  return platform + '-' + arch
}

/** Platform descriptor, or undefined when this release family has no binary. */
export function noemaPlatformPackage(
  platform: string = process.platform,
  arch: string = process.arch,
): NoemaPlatformPackage | undefined {
  return NOEMA_PLATFORM_PACKAGES[noemaPlatformKey(platform, arch)]
}

/**
 * Ordered candidates: release/debug builds from the git submodule first, then
 * the installed optional package. Exposed to make packaging tests deterministic.
 */
export function bundledNoemaCandidates(options: BundledNoemaResolutionOptions = {}): string[] {
  const platform = options.platform ?? process.platform
  const arch = options.arch ?? process.arch
  const descriptor = noemaPlatformPackage(platform, arch)
  if (descriptor === undefined) return []

  const candidates: string[] = []
  const projectRoot = options.projectRoot ?? resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const targetRoot = join(projectRoot, 'noema', 'target')
  candidates.push(
    join(targetRoot, descriptor.rustTarget, 'release', descriptor.binaryName),
    join(targetRoot, 'release', descriptor.binaryName),
    join(targetRoot, descriptor.rustTarget, 'debug', descriptor.binaryName),
    join(targetRoot, 'debug', descriptor.binaryName),
  )

  const resolvePackageJson = options.resolvePackageJson ?? (specifier => requireFromPlugin.resolve(specifier))
  try {
    const packageJson = resolvePackageJson(descriptor.packageName + '/package.json')
    candidates.push(join(dirname(packageJson), 'bin', descriptor.binaryName))
  } catch {
    // Optional dependencies are absent on every non-matching platform and in
    // a fresh source checkout. The submodule candidates above are intentional.
  }
  return [...new Set(candidates)]
}

/** Resolve the bundled executable if an installed package or dev build exists. */
export function tryResolveBundledNoemaBinary(
  options: BundledNoemaResolutionOptions = {},
): string | undefined {
  const isFile = options.isFile ?? defaultIsFile
  return bundledNoemaCandidates(options).find(candidate => isFile(candidate))
}

/** Resolve the bundled executable or fail with a platform-specific remedy. */
export function resolveBundledNoemaBinary(options: BundledNoemaResolutionOptions = {}): string {
  const platform = options.platform ?? process.platform
  const arch = options.arch ?? process.arch
  const key = noemaPlatformKey(platform, arch)
  const descriptor = noemaPlatformPackage(platform, arch)
  if (descriptor === undefined) {
    throw new Error(
      'Noema memory: no bundled noema-mcp build exists for ' + key +
      '. Supported platforms: ' + Object.keys(NOEMA_PLATFORM_PACKAGES).join(', ') +
      '. Set a custom server command in Noema Memory settings to use another build.',
    )
  }
  const binary = tryResolveBundledNoemaBinary(options)
  if (binary !== undefined) return binary
  throw new Error(
    'Noema memory: bundled package ' + descriptor.packageName +
    ' is not installed (or its binary is missing). Reinstall @zseven-w/dsh-noema with optional dependencies enabled (npm --include=optional), '
    + 'run npm run build:noema:dev in a source checkout, or set a custom server command in Noema Memory settings.',
  )
}
