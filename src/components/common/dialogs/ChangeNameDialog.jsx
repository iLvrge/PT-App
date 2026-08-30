import React from 'react'
import { Button, TextField } from '@mui/material'
import { Dialog, DialogContent } from '../../../ui/Dialog'

/**
 * Extracted from ActionMenu and AssetsCommentsTimeline, which carried
 * byte-identical copies of this markup.
 *
 * The copies were not equivalent in effect: each referenced `classes.root` and
 * `classes.btn` from its own stylesheet, and those differ. In
 * AssetsCommentsTimeline they are a flex container and an absolutely-positioned
 * button; in NewHeader `root` is the header bar's own rule (z-index 1206,
 * overflow hidden) applied to a form, and `btn` is not defined at all, so that
 * className resolved to undefined.
 *
 * Both call sites keep passing what they resolved to before, so this changes no
 * rendering. The NewHeader case looks like copy-paste rather than intent and is
 * worth revisiting once it can be seen on screen.
 */
const ChangeNameDialog = ({ open, onClose, onChangeName, onSubmit, formClassName, buttonClassName }) => (
  <Dialog open={open} onOpenChange={(next) => { if (!next) onClose() }}>
    <DialogContent
      title="Change company name"
      className="!w-[300px] !max-w-none !bg-[#424242] !px-2.5"
    >
      <div style={{ display: 'flex', height: '20vh', position: 'relative' }}>
        <form className={formClassName} noValidate autoComplete="off">
          <TextField
            id="change-name"
            label="Company Name"
            onChange={onChangeName}
            placeholder="Enter a new company name"
          />
        </form>
        <Button variant="outlined" onClick={onSubmit} className={buttonClassName}>
          Submit
        </Button>
      </div>
    </DialogContent>
  </Dialog>
)

export default ChangeNameDialog
