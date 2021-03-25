import React from 'react'
import useStyles from './styles'
import 'font-awesome/css/font-awesome.min.css'
import classnames from 'classnames'

function CustomTab(props) {
  const { tabs, activeTabId, setActiveTabId } = props
  const classes = useStyles()
  const count = tabs.length

  return (
    <div className={classes.customTabContainer}>
      <i
        className={classnames('fa fa-caret-left', classes.button)}
        onClick={() => {
          setActiveTabId((activeTabId + count -1) % count)
        }}
      />
      <span>{tabs[activeTabId].toUpperCase()}</span>
      <i
        className={classnames('fa fa-caret-right', classes.button)}
        onClick={() => {
          setActiveTabId((activeTabId + 1) % count)
        }}
      />
    </div>
  )
}

export default CustomTab