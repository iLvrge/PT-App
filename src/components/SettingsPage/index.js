import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { Redirect, useHistory, useLocation } from 'react-router-dom'
import useStyles from './styles'
import NewHeader from '../NewHeader'
import _get from 'lodash/get'
import { useSelector, useDispatch } from 'react-redux'

import CompaniesNames from './Tabs/Compaines/Names'
import CompaniesAdresses from './Tabs/Compaines/Adresses'
import CompaniesLawFirms from './Tabs/Compaines/LawFirms'
import Slacks from './Tabs/Slacks'
import Users from './Tabs/Users'
import Repository from './Tabs/Repository'
import Documents from './Tabs/Documents/index'
import Professionals from './Tabs/Professionals'
import LawFirms from './Tabs/LawFirms'
import Grid from '@material-ui/core/Grid'


import { setBreadCrumbs } from  '../../actions/patentTrackActions2'
import { setControlModal } from '../../actions/uiActions'
import NavigationIcon from '../../components/NavigationIcon'

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
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()
  const authenticated = useSelector(store => store.auth.authenticated)  
  const [ openBar, setOpenBar ] = useState(false)
  const [ openCompanyBar, setOpenCompanyBar ] = useState(false)
  const [ openTeamBar, setOpenTeamBar ] = useState(false)
  const [ openDocumentBar, setOpenDocumentBar ] = useState(false)
  const [ openAddressBar, setOpenAddressBar ] = useState(false)
  const [ openLawfirmsBar, setOpenLawfirmsBar ] = useState(false)
  const [ openSlackBar, setOpenSlackBar ] = useState(false)
  const currentTab = useMemo(() => {
    const splittedPathname = location.pathname.split('/')
    return splittedPathname.slice(2).join('/')
  }, [ location ])


  const initialOpenSubTabs = findTabViaChild(currentTab)
  const [ openSubTabs, setOpenSubTabs ] = useState(initialOpenSubTabs ? [ initialOpenSubTabs ] : [])

  console.log("SettingsPage")  

  useEffect(() => {
    const tab = findTabViaChild(currentTab)
    if (!tab) {
      setOpenSubTabs([])
    }
    switch(currentTab) {
      case 'companies/names':
        setOpenCompanyBar(true)
        break;
      case 'users':
        setOpenTeamBar(true)
        break;
      case 'repository':
        setOpenDocumentBar(true)
        break;
      case 'companies/addresses':
        setOpenAddressBar(true)
        break;
      case 'companies/lawFirms':
        setOpenLawfirmsBar(true)
        break;
      case 'slacks':
        setOpenSlackBar(true)
        break;
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

  const resetAll = () => {
    setOpenBar(false)
    setOpenCompanyBar(false)
    setOpenTeamBar(false)
    setOpenDocumentBar(false)
    setOpenAddressBar(false)
    setOpenLawfirmsBar(false)
    setOpenSlackBar(false)
  }

  const handleSlackLink = () => {
    resetAll()
    setOpenSlackBar(true)
    history.push('/settings/slacks')  
  }

  const handleRepositoryLink = () => {
    resetAll()
    setOpenDocumentBar(true)
    history.push('/settings/repository')  
  }

  const handleUsersLink = () => {
    resetAll()
    setOpenTeamBar(true)
    history.push('/settings/users')  
  }

  const handleProfessionalsLink = () => {
    history.push('/settings/professionals')  
  }

  const handleDocumentsLink = () => {
    history.push('/settings/documents')  
  }

  const handleCompanyNamesLink = () => {
    resetAll()
    setOpenCompanyBar(true)
    history.push('/settings/companies/names')  
  }

  const handleCompanyAddressLink = () => {
    resetAll()
    setOpenAddressBar(true)
    history.push('/settings/companies/addresses')  
  }

  const handleCompanyLawfirmsLink = () => {
    resetAll()
    setOpenLawfirmsBar(true)
    history.push('/settings/companies/lawFirms')  
  }

  const handleLawfirmsLink = () => {
    history.push('/settings/lawFirms')  
  }

  const handleHomeLink = useCallback(() => {    
    history.push('/') 
    setTimeout(() => {
      dispatch(
        setBreadCrumbs('')
      )
      /* dispatch(
        setControlModal(true)
      ) */
    }, 500) 
  }, [dispatch])

  const topToolBar = [
    {
      tooltip: 'Home',
      bar: openBar,
      click: handleHomeLink,
      t: 40
    },
    {
      tooltip: 'Companies',
      bar: openCompanyBar,
      click: handleCompanyNamesLink,
      t: 36
    },
    {
      tooltip: 'Team Members',
      bar: openTeamBar,
      click: handleUsersLink,
      t: 33
    },    
    {
      tooltip: 'Documents and Templates',
      bar: openDocumentBar,
      click: handleRepositoryLink,
      t: 32
    }, 
    {
      tooltip: 'Companies Addresses',
      bar: openAddressBar,
      click: handleCompanyAddressLink,
      t: 37
    },
    {
      tooltip: 'Law Firms',
      bar: openLawfirmsBar,
      click: handleCompanyLawfirmsLink,
      t: 38
    },
    {
      tooltip: 'Slack',
      bar: openSlackBar, 
      click: handleSlackLink,
      t: 31
    },
    /* {
      tooltip: 'Professionals',
      bar: openBar,
      click: handleProfessionalsLink,
      t: 34
    },
    {
      tooltip: 'Documents',
      bar: openBar,
      click: handleDocumentsLink,
      t: 35
    },
    {
      tooltip: 'Lawfirms',
      bar: openBar,
      click: handleLawfirmsLink,
      t: 39
    } */
  ]

  return !authenticated ? <Redirect to={'/'} /> : (
    <div className={classes.root}>
      <NewHeader />
      <div className={classes.settings}>
        <Grid container className={classes.dashboardWarapper}>
          <Grid container className={classes.dashboard}>
            <div className={classes.filterToolbar}> 
              <div className={classes.flex}>
                {
                  topToolBar.map( (item, index) => (
                    <NavigationIcon key={index} {...item}/>
                  ))
                }              
              </div>
            </div>
            <div className={classes.tabPanel}>
              {
                FLAT_TABS.map(({ value, component: Component }) => (
                  currentTab === value && (<Component key={value} />)
                ))
              } 
            </div>
          </Grid>
        </Grid>   
      </div>
    </div>
  )
}

export default SettingsPage
