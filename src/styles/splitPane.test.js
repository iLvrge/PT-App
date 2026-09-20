import { describe, it, expect } from 'vitest'
import * as splitPane from './splitPane'
import * as drive from './driveExplorer'

/**
 * Tailwind scans source statically, so every export here must be a finished
 * literal. A parameterised version of splitPane.js once built its colour with a
 * template literal and silently emitted no CSS at all - the build stayed green
 * and three of four layouts lost their resizer colour.
 */
const modules = { splitPane, driveExplorer: drive }

describe.each(Object.entries(modules))('%s exports', (_name, mod) => {
  it('are all plain non-empty strings', () => {
    for (const [ key, value ] of Object.entries(mod)) {
      expect(typeof value, `${key} must be a string, not ${typeof value}`).toBe('string')
      expect(value.length, `${key} must not be empty`).toBeGreaterThan(0)
    }
  })

  it('contain no unresolved interpolation', () => {
    for (const [ key, value ] of Object.entries(mod)) {
      expect(value, `${key} contains a template placeholder`).not.toMatch(/\$\{/)
    }
  })
})

describe('splitPane resizer colours', () => {
  it('keeps one variant per colour the four layouts used', () => {
    expect(splitPane.splitPanePink).toContain('[&_.Resizer:hover]:bg-[#e91e63]')
    expect(splitPane.splitPaneSecondary).toContain('[&_.Resizer:hover]:bg-[#E60000]')
    expect(splitPane.splitPaneCorrect).toContain('[&_.Resizer:hover]:bg-[#f50057]')
    expect(splitPane.splitPaneCorrect).toContain('[&_.Resizer]:bg-black')
  })

  it('shares the same geometry across every variant', () => {
    for (const v of [ splitPane.splitPanePink, splitPane.splitPaneSecondary, splitPane.splitPaneCorrect ]) {
      expect(v).toContain('[&_.Resizer]:w-[3px]')
      expect(v).toContain('[&_.Pane2]:h-full')
      expect(v).toContain('!relative')
    }
  })

  // `hover:[&_.Resizer]` compiles to `.splitPane:hover .Resizer` - hover on the
  // PANE, colouring every resizer inside it. These panes nest several deep, so
  // that lit up every divider on the page at once instead of the one under the
  // pointer. The colour has to hang off the resizer: `[&_.Resizer:hover]`.
  it('puts the hover on the resizer, never on the pane around it', () => {
    for (const [ key, value ] of Object.entries(splitPane)) {
      expect(value, `${key} hovers the pane instead of the resizer`)
        .not.toMatch(/hover:\[&_\.Resizer\]/)
    }
  })
})

describe('driveExplorer variants', () => {
  it('keeps the literal ground Repository and Utilities used', () => {
    expect(drive.driveLiteral).toContain('bg-[#292929]')
    expect(drive.driveLiteral).toContain('border-[#5c5c5c]')
    expect(drive.headingLiteral).toContain('bg-[#292929]')
  })

  it('keeps the token-based rules Templates used', () => {
    expect(drive.driveTokens).toContain('border-divider')
    expect(drive.driveTokens).not.toContain('#292929')
    expect(drive.headingTokens).toContain('border-divider')
  })
})
