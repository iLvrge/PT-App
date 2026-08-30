/**
 * Tailwind scans source statically, so a utility assembled at runtime emits no
 * CSS and no warning - the page just silently loses that style. This flags
 * template literals that interpolate into the middle of a Tailwind arbitrary
 * value or utility, e.g. `bg-[${colour}]` or `w-[${n}px]`.
 */
const fs = require('fs')
const cp = require('child_process')

const files = cp
  .execSync('find src -name "*.js" -o -name "*.jsx"', { encoding: 'utf8' })
  .trim().split('\n').filter(Boolean)

// a Tailwind-looking prefix immediately followed by an interpolation
const DYNAMIC = /[\w\]-](?:\[|-\[)\$\{|(?:bg|text|border|w|h|p|m|top|left|right|bottom|fill|stroke|z|gap|min-w|min-h|max-w|max-h)-\[\$\{/

// Tailwind will not parse an arbitrary property whose value contains nested
// parentheses with commas, e.g. [background-image:linear-gradient(rgba(..),rgba(..))].
// It emits nothing and does not warn. Put those in a real stylesheet instead.
const NESTED_ARBITRARY = /\[[a-z-]+:[^\]]*\([^)]*\([^)]*,[^)]*\)/

const bad = []
for (const f of files) {
  const s = fs.readFileSync(f, 'utf8')
  s.split('\n').forEach((line, i) => {
    if (DYNAMIC.test(line)) bad.push(`${f}:${i + 1}  runtime-built    ${line.trim().slice(0, 90)}`)
    else if (NESTED_ARBITRARY.test(line)) bad.push(`${f}:${i + 1}  nested-parens    ${line.trim().slice(0, 90)}`)
  })
}

if (bad.length) {
  console.error('Tailwind classes that emit no CSS:')
  bad.forEach((b) => console.error('  ' + b))
  process.exit(1)
}
console.log(`OK - ${files.length} files, no silently-dropped Tailwind classes`)
