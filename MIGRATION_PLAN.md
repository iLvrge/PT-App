# PT-App — Load-Time & Modernization Plan

**Goal (revised per your message): make the app load as fast as possible.**
Everything below is now ranked by measured impact on first load, not by how modern it looks.

All numbers here are measured on this machine from real production builds, not estimated.

---

## 0. The measured baseline

Production build of `master` as it stands today:

| Asset | Gzipped | Raw |
|---|---|---|
| `2.[hash].chunk.js` (vendor) | **1.29 MB** | 5.38 MB |
| `main.[hash].chunk.js` (app) | **302.8 KB** | 1.26 MB |
| CSS (both) | 20.7 KB | 104 KB |
| **Total JS** | **~1.6 MB gzipped** | **6.64 MB** |

Two JS chunks. That is the whole story: **there is no code splitting at all**, so every
byte above is downloaded, parsed and executed before the first screen paints.
CRA's own build output says it plainly:

> The bundle size is significantly larger than recommended. Consider reducing it with code splitting.

Note: the build only completes with sourcemaps if you raise the heap
(`--max-old-space-size=10240`); at the default it dies with
`FATAL ERROR: ... JavaScript heap out of memory`. That is presumably why
`GENERATE_SOURCEMAP=false` is hardcoded in the `build` script.

---

## 1. Where the bytes actually go

Attributed with `source-map-explorer` against a real sourcemapped build. Raw KB, share of the 6.64 MB:

| # | Package | Raw KB | Share |
|---|---|---|---|
| 1 | **your own `src/`** | 1,998 | **29.4%** |
| 2 | **caniuse-lite** | 791 | **11.6%** |
| 3 | @mui/material | 435 | 6.4% |
| 4 | react-gauge-chart | 267 | 3.9% |
| 5 | **vis-timeline** | 262 | 3.9% |
| 6 | **vis-timeline-73** | 260 | 3.8% |
| 7 | webpack runtime / no source | 241 | 3.5% |
| 8 | quill | 210 | 3.1% |
| 9 | chart.js | 197 | 2.9% |
| 10 | @material-table/core | 172 | 2.5% |
| 11 | @mui/x-date-pickers | 145 | 2.1% |
| 12 | react-dom | 135 | 2.0% |
| 13 | date-fns | 124 | 1.8% |
| 14 | **autoprefixer** | 111 | 1.6% |
| 15 | react-virtualized | 105 | 1.5% |
| 16 | d3 (+27 submodules) | 102 | 1.5% |
| 17 | lodash | 98 | 1.4% |
| 18 | @hello-pangea/dnd | 97 | 1.4% |
| | …119 more packages | 575 | 8.4% |

### Two conclusions that change the plan

**(a) MUI is not why the app is slow.** Every MUI package combined —
`material` + `system` + `base` + `icons-material` + `x-date-pickers` — is about
**697 KB raw, ~10% of the bundle**. Ripping it out is months of work for a tenth
of the payload. The premise "MUI is very heavy" is measurably not the problem here.

**(b) Your own `src/` is the biggest single slice at 29.4%.** No library change
touches that. Only code splitting does.

---

## 2. DONE — dead `autoprefixer` imports (measured win)

Two files imported a **build-time PostCSS tool into the browser bundle**:

```js
src/components/Reports/LineGraph.js:1                    import { data } from 'autoprefixer';
src/components/common/AssetsCommentsTimeline/styles.js:2 import autoprefixer from 'autoprefixer'
```

Neither identifier is used anywhere in either file — IDE auto-import accidents.
But they dragged in `autoprefixer` **and its `caniuse-lite` browser database**:
`791 + 111 = 902 KB raw, 13.3% of the entire bundle`, shipped to every user for nothing.

Both lines removed. Rebuilt and measured:

| | Before | After | Change |
|---|---|---|---|
| vendor chunk (gzip) | 1.29 MB | **1.17 MB** | **−123.5 KB** |
| vendor chunk (raw) | 5.38 MB | **4.36 MB** | **−1.02 MB** |

**A two-line deletion removed 9.6% of the gzipped vendor chunk.** This is committed
to nothing yet — it is sitting in the working tree for you to review.

These files are also a live Vite blocker: Rollup treats a bare `autoprefixer`
import as a hard resolution error, not a warning. So this had to be fixed anyway.

---

## 3. vis-timeline — DONE (root cause proven, fix applied and verified)

### What is actually wrong

`vis-timeline@7.7.0` imports `isDataViewLike` from `vis-data` and uses it as the gate
that decides whether the argument to `setItems()` is a DataSet. **That helper was added
in `vis-data@7.1.0`.** Your `package.json` pins `vis-data@7.0.0`, which does not export it.

The peer range is what hid this: vis-timeline 7.7.0 declares
`"vis-data": "^6.3.0 || ^7.0.0"` — so **npm never warns**, even though the code needs 7.1.0+.

Under webpack 4 a missing named ESM export becomes `undefined` at runtime with only a
build warning — so the guard silently never passes, no items bind, and you get an empty
timeline **with nothing in the console.** Exactly the symptom that caused the rollback.

### The workaround currently in the repo

Someone hand-edited the installed package:

```diff
  node_modules/vis-timeline/esnext/esm/vis-timeline-graph2d.js
- from 'vis-data/esnext/esm/vis-data.js'
+ from 'vis-data-71/esnext/esm/vis-data.js'
```

Exactly one file in the package mentions `vis-data-71`; the package's own `package.json`
still says `vis-data`. There is no `patch-package`, no `patches/` directory, no postinstall
hook, and `node_modules` is gitignored. **This fix dies on the next `npm install` or fresh clone.**

### Correction to the framing

It is the reverse of what you described: **9 components are on the old `vis-timeline-73`**,
only **3** are on the new one. `src/components/Reports/TimelineChart.js` still has the new
imports commented out above the old ones — the record of the reverted attempt.

### Proof the new version works

Three isolated module trees, each with clean **published** packages (no hand edits),
running the exact pattern your components use — `new Timeline(container, [], options)`
with the real options object from `Fees.js`, then `setItems(new DataSet(items))`:

| Config | vis-timeline | vis-data | `isDataViewLike` exported | Items bound | Result |
|---|---|---|---|---|---|
| current | 7.3.7 | 7.0.0 | no (not needed) | 3 / 3 | **renders** |
| as declared | 7.7.0 | 7.0.0 | **no** | — | **hard failure** |
| proposed fix | 7.7.0 | **7.1.2** | **yes** | 3 / 3 | **renders** |

The middle row fails with:

```
SyntaxError: The requested module 'vis-data/esnext/esm/vis-data.js'
does not provide an export named 'isDataViewLike'
```

Node's strict ESM turns it into a throw; webpack 4 turns the same condition into
`undefined` and an empty chart. Same root cause, different symptom.

### The fix

```diff
- "vis-data": "7.0.0",
- "vis-data-71": "npm:vis-data@7.1.2",
- "vis-timeline-73": "npm:vis-timeline@7.3.7",
+ "vis-data": "^7.1.2",
  "vis-timeline": "^7.7.0",
```

Then rewrite the 9 components' imports from `vis-timeline-73` to `vis-timeline`,
and delete the `node_modules` hand-edit.

`vis-data@7.1.2` is a strict superset of 7.0.0 — it *adds* `isDataSetLike`/`isDataViewLike`
and removes nothing, so the 9 components already on 7.0.0 cannot break. The vis-timeline
API surface actually used is tiny and unchanged between 7.3.7 and 7.7.0:
`setItems` (16 uses), `setOptions` (23), `on` (31), `destroy` (7), `setWindow` (2).

**Bonus:** shipping one copy instead of two removes **260 KB raw** from the bundle.

---

## 4. react-virtualized — the honest answer

**There is no meaningful "new version" to upgrade to.**

- Installed: **9.22.5**. Latest: **9.22.6** (published 2025-12-22). That is a patch —
  it changes nothing about performance.
- react-virtualized has been feature-frozen for years. Its author's successor is
  **react-window** (now at 2.3.0), and the modern headless option is
  **@tanstack/react-virtual** (3.14.10).

| Package | Unpacked | Notes |
|---|---|---|
| react-virtualized 9.22.6 | 2,191 KB | frozen; `Table`+`Column` included |
| react-window 2.3.0 | 211 KB | list/grid primitives only — **no Table/Column** |
| @tanstack/react-virtual 3.14.10 | 55 KB | headless; you own all markup |

**But it is not a load-time problem:** react-virtualized is **105 KB raw, 1.5%** of the
bundle. Replacing it is a maintenance and React-19-readiness move, not a speed move.

**The good news is the shape of the work.** Exactly **one** file imports it:

```js
src/components/common/VirtualizedTable/index.js:35
  import { ArrowKeyStepper, AutoSizer, Column, SortDirection, Table, InfiniteLoader }
    from "react-virtualized";
```

That 1,148-line wrapper is then consumed by **~40 components**. So the whole dependency
is behind one seam. Whatever replaces it must keep the wrapper's existing props, or all
40 call sites break at once.

**Recommendation:** do the patch bump to 9.22.6 now (free, zero risk), but do the actual
replacement **as part of the Tailwind rewrite, not before it.** react-window and
TanStack both drop `Table`/`Column`, so you rebuild the table markup by hand either
way — and if you do it now you will rebuild that same markup a second time when Tailwind
lands. Doing it once, later, is strictly less work.

There is also a **second, unrelated grid library** in the tree:
`src/components/common/VirtualizedTable2/index.js` uses
`@devexpress/dx-react-grid-material-ui` (2 files). Two virtualized-table stacks for
one app is worth consolidating during the same pass.

---

## 4b. The collapsible / resizable split-pane layout — the biggest hidden risk

This is `react-split-pane@0.1.92`, and it is used far more heavily than anything else
discussed above: **46 `<SplitPane>` instances across 15 files.** Three files hold
deeply nested layout trees:

| File | Instances |
|---|---|
| `CorrectLayout/index.js` | 11 |
| `PatentLayout/index.js` | 10 |
| `GlobalScreen/index.js` | 10 |
| `Search`, `AssetDetailsContainer`, `Templates` | 2 each |
| 9 further files | 1 each |

All 46 are `split="vertical"` (side-by-side panes).

### How the collapse actually works today

The library does **not** provide the collapse. It is a CSS override on the library's
internal DOM (`SplitPaneDrawer/styles.js`):

```js
hidePane1: {
  '& .Pane1':   { width: '0 !important' },
  '& .Resizer': { display: 'none !important' },
}
```

Pane 1 is forced to zero width, the resizer is hidden, and Pane 2 takes the full width
because of the flex layout. `onDragStarted`/`onDragFinished` exist only to disable the
`transition: width .3s` while dragging so it does not lag behind the cursor.

There is also **direct DOM manipulation of library internals** in `utils/resizeBar.js`:

```js
const container   = ref.current.splitPane                        // internal instance field
const findResizer = container.querySelector('span.Resizer.vertical')  // internal DOM + class
findResizer.style.display = display
```

and size persistence hand-rolled in `utils/splitpane.js` (`localStorage.setItem(name, size)`).

**23 files reference `.Pane1` / `.Pane2` / `.Resizer` directly.** This is the same
"styling a library's internal DOM" problem as the 446 `.Mui*` selectors — and it is why
the Tailwind migration is riskier than a component-by-component port suggests. These
selectors cannot become utility classes; they only disappear when the layout layer is replaced.

### Upgrading is a rewrite, not a version bump

`react-split-pane` was revived after a five-year gap: `0.1.92` (Aug 2020) → **`3.2.0`
(Feb 2026)**, same maintainers (`tomkp`, `wuweiweiwu`), same repo, MIT. Legitimate, but
3.x is a completely new API:

| | 0.1.92 (yours) | 3.2.0 |
|---|---|---|
| import | `import SplitPane from` (default) | `import { SplitPane, Pane } from` (**named**) |
| children | bare children | explicit `<Pane>` wrappers |
| orientation | `split="vertical"` | `direction="horizontal"` — **see trap below** |
| sizing | `defaultSize`/`minSize`/`maxSize` on parent | per-`<Pane>` `size`/`minSize`/`maxSize` |
| drag events | `onDragStarted` / `onDragFinished` | `onResizeStart` / `onResize` / `onResizeEnd` |
| `primary` prop | yes | **removed** |
| classes | `.Pane1` `.Pane2` `.Resizer` | `.split-pane` `.split-pane-pane` `.split-pane-divider` |
| stylesheet | none (you styled it) | ships `styles.css` with CSS custom properties |
| types | none | TypeScript |
| extras | — | `useResizer`, `useKeyboardResize`, `usePersistence` |

**The trap: the orientation naming is inverted.** In 0.1.92, `split` describes the
*divider*; in 3.2.0, `direction` describes the *layout*:

- old `split="vertical"` → `flexDirection: row` → panes side-by-side
- new `direction="horizontal"` → `flexDirection: row` → panes side-by-side

So **old `vertical` ≡ new `horizontal`.** A naive find-and-replace of `split=` to
`direction=` would silently rotate all 46 layouts by 90 degrees. And because `.Pane1` no
longer exists in 3.x, `hidePane1` would stop matching and **every collapse would silently
stop working** — no error, the pane just never collapses.

### Recommendation: do not upgrade this yet

Three reasons:

1. **It is not a performance problem.** react-split-pane is **9 KB raw** in the bundle
   (react-draggable 26 KB, react-resizable 10 KB, react-drag-and-drop 7 KB). The whole
   layout stack is ~52 KB, under 1%.
2. **It is not a Vite blocker.** 0.1.92 ships `dist/index.esm.js`, so Vite handles it fine.
   It also does **not** use `findDOMNode`, so it is not a React 18 blocker either — its
   `react ^16.0.0-0` peer range is just an unmaintained declaration.
3. **Doing it now means doing it twice.** The collapse is CSS reaching into library
   internals, so the layout layer gets rewritten during the Tailwind phase regardless.

**When you do get there, 3.2.0 is the right target and it makes this feature better:**
collapse becomes a supported `<Pane size={0}>` in controlled mode instead of a
`width: 0 !important` hack, `usePersistence` replaces the hand-rolled localStorage in
`utils/splitpane.js`, `resizable={false}` replaces the `querySelector` DOM poking in
`utils/resizeBar.js`, and you get keyboard resizing — which the current version has no
accessibility story for at all.

**This is the answer to "will the resizable/collapsible sections survive the migration":
yes, and they get cleaner — but it is a rewrite of the layout layer, not a version bump,
and it must be sequenced with the Tailwind work rather than before it.**


---

## 5. Dependencies declared but never imported

These appear in `package.json` and on disk but **zero files in `src/` import them**:

`material-table` (18.9 MB), `jspdf` (14.6 MB), `react-syntax-highlighter` (9.0 MB),
`google-charts`, and others.

**They do not affect bundle size** — webpack cannot bundle what nothing imports — so
removing them will not speed up page load. They do cut install and CI time, and reduce
the audit surface. Worth doing, but as housekeeping, not as performance work.

Also: **`node_modules/all_vis.zip` is a 24.4 MB zip file inside `node_modules`.**
Someone's manual backup of the vis packages. It should not be there.

---

## 6. Revised priority order — by measured impact on load time

| # | Work | Effort | Expected effect on first load |
|---|---|---|---|
| 1 | ~~Delete 2 dead `autoprefixer` imports~~ **done** | 2 lines | **−123.5 KB gzip, measured** |
| 2 | **Route-level code splitting** (`React.lazy` on 27 routes) | ~1–2 days | **Largest remaining win.** Defers most of the 1,998 KB of app code plus quill, chart.js, d3, gauge-chart, the vis charts — none of which the login screen needs |
| 3 | ~~Consolidate vis-timeline to one version~~ **done** | | **−67.2 KB gz measured**; the node_modules hand-edit is gone, so timelines survive a fresh install |
| 4 | Fix `@mui/icons-material` barrel imports (44 files) | ~half a day | Barrel imports tree-shake unreliably under webpack 4; deep imports are already used in 75 places, so make it consistent |
| 5 | CRA → Vite | 2–4 days | Transforms **dev** experience and build time. Modest effect on production bundle — Rollup splits better than webpack 4, but item 2 is where the real win is |
| 6 | react-virtualized 9.22.5 → 9.22.6 | minutes | None. Housekeeping |
| 7 | Remove unimported dependencies + `all_vis.zip` | ~1 hour | None on load; faster installs and CI |
| 8 | MUI → Tailwind **+ the split-pane layout layer together** | **weeks–months** | ~10% of bundle at most. The 46 `<SplitPane>` instances and the 23 files styling `.Pane1`/`.Resizer` must be rewritten in the same pass — see §4b |

**The headline: items 1–4 are roughly three days of work and address far more of the
load time than item 8 does in three months.** I would do 1–4, re-measure, and only then
decide whether the Tailwind migration is worth it — because after code splitting, the
MUI number will be smaller still, since much of it will no longer be in the initial chunk.

---

## 7. CRA → Vite: known blockers

1. **`autoprefixer` imports** — fixed in item 1. Rollup would have hard-failed on these.
2. **`process.env.REACT_APP_*`** — Vite uses `import.meta.env.VITE_*`. Mechanical rename,
   but every variable and the deploy pipeline must change together.
3. **`--openssl-legacy-provider`** — currently required because webpack 4 uses MD4 hashing.
   Vite removes the need entirely.
4. **`@mui/styles`** — the deprecated v4 JSS bridge, used by 113 files. It works under Vite
   but **is not React 18 compatible**, so it blocks the React upgrade.
5. **SVG imports as components** (CRA's `ReactComponent` named export) need
   `vite-plugin-svgr`.

---

## 8. MUI → Tailwind, if and when you get there

It is two migrations, not one, and only the first is about Tailwind:

- **Styling** — 113 `makeStyles` files, 13,712 lines of JSS, 1,761 nested `&` selectors.
  Large but mechanical. The codebase is refreshingly single-engine: no styled-components,
  no `withStyles`, only 15 `sx` props.
- **Behaviour** — Tailwind replaces none of Modal (16 uses), Dialog (10), Menu (7),
  Select (13), Tooltip (26), Tabs (13). These need a headless library.

The expensive part is **446 `.Mui*` descendant selectors across 84 files**. Each reaches
into MUI's internal DOM, cannot become a utility class, and only disappears when that
component is replaced — which couples the two migrations together. With **zero tests in
the repo**, that is months of work without a safety net.

### Headless library: use Radix UI

You asked which fits. **Radix UI**, for three concrete reasons:

1. **It covers all six primitives you actually use.** Headless UI has **no Tooltip
   primitive at all** — and you use Tooltip 26 times. That rules it out.
2. **Per-component packages** (`@radix-ui/react-dialog`, `-tooltip`, …) so it code-splits
   cleanly, which matters given item 2 is the main performance lever.
3. **MUI Base is in flux.** `@mui/base` is being superseded by Base UI
   (`@base-ui-components/react`). Adopting it now means migrating twice. Radix's API has
   been stable for years and has the strongest accessibility record.

### Theme colors

Keeping them identical is the easy part. Only `src/themes/themeMode.js` is live; the
palette is 8 tokens, and generating `tailwind.config.js` from that file keeps one source
of truth. The real work is the **119 unique hardcoded hex values** (773 literals) sitting
outside the theme entirely.

Dead theme files that can be deleted now: `src/themes/index.js`, `src/themes/default.js`,
`src/useDarkMode.js`, `src/store/configureStore.js`.

---

## 8b. Two constraints that break the "one component at a time" model

Found while actually converting components, not by reading the code.

### Stylesheets are shared between siblings, not owned by one component

23 `styles.js` files have more than one importer. Deleting one after converting
its `index.js` breaks the siblings — this happened with `Slacks/styles.js`,
which `AddPeople.js` also imports.

| stylesheet | importers |
|---|---|
| `Reports/styles.js` | 10 |
| `IllustrationCommentContainer/styles.js` | 7 |
| `AssetsVisualizer/LifeSpanContainer`, `FamilyItemContainer`, `LegalEventsContainer` | 6 each |
| `NewHeader/styles.js` | 5 |
| `AssetsVisualizer/InventionVisualizer/styles.js` | 5 |
| …17 more | 2–3 each |

Those directories have to be converted as a unit. 65 stylesheets have exactly
one importer and can safely be done individually.

### 38 components forward `classes={classes}` into a shared table

Almost all of them into `VirtualizedTable`. The parent builds a JSS `classes`
object and hands the whole thing to the child, so the parent's stylesheet cannot
be removed until the child stops accepting a `classes` prop.

This is not visible from the parent alone: `LayoutTemplates` and `FilesTemplates`
both looked like clean single-importer conversions, converted without build
errors, and would have thrown at runtime — the build does not catch a `classes`
identifier that no longer exists. Both were reverted.

**Consequence:** `VirtualizedTable` has to be converted first and given a real
styling API. Until then those 38 components are blocked, and any conversion of
them is a runtime error the build will not report.

**Working rule:** before converting a component, check that it does not forward
`classes={classes}` and that no sibling imports its stylesheet.


---

## 9. Open questions

1. **No `primary` palette is defined at all** in `themeMode.js`, so every
   `color="primary"` renders MUI's default blue `#1976d2`. Intentional, or a bug that has
   been live long enough to look intentional?
2. **React 17 → 18** — removing `@mui/styles` unblocks it. Same pass or separate? I would
   keep it separate.
3. **Tests.** There are zero. Before the Tailwind phase, some coverage on the highest-churn
   screens (`Reports/` takes nearly all recent commits) would de-risk it considerably.

---

## 10. Out of scope, but found along the way

- **`REACT_APP_MICROSOFT_SECRET_KEY` was shipped in the production bundle.**
  Confirmed against the CRA build taken before any changes: the value appears in
  two chunks (`main.*.chunk.js` and `2.*.chunk.js`). No application code reads
  it — CRA injected the *entire* `process.env` object, so every `REACT_APP_*`
  variable was written into the bundle whether referenced or not.

  The Vite migration removed the exposure incidentally: Vite's `define` only
  replaces identifiers that appear in source, and the current build contains
  zero occurrences. **That does not undo anything.** The value was public in
  every deployed build for as long as CRA was used, so it must be treated as
  compromised: **rotate it in Azure, and move it server-side** — a client-side
  OAuth flow should never hold a client secret.

  `scripts/check-bundle-secrets.cjs` now fails the build if any credential-shaped
  value from `.env` appears in the output. Verified against a deliberately
  planted leak.
- Two disconnected router histories, so the axios 401 redirect bypasses the router.
- `node_modules/all_vis.zip` (24.4 MB) checked into the dependency tree.
