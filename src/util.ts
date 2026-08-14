/**
 * Small path/format helpers shared by the host half of the plugin.
 * @module @zseven-w/dsh-noema/util
 */
import { homedir } from 'node:os'

/** Expand a leading tilde to the user's home directory. */
export function expandHome(path: string): string {
  if (path === '~') return homedir()
  if (path.startsWith('~/') || path.startsWith('~\\')) {
    return homedir() + path.slice(1)
  }
  return path
}
