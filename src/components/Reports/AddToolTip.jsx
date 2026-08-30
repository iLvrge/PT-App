import React from 'react'
import Tooltip from '../../ui/Tooltip'

/**
 * Radix-backed replacement for the MUI Tooltip wrapper.
 *
 * Behaviour preserved: 1500ms open delay, and 18px tooltip text. The 18px came
 * from Reports/styles.js setting `.MuiTypography-root { fontSize: 18 }` inside
 * the tooltip, applied to the <Typography variant="body2"> this used to wrap
 * its content in — so the Typography and the descendant selector both go, and
 * the size is set directly.
 *
 * Dropped deliberately:
 *  - the `grid` prop and its `tooltip{lg}` class: no caller ever passes `grid`.
 *  - the `&.3` / `&.4` / `&.6` max-width rules: a CSS class cannot begin with a
 *    digit, so those selectors never matched anything.
 *  - the Zoom transition, which ran with `timeout: 0` and so was already a no-op.
 */
const AddToolTip = ({ tooltip, placement = 'bottom', children, className }) => (
  <Tooltip title={tooltip} side={placement} delayDuration={1500} className={className}>
    {children}
  </Tooltip>
)

export default AddToolTip
