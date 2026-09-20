/**
 * Flags a plain CSS class that two or more component stylesheets both define.
 *
 * makeStyles gave every component its own scoped names (makeStyles-root-123).
 * The migration to plain CSS hardcoded generic ones instead - .pt-root,
 * .pt-container, .pt-toolbar - so unrelated components now share a namespace
 * and silently overwrite each other, with import order deciding the winner.
 * That is not hypothetical: it collapsed the header to 0px, stretched every
 * KPI tile to full viewport height and clipped their label chips, all at once
 * and all invisibly.
 *
 * A collision is only reported when the components that APPLY the class do not
 * all share one stylesheet - i.e. when two different components really are
 * fighting. Genuinely shared utilities (one definition, many users) are fine.
 *
 * KNOWN is the collisions that predate this check. Fix one, delete it here; do
 * not add to it.
 */
const fs = require('fs');
const cp = require('child_process');
const path = require('path');

const KNOWN = new Set([
  // Quill toolbar state classes, and the vis.js / data-driven names
  // (`cluster-sales`, `asset-type-*`, `vis-*`). Unlike the `pt-` names these
  // were literal globals in master too - written as `'& .cluster-sales'` inside
  // a scoped parent, never as a makeStyles key - so they are shared by design.
  'focus', 'attach',
]);

const cssFiles = cp.execSync('find src -name "*.css"', { encoding: 'utf8' }).trim().split('\n').filter(Boolean);

const defs = new Map(); // class -> Set(stylesheet)
for (const file of cssFiles) {
  const css = fs.readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  // Take the whole selector list of every rule, then key each selector on the
  // class it is ROOTED at. `.pt-action-icon svg` and `.pt-action-icon:hover`
  // both claim `.pt-action-icon`'s namespace just as surely as a bare
  // `.pt-action-icon` does - that descendant form is how Reports' KPI styles
  // silently shrank every icon in the header to 1.5rem.
  const re = /(?:^|\}|;)\s*([^{}@;][^{}]*?)\s*\{/g;
  let m;
  while ((m = re.exec(css))) {
    for (const sel of m[1].split(',')) {
      const root = sel.trim().match(/^\.([A-Za-z0-9_-]+)/);
      if (!root) continue; // element-, id- or :root-anchored: not a class namespace
      const name = root[1];
      if (!defs.has(name)) defs.set(name, new Set());
      defs.get(name).add(file);
    }
  }
}

const jsFiles = cp.execSync('find src -name "*.js" -o -name "*.jsx"', { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const sources = jsFiles.map((f) => ({ file: f, text: fs.readFileSync(f, 'utf8') }));

/** Which stylesheet does this component file pull in, directly or via its folder? */
const sheetFor = (jsFile) => {
  const dir = path.dirname(jsFile);
  return cssFiles.filter((c) => path.dirname(c) === dir);
};

const problems = [];
for (const [name, sheets] of defs) {
  if (sheets.size < 2) continue;
  // who applies it?
  // A class name may contain hyphens, so \b is wrong here: it would match
  // pt-heading inside pt-heading-name. Require a real token boundary.
  const token = new RegExp(`['"\`][^'"\`]*(?<![A-Za-z0-9_-])${name}(?![A-Za-z0-9_-])[^'"\`]*['"\`]`);
  const users = sources.filter(({ text }) => token.test(text));
  const owningSheets = new Set();
  for (const u of users) for (const s of sheetFor(u.file)) if (sheets.has(s)) owningSheets.add(s);
  if (owningSheets.size < 2) continue; // one real owner (or none found) - not a fight
  if (KNOWN.has(name)) continue;
  problems.push({ name, sheets: [...sheets], users: users.map((u) => u.file) });
}

if (problems.length) {
  console.error(`FAIL - ${problems.length} CSS class name(s) defined by more than one component:\n`);
  for (const p of problems) {
    console.error(`  .${p.name}`);
    for (const s of p.sheets) console.error(`      defined: ${s}`);
    for (const u of p.users) console.error(`      applied: ${u}`);
    console.error('');
  }
  console.error('Scope each component\'s copy (e.g. .pt-kpi-toolbar) so they stop overwriting each other.');
  process.exit(1);
}

const stillKnown = [...defs].filter(([n, s]) => s.size > 1 && KNOWN.has(n)).length;
console.log(`OK - ${cssFiles.length} stylesheets, no new cross-component class collisions (${stillKnown} pre-existing, see KNOWN)`);
