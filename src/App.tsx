import React, { FC } from 'react'
import { Switch } from 'react-router-dom'

import { PageRoute } from './components'
import { HomePage } from './pages'

export const App: FC = () => {
  return (
    <Switch>
      <PageRoute component={HomePage} path="/" />
    </Switch>
  )
}
