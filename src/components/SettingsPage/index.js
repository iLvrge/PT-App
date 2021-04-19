import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { Redirect, useHistory, useLocation } from 'react-router-dom'
import useStyles from './styles'
import NewHeader from '../NewHeader'
import _get from 'lodash/get'
import { useSelector } from 'react-redux'

import CompaniesNames from './Tabs/Compaines/Names'
import CompaniesAdresses from './Tabs/Compaines/Adresses'
import CompaniesLawFirms from './Tabs/Compaines/LawFirms'
import Slacks from './Tabs/Slacks'
import Users from './Tabs/Users'
import Repository from './Tabs/Repository'
import Documents from './Tabs/Documents/index'
import Professionals from './Tabs/Professionals'
import LawFirms from './Tabs/LawFirms'
import Collapse from '@material-ui/core/Collapse'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { ExpandLess, ExpandMore } from '@material-ui/icons'

const TABS = [
  { label: 'Slacks', value: 'slacks', component: Slacks },
  { label: 'Repository', value: 'repository', component: Repository },
  { label: 'Users', value: 'users', component: Users },
  { label: 'Professionals', value: 'professionals', component: Professionals },
  { label: 'Documents', value: 'documents', component: Documents },
  {
    label: 'Companies', value: 'companies', children: [
      { label: 'Names', value: 'companies/names', component: CompaniesNames },
      { label: 'Addresses', value: 'companies/addresses', component: CompaniesAdresses },
      { label: 'Law Firms', value: 'companies/lawFirms', component: CompaniesLawFirms },
    ],
  },
  { label: 'Law Firms', value: 'lawFirms', component: LawFirms },
]
const FLAT_TABS = TABS.reduce((prev, tab) => tab.children ? [ ...prev, ...tab.children ] : [ ...prev, tab ], [])

const DEFAULT_ROUTE = TABS[0].value

const findTabViaChild = (currentTab) => _get(TABS.find(({ children }) => Array.isArray(children) && children.some(({ value }) => value === currentTab)), 'value')

function SettingsPage() {
  const classes = useStyles()
  const authenticated = useSelector(store => store.auth.authenticated)
  const history = useHistory()
  const location = useLocation()

  const currentTab = useMemo(() => {
    const splittedPathname = location.pathname.split('/')
    return splittedPathname.slice(2).join('/')
  }, [ location ])

  const initialOpenSubTabs = findTabViaChild(currentTab)
  const [ openSubTabs, setOpenSubTabs ] = useState(initialOpenSubTabs ? [ initialOpenSubTabs ] : [])

  useEffect(() => {
    const tab = findTabViaChild(currentTab)
    if (!tab) {
      setOpenSubTabs([])
    }
  }, [ currentTab ])

  useEffect(() => {
    if (location.pathname === '/settings' || location.pathname === '/settings/') {
      history.push(`/settings/${DEFAULT_ROUTE}`)
    }
  }, [ location, history ])

  const onClickTab = (tab) => () => {
    if (Array.isArray(tab.children)) {
      setOpenSubTabs((openSubTabs) => openSubTabs.includes(tab.value) ? openSubTabs.filter(openSubTab => openSubTab !== tab.value) : [ ...openSubTabs, tab.value ])
    } else {
      history.push(`/settings/${tab.value}`)
    }
  }

  const isTabSelected = (tab) => {
    if (tab.children) {
      return currentTab.includes(tab.value)
    }
    return currentTab === tab.value
  }

  return !authenticated ? <Redirect to={'/'} /> : (
    <div className={classes.root}>
      <NewHeader />

      <div className={classes.settings}>
        {/* <div>
          <List className={classes.list}>
            {
              TABS.map((tab) => {
                const open = openSubTabs.includes(tab.value)
                const subTabs = !!tab.children

                return (
                  <Fragment key={tab.value}>
                    <ListItem button selected={isTabSelected(tab)} onClick={onClickTab(tab)}>
                      <ListItemText className={classes.listItemText} primary={tab.label} />
                      {subTabs && (open ? <ExpandLess /> : <ExpandMore />)}
                    </ListItem>
                    {subTabs && (
                      <Collapse in={open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {
                            tab.children.map((tab) => (
                              <ListItem
                                key={tab.value}
                                button
                                className={classes.nested}
                                selected={isTabSelected(tab)}
                                onClick={onClickTab(tab)}>

                                <ListItemText className={classes.listItemText} primary={tab.label} />
                              </ListItem>
                            ))
                          }
                        </List>
                      </Collapse>
                    )}

                  </Fragment>
                )
              })
            }
          </List>
        </div> */}
        <div className={classes.tabPanel}>
          {
            FLAT_TABS.map(({ value, component: Component }) => (
              currentTab === value && (<Component key={value} />)
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
