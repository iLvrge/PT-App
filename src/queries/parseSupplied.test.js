import { describe, it, expect } from 'vitest'
import { parseSupplied, isAbsent } from './parseSupplied'

describe('parseSupplied', () => {
  it('parses a JSON array string', () => {
    expect(parseSupplied('[{"src":"a"}]')).toEqual([ { src: 'a' } ])
  })

  it('returns a non-JSON string unchanged', () => {
    expect(parseSupplied('just text')).toBe('just text')
  })

  it('returns an already-parsed array unchanged', () => {
    const arr = [ 1, 2 ]
    expect(parseSupplied(arr)).toEqual(arr)
  })

  it('does not throw on null or undefined', () => {
    expect(() => parseSupplied(null)).not.toThrow()
    expect(() => parseSupplied(undefined)).not.toThrow()
  })
})

describe('isAbsent', () => {
  it.each([
    [ 'null', null ],
    [ 'undefined', undefined ],
    [ 'empty string', '' ],
    [ 'empty array', [] ],
  ])('treats %s as absent, so the component fetches', (_label, value) => {
    expect(isAbsent(value)).toBe(true)
  })

  it.each([
    [ 'a populated array', [ { src: 'a' } ] ],
    [ 'a non-empty string', 'text' ],
    [ 'an object', { text: 'x' } ],
    [ 'zero', 0 ],
  ])('treats %s as present, so the component uses it', (_label, value) => {
    expect(isAbsent(value)).toBe(false)
  })
})
