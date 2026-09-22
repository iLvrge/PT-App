// @vitest-environment node
// Reads the stylesheets off disk rather than rendering, so it needs node.
import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tokens from '../themes/tokens'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

const cssFiles = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return cssFiles(full)
    return entry.isFile() && entry.name.endsWith('.css') ? [full] : []
  })

// Everything under src/, minus the file the build generates from tokens.js.
const sheets = cssFiles(path.join(root, 'src'))
  .filter((f) => !f.endsWith('theme.generated.css'))
  .map((f) => ({ file: path.relative(root, f), css: fs.readFileSync(f, 'utf8') }))

/**
 * The makeStyles -> plain-CSS migration rewrote `theme.palette.x.y` into
 * `var(--pt-x-y)`. Where the JS name had one more camelCase segment than any
 * token, the rewrite matched the prefix and left the rest of the name sitting
 * outside the parenthesis:
 *
 *   theme.palette.action.disabledBackground
 *     -> var(--pt-action-disabled)Background
 *
 * That is not a parse error, it is an invalid *value*, so the browser drops the
 * whole declaration and says nothing. The message composer's icons lost their
 * disabled tint that way and rendered at full strength, looking clickable when
 * they do nothing until a channel is selected - the `pointer-events: none` in
 * the same rule survived, so only the colour was wrong.
 *
 * Both halves are pinned: no truncated var(), and no reference to a token that
 * tokens.js does not define (which fails the same silent way).
 */
describe('CSS custom properties', () => {
  it('never leaves text stranded outside a var()', () => {
    const stranded = []
    for (const { file, css } of sheets) {
      css.split('\n').forEach((line, i) => {
        // A var(...) immediately followed by a letter: the tail of a longer
        // name that the rewrite cut in half.
        if (/var\(\s*--[\w-]+\s*\)[A-Za-z]/.test(line)) {
          stranded.push(`${file}:${i + 1}  ${line.trim()}`)
        }
      })
    }
    expect(stranded).toEqual([])
  })

  it('only references tokens that tokens.js defines', () => {
    const defined = new Set(Object.keys(tokens['light']).map((k) => `--pt-${k}`))
    // tokens.js must define the same names in both modes, or a theme switch
    // would silently drop a colour.
    expect(Object.keys(tokens['dark']).sort()).toEqual(Object.keys(tokens['light']).sort())

    const missing = new Set()
    for (const { file, css } of sheets) {
      for (const [, name] of css.matchAll(/var\(\s*(--pt-[\w-]+)/g)) {
        if (!defined.has(name)) missing.add(`${name}  (${file})`)
      }
    }
    expect([...missing]).toEqual([])
  })

  it('defines the disabled-background tint the composer icons use', () => {
    // Distinct from action-disabled, and much fainter: MUI's own
    // action.disabledBackground, which is what master renders.
    expect(tokens['dark']['action-disabled-background']).toBe('rgba(255, 255, 255, 0.12)')
    expect(tokens['light']['action-disabled-background']).toBe('rgba(0, 0, 0, 0.12)')
  })
})
