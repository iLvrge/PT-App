/**
 * Shared class strings for the react-split-pane layout used by PatentLayout,
 * MainDashboard, GlobalScreen and CorrectLayout.
 *
 * Those four carried near-identical 184-line stylesheets that had drifted apart
 * only in the resizer colour, so there is one constant per colour rather than a
 * function: Tailwind scans source statically and cannot see a class assembled
 * from a template literal at runtime. Every utility below must stay a literal.
 *
 * .Pane, .Pane1, .Pane2 and .Resizer are react-split-pane's own class names and
 * stay as arbitrary variants until that layer is replaced (MIGRATION_PLAN 4b).
 *
 * The hover colour is written `[&_.Resizer:hover]`, never `hover:[&_.Resizer]`.
 * The second form compiles to `.splitPane:hover .Resizer` - hover on the PANE,
 * colouring every resizer inside it. These panes nest several deep, so pointing
 * anywhere in the layout lit up every divider on the page at once. master nests
 * `&:hover` inside `& .Resizer`, i.e. `.splitPane .Resizer:hover`: only the
 * divider actually under the pointer.
 */

const BASE =
  '!relative ' +
  '[&_.Resizer]:h-full [&_.Resizer]:w-[3px] [&_.Resizer]:z-[1] [&_.Resizer]:opacity-100 ' +
  '[&_.Resizer]:box-border [&_.Resizer]:cursor-col-resize [&_.Resizer]:bg-clip-padding ' +
  '[&_.Resizer.horizontal]:h-[3px] [&_.Resizer.horizontal]:w-full [&_.Resizer.horizontal]:cursor-row-resize ' +
  '[&_.Pane]:max-h-full [&_.Pane2]:h-full [&_.Pane2]:overflow-auto'

/** PatentLayout and MainDashboard: pink[500] hover, no resting colour. */
export const splitPanePink = `${BASE} [&_.Resizer]:bg-none [&_.Resizer:hover]:bg-[#e91e63]`

/** GlobalScreen: secondary.main hover. */
export const splitPaneSecondary = `${BASE} [&_.Resizer]:bg-none [&_.Resizer:hover]:bg-[#E60000]`

/** CorrectLayout: black resting, #f50057 hover - its own literals. */
export const splitPaneCorrect = `${BASE} [&_.Resizer]:bg-black [&_.Resizer:hover]:bg-[#f50057]`

export const minimized =
  '[&_.Pane.Pane1]:!h-full [&_.Pane.Pane1]:!max-h-[unset] [&_.Pane.Pane2]:!hidden'

export const splitPane2 = '[&_.Pane]:max-h-full'
export const splitPane3 = '[&_.Pane]:!max-w-full'

// splitPane2OverflowHidden and splitPane2OverflowUnset were separate rules with
// identical bodies (overflow: unset !important); one constant covers both.
export const pane2OverflowUnset = '[&_.Pane2]:!overflow-[unset]'
export const pane1OverflowUnset = '[&_.Pane1]:!overflow-[unset]'
export const mainOverflowUnset = '!overflow-[unset]'
export const paneHeightZero = '[&_.Pane1]:h-0'

export const notInteractive = 'pointer-events-none [&_iframe]:pointer-events-none'
export const isInteractive = 'pointer-events-auto'
export const companyBar = 'h-full'
