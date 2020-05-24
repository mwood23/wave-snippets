import React, { FC } from 'react'
import { Route, RouteProps } from 'react-router-dom'

export const PageRoute: FC<RouteProps> = (props) => {
  return <Route {...props} />
}
