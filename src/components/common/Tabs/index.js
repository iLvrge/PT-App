import React from 'react'
import { Tab, Tabs } from '@material-ui/core'
import useStyles from './styles'
import classnames from 'classnames'

function TabsContainer(props) {
  const classes = useStyles()
  const count = props.tabs.length
  return (
    <div className={classes.tabsWrapper}>
      <div className={classes.customTabContainer}>
        <i
          className={classnames('fa fa-caret-left', classes.button)}
          onClick={() => {
            props.setActiveTabId((props.activeTabId + count - 1) % count)
          }}
        />
        <Tabs
          value={props.activeTabId}
          onChange={(e, id) => props.setActiveTabId(id)}
          TabIndicatorProps={{ style: { height: 0 } }}
          className={classes.tabs}
        >
          {props.tabs &&
            props.tabs.map((tab, index) => (
              <Tab
                key={tab}
                label={tab}
                className={classes.tabItem}
                style={{
                  background: props.activeTabId === index ? '#222' : 'black',
                  color: '#bdbdbd',
                  borderBottom: `1.5px solid ${
                    props.activeTabId === index ? '#2493f2' : '#363636'
                  }`,
                  marginLeft: index === props.gapIndex ? '35px' : 0,
                  textIndent: props.hidden === index ? '-9999px': '',
                  position: props.hidden === index ? 'absolute': 'unset',
                  left: props.hidden === index ? '-9999px': '',
                }}
              />
            ))}
        </Tabs>
        <i
          className={classnames('fa fa-caret-right', classes.button)}
          onClick={() => {
            props.setActiveTabId((props.activeTabId + 1) % count)
          }}
        />
      </div>
    </div>
  )
}

export default TabsContainer
