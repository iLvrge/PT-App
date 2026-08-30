/**
 * Fails if a file calls a React hook it has not imported.
 *
 * esbuild does not resolve identifiers, so an unimported hook builds cleanly and
 * throws only when the component renders. This was a real mistake on this branch:
 * a useMemo added to MainCompaniesSelector without extending its React import
 * passed the build and would have crashed the screen.
 */
const fs = require('fs')
const cp = require('child_process')

const HOOKS = [
  'useState', 'useEffect', 'useMemo', 'useCallback', 'useRef', 'useContext',
  'useReducer', 'useLayoutEffect', 'useImperativeHandle', 'useDebugValue',
]

const files = cp
  .execSync('find src -name "*.js" -o -name "*.jsx"', { encoding: 'utf8' })
  .trim().split('\n').filter(Boolean)

const bad = []
for (const f of files) {
  const raw = fs.readFileSync(f, 'utf8')
  const src = raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^[ \t]*\/\/.*$/gm, '')
  // Imports here are frequently spread over several lines, so take the whole
  // statement rather than only lines that begin with `import`.
  const importLines = (raw.match(/import[\s\S]*?from\s*['"][^'"]+['"]/g) || []).join('\n')
  for (const hook of HOOKS) {
    const used = new RegExp(`(^|[^.\\w])${hook}\\s*\\(`).test(src)
    if (!used) continue
    const imported =
      new RegExp(`\\b${hook}\\b`).test(importLines) ||
      new RegExp(`React\\.${hook}`).test(src) ||
      new RegExp(`(const|function)\\s+${hook}\\b`).test(src)
    if (!imported) bad.push(`${f}: calls ${hook}() without importing it`)
  }
}

if (bad.length) {
  console.error('React hooks used without being imported:')
  bad.forEach((b) => console.error('  ' + b))
  process.exit(1)
}
console.log(`OK - ${files.length} files, every React hook used is imported`)
