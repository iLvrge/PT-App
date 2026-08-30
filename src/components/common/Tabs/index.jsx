import React from 'react'
import { Tab, Tabs } from '@mui/material'
import cn from '../../../ui/cn'
import 'font-awesome/css/font-awesome.min.css'

/**
 * Colours here (#222222, #363636, #2493f2, #bdbdbd, black) are literals carried
 * over verbatim from the previous styles - none of them are theme tokens.
 */
const TabsContainer = ({ tabs = [], activeTabId, setActiveTabId, gapIndex, hidden }) => {
  const count = tabs.length
  const step = (delta) => setActiveTabId((activeTabId + count + delta) % count)

  return (
    <div className="w-full">
      <div className="-mt-px mx-2.5 flex items-center justify-start border border-t-0 border-[#363636] bg-[#222222] py-0.5">
        <i className="fa fa-caret-left cursor-pointer" onClick={() => step(-1)} />

        <Tabs
          value={activeTabId}
          onChange={(e, id) => setActiveTabId(id)}
          TabIndicatorProps={{ style: { height: 0 } }}
          className="relative min-h-0 px-2"
        >
          {tabs.map((tab, index) => (
            <Tab
              key={tab}
              label={tab}
              className={cn(
                'mx-[2.5px] min-h-0 min-w-0 border border-t-0 border-[#363636]',
                'px-3 py-px leading-6'
              )}
              style={{
                background: activeTabId === index ? '#222' : 'black',
                color: '#bdbdbd',
                borderBottom: `1.5px solid ${activeTabId === index ? '#2493f2' : '#363636'}`,
                marginLeft: index === gapIndex ? '35px' : 0,
                textIndent: hidden === index ? '-9999px' : '',
                position: hidden === index ? 'absolute' : 'unset',
                left: hidden === index ? '-9999px' : '',
              }}
            />
          ))}
        </Tabs>

        <i className="fa fa-caret-right cursor-pointer" onClick={() => step(1)} />
      </div>
    </div>
  )
}

export default TabsContainer
