import React, { Fragment, Suspense } from 'react'

import { Switch, Route } from 'react-router-dom'

import routeList from './routeList'
import lazyWithRetry from './utils/lazyWithRetry'
import ErrorBoundary from './components/common/ErrorBoundary'
import RouteFallback from './components/common/RouteFallback'
import RouteErrorFallback from './components/common/RouteErrorFallback'

// Layouts stay eager: every route renders one, so deferring them would only add
// a round trip before anything at all can paint.
import GlobalLayout from './layout/GlobalLayout'
import BlankLayout from './layout/BlankLayout'

// Eager on purpose — splitting these would not actually move any bytes out of
// the initial chunk, because both are already imported by eagerly-loaded modules:
//   Googlelogin   -> imported by NewHeader/ActionMenu and two SettingsPage tabs
//   AuthMicrosoft -> api/axiosSetup imports refreshMicrosoftToken from it
import Googlelogin from './components/common/Googlelogin'
import AuthMicrosoft from './components/AuthMicrosoft'

// Route-level split points. Each becomes its own chunk, fetched on navigation.
const Settings = lazyWithRetry(() => import('./components/SettingsPage'), 'SettingsPage')
const Reports = lazyWithRetry(() => import('./components/Reports'), 'Reports')
const MainDashboard = lazyWithRetry(() => import('./components/MainDashboard'), 'MainDashboard')
const PatentLayout = lazyWithRetry(() => import('./components/PatentLayout'), 'PatentLayout')
const GlobalScreen = lazyWithRetry(() => import('./components/GlobalScreen'), 'GlobalScreen')
const Auth = lazyWithRetry(() => import('./components/auth'), 'Auth')
const AuthSlack = lazyWithRetry(() => import('./components/AuthSlack'), 'AuthSlack')

/* import CorrectLayout from './components/CorrectLayout'  */

/**
 * Wraps a lazily-loaded route so that:
 *  - Suspense shows a loader while the chunk downloads
 *  - ErrorBoundary catches both a failed chunk fetch and a render error inside it
 *
 * The boundary sits OUTSIDE Suspense so it can catch the rejected import; the
 * loader sits inside the layout so the header and navigation stay on screen
 * while the route chunk is still arriving.
 *
 * Each Layout (e.g. GlobalLayout) injects a large bag of props into its
 * `children` via React.cloneElement, on the assumption that its direct child
 * IS the page component. Here it is actually this boundary, so without
 * forwarding `...rest` onto the real page component below, every one of those
 * props silently vanished — e.g. `checkChartAnalytics` reached MainDashboard
 * as undefined and threw "checkChartAnalytics is not a function" the moment
 * it rendered, taking the whole route down.
 */
const RouteBoundary = ({ children, ...rest }) => (
  <ErrorBoundary fallback={(state) => <RouteErrorFallback {...state} />}>
    <Suspense fallback={<RouteFallback />}>
      {React.isValidElement(children) ? React.cloneElement(children, rest) : children}
    </Suspense>
  </ErrorBoundary>
)

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

if (process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE') {
  // Add the SAMPLE default route FIRST
  pages.unshift({
    exact: true,
    path: routeList.standard_default,
    component: PatentLayout,
    layout: GlobalLayout,
    type: 1
  });

} else if(process.env.REACT_APP_ENVIROMENT_MODE === 'SAMPLE-1' || process.env.REACT_APP_ENVIROMENT_MODE === 'STANDARD') {
  dashboardPages = []
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
              <RouteBoundary>
                <Component {...props} type={type} />
              </RouteBoundary>
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
                <RouteBoundary>
                  <Component {...props} type={type} />
                </RouteBoundary>
              </Layout>
            )}
          />  
      )
    )}
    <Route
      path="/slack"
      render={props => (
        <RouteBoundary>
          <AuthSlack {...props} />
        </RouteBoundary>
      )}
    />
    <Route path="/microsoft" component={AuthMicrosoft} />
    {
      [ 'PRO', 'KPI' ].includes(process.env.REACT_APP_ENVIROMENT_MODE)
      ?
        <Fragment>
          <Route
            path="/settings"
            render={props => (
              <RouteBoundary>
                <Settings {...props} />
              </RouteBoundary>
            )}
          />

          <Route
            path="/reset/:token"
            render={props => (
              <RouteBoundary>
                <Auth {...props} />
              </RouteBoundary>
            )}
          />
          <Route
            path="/auth"
            render={props => (
              <RouteBoundary>
                <Auth {...props} />
              </RouteBoundary>
            )}
          />
        </Fragment>
      :
      ''
    }        
  </Switch>
)