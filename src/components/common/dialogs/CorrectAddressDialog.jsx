import React, { Suspense } from 'react'
import { Dialog, DialogContent } from '../../../ui/Dialog'

/**
 * Extracted from ActionMenu and AssetsCommentsTimeline. The two copies differed
 * only in whether CustomerAddress was lazily loaded; it is lazy here, which is
 * the behaviour ActionMenu had and is strictly better for the other call site.
 */
const CorrectAddressDialog = ({ open, onClose, onSelectAddress, children }) => (
  <Dialog open={open} onOpenChange={(next) => { if (!next) onClose() }}>
    <DialogContent title="Correct address" className="!w-[600px] !max-w-none">
      <div style={{ display: 'flex', height: '50vh' }}>
        <Suspense fallback={null}>{children}</Suspense>
      </div>
    </DialogContent>
  </Dialog>
)

export default CorrectAddressDialog
