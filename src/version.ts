/** Runtime package version shared with MCP client metadata. */
import { createRequire } from 'node:module'

const requireFromPlugin = createRequire(import.meta.url)
const manifest = requireFromPlugin('../package.json') as { version?: unknown }

if (typeof manifest.version !== 'string' || manifest.version === '') {
  throw new Error('@zseven-w/dsh-noema package.json has no valid version')
}

export const DSH_NOEMA_VERSION = manifest.version
