// @vitest-environment node
// Reads files off disk rather than rendering, so it needs node, not jsdom.
import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8')

/**
 * These four all produced the same symptom - the page looked subtly wrong with
 * nothing in the console - and none of them is visible in a component's own
 * source. Each was found by diffing the rendered DOM against master, so each
 * gets pinned here rather than re-discovered.
 */
describe('global CSS ordering and vendor stylesheets', () => {
  const entry = read('src/index.js')
  const at = (needle) => entry.indexOf(needle)

  it('imports every vendor stylesheet from the entry, before the app stylesheets', () => {
    // Equal-specificity overrides (`.dashboardIntroTooltip` vs `.introjs-tooltip`)
    // are decided by source order alone. CRA emitted index.css last; Vite orders
    // by the module graph, so a sheet imported inside a component landed after
    // index.css and started winning - which shrank the walkthrough tooltip from
    // 450px to intro.js's own 250px.
    const vendors = [
      'font-awesome/css/font-awesome.min.css',
      'intro.js/introjs.css',
      'vis-timeline/styles/vis-timeline-graph2d.min.css',
      'react-quill/dist/quill.snow.css',
    ]
    const app = ["'./styles/tailwind.css'", "'./index.css'"]

    for (const v of vendors) expect(at(v), `${v} must be imported from src/index.js`).toBeGreaterThan(-1)
    for (const a of app) expect(at(a), `${a} must be imported from src/index.js`).toBeGreaterThan(-1)

    const lastVendor = Math.max(...vendors.map(at))
    const firstApp = Math.min(...app.map(at))
    expect(lastVendor, 'every vendor sheet must be imported above the app sheets').toBeLessThan(firstApp)
  })

  it('pulls in Tailwind without preflight', () => {
    // Preflight zeroes the margin on every element. master shipped no reset, so
    // anything relying on browser defaults collapsed - the walkthrough
    // tooltip's paragraphs lost their 20px margins and ran together.
    const tw = read('src/styles/tailwind.css').replace(/\/\*[\s\S]*?\*\//g, '')
    // the bare `tailwindcss` entry point is theme + preflight + utilities
    expect(tw).not.toMatch(/@import\s+["']tailwindcss["']\s*;/)
    expect(tw).toContain('tailwindcss/theme.css')
    expect(tw).toContain('tailwindcss/utilities.css')
    expect(tw).not.toMatch(/@import[^;]*preflight/)
  })

  it('keeps font-awesome installed for the class-based icons', () => {
    // @fortawesome/react-fontawesome renders its own SVG and needs no CSS, so
    // dropping this package was silent: the 15 `<i className="fa fa-...">`
    // icons just rendered at zero width, the `»` breadcrumb separator included.
    const pkg = JSON.parse(read('package.json'))
    expect(pkg.dependencies['font-awesome']).toBeTruthy()

    const uses = []
    const walk = (dir) => {
      for (const e of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
        const rel = `${dir}/${e.name}`
        if (e.isDirectory()) walk(rel)
        else if (/\.jsx?$/.test(e.name) && /className=["'{`][^"'`]*\bfa fa-/.test(read(rel))) uses.push(rel)
      }
    }
    walk('src')
    expect(uses.length, 'class-based fa icons exist, so the stylesheet is required').toBeGreaterThan(0)
  })
})

describe('component stylesheets stay in their own namespace', () => {
  it('does not let one component restyle another through a shared class', () => {
    // `.pt-action-icon svg {width:1.5rem}` in the KPI stylesheet was shrinking
    // every icon in the header, because both sides had been flattened out of
    // makeStyles onto the same literal class name.
    expect(() =>
      execFileSync('node', ['scripts/check-css-collisions.cjs'], { cwd: root, stdio: 'pipe' })
    ).not.toThrow()
  })
})
