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
