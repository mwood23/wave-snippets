import { CSSReset, ColorModeProvider, ThemeProvider } from '@chakra-ui/core'
import { Global } from '@emotion/core'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider as ThemeUIThemeProvider } from 'theme-ui'

import { App } from './App'
import { ScrollToTop } from './components'
import { PreviewProvider, SnippetProvider } from './context'
import { unregister } from './serviceWorker'
import { customTheme } from './theme'

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ScrollToTop />
      <ThemeUIThemeProvider theme={{}}>
        <ThemeProvider theme={customTheme}>
          <ColorModeProvider value={'dark'}>
            <CSSReset />
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
            <SnippetProvider>
              <PreviewProvider>
                <App />
              </PreviewProvider>
            </SnippetProvider>
          </ColorModeProvider>
        </ThemeProvider>
      </ThemeUIThemeProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
unregister()
