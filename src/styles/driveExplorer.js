/**
 * Shared classes for the Google Drive explorer in SettingsPage Repository,
 * Utilities and Templates. Repository and Utilities carried byte-identical
 * stylesheets; Templates differed only in `drive` and `heading`, where it uses
 * theme tokens where the other two use literals. Both variants are kept verbatim.
 *
 * Every string here is a literal - Tailwind cannot see a class built at runtime.
 * MuiTreeItem/MuiBreadcrumbs/Droppable selectors target DOM this app does not own.
 */

const DRIVE_BASE =
  'flex h-screen overflow-auto ' +
  '[&_.MuiTableCell-root]:whitespace-nowrap ' +
  '[&_.MuiAvatar-root]:h-4 [&_.MuiAvatar-root]:w-4 ' +   // theme.spacing(2)
  '[&_.MuiList-root]:w-full ' +
  '[&_.MuiTreeItem-label]:flex [&_.MuiTreeItem-label]:h-10 [&_.MuiTreeItem-label]:items-center ' +
  '[&_.Droppable]:w-full [&_.Droppable_.MuiTypography-root]:pl-[5px] ' +
  '[&_.MuiTreeView-root]:w-full ' +
  '[&_li.MuiListItem-root]:h-10 [&_li.MuiListItem-root]:py-0'

/** Repository and Utilities: #292929 ground, #5c5c5c rules. */
export const driveLiteral =
  `${DRIVE_BASE} bg-[#292929] ` +
  '[&_.MuiTreeView-root_.MuiTreeItem-root]:border-b [&_.MuiTreeView-root_.MuiTreeItem-root]:border-[#5c5c5c] ' +
  '[&_li.MuiListItem-root]:border-b [&_li.MuiListItem-root]:border-[#5c5c5c]'

/** Templates: no ground, divider token for rules. */
export const driveTokens =
  `${DRIVE_BASE} ` +
  '[&_.MuiTreeView-root_.MuiTreeItem-root]:border-b [&_.MuiTreeView-root_.MuiTreeItem-root]:border-divider ' +
  '[&_li.MuiListItem-root]:border-b [&_li.MuiListItem-root]:border-divider'

const HEADING_BASE =
  'flex h-10 items-center overflow-hidden pl-[25px] border-b ' +
  '[&_.MuiBreadcrumbs-root]:ml-[30px] [&_.MuiBreadcrumbs-root]:inline-block [&_.MuiBreadcrumbs-root]:w-screen'

export const headingLiteral = `${HEADING_BASE} bg-[#292929] border-[#5c5c5c]`
export const headingTokens = `${HEADING_BASE} border-divider`

export const frame = 'h-screen w-full'
export const noWrap = 'whitespace-nowrap'
export const flexColumn = 'flex flex-col'
export const relativeLockedIcon = 'relative top-[5px] cursor-pointer'
