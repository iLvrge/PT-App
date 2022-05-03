import React, { Fragment } from 'react'

import { Switch, Route } from 'react-router-dom'
import Settings from './components/SettingsPage'


import Search from './components/Search'
import Reports from './components/Reports'
import GlobalScreen from './components/GlobalScreen'
import CorrectLayout from './components/CorrectLayout' 
import PatentLayout from './components/PatentLayout' 
import Googlelogin from './components/common/Googlelogin' 

import Auth from './components/auth'
import AuthSlack from './components/AuthSlack'

import routeList from './routeList'
import GlobalLayout from './layout/GlobalLayout'
import BlankLayout from './layout/BlankLayout'

let pages = [
  //Authenticated  pages   
  
  {
    exact: false,
    path: routeList.maintainence,
    component: GlobalScreen,
    layout: GlobalLayout,
    type: 1
  },
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
    path: routeList.default,
    component: GlobalScreen,
    layout: GlobalLayout,
    type: 1
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
    component: GlobalScreen,
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
  },
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

if(process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE' || process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD' || process.env.REACT_APP_ENVIROMENT_MODE === 'DASHBOARD' ) {
  pages = [  
    {
      exact: true,
      path: routeList.standard_default,
      component: GlobalScreen,
      layout: GlobalLayout,
      type: 1
    },
  ] 
}

console.log("process.env.REACT_APP_ENVIROMENT_MODE", process.env.REACT_APP_ENVIROMENT_MODE, routeList)

export default (
  <Switch>
    {/* <Route path="/dashboard" component={DashBoard} />
    <Route path="/dashboard2" component={DashBoard2} /> */}
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
    {
      process.env.REACT_APP_ENVIROMENT_MODE === 'PRO'
      ?
        <>
        <Route path="/settings" component={Settings} />
        <Route path="/reset/:token" component={Auth} />
        <Route path="/auth" component={Auth} />        
        </>
      :
      ''
    }        
  </Switch>
)