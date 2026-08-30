/**
 * Fails if a file references `classes.x` or `useStyles()` without importing a
 * stylesheet. The bundler does not catch this - it is a runtime ReferenceError,
 * which is exactly how two conversions nearly shipped broken.
 */
const fs = require('fs')
const cp = require('child_process')

const files = cp
  .execSync('find src -name "*.js" -o -name "*.jsx"', { encoding: 'utf8' })
  .trim().split('\n').filter(Boolean)

const bad = []
for (const f of files) {
  const s = fs.readFileSync(f, 'utf8')
  const usesClasses = /\bclasses\s*\./.test(s)
  const callsUseStyles = /\buseS[yt]?[tl]?yles\s*\(/.test(s)
  const importsStyles =
    /from\s+['"][^'"]*styles['"]/.test(s) || /from\s+['"]@mui\/styles/.test(s)
  const declaresClasses = /\b(const|let|var)\s+classes\b/.test(s) || /\bclasses\s*[,}]/.test(s)
  if (usesClasses && !importsStyles && !declaresClasses) bad.push(`${f}: uses classes.* with no stylesheet import`)
  if (callsUseStyles && !importsStyles) bad.push(`${f}: calls useStyles() with no stylesheet import`)
}

if (bad.length) {
  console.error('Dangling style references:')
  bad.forEach((b) => console.error('  ' + b))
  process.exit(1)
}
console.log(`OK - ${files.length} files, no dangling style references`)
