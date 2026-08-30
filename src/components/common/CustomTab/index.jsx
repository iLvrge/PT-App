import React from 'react'
import 'font-awesome/css/font-awesome.min.css'

const CustomTab = ({ tabs, activeTabId, setActiveTabId }) => {
  const count = tabs.length
  const step = (delta) => setActiveTabId((activeTabId + count + delta) % count)

  return (
    // #222222 is carried over verbatim from the previous styles; it is not a
    // theme token, so it stays as a literal rather than being approximated.
    <div className="flex items-center justify-around bg-[#222222] py-0.5">
      <i className="fa fa-caret-left cursor-pointer" onClick={() => step(-1)} />
      <span>{tabs[activeTabId].toUpperCase()}</span>
      <i className="fa fa-caret-right cursor-pointer" onClick={() => step(1)} />
    </div>
  )
}

export default CustomTab
