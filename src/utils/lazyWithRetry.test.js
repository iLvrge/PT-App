import { describe, it, expect, beforeEach } from 'vitest'
import { isChunkLoadError, clearChunkReloadMark } from './lazyWithRetry'

describe('isChunkLoadError', () => {
  it.each([
    [ 'webpack ChunkLoadError by name', Object.assign(new Error('boom'), { name: 'ChunkLoadError' }) ],
    [ 'webpack message', new Error('Loading chunk 42 failed.') ],
    [ 'css chunk', new Error('Loading CSS chunk 7 failed.') ],
    [ 'vite dynamic import', new Error('Failed to fetch dynamically imported module: /assets/x.js') ],
    [ 'safari wording', new Error('Importing a module script failed.') ],
    [ 'firefox wording', new Error('error loading dynamically imported module') ],
  ])('recognises %s', (_label, error) => {
    expect(isChunkLoadError(error)).toBe(true)
  })

  it.each([
    [ 'a render error', new TypeError("Cannot read properties of undefined (reading 'map')") ],
    [ 'a rejected api call', new Error('Request failed with status code 500') ],
    [ 'null', null ],
    [ 'undefined', undefined ],
  ])('does not misclassify %s', (_label, error) => {
    expect(isChunkLoadError(error)).toBe(false)
  })

  it('is case-insensitive on the message forms', () => {
    expect(isChunkLoadError(new Error('loading chunk 3 FAILED'))).toBe(true)
  })
})

describe('clearChunkReloadMark', () => {
  beforeEach(() => sessionStorage.clear())

  it('removes the one-shot reload marker', () => {
    sessionStorage.setItem('ptapp:chunk-reload', 'SomeRoute')
    clearChunkReloadMark()
    expect(sessionStorage.getItem('ptapp:chunk-reload')).toBeNull()
  })

  it('does not throw when storage is unavailable', () => {
    const original = Object.getOwnPropertyDescriptor(window, 'sessionStorage')
    Object.defineProperty(window, 'sessionStorage', {
      configurable: true,
      get() { throw new Error('blocked') },
    })
    expect(() => clearChunkReloadMark()).not.toThrow()
    if (original) Object.defineProperty(window, 'sessionStorage', original)
  })
})
