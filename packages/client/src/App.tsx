import React, { FC } from 'react'
import { Switch } from 'react-router-dom'

import { PageRoute } from './components'
import { PrivateRoute } from './components/PrivateRoute'
import {
  AccountPage,
  DownloadPage,
  EmbedPage,
  GalleryPage,
  HomePage,
  MySnippetsPage,
  NotFoundPage,
} from './pages'

export const App: FC = () => (
  <Switch>
    <PrivateRoute exact component={AccountPage} path="/account" />
    <PrivateRoute exact component={GalleryPage} path="/gallery" />
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
    <PageRoute component={NotFoundPage} />
  </Switch>
)
