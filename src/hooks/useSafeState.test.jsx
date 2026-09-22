import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import React from 'react'
import useSafeState from './useSafeState'

/**
 * The chart panels set state with a fetch result. Leaving the screen before
 * that lands made React 17 log "Can't perform a React state update on an
 * unmounted component ... indicates a memory leak", once per late response.
 * These pin the two halves: the setter still works while mounted, and is
 * inert - silently, not by throwing - once it is not.
 */
describe('useSafeState', () => {
  afterEach(() => vi.restoreAllMocks())

  /** Resolves a promise the test controls, then sets state with the result. */
  const Late = ({ promise }) => {
    const [value, setValue] = useSafeState('initial')
    React.useEffect(() => {
      let cancelled = false
      promise.then((next) => { if (!cancelled) setValue(next) })
      return () => { cancelled = false } // deliberately does NOT cancel
    }, [promise, setValue])
    return <span data-testid="value">{value}</span>
  }

  it('updates while the component is mounted', async () => {
    const promise = Promise.resolve('arrived')
    render(<Late promise={promise} />)

    await act(async () => { await promise })
    expect(screen.getByTestId('value').textContent).toBe('arrived')
  })

  it('drops an update that arrives after unmount, and warns about nothing', async () => {
    const warn = vi.spyOn(console, 'error').mockImplementation(() => {})
    let resolve
    const promise = new Promise((r) => { resolve = r })

    const { unmount } = render(<Late promise={promise} />)
    unmount()

    await act(async () => { resolve('too late'); await promise })

    expect(warn).not.toHaveBeenCalled()
  })

  it('keeps a stable setter, so it is safe in an effect dependency list', () => {
    const setters = []
    const Probe = () => {
      const [n, setN] = useSafeState(0)
      setters.push(setN)
      return <button onClick={() => setN(n + 1)}>{n}</button>
    }

    render(<Probe />)
    act(() => { screen.getByRole('button').click() })

    expect(setters.length).toBeGreaterThan(1)
    expect(setters[0]).toBe(setters[setters.length - 1])
  })
})
