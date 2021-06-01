import React, { Fragment } from 'react'
import { Switch, Route } from 'react-router-dom'
import DashBoard from './components/DashBoard/DashBoard'
import DashBoard2 from './components/DashBoard2'
import Settings from './components/SettingsPage'

import Review from './components/Review'
import Correct from './components/Correct'
import InProgress from './components/InProgress'
import InSight from './components/InSight'
import Resources from './components/Resources'
import Record from './components/Record'
import BigScreen from './components/BigScreen'
import DueDilligence from './components/DueDilligence'
import Search from './components/Search'
import GlobalScreen from './components/GlobalScreen'

import Auth from './components/auth'
import AuthSlack from './components/AuthSlack'

import routeList from './routeList'
import MainLayout from './layout/MainLayout'
import BlankLayout from './layout/BlankLayout'
import GlobalLayout from './layout/GlobalLayout'

const pages = [
  //Authenticated  pages   
  {
    exact: true,
    path: routeList.insights,
    component: InSight,
    layout: BlankLayout
  },
  {
    exact: true,
    path: routeList.resources,
    component: Resources,
    layout: BlankLayout
  },
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
    path: routeList.search,
    component: GlobalScreen,
    layout: GlobalLayout,
    type: 2
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
    path: routeList.correct_details,
    component: GlobalScreen,
    layout: GlobalLayout,
    type: 1
  }
] 

export default (
  <Switch>
    {/* <Route path="/dashboard" component={DashBoard} />
    <Route path="/dashboard2" component={DashBoard2} /> */}
    {pages.map(
      ({ exact, path, type, component: Component, layout: Layout }, index) => (
        <Route
          key={index}
          exact={exact}
          path={path}
          render={props => (
            <Layout history={props.history} type={type}>
              <Component {...props} type={type} />
            </Layout>
          )}
        />
      )
    )}
    <Route path="/settings" component={Settings} />

    <Route path="/reset/:token" component={Auth} />
    <Route path="/auth" component={Auth} />
    <Route path="/slack" component={AuthSlack} />    
  </Switch>
)