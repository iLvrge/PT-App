import { describe, it, expect } from 'vitest'
import {
  problemType,
  problemMessage,
  problemFields,
  problemRequestId,
  isRateLimited,
  retryAfterSeconds,
  isUnknownShareCode,
} from './problem'

const withBody = (status, data, headers = {}) => ({ response: { status, data, headers } })

describe('reading an RFC 7807 problem document', () => {
  const problem = {
    type: 'https://api.patentrack.com/errors/validation-error',
    title: 'Validation Error',
    status: 400,
    detail: 'companies must be a JSON array',
    instance: '/customers/due_dilligence/assets',
    requestId: '847d22127f905e82',
    errors: [{ field: 'companies', message: 'must be a JSON array' }],
    error: { message: 'companies must be a JSON array', requestId: '847d22127f905e82' },
  }

  it('takes the slug off the type URI', () => {
    expect(problemType(withBody(400, problem))).toBe('validation-error')
  })

  it('prefers detail over the legacy envelope', () => {
    expect(problemMessage(withBody(400, problem))).toBe('companies must be a JSON array')
  })

  it('returns the field errors', () => {
    expect(problemFields(withBody(400, problem))).toEqual([
      { field: 'companies', message: 'must be a JSON array' },
    ])
  })

  it('returns the request id, for quoting in a bug report', () => {
    expect(problemRequestId(withBody(400, problem))).toBe('847d22127f905e82')
  })
})

describe('falling back to the pre-7807 envelope', () => {
  // The deploy order must not matter: this build has to work against an API
  // that has not taken the change yet.
  const legacy = { error: { message: 'Invalid url', details: [{ field: 'code', message: 'unknown' }] } }

  it('reads error.message when there is no detail', () => {
    expect(problemMessage(withBody(404, legacy))).toBe('Invalid url')
  })

  it('reads error.details when there is no errors[]', () => {
    expect(problemFields(withBody(404, legacy))).toEqual([{ field: 'code', message: 'unknown' }])
  })

  it('has no type to match on, and says so rather than guessing', () => {
    expect(problemType(withBody(404, legacy))).toBeNull()
  })
})

describe('bodies that are not problem documents at all', () => {
  it('uses a plain string body as the message', () => {
    expect(problemMessage(withBody(502, 'Bad Gateway'))).toBe('Bad Gateway')
  })

  it('falls back to the caller default for an empty body', () => {
    expect(problemMessage(withBody(500, ''), 'Something went wrong.')).toBe('Something went wrong.')
  })

  it('describes a network failure rather than blaming the server', () => {
    expect(problemMessage({ isNetworkError: true, isOffline: true })).toMatch(/offline/i)
    expect(problemMessage({ isNetworkError: true, isOffline: false })).toMatch(/reach the server/i)
  })

  it('survives an error with no response at all', () => {
    expect(problemType({})).toBeNull()
    expect(problemFields({})).toEqual([])
    expect(problemRequestId(undefined)).toBeNull()
  })
})

describe('rate limiting', () => {
  const limited = withBody(
    429,
    { type: 'https://api.patentrack.com/errors/rate-limited', title: 'Too Many Requests', status: 429 },
    { 'retry-after': '900' }
  )

  it('recognises a 429 and reads Retry-After', () => {
    expect(isRateLimited(limited)).toBe(true)
    expect(retryAfterSeconds(limited)).toBe(900)
  })

  it('returns null when the server did not say how long to wait', () => {
    expect(retryAfterSeconds(withBody(429, {}))).toBeNull()
  })

  it('does not call an ordinary failure rate limited', () => {
    expect(isRateLimited(withBody(400, {}))).toBe(false)
  })
})

describe('share codes', () => {
  it('tells an unknown share code apart from any other 404', () => {
    const unknown = withBody(404, { type: 'https://api.patentrack.com/errors/unknown-share-code' })
    const other = withBody(404, { type: 'https://api.patentrack.com/errors/not-found' })
    expect(isUnknownShareCode(unknown)).toBe(true)
    expect(isUnknownShareCode(other)).toBe(false)
  })
})
