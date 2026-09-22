import { describe, it, expect, vi, beforeEach } from 'vitest'

/*
 * The 401 -> refresh -> retry interceptor.
 *
 * The refresh request goes through this same interceptor, so a refresh that
 * itself answers 401 used to re-enter the retry branch and refresh the
 * refresh, forever: `_retry` is set on the *original* config, and every retry
 * builds a fresh config that has never been flagged. Measured against the
 * pre-guard build, one expired session fired ~1,000 /refresh-token calls in
 * four seconds until the API's rate limiter answered 429, and the app showed
 * a red "Request failed with status code 429" overlay instead of the sign-in
 * page.
 *
 * Nothing about that is visible from the outside until a session expires, so
 * it is pinned here: one refresh attempt, then a clean logout.
 */

vi.mock('../config/config', () => ({
  base_api_url: 'http://api.test',
  base_new_api_url: 'http://api.test',
}))
vi.mock('./token', () => ({ default: () => 'stale-token', getToken: () => 'stale-token' }))
vi.mock('../history', () => ({ default: { push: vi.fn() } }))
vi.mock('../utils/tokenStorage', () => ({
  removeTokenStorage: vi.fn(),
  deleteCookie: vi.fn(),
}))
vi.mock('../components/AuthMicrosoft', () => ({ refreshMicrosoftToken: vi.fn() }))

const api = (await import('./axiosSetup')).default
const history = (await import('../history')).default
const { removeTokenStorage, deleteCookie } = await import('../utils/tokenStorage')

/** axios 0.21 adapters resolve/reject with a response attached to the error. */
const ok = (config, data = {}) => Promise.resolve({ status: 200, data, config, headers: {}, statusText: 'OK' })
const fail = (config, status, data = '') => {
  const error = new Error(`Request failed with status code ${status}`)
  error.config = config
  error.response = { status, data, config, headers: {} }
  return Promise.reject(error)
}

/** Records every request the instance makes and answers from `reply`. */
const install = (reply) => {
  const seen = []
  api.defaults.adapter = (config) => {
    seen.push(config.url)
    return reply(config, seen)
  }
  return seen
}

const refreshCalls = (seen) => seen.filter((url) => url === '/refresh-token').length

beforeEach(() => {
  vi.clearAllMocks()
  // The logout path assigns window.location; jsdom cannot navigate, so it is
  // replaced with a plain object to keep the assignment harmless.
  Object.defineProperty(window, 'location', {
    configurable: true,
    writable: true,
    value: { href: 'http://localhost:3000/patent_assets/owned' },
  })
  // This environment's localStorage has no working setItem, and the success
  // path stores the refreshed token.
  const store = new Map()
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    writable: true,
    value: {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k),
      clear: () => store.clear(),
    },
  })
})

describe('401 refresh interceptor', () => {
  it('attempts the refresh once when the refresh itself is rejected', async () => {
    const seen = install((config) => fail(config, 401))

    await expect(api.get('/profile')).rejects.toBeTruthy()

    // The loop this guards against produced ~1,000 of these.
    expect(refreshCalls(seen)).toBe(1)
    // The original is tried once and not retried, since the refresh failed.
    expect(seen.filter((url) => url === '/profile')).toHaveLength(1)
  })

  it('clears the session and sends the user to sign in when the refresh fails', async () => {
    install((config) => fail(config, 401))

    await expect(api.get('/profile')).rejects.toBeTruthy()

    // This API answers 401, never 403, so the old 403-only logout never ran
    // and the app sat on a blank screen.
    expect(removeTokenStorage).toHaveBeenCalledWith('token')
    expect(deleteCookie).toHaveBeenCalledWith('token')
    expect(history.push).toHaveBeenCalledWith('/auth')
  })

  it('retries the original request once with the new token when the refresh succeeds', async () => {
    const seen = install((config, calls) => {
      if (config.url === '/refresh-token') return ok(config, { accessToken: 'fresh-token' })
      // First /profile 401s; the retry after a successful refresh succeeds.
      return calls.filter((url) => url === '/profile').length === 1
        ? fail(config, 401)
        : ok(config, { id: 1 })
    })

    const response = await api.get('/profile')

    expect(response.data).toEqual({ id: 1 })
    expect(refreshCalls(seen)).toBe(1)
    expect(seen.filter((url) => url === '/profile')).toHaveLength(2)
    // A recovered session must not be torn down.
    expect(removeTokenStorage).not.toHaveBeenCalled()
    expect(history.push).not.toHaveBeenCalled()
  })

  it('does not attempt a refresh for a non-401 failure', async () => {
    const seen = install((config) => fail(config, 500))

    await expect(api.get('/profile')).rejects.toBeTruthy()

    expect(refreshCalls(seen)).toBe(0)
  })
})
