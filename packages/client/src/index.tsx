import 'react-toastify/dist/ReactToastify.css'

import './index.css'

import { CSSReset, ColorModeProvider, ThemeProvider } from '@chakra-ui/core'
import createCache from '@emotion/cache'
import { CacheProvider, Global } from '@emotion/core'
import { init } from '@sentry/browser'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider as ThemeUIThemeProvider } from 'theme-ui'

import { App } from './App'
import { ScrollToTop, ToastContainer } from './components'
import { AuthProvider } from './context'
import { unregister } from './serviceWorker'
import { customTheme } from './theme'

// TODO: When we add an error boundary we'll need to start recording errors there.
if (process.env.NODE_ENV === 'production') {
  init({
    dsn:
      'https://27e96aefbcba4947a1ed1fc69a00fc87@o180781.ingest.sentry.io/5266266',
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
        <ThemeUIThemeProvider theme={{}}>
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
                  },
                }}
              />
              {/* Putting at root for now because not sure what this turns into. Can move down later if we only use it in the builder. */}
              <AuthProvider>
                <App />
              </AuthProvider>
            </ColorModeProvider>
          </ThemeProvider>
        </ThemeUIThemeProvider>
      </CacheProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
unregister()
