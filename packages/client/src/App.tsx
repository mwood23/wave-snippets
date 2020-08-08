import React, { FC } from 'react'
import { Redirect, Switch } from 'react-router-dom'

import { PageRoute } from './components'
import { PrivateRoute } from './components/PrivateRoute'
import {
  AboutPage,
  DownloadPage,
  EmbedPage,
  HomePage,
  MySnippetsPage,
  PrivacyPolicyPage,
  TermsAndConditionsPage,
} from './pages'

export const App: FC = () => (
  <Switch>
    <PageRoute exact component={AboutPage} path="/about" />
    <PageRoute exact component={PrivacyPolicyPage} path="/privacy-policy" />
    <PageRoute
      exact
      component={TermsAndConditionsPage}
      path="/terms-and-conditions"
    />
    <PrivateRoute exact component={MySnippetsPage} path="/my-snippets" />
    <PageRoute
      exact
      component={EmbedPage}
      path="/embed/:snippetID"
      showFooter={false}
      showNav={false}
    />
    <PageRoute
      exact
      component={DownloadPage}
      path="/download/:snippetID"
      showFooter={false}
      showNav={false}
    />

    <PageRoute exact component={HomePage} path="/:snippetID?" />

    {/* Technically this never gets called cause of how we scope snippets. Weird, but not the worst I reckon. */}
    <Redirect to="/" />
  </Switch>
)
