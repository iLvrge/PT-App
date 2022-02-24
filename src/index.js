import React, { useMemo } from 'react'
import ReactDOM from 'react-dom'

import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

import { BrowserRouter as Router } from 'react-router-dom'
import { createTheme, adaptV4Theme } from '@mui/material';
import { Provider } from 'react-redux'

import * as serviceWorker from './serviceWorker'
import App from './components/App'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'

import store from './reducers/store/configureStore'
import './index.css'
import { SnackbarProvider } from 'notistack'

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
  const theme = useMemo(
    () =>
      createTheme(adaptV4Theme({
        palette: {
          mode: 'dark',
        },
      })),
    [],
  )

  return (
    <Provider store={store}>
      <Router>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3}>
              <CssBaseline />
              <App />
            </SnackbarProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </Router>
    </Provider>
  );
}

ReactDOM.render(<AppWrapper />, document.getElementById('root'))
serviceWorker.register()
//serviceWorker.unregister();
