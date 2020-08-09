import React, { ComponentType, FC } from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'

import { useAuthState } from '../context'
import { Spinner } from './core'
import { PageRoute, PageRouteProps } from './PageRoute'

export type PrivateRouteProps = RouteProps &
  PageRouteProps & {
    component: ComponentType<any>
  }

export const PrivateRoute: FC<PrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const { user, isLoading } = useAuthState()

  if (isLoading) {
    return <Spinner superCentered />
  }

  return (
    <Route
      render={(props) =>
        user ? (
          <PageRoute {...rest} {...props} component={Component} />
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  )
}
