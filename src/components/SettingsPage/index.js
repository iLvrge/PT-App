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
import Templates from './Tabs/Templates'
import Repository from './Tabs/Repository'
import Utilities from './Tabs/Utilities'
import Documents from './Tabs/Documents/index'
import Professionals from './Tabs/Professionals'
import LawFirms from './Tabs/LawFirms'
import Grid from '@mui/material/Grid'


import { setBreadCrumbs, setBreadCrumbsAndCategory, setCPCRequest, setJurisdictionRequest, setSwitchAssetButton, setTimelineData, setTimelineRequest } from  '../../actions/patentTrackActions2' 
import { setAssetButton, setControlModal, setDashboardScreen, setTransactionButton, setViewDashboardIntial, updateViewDashboard } from '../../actions/uiActions'

import { resetAllRowSelect, resetItemList } from '../../utils/resizeBar' 
import NavigationIcon from '../../components/NavigationIcon'
import { controlList } from '../../utils/controlList'
import CategoryProducts from './Tabs/CategoryProducts'
import { getShareLocationCode } from '../../utils/hashLocation'

const TABS = [
  { label: 'Slacks', value: 'slacks', component: Slacks },
  { label: 'Templates', value: 'templates', component: Templates },
  { label: 'Repository', value: 'repository', component: Repository },
  { label: 'Utilities', value: 'utilities', component: Utilities },
  { label: 'Users', value: 'users', component: Users },
  { label: 'Users', value: 'users/:code', component: Users },
  { label: 'Professionals', value: 'professionals', component: Professionals },
  { label: 'Documents', value: 'documents', component: Documents },
  { label: 'Category', value: 'category', component: CategoryProducts },
  {
    label: 'Companies', value: 'companies', children: [
      { label: 'Names', value: 'companies/names', component: CompaniesNames },
      { label: 'Names', value: 'companies/names:code', component: CompaniesNames },
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
  const [ openCategoryBar, setOpenCategoryBar ] = useState(false)
  const [ openTemplateBar, setOpenTemplateBar ] = useState(false)
  const [ openDocumentBar, setOpenDocumentBar ] = useState(false)
  const [ openUtilitiesBar, setOpenUtilitiesBar ] = useState(false)
  const [ openAddressBar, setOpenAddressBar ] = useState(false)
  const [ openLawfirmsBar, setOpenLawfirmsBar ] = useState(false)
  const [ openSlackBar, setOpenSlackBar ] = useState(false)
  const dashboardScreen = useSelector(state => state.ui.dashboardScreen)
  const viewDashboard = useSelector(state => state.ui.viewDashboard) 
  const profile = useSelector(store => (store.patenTrack.profile))
  const currentTab = useMemo(() => {
    let splittedPathname = location.pathname.split('/')
    if(process.env.REACT_APP_ENVIROMENT_MODE === 'KPI') {
      splittedPathname.splice(splittedPathname.length - 1 , 1 ) 
    }
    return splittedPathname.slice(2).join('/')
  }, [ location ])
 
  const initialOpenSubTabs = findTabViaChild(currentTab)
  const [ openSubTabs, setOpenSubTabs ] = useState(initialOpenSubTabs ? [ initialOpenSubTabs ] : [])

  console.log('currentTab', currentTab)

  useEffect(() => {
    if(profile?.user && profile.user?.role && profile.user.role.name != 'Admin') {
      handleHomeLink()
    }
  }, [profile])

  useEffect(() => {
    if(dashboardScreen === true) {
      dispatch(setDashboardScreen(false))
    }
  }, [dashboardScreen])

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
      case 'category':
        setOpenCategoryBar(true)
        break;
      case 'templates':
        setOpenTemplateBar(true)
        break;
      case 'repository':
        setOpenDocumentBar(true)
        break;
      case 'utilities':
        setOpenUtilitiesBar(true)
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
    setOpenCategoryBar(false)
    setOpenTemplateBar(false)
    setOpenDocumentBar(false)
    setOpenUtilitiesBar(false)
    setOpenAddressBar(false)
    setOpenLawfirmsBar(false)
    setOpenSlackBar(false)
  }

  const handleSlackLink = () => {
    resetAll()
    setOpenSlackBar(true)
    history.push('/settings/slacks')  
  }

  const handleTemplatesLink = () => {
    resetAll()
    setOpenTemplateBar(true)
    history.push('/settings/templates')  
  }

  const handleRepositoryLink = () => {
    resetAll()
    setOpenDocumentBar(true)
    history.push('/settings/repository')  
  }

  const handleUtilitiesLink = () => {
    resetAll()
    setOpenUtilitiesBar(true)
    history.push('/settings/utilities')  
  }

  const handleUsersLink = () => {
    resetAll()
    setOpenTeamBar(true)
    let codeShare = getShareLocationCode()
    history.push(`/settings/users${codeShare != '' ? '/'+codeShare : ''}`)  
  }

  const handleCategoryLink = () => {
    resetAll()
    setOpenCategoryBar(true)
    let codeShare = getShareLocationCode()
    history.push(`/settings/category${codeShare != '' ? '/'+codeShare : ''}`)  
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
    let codeShare = getShareLocationCode()
    history.push(`/settings/companies/names${codeShare != '' ? '/'+codeShare : ''}`)  
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
    const oldViewScreen = {
      ...viewDashboard,  
      line: false,
      gauge: process.env.REACT_APP_ENVIROMENT_MODE === 'DASHBOARD' ? true : false,
      jurisdictions: false,
      invention: false,
      sankey: false,
      kpi: process.env.REACT_APP_ENVIROMENT_MODE === 'DASHBOARD' ? false : true,
      timeline: false 
    }
    resetAllRowSelect(dispatch, resetItemList.resetAll)
    resetAllRowSelect(dispatch, resetItemList.clearOtherItems)
    dispatch(updateViewDashboard(oldViewScreen))
    dispatch(setViewDashboardIntial(false))  
    dispatch(setDashboardScreen(true)) 
    let codeShare = ''
    if(process.env.REACT_APP_ENVIROMENT_MODE === 'KPI') {
      const locationShare = window.location.pathname
      codeShare = '/' + locationShare.split('/').pop()
    } 
    history.push(`/dashboard${codeShare}`) 
    dispatch(setAssetButton(false))
    dispatch(setTransactionButton(false))
    dispatch(setJurisdictionRequest(false))
    dispatch(setCPCRequest(false))
    dispatch(setTimelineRequest(false))
    dispatch(setTimelineData([])) 
    const findIndex = controlList.findIndex( item => item.type == 'menu' && item.category == 'due_dilligence')
    if( findIndex !== -1 ) {
      //hideMenu(event, controlList[findIndex]) 
      dispatch(setBreadCrumbsAndCategory(controlList[findIndex]))  
      dispatch(setSwitchAssetButton( 0 ))
    }
    /* setTimeout(() => {
      dispatch(
        setBreadCrumbs('')
      )
      dispatch(setDashboardScreen(true)) 
    }, 500)  */
  }, [dispatch])

  const topToolBar = [
    /* {
      tooltip: 'Home',
      bar: openBar,
      click: handleHomeLink,
      t: 40
    }, */
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
      tooltip: 'Categories',
      bar: openCategoryBar,
      click: handleCategoryLink,
      t: 46
    },  
    /* {
      tooltip: 'Templates',
      bar: openTemplateBar,
      click: handleTemplatesLink,
      t: 41
    }, 
    {
      tooltip: 'Documents',
      bar: openDocumentBar,
      click: handleRepositoryLink,
      t: 42 
    },
    {
      tooltip: 'Utilities',
      bar: openUtilitiesBar,
      click: handleUtilitiesLink,
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
    }, */
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