import { describe, it, expect, afterEach, vi } from 'vitest'
import React from 'react'
import { render, act } from '@testing-library/react'
import useOnlineStatus, { waitForOnline } from './useOnlineStatus'

// @testing-library/react v11 (the version this React 17 app is on) has no
// renderHook; a probe component is the equivalent.
const renderHook = (hook) => {
  const result = { current: undefined }
  const Probe = () => { result.current = hook(); return null }
  const view = render(<Probe />)
  return { result, unmount: view.unmount }
}

const setOnline = (value) =>
  Object.defineProperty(navigator, 'onLine', { configurable: true, value })

const fire = (name) => act(() => { window.dispatchEvent(new Event(name)) })

afterEach(() => setOnline(true))

describe('useOnlineStatus', () => {
  it('starts from navigator.onLine', () => {
    setOnline(false)
    const { result } = renderHook(() => useOnlineStatus())
    expect(result.current).toBe(false)
  })

  it('follows offline and online events', () => {
    setOnline(true)
    const { result } = renderHook(() => useOnlineStatus())
    expect(result.current).toBe(true)

    setOnline(false); fire('offline')
    expect(result.current).toBe(false)

    setOnline(true); fire('online')
    expect(result.current).toBe(true)
  })

  it('detaches its listeners on unmount', () => {
    const remove = vi.spyOn(window, 'removeEventListener')
    renderHook(() => useOnlineStatus()).unmount()
    const events = remove.mock.calls.map(([ e ]) => e)
    expect(events).toContain('online')
    expect(events).toContain('offline')
    remove.mockRestore()
  })
})

describe('waitForOnline', () => {
  it('resolves immediately when already online', async () => {
    setOnline(true)
    await expect(waitForOnline(50)).resolves.toBe(true)
  })

  it('waits for the online event, then resolves true', async () => {
    setOnline(false)
    const pending = waitForOnline(5000)
    setOnline(true)
    window.dispatchEvent(new Event('online'))
    await expect(pending).resolves.toBe(true)
  })

  it('resolves false if the connection never returns before the timeout', async () => {
    setOnline(false)
    await expect(waitForOnline(20)).resolves.toBe(false)
  })
})
