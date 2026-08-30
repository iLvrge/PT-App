/**
 * Fails the build if any value from .env that looks like a credential appears
 * in the built output.
 *
 * This is not hypothetical. Under react-scripts, CRA injected the entire
 * process.env object into the bundle, so every REACT_APP_* variable shipped to
 * the browser whether or not any code read it -
 * REACT_APP_MICROSOFT_SECRET_KEY was present in two chunks of the production
 * build. Vite only inlines identifiers that actually appear in source, which
 * removes the current exposure, but nothing stops a future `process.env.X`
 * reference from putting one back.
 *
 * Never prints a secret - only the variable name.
 */
const fs = require('fs')
const path = require('path')

const BUILD = 'build'
const SENSITIVE = /(SECRET|PASSWORD|PRIVATE|_KEY$|_TOKEN$|CREDENTIAL)/i

if (!fs.existsSync('.env') || !fs.existsSync(BUILD)) {
  console.log('OK - nothing to check (.env or build/ missing)')
  process.exit(0)
}

const vars = fs.readFileSync('.env', 'utf8')
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#') && l.includes('='))
  .map((l) => {
    const i = l.indexOf('=')
    return [ l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '') ]
  })
  .filter(([ name, value ]) => SENSITIVE.test(name) && value.length >= 8)

const files = []
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
  const p = path.join(d, e.name)
  e.isDirectory() ? walk(p) : files.push(p)
})
walk(BUILD)

const leaks = []
for (const [ name, value ] of vars) {
  for (const f of files) {
    let content
    try { content = fs.readFileSync(f, 'utf8') } catch (_) { continue }
    if (content.includes(value)) leaks.push(`${name} found in ${f}`)
  }
}

if (leaks.length) {
  console.error('Credentials from .env are present in the build output:')
  leaks.forEach((l) => console.error('  ' + l))
  console.error('\nAnything reachable from client code ships to every user. Move it server-side.')
  process.exit(1)
}
console.log(`OK - ${vars.length} credential-shaped variable(s) checked, none in the build`)
