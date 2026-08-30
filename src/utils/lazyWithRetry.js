import { lazy } from 'react'
import { waitForOnline } from '../hooks/useOnlineStatus'

/**
 * Code splitting means a route's JavaScript is fetched at navigation time, so a
 * dropped connection turns a working app into a blank screen. This wraps
 * React.lazy so a failed chunk fetch is survivable:
 *
 *   1. If the browser is offline, wait for it to come back rather than
 *      spending retries against a network that cannot answer.
 *   2. Retry a few times with backoff, for transient failures.
 *   3. If the chunk is genuinely gone (a deploy replaced the hashed filenames
 *      while this tab was open), reload the page once to pick up the new
 *      index.html. Guarded by sessionStorage so a persistent failure cannot
 *      turn into a reload loop.
 *   4. Otherwise rethrow, so the nearest ErrorBoundary renders a real message.
 *
 * Note on retrying from the UI: React.lazy caches a rejected import, so
 * resetting an ErrorBoundary does NOT refetch the chunk. That is why the
 * recovery offered to the user for a chunk failure is a page reload, and why
 * the retries above happen inside the factory where they still take effect.
 */

const RELOAD_KEY = 'ptapp:chunk-reload'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** Chunk fetch failures have no single error type; match the known shapes. */
export const isChunkLoadError = (error) => {
  if (!error) return false
  const name = String(error.name || '')
  const message = String(error.message || '')
  return (
    name === 'ChunkLoadError' ||
    /Loading chunk [\d]+ failed/i.test(message) ||
    /Loading CSS chunk/i.test(message) ||
    /Failed to fetch dynamically imported module/i.test(message) ||
    /error loading dynamically imported module/i.test(message) ||
    /Importing a module script failed/i.test(message)
  )
}

const hasReloadedFor = (key) => {
  try {
    return sessionStorage.getItem(RELOAD_KEY) === key
  } catch (_) {
    return false // Safari private mode and similar; skip the reload path.
  }
}

const markReloadedFor = (key) => {
  try {
    sessionStorage.setItem(RELOAD_KEY, key)
  } catch (_) {
    /* storage unavailable — the reload simply will not be attempted again */
  }
}

export const clearChunkReloadMark = () => {
  try {
    sessionStorage.removeItem(RELOAD_KEY)
  } catch (_) {
    /* no-op */
  }
}

/**
 * @param {() => Promise<{default: React.ComponentType}>} factory dynamic import
 * @param {string} name stable identifier, used to scope the one-shot reload
 * @param {{retries?: number, baseDelay?: number}} [options]
 */
export default function lazyWithRetry(factory, name, options = {}) {
  const { retries = 3, baseDelay = 400 } = options

  return lazy(async () => {
    let lastError

    for (let attempt = 0; attempt <= retries; attempt += 1) {
      // Do not waste an attempt while the browser knows it is offline.
      await waitForOnline()

      try {
        const mod = await factory()
        // Getting here means the network works; let a future deploy reload again.
        clearChunkReloadMark()
        return mod
      } catch (error) {
        lastError = error

        // A non-network error inside the module itself will not fix itself.
        if (!isChunkLoadError(error)) break

        if (attempt < retries) {
          await sleep(baseDelay * 2 ** attempt)
        }
      }
    }

    // Retries exhausted. A stale deploy is the common cause and a reload fixes it.
    if (isChunkLoadError(lastError) && !hasReloadedFor(name)) {
      markReloadedFor(name)
      window.location.reload()
      // Keep the promise pending so nothing renders during the reload.
      return new Promise(() => {})
    }

    throw lastError
  })
}
