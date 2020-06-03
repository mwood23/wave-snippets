import React, { FC } from 'react'
import { Switch } from 'react-router-dom'

import { PageRoute } from './components'
import { PrivateRoute } from './components/PrivateRoute'
import { AccountPage, HomePage, NotFoundPage } from './pages'

export const App: FC = () => (
  <Switch>
    <PageRoute exact component={HomePage} path="/" />
    <PrivateRoute exact component={AccountPage} path="/account" />

    <PageRoute component={NotFoundPage} />
  </Switch>
)
