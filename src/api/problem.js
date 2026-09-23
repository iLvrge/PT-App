/**
 * Reading an error out of an API response.
 *
 * The API answers failures with RFC 7807 problem documents
 * (`application/problem+json`): `type`, `title`, `status`, `detail`,
 * `instance`, plus `requestId` and, on validation failures, `errors[]`.
 *
 * It still carries the older `{ error: { message, details } }` envelope in the
 * same body, so this reads the standard fields first and falls back. That
 * fallback is what makes the deploy order not matter: this build works against
 * an API that has the change and one that does not.
 *
 * Match on `type`, never on `detail` — `detail` is written for a person and
 * changes freely, `type` is part of the contract.
 */

/** The slug at the end of a type URI, e.g. 'unknown-share-code'. */
export const problemType = (error) => {
  const data = error && error.response && error.response.data
  if (!data || typeof data !== 'object' || !data.type) return null
  return String(data.type).split('/').filter(Boolean).pop() || null
}

/** A message worth showing someone, or the fallback if the body carried none. */
export const problemMessage = (error, fallback = 'Something went wrong.') => {
  const response = error && error.response
  const data = response && response.data

  if (typeof data === 'string' && data.trim()) return data

  if (data && typeof data === 'object') {
    if (data.detail) return data.detail
    if (data.error && data.error.message) return data.error.message
    if (data.title) return data.title
  }

  if (error && error.isNetworkError) {
    return error.isOffline
      ? 'You appear to be offline.'
      : 'Could not reach the server.'
  }

  return fallback
}

/** Field-level validation failures, as [{ field, message }]. */
export const problemFields = (error) => {
  const data = error && error.response && error.response.data
  if (!data || typeof data !== 'object') return []
  if (Array.isArray(data.errors)) return data.errors
  if (data.error && Array.isArray(data.error.details)) return data.error.details
  return []
}

/** The server's id for this failure, for a bug report. */
export const problemRequestId = (error) => {
  const data = error && error.response && error.response.data
  if (!data || typeof data !== 'object') return null
  return data.requestId || (data.error && data.error.requestId) || null
}

/** True when the API refused because the caller is over a rate limit. */
export const isRateLimited = (error) =>
  (error && error.response && error.response.status === 429) ||
  problemType(error) === 'rate-limited'

/** How long the API asked us to wait, in seconds, if it said. */
export const retryAfterSeconds = (error) => {
  const headers = error && error.response && error.response.headers
  const raw = headers && (headers['retry-after'] || headers['Retry-After'])
  const seconds = Number.parseInt(raw, 10)
  return Number.isFinite(seconds) ? seconds : null
}

/** True when a share link is unknown or expired, rather than merely empty. */
export const isUnknownShareCode = (error) =>
  problemType(error) === 'unknown-share-code'
