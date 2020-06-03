import React, { ComponentType, FC } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Redirect, Route, RouteProps } from 'react-router-dom'

import { firebase } from '../config/firebase'
import { Spinner } from './core'
import { PageRouteProps } from './PageRoute'

export type PrivateRouteProps = RouteProps &
  PageRouteProps & {
    component: ComponentType<any>
  }

export const PrivateRoute: FC<PrivateRouteProps> = ({
  component: Component,
  ...rest
}) => {
  const [user, loading, error] = useAuthState(firebase.auth())

  console.log(user)

  if (loading) {
    return (
      <Spinner
        left="50%"
        position="absolute"
        top="50%"
        transform="translate(-50%,-50%)"
      />
    )
  }

  if (error) {
    return <div>Error</div>
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? (
          <Component {...props} />
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
