import React, { Fragment } from 'react'

import { Switch, Route } from 'react-router-dom'
import Settings from './components/SettingsPage'

 
import Reports from './components/Reports'
import MainDashboard from './components/MainDashboard' 

import routeList from './routeList'


/* import CorrectLayout from './components/CorrectLayout'  */

import Googlelogin from './components/common/Googlelogin' 

import Auth from './components/auth'
import AuthSlack from './components/AuthSlack' 
import AuthMicrosoft from './components/AuthMicrosoft' 
import GlobalLayout from './layout/GlobalLayout'
import BlankLayout from './layout/BlankLayout'
import PatentLayout from './components/PatentLayout' 
import GlobalScreen from './components/GlobalScreen'

let dashboardPages = [
  {
    exact: false,
    path: routeList.dashboard_share,
    component: MainDashboard,
    layout: GlobalLayout,
    type: 1
  },
  {
    exact: true,
    path: routeList.dashboard_kpi,
    component: MainDashboard,
    layout: GlobalLayout,
    type: 1
  },
  {
    exact: true,
    path: routeList.dashboard_attention,
    component: MainDashboard,
    layout: GlobalLayout,
    type: 1
  },
  {
    exact: true,
    path: routeList.dashboard_activity,
    component: MainDashboard,
    layout: GlobalLayout,
    type: 1
  },
  {
    exact: true,
    path: routeList.default,
    component: MainDashboard,
    layout: GlobalLayout,
    type: 1
  },
  
]

let pages = [
  //Authenticated  pages    
  
  {
    exact: false,
    path: routeList.duedilligence,
    component: GlobalScreen,
    layout: GlobalLayout, 
    type: 1
  },
  {
    exact: true,
    path: routeList.reports,
    component: Reports,
    layout: GlobalLayout,
    type: 2
  },
  {
    exact: true,
    path: routeList.search,
    component: GlobalScreen,
    layout: GlobalLayout,
    type: 3
  },
  {
    exact: true,
    path: routeList.global,
    component: GlobalScreen,
    layout: GlobalLayout,
    type: 1
  },
  {
    exact: true,
    path: routeList.assignments,
    component: GlobalScreen,
    layout: GlobalLayout,
    type: 1
  },
  {
    exact: false,
    path: routeList.assignments_layouts,
    component: GlobalScreen,
    layout: GlobalLayout,
    type: 1
  },
  {
    exact: false,
    path: routeList.assignments_layouts_share,
    component: GlobalScreen,
    layout: GlobalLayout,
    type: 1
  },
  {    
    exact: true,
    path: routeList.invent,
    component: GlobalScreen,
    layout: GlobalLayout,
    type: 5
  },
  {    
    exact: true,
    path: routeList.restore_ownership,
    component: GlobalScreen,
    layout: GlobalLayout,
    type: 1
  },
  {    
    exact: true,
    path: routeList.clear_encumbrances,
    component: GlobalScreen,
    layout: GlobalLayout,
    type: 1
  },
  {    
    exact: true,
    path: routeList.pay_maintainence_fee,
    component: PatentLayout,
    layout: GlobalLayout,
    type: 0
  },
  {    
    exact: true,
    path: routeList.pay_maintainence_fee_share,
    component: PatentLayout,
    layout: GlobalLayout,
    type: 0
  },
  {    
    exact: true,
    path: routeList.patent_assets,
    component: PatentLayout,
    layout: GlobalLayout, 
    type: 1
  },
  {    
    exact: false,
    path: routeList.patent_assets_layouts,
    component: PatentLayout,
    layout: GlobalLayout, 
    type: 1
  },
  {    
    exact: false,
    path: routeList.patent_assets_layouts_share,
    component: PatentLayout,
    layout: GlobalLayout, 
    type: 1
  },
  /* {    
    exact: true,
    path: routeList.correct_details,
    component: CorrectLayout,
    layout: GlobalLayout, 
    type: 1
  },
  {    
    exact: true,
    path: routeList.correct_address,
    component: CorrectLayout,
    layout: GlobalLayout, 
    type: 1
  }, */
  {    
    exact: true,
    path: routeList.review_foreign_assets,
    component: GlobalScreen,
    layout: GlobalLayout,
    type: 9
  },
  {
    exact: true,
    path: routeList.google_login,
    component: Googlelogin,
    layout: BlankLayout,
    childWindow: 1
  }
] 

if(process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' || process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD') {
  if(process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD') {
    dashboardPages = []
  }
  pages = [  
    {
      exact: true,
      path: routeList.standard_default,
      component: PatentLayout,
      layout: GlobalLayout,
      type: 1
    },
  ] 
} else  if(process.env.REACT_APP_ENVIROMENT_MODE === 'DASHBOARD' /*  || process.env.REACT_APP_ENVIROMENT_MODE === 'KPI' */) {
  pages = [  
    {
      exact: true,
      path: routeList.standard_default,
      component: MainDashboard,
      layout: GlobalLayout,
      type: 1
    },
  ] 
} else if (process.env.REACT_APP_ENVIROMENT_MODE === 'KPI') { 
  dashboardPages.push(
    {
      exact: true,
      path: routeList.standard_default,
      component: MainDashboard,
      layout: GlobalLayout,
      type: 1
    })
}
 

export default (
  <Switch>
    {/* <Route path="/dashboard" component={DashBoard} />
    <Route path="/dashboard2" component={DashBoard2} /> */}
    {dashboardPages.map(
      ({ exact, path, type, childWindow, component: Component, layout: Layout }, index) => (
        <Route
          key={index}
          exact={exact}
          path={path}
          render={props => (
            <Layout history={props.history} type={type} standalone={childWindow}>
              <Component {...props} type={type} />
            </Layout>
          )}
        />
      )
    )}
    {pages.map(
      ({ exact, path, type, childWindow, component: Component, layout: Layout }, index) => ( 
          <Route
            key={index}
            exact={exact}
            path={path}
            render={props => (
              <Layout history={props.history} type={type} standalone={childWindow}>
                <Component {...props} type={type} />
              </Layout>
            )}
          />  
      )
    )}
    <Route path="/slack" component={AuthSlack} />
    <Route path="/microsoft" component={AuthMicrosoft} />
    {
      ['PRO', 'KPI'].includes(process.env.REACT_APP_ENVIROMENT_MODE)
      ?
        <Fragment>
          <Route path="/settings" component={Settings} />
          
          <Route path="/reset/:token" component={Auth} />
          <Route path="/auth" component={Auth} />       
        </Fragment>
      :
      ''
    }        
  </Switch>
)