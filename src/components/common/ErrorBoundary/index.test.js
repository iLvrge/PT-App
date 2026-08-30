import React, { useState } from 'react'
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ErrorBoundary from './index'

const Boom = ({ error }) => { throw error || new Error('kaboom') }

// React logs caught errors to console.error; silence it so failures stay readable.
let spy
beforeAll(() => { spy = vi.spyOn(console, 'error').mockImplementation(() => {}) })
afterAll(() => spy.mockRestore())

describe('ErrorBoundary', () => {
  it('renders children when nothing throws', () => {
    render(<ErrorBoundary><p>all good</p></ErrorBoundary>)
    expect(screen.getByText('all good')).toBeInTheDocument()
  })

  it('keeps the original default fallback verbatim', () => {
    // Five call sites pass only children and rely on this exact wording.
    render(<ErrorBoundary><Boom /></ErrorBoundary>)
    expect(
      screen.getByText('This request is temporarily un-servable, please try a different one.')
    ).toBeInTheDocument()
  })

  it('renders a fallback element when given one', () => {
    render(<ErrorBoundary fallback={<p>custom</p>}><Boom /></ErrorBoundary>)
    expect(screen.getByText('custom')).toBeInTheDocument()
  })

  it('passes error, reset and isChunkError to a fallback function', () => {
    const fallback = vi.fn(() => <p>fn fallback</p>)
    render(<ErrorBoundary fallback={fallback}><Boom /></ErrorBoundary>)
    expect(screen.getByText('fn fallback')).toBeInTheDocument()
    const arg = fallback.mock.calls[0][0]
    expect(arg.error).toBeInstanceOf(Error)
    expect(typeof arg.reset).toBe('function')
    expect(arg.isChunkError).toBe(false)
  })

  it('flags a chunk load error so the fallback can offer a reload', () => {
    const fallback = vi.fn(() => null)
    const chunkError = Object.assign(new Error('Loading chunk 3 failed.'), { name: 'ChunkLoadError' })
    render(<ErrorBoundary fallback={fallback}><Boom error={chunkError} /></ErrorBoundary>)
    expect(fallback.mock.calls[0][0].isChunkError).toBe(true)
  })

  it('calls onError without letting a failing reporter mask the error', () => {
    const onError = vi.fn(() => { throw new Error('reporter exploded') })
    render(<ErrorBoundary onError={onError}><Boom /></ErrorBoundary>)
    expect(onError).toHaveBeenCalled()
    expect(
      screen.getByText('This request is temporarily un-servable, please try a different one.')
    ).toBeInTheDocument()
  })

  it('recovers when reset is called and the child no longer throws', () => {
    let shouldThrow = true
    const Child = () => { if (shouldThrow) throw new Error('once'); return <p>recovered</p> }
    render(
      <ErrorBoundary fallback={({ reset }) => (
        <button onClick={() => { shouldThrow = false; reset() }}>retry</button>
      )}>
        <Child />
      </ErrorBoundary>
    )
    fireEvent.click(screen.getByText('retry'))
    expect(screen.getByText('recovered')).toBeInTheDocument()
  })

  it('resets when a resetKey changes', () => {
    const Harness = () => {
      const [ k, setK ] = useState(0)
      return (
        <>
          <button onClick={() => setK(1)}>bump</button>
          <ErrorBoundary resetKeys={[ k ]} fallback={<p>failed</p>}>
            {k === 0 ? <Boom /> : <p>fresh</p>}
          </ErrorBoundary>
        </>
      )
    }
    render(<Harness />)
    expect(screen.getByText('failed')).toBeInTheDocument()
    fireEvent.click(screen.getByText('bump'))
    expect(screen.getByText('fresh')).toBeInTheDocument()
  })
})
