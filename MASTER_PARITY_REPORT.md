# rewrite/v2 vs master — parity report

**Date:** 20 Sep 2026 · **Account:** Avaya (organisation_id 68) · **API:** local `:3600`
**master:** `d211745c` on `:3001` (CRA) · **rewrite/v2:** `0c22061a` on `:3000` (Vite)

## How this was measured

Both branches were run side by side against the same local API and the same
logged-in user, at the same viewport (1600x642). For each route a *fingerprint*
of the rendered page was captured — for every visible element: tag, its own
text, an icon's path signature, its bounding box, and 20 computed visual
properties. Class names are deliberately excluded, because master generates
`makeStyles-root-123` where v2 writes `.pt-act-root`; what has to match is what
lands on screen, not how it is spelled.

Two measurement traps had to be closed before the numbers meant anything:

- **Background tabs.** Chrome does not advance CSS transitions in a background
  tab. Measuring one there caught MUI's 250ms colour transition frozen at frame
  0 and reported ten KPI labels as grey when they render blue. Every capture now
  finishes outstanding animations and is taken with the tab foregrounded.
- **Off-screen nodes.** vis-timeline parks items at large negative offsets. Nodes
  wholly outside the viewport are excluded; otherwise the diff measures the
  library's scratch space.

## Result

| Route | master | v2 | divergences |
|---|---:|---:|---:|
| `/dashboard` (KPI) | 554 | 554 | **0** |
| `/dashboard/attention` | 546 | 546 | **0** |
| `/dashboard/activity` | 2005 | 2005 | **0** |
| `/assignments` | 587 | 587 | **0** |
| `/patent_assets` | 1922 | 1922 | 3 |
| `/search` | 587 | 587 | **0** |
| `/reports` | 200 | 200 | **0** |
| `/global` | 587 | 587 | **0** |
| `/due` | 587 | 587 | **0** |
| `/settings` | 224 | 223 | 2 |
| `/mainenance/pay_maintainence_fee` | 1498 | 1498 | 3 |
| `/mainenance/restore_ownership` | 587 | 587 | **0** |
| `/mainenance/clear_encumbrances` | 587 | 587 | **0** |
| `/ownership/invent` | 587 | 587 | **0** |
| `/review_external_assets` | 208 | 208 | **0** |
| `/mainenance/correct_names` | 2 | 2 | **0** (blank in both) |
| `/mainenance/correct_address` | 2 | 2 | **0** (blank in both) |
| `/locate_lost_assets` | 2 | 2 | **0** (blank in both) |

15 of 18 routes are pixel-identical. `/patent_assets` started at 68 diverging
elements and `/dashboard/activity` at 360.

`correct_names`, `correct_address` and `locate_lost_assets` render nothing in
**both** branches — they appear in `routeList.js` but have no `<Route>` in
`routes.js`. Pre-existing, not a rewrite regression, and worth a decision (see
Open questions).

## What was actually wrong

Eight defects, each with a single cause. None of them produced a console error,
which is why they survived.

### 1. `font-awesome` was deleted from the project

15 `<i className="fa fa-...">` icons rendered at zero width, including the `»`
separator in every breadcrumb. `@fortawesome/react-fontawesome` renders its own
SVG and needs no stylesheet, so removing the *other* FontAwesome package looked
harmless. Restored as a dependency and imported from the entry.

### 2. Vendor CSS was overriding app CSS

Several app rules override a vendor rule at *equal* specificity, where source
order alone decides the winner — e.g. `.dashboardIntroTooltip {min-width:450px}`
against intro.js's own `.introjs-tooltip {min-width:250px}`. CRA emitted
`index.css` last, so ours won. Vite orders CSS by the module graph, so a sheet
imported inside a component landed *after* `index.css` and started winning. The
walkthrough tooltip shrank from 450px to 250px and its title wrapped.

All vendor stylesheets are now imported from `src/index.js`, ahead of ours.

### 3. Tailwind's preflight was resetting margins master never reset

Preflight zeroes the margin on every element. master shipped no reset at all, so
anything relying on browser defaults collapsed — the tooltip's paragraphs ran
together. Tailwind is now imported without preflight.

### 4. Every Tailwind override of a MUI style was inert

MUI/emotion injects unlayered; Tailwind utilities live in `@layer utilities`, and
an unlayered rule beats a layered one outright — specificity never enters into
it. So `text-[1.1rem]` on a Tab lost to MUI's `0.875rem`, and an explicit
`[&_.MuiTab-root]:min-w-[135px]` — someone matching master's 135px tabs exactly —
lost to MUI's 90px. Utilities are now imported unlayered, so they compete on
specificity and order like the rest of the app's CSS.

### 5. 23 class names were shared by up to 8 components each

`makeStyles` generated a unique class per component, so two components could both
have a `tab:` key without ever meeting. The migration wrote those keys out as
literal names — `.pt-root`, `.pt-tab`, `.pt-loader` — putting them into one
shared namespace with import order picking the winner:

- FamilyItemContainer's `.pt-root .MuiTableCell-root {line-height:25px}` applied
  to AssetsTable, making all 3,997 asset rows 5px too tall.
- TabsWithTimeline's `.pt-tab {flex:1}` applied to every tab bar in the app, so
  tabs split their container equally instead of sizing to content — 103px each
  instead of 123/120/114/139, truncating "Salable" to "Salabl".

681 occurrences renamed per directory. The collision list is now empty.

### 6. 260 selectors had escaped their component scope

`jss-plugin-nested` prefixes **every** selector of a nested comma list with the
component's class. master's

```js
'& .MuiCardActions-root, .MuiCardContent-root': { padding: '5px 8px' }
```

compiled to `.makeStyles-card-109 .MuiCardActions-root, .makeStyles-card-109
.MuiCardContent-root`. The migration prefixed only the first, so the rest became
global — and, a class short on specificity, then lost to the rules they were
meant to beat. That is why twelve KPI gauges rendered 5px taller than master's.

### 7. Nine timelines were on the wrong vis-timeline version

master depends on two builds at once through npm aliases (`vis-timeline` 7.7.0
and `vis-timeline-73` = 7.3.7) and uses the 7.3.7 build in nine components. The
rewrite dropped the aliases and pointed everything at 7.7.0, which lays items out
differently and builds item content without the template's own classes. On
`/dashboard/activity` that meant 'Persony Inc' measured 88x18 against master's
66x26 and the axis sat at quarters where master shows days.

### Also fixed

- **Roboto was never loading.** master pulls the webfont in through
  `PatentrackDiagram/css/styles.css`; CRA bundles all CSS upfront so it was
  always present. Under Vite it only loaded on pages that mount that component,
  so most pages fell back to Arial — 21 registered font faces against master's 49.
- **QuillEditor's global stylesheet was overwritten.** It is the only component in
  the app with both a `styles.js` and a plain `styles.css`; the migration
  converted the former onto the latter and lost 97 lines of Quill overrides.
  Restored as `quill-overrides.css`.
- **Two px-for-rem conversions.** This app sets a 14px root, so Tailwind's
  rem-based scale lands 12.5% short of the px value it replaced: `w-6` gave 21px
  where master sets 24px, and `StyledSearch` measured 148px against master's 211px.

### 8. Hovering anywhere lit up every split-pane divider

Reported after the first pass, and my first check of it was wrong: I measured a
resizer on `/dashboard`, which has two and no nesting, found it transparent at
rest, and concluded the pink was just the hover state. On `/patent_assets` there
are five, nested, and all of them went pink together.

`hover:[&_.Resizer]:bg-[#e91e63]` compiles to `.splitPane:hover .Resizer` —
hover on the **pane**, colouring every resizer inside it. Because the panes nest
several deep, pointing anywhere in the layout hit the outermost pane and lit up
every divider at once. master nests `&:hover` inside `& .Resizer`, giving
`.splitPane .Resizer:hover`: only the divider under the pointer.

Fixed in all five places (`splitPane.js` x3, `SplitPaneDrawer`, `LawFirms`) by
writing `[&_.Resizer:hover]`. The same inversion does **not** apply to the
`hover:[&_svg]` rules on icon buttons — master really does hover the container
there, so those are correct as written.

## Checked and found *not* to be regressions

- **14 `className={undefined}`**: every one converts a `classes.<key>` that
  master's `styles.js` never defined, or defines as an empty rule. Dead in both.
- **Icon path differences**: `@mui/icons-material` resolved to 5.18.0 in master's
  tree and 5.11.0 here, from the same `^5.4.2` range. Same glyph, same box.

## Residual differences (3, all sub-pixel or invisible)

| Where | Difference | Assessment |
|---|---|---|
| `/patent_assets`, `/mainenance/*` | "Licensable" tab 138px vs 139px | 1px text metric |
| `/settings` | search field 214px vs 211px | 3px, was 63px |
| GeoChart `<svg>` | inherited `font-size` 14px vs 16px | identical box, no visual effect |

## Guards added

`npm run check:styles` now also runs `scripts/check-css-collisions.cjs`, which
fails the build if two component stylesheets claim the same class namespace —
including through a descendant selector like `.pt-action-icon svg`, the form that
let the header-icon bug through. Its allow-list is empty and should stay that way.

`src/styles/cssOrder.test.js` pins the vendor-before-app import order, the
no-preflight Tailwind entry, and the presence of `font-awesome`.
`src/styles/splitPane.test.js` fails if a resizer colour is ever hung off the
pane (`hover:[&_.Resizer]`) instead of the resizer (`[&_.Resizer:hover]`).

One caveat on verification: synthetic hover through browser automation did not
trigger the `:hover` state on a 3px divider on **either** branch, so the
corrected highlight is confirmed by the generated selector matching master's
(`.splitPane .Resizer:hover`) and by the all-at-once colouring being gone —
not by an automated visual check. Worth a manual hover to confirm.

Full suite: **147 tests, 21 files, all passing.**

## Open questions for you

1. **`correct_names`, `correct_address`, `locate_lost_assets` render nothing in
   both branches.** They are in `routeList.js` with no `<Route>` in `routes.js`.
   Should they be wired up, or removed from the list?
2. **`vis-data` stays at `^7.1.2`, where master pins `7.0.0`.** master's 7.0.0
   does not export `isDataViewLike`, which vis-timeline 7.7.0 imports; webpack
   degrades that to a warning, Vite fails the build. 7.1.2 supersets 7.0.0.
   Flagging it because it is the one dependency that deliberately differs.
3. **The walkthrough replays on every load** in both branches, so it is not a
   rewrite regression — but it does suggest the "seen" flag is not being stored.
