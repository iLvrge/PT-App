import { describe, it, expect } from 'vitest'
import tokens from './tokens'
import themeMode from './themeMode'

/**
 * These are the exact values from the original themeMode.js, transcribed before
 * the Tailwind migration began. The brief was that theme colours must not
 * change, so this locks them: any drift fails here rather than in someone's eye.
 */
const ORIGINAL = {
  light: {
    'bg-default': '#F7F9FC',
    'bg-paper': '#FFFFFF',
    'text-primary': 'rgba(0, 0, 0, 0.87)',
    'text-active': '#E60000',
    'action-disabled': 'rgba(0, 0, 0, 0.26)',
    divider: 'rgba(0, 0, 0, 0.12)',
    'secondary-main': '#E60000',
    'secondary-button-active': '#90CAF9',
  },
  dark: {
    'bg-default': '#0B0C0E',
    'bg-paper': '#1D2025',
    'text-primary': '#ffffff',
    'text-active': '#E60000',
    'action-disabled': 'rgba(255, 255, 255, 0.3)',
    divider: 'rgba(255, 255, 255, 0.12)',
    'secondary-main': '#E60000',
    'secondary-button-active': '#90CAF9',
  },
}

describe('theme tokens', () => {
  it.each([ 'light', 'dark' ])('%s palette matches the pre-migration values exactly', (mode) => {
    expect(tokens[mode]).toEqual(ORIGINAL[mode])
  })

  it('defines the same token names in both modes', () => {
    expect(Object.keys(tokens.light).sort()).toEqual(Object.keys(tokens.dark).sort())
  })

  it.each([ 'light', 'dark' ])('%s MUI palette is built from the tokens', (mode) => {
    const t = tokens[mode]
    const p = themeMode[mode].palette
    expect(p.mode).toBe(mode)
    expect(p.background.default).toBe(t['bg-default'])
    expect(p.background.paper).toBe(t['bg-paper'])
    expect(p.text.primary).toBe(t['text-primary'])
    expect(p.text.active).toBe(t['text-active'])
    expect(p.action.disabled).toBe(t['action-disabled'])
    expect(p.divider).toBe(t.divider)
    expect(p.secondary.main).toBe(t['secondary-main'])
    expect(p.secondary.buttonActive).toBe(t['secondary-button-active'])
  })

  it('keeps the h6 override the original theme carried', () => {
    expect(themeMode.light.typography.h6.fontSize).toBe('1.1rem')
    expect(themeMode.dark.typography.h6.fontSize).toBe('1.1rem')
  })

  it('still defines no primary palette, so MUI supplies its default', () => {
    // Called out in MIGRATION_PLAN.md as an open question. If a primary is ever
    // added deliberately, update this expectation rather than deleting it.
    expect(themeMode.light.palette.primary).toBeUndefined()
    expect(themeMode.dark.palette.primary).toBeUndefined()
  })
})
