# PT-App frontend test report

Tested against the local `PT-API` rewrite (`rewrite/v2`, port 3600), MySQL over
the SSH tunnel, customer **Avaya** (`organisation_id 68`). Login used
throughout: `test` / `123465` (see `pt-app-test-credentials` — this is Avaya's
only native business user).

Local setup used: `PT-App/.env`'s `REACT_APP_API_URL` pointed at
`http://localhost:3600` (committed value is `https://api.patentrack.com`,
`.env` is gitignored so this was never at risk of being committed).
`PT-API/.env` also got `RATE_LIMIT_MAX`/`RATE_LIMIT_AUTH_MAX`/`RATE_LIMIT_PUBLIC_MAX`
raised for local testing (same file, also gitignored).

## Headline

**The app did not load at all before this pass — every fresh sign-in produced
a permanent blank screen.** That was not one bug but a chain of six, each
hiding the next: an infinite network retry loop, a broken dev-server
dependency, two real JavaScript errors, a prop-passing regression that broke
every code-split route, and a handful of dangling references to a styling
system the app had already migrated away from. All six are fixed below, with
real Avaya data now rendering (44 companies, real KPI numbers, a working 3D
asset chart, a jurisdiction map, real settings screens). A seventh, unrelated
bug was found and fixed in the API itself. **An eighth was found afterward**:
the dashboard's KPI tile row (Owned/Invented/Acquired/etc.) had correct data
underneath the whole time but rendered at zero width — traced to a ninth
instance of the same CSS class-collision problem and fixed; see §4. One class
of issue remains open — the class-collision problem is systemic (17+ files
share generic names across `.pt-root`/`.pt-container`/`.pt-list`) and only the
instances that were actively breaking something have been fixed; others may
still be lurking on pages this pass didn't reach. See §5 for the decision
that needs making about the rest.

---

## 1. Six bugs that together made the app unable to load, fixed

### 1a. Infinite `/refresh-token` retry loop on any unauthenticated request

`src/api/axiosSetup.js`'s response interceptor retries a 401 by calling
`/refresh-token` through the *same* axios instance. The API answers a
missing, invalid, or expired token with 401 in every case (never 403). Since
the refresh call's own 401 re-entered the same interceptor branch, it tried
to refresh the refresh, recursing — dozens of `/refresh-token` requests fired
within milliseconds on every single unauthenticated page load (i.e. every
fresh visit, and every real session expiry), until the API's rate limiter cut
it off. The tab never got far enough to render the sign-in page.

**Fixed**: excluded the refresh-token request itself from the retry branch,
and added the missing logout side effect (clear stored token, redirect to
`/auth`) to the branch that actually fires when a refresh genuinely fails —
the existing 403-only logout code path never matched this API's real 401
responses, so a real session expiry would previously have hung the same way.

### 1b. `react-virtualized`'s broken ES build crashed Vite's dependency pre-bundle

`react-virtualized@9.22.5`'s ESM build has a real upstream bug (missing
`bpfrpt_proptype_*` exports — [issue #1632](https://github.com/bvaughn/react-virtualized/issues/1632)).
esbuild's strict ESM resolution fails hard on it. The first time any route
using `VirtualizedTable` loaded, Vite's dependency scan crashed and never
recovered — every such route (most of the app) hung forever on its loading
spinner, with no console error visible on the page itself (the failure was on
the dev server side).

**Fixed**: `vite.config.js` now aliases the bare `react-virtualized`
specifier to its CommonJS entry, which has the identical bug but tolerates it
silently (CommonJS `require()` of a missing named export is `undefined`, not
a hard failure).

**Open question**: this may only affect Vite's dev-mode dependency
pre-bundling (esbuild), not the production build (Rollup) — worth a
production build smoke test, not done in this pass.

### 1c. Two real `const` reassignment bugs

Genuine runtime `TypeError`s, not dev-only artifacts — just never previously
reached, because (1b) blocked Vite's dependency scan before it got this far
into the app:

- `src/components/common/AssetsCommentsTimeline/index.js`: `const token = JSON.parse(slackToken); ...; token = JSON.parse(token)`
- `src/components/common/MainCompaniesSelector/index.js`: `const all = [], groups = []; ...; all = [...all, ...parseChild]`

Both changed to `let`.

### 1d. `RouteBoundary` silently dropped every prop `GlobalLayout` injects

`GlobalLayout` clones its `children` with roughly 50 props (state, handlers,
`checkChartAnalytics`, etc.), assuming its direct child IS the routed page
component. The code-splitting work wrapped every page in
`<RouteBoundary><Component/></RouteBoundary>`, so `GlobalLayout`'s clone
lands on `RouteBoundary` — which only ever destructured `{ children }` and
threw every other prop away. `MainDashboard` (and everything else routed this
way) rendered with `checkChartAnalytics` — and everything else in that prop
bag — as `undefined`, crashing with `"checkChartAnalytics is not a function"`
the instant it rendered.

**Fixed**: `src/routes.js`'s `RouteBoundary` now forwards `...rest` onto its
child via `React.cloneElement`. This is systemic — it very likely unblocks
every other lazy route (`Settings`, `Reports`, `PatentLayout`, `GlobalScreen`),
not just the dashboard. Spot-checked Settings (Companies, Users) and Assets
directly; the others were not individually re-verified.

### 1e. Dangling `classes` references left over from a removed styling system

Five more real `ReferenceError`s, all the same shape: a component used to
call `const classes = useStyles()` (MUI's old `makeStyles`), that hook call
was removed as part of the CSS-extraction migration, and the code that
*used* `classes` was not:

- `src/components/common/VirtualizedTable/index.js` — two `useCallback`
  dependency arrays
- `src/components/common/AssetsVisualizer/LegalEventsContainer/Fees.js` —
  four call sites passing `classes` into `convertDataToItem`, whose `cls`
  parameter turned out to be unused inside the function anyway
- `src/components/common/AssetsCommentsTimeline/index.js` — two more
  dependency arrays
- `src/components/SettingsPage/Tabs/Compaines/Names/CompaniesTable/index.js`
  — `classes[headCell.class]`; currently dead code (`headCell.class` is
  always `''` in this file today) but a landmine the moment anyone sets a
  real value there

All fixed by removing the dangling reference or substituting
`undefined`/`''` where the value was never actually read.

### 1f. Systemic CSS class collision: `.pt-root` defined independently in 14 files — one instance fixed, the rest flagged

Another artifact of the same styling migration: each component's local
`.root` class from its own `makeStyles()` hook used to be auto-scoped
uniquely per component by JSS. When that got replaced with plain CSS files,
the class name was hardcoded to the literal string `pt-root` everywhere,
with no scoping — so **14 different stylesheets** now define `.pt-root`
independently, and all of them apply globally to any element with that
class, with the winner decided purely by import/source order:

```
NewHeader/styles.css                                    common/ForeignAsset/styles.css
common/IllustrationCommentContainer/styles.css           common/AssetsVisualizer/TimelineSecurity/styles.css
common/AssetsCommentsTimeline/styles.css                 common/AssetsVisualizer/LifeSpanContainer/styles.css
common/AssetsTable/styles.css                            common/AssetsVisualizer/FamilyContainer/styles.css
common/AssetsVisualizer/TimelineWithLogo/styles.css      common/AssetsVisualizer/FamilyItemContainer/styles.css
common/AssetsVisualizer/TimelineContainer/styles.css     common/AssetsVisualizer/InventionVisualizer/styles.css
common/AssetsVisualizer/TabsWithTimeline/styles.css      common/AssetsVisualizer/LegalEventsContainer/styles.css
```

This actively broke the dashboard: `NewHeader`'s own `.pt-root` (small,
`position: initial`) lost to `IllustrationCommentContainer`'s later
`.pt-root { flex: 1 1 0%; height: 100%; ... }`, stretching the header to fill
the *entire page* and hiding all real content behind it — a solid black
screen, even though the DOM and the real data underneath were both correct.

A `.pt-container` class has the identical problem across 3 more files
(`IllustrationCommentContainer`, `AssetsVisualizer/FamilyItemContainer`,
`Reports/styles.css`). There may be other repeated generic names from the
same migration this pass did not search for.

**Fixed just the one active collision** that was blocking the dashboard:
renamed `NewHeader`'s class to `.pt-header-root` (its own CSS file plus the
one `className` reference in `NewHeader/index.js`). **The other 13 `.pt-root`
files, and all 3 `.pt-container` files, are untouched** — seeing this
dashboard render correctly again doesn't mean every page is safe from a
similar pairwise collision. See §3 for the decision this needs.

---

## 2. One more bug, found here but fixed in `PT-API`

**`DELETE /admin/customers/:id/users/:userId` never cleaned up the tenant
copy of the deleted user.** There are two different "delete a customer's
user" routes in the API; only one of them (`DELETE /admin/users/:orgId/:user_id`)
correctly deleted both the business-side row and the customer's own tenant
copy. The other left the tenant row behind forever. Found because Avaya's
Settings > Users page in PT-App still listed a test user
(`qa-admin-manager@avaya.com`, tenant `user_id` 348) that had already been
"deleted" through the API during an earlier testing pass.

Fixed in `PT-API/src/modules/users/users.service.js` (`remove()`) with a
regression test — see that repo's own session log for detail. **Not fully
cleaned up**: the orphaned tenant row itself (348) still exists — its
business-side counterpart is already gone, so neither delete route's lookup
can find it anymore to re-trigger cleanup, and direct SQL cleanup was blocked
by a sandbox guard. A one-off `DELETE FROM user WHERE user_id = 348` against
Avaya's tenant database would clear it; cosmetic only.

---

## 3. Confirmed working with real data

- Sign-in (`test` / `123465`) → `/dashboard`, session persists across an API
  restart (JWT-based, as expected)
- Dashboard: Companies panel loads all 44 real Avaya company groups (Avaya
  Inc, Avaya LLC, Competitors, Licensees, Licensors, M&A Targets, NPEs,
  Subsidiaries, Testing Group — including a "QA Test New Company" and other
  test artifacts left over from earlier `PT-API` route testing, which is
  expected and not a PT-App bug)
- Selecting "Avaya Inc" loads its real KPI figures from the API: Owned
  27/16, Invented 22/16, Acquired 5/0, Collateralized 16/0, Maintenance Fee
  Due 4 ($17,220), Divested 2093/70, Abandoned 69/465, a real Non-U.S.
  country breakdown, and a real law-firm "Managers" list with correct
  counts — present and correct in the DOM, just not visible on screen (§4)
- The Assets page (`/patent_assets`): a real 3-D "assets by technology over
  time" chart (2001–2023), a world map colored by jurisdiction with a real
  total count, a real asset list (3,997 real US patent/application numbers)
- Settings > Companies: real company groups with real assignment counts,
  plus the pending "ready to import" company requests from earlier `PT-API`
  testing
- Settings > Users (Team Members): real Avaya user list, correctly reflected
  the deletion fix in §2 as soon as the API picked it up

## 4. Fixed: the KPI panel rendered correct data at zero width

The KPI tile row (Owned / Invented / Acquired / Collateralized / Maintenance
Fee Due / Challenged / Divested / Abandoned / Non-U.S. / Inventors / Managers
/ Lenders) on the dashboard had entirely correct data — confirmed via the
accessibility tree — but was invisible on screen.

An earlier version of this report guessed the cause was MUI's legacy `Grid`
component failing to generate its breakpoint CSS. That guess was wrong, and
is corrected here: the Grid item's own emotion-generated class
(`.css-1idn90j-MuiGrid-root`, correctly declaring `flex-basis: 100%`) was
present and correct all along. The real cause, found by comparing the
element's *declared* CSS against its *computed* style: the same item also
carried a plain `className="pt-list"`, and a **completely unrelated**
`.pt-list { flex: 1; }` rule in
`src/components/common/AssetsCommentsTimeline/styles.css` was overriding the
Grid item's `flex-basis: 100%` down to `flex-basis: 0%` — collapsing the
entire tile row to zero width. This is the identical class-collision problem
from §1f (generic names hardcoded during the `makeStyles` migration, no
scoping), just a third instance of it (`.pt-list`, not `.pt-root`/`.pt-container`).

**Fixed**: renamed `Reports/index.js`'s own `pt-list` usage — and every
selector in `Reports/styles.css` that targeted it — to `pt-kpi-list`, which
nothing else uses. Verified live: the tile row now renders as visible boxes
with the correct real numbers (Owned 27/16, Acquired 5/0, Collateralized
16/0, etc. for Avaya Inc).

---

## 5. Decisions needed from you

1. **The `.pt-root` / `.pt-container` / `.pt-list` class-collision problem
   (§1f, §4) is bigger than the three instances fixed so far.** Real options:
   (a) do a full audit and rename every one of the ~17+ colliding
   definitions to something component-specific, the "correct" fix but real
   work across many files; (b) adopt CSS Modules or a similar scoping
   mechanism going forward so this class of bug can't recur, without
   necessarily fixing every existing instance immediately; (c) leave it and
   fix collisions reactively as they surface, the way this pass did three
   times over. I did not want to make this call unilaterally — it is a
   meaningful scope/time decision, not a bug fix.
2. **Confirm whether `react-virtualized`'s broken ES build (§1b) affects the
   production build too**, not just local dev — if it does, the same alias
   fix (or a different one, since Rollup's resolution differs from esbuild's)
   would need to land in the production bundle as well.
3. **Clean up the orphaned tenant user row** (§2, `user_id` 348 in Avaya's
   tenant database) — cosmetic, low priority, needs a one-off SQL DELETE I
   couldn't run myself.

---

## 6. Not covered in this pass

Given the size of this app, this pass covered sign-in, the main dashboard
and its KPI/company-selector shell, the Assets page, and two Settings tabs
(Companies, Users) — enough to find and fix the chain of bugs that blocked
the app from loading at all, plus a couple of things behind that. It did
**not** exhaustively click through every remaining page, tab, dialog, and
action (Reports' other views, Transactions, Documents, the Reports/KPI page
navigation icons individually, Google/Microsoft/Slack integrations, the
comment/messaging panel, sharing flows, and more). Given how much was broken
before even the dashboard would render, I'd expect more issues of the same
general shape (dangling `classes` references, more `.pt-root`-style
collisions) to surface as those areas get exercised — worth another pass
once you've had a chance to look at what's here.
