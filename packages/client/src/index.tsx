import 'react-toastify/dist/ReactToastify.css'

import './index.css'

import { CSSReset, ColorModeProvider, ThemeProvider } from '@chakra-ui/core'
import createCache from '@emotion/cache'
import { CacheProvider, Global } from '@emotion/core'
import { init } from '@sentry/browser'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'

import { App } from './App'
import { ScrollToTop, ToastContainer } from './components'
import { AuthProvider, GlobalProvider } from './context'
import { unregister } from './serviceWorker'
import { customTheme } from './theme'

// TODO: When we add an error boundary we'll need to start recording errors there.
if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_SENTRY_DSN) {
  init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    environment: process.env.NODE_ENV,
  })
}

const myCache = createCache()
myCache.compat = true

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ScrollToTop />
      <CacheProvider value={myCache}>
        <ThemeProvider theme={customTheme}>
          <ColorModeProvider value={'dark'}>
            <CSSReset />
            <ToastContainer />
            {/* Code surfer relies on Theme-UI which hijacks some global elements. We need to take the control
          back so that Chakra can be our single source of truth. */}
            <Global
              styles={{
                body: {
                  backgroundColor: 'transparent !important',
                  color: 'inherit !important',
                },
              }}
            />
            {/* Putting at root for now because not sure what this turns into. Can move down later if we only use it in the builder. */}
            <GlobalProvider>
              <AuthProvider>
                <App />
              </AuthProvider>
            </GlobalProvider>
          </ColorModeProvider>
        </ThemeProvider>
      </CacheProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
unregister()
