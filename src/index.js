import React, { useMemo} from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing"; 

import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { StyledEngine } from './styledEngine'
import * as serviceWorker from './serviceWorker'

import store from './reducers/store/configureStore'
import './index.css'

/* Sentry.init({
  dsn: "https://b3f7c9d9c8b74a4fa5a9d8f0d97d5b7b@o487723.ingest.sentry.io/5546842",
  integrations: [
    new Integrations.BrowserTracing(),
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
}); */



const AppWrapper = () => { 
  return (
    <Provider store={store}>
      <Router>
        <StyledEngine/>
      </Router>
    </Provider>
  );
}

ReactDOM.render(<AppWrapper />, document.getElementById('root'))
serviceWorker.register()
//serviceWorker.unregister();
