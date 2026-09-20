import React, { useMemo} from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing"; 

import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from './lib/queryClient'
import { StyledEngine } from './styledEngine'
import * as serviceWorker from './serviceWorker'

import store from './reducers/store/configureStore'

// Vendor stylesheets are hoisted here, ahead of our own, on purpose.
//
// Several app rules override a vendor rule at EQUAL specificity, so source
// order alone picks the winner - e.g. `.dashboardIntroTooltip {min-width:450px}`
// against intro.js's own `.introjs-tooltip {min-width:250px}`. CRA emitted
// index.css last and ours won. Vite orders CSS by the module graph, so a sheet
// imported deep inside a component landed AFTER index.css and started winning
// instead, which is what shrank the walkthrough tooltip to 250px. Importing
// them from the entry pins them first wherever else they are imported.
// Keep this block above the two app sheets below.
// FontAwesome 4's class-based icons (`<i className="fa fa-angle-double-right">`).
// Distinct from @fortawesome/react-fontawesome, which renders its own SVG and
// needs no stylesheet - which is why dropping this package went unnoticed: the
// 15 class-based icons simply rendered at zero width, among them the `»`
// separator in every breadcrumb. master imported it from CustomTab and Loader.
import 'font-awesome/css/font-awesome.min.css'
import 'intro.js/introjs.css'
import 'vis-timeline/styles/vis-timeline-graph2d.min.css'
import 'react-quill/dist/quill.snow.css'

import './styles/tailwind.css'
import './index.css'

/* Sentry.init({
  dsn: "https://9b208378541b4e1ca9201363140d27f4@o4504419505012736.ingest.sentry.io/4504419571466240",
  integrations: [
    new Integrations.BrowserTracing(),
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});  */



const AppWrapper = () => { 
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <StyledEngine/>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
}

ReactDOM.render(<AppWrapper />, document.getElementById('root'))
serviceWorker.register()
//serviceWorker.unregister();
