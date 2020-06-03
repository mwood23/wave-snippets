import React, { FC } from 'react'
import { Route, RouteProps } from 'react-router-dom'

import { Footer } from './Footer'
import { Nav } from './Nav'

export type PageRouteProps = RouteProps & {
  showNav?: boolean
  showFooter?: boolean
}

export const PageRoute: FC<PageRouteProps> = ({
  showNav = true,
  showFooter = true,
  render,
  component: Component,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) => (
      <>
        {showNav && <Nav />}
        {render ? (
          render({ ...rest, ...props })
        ) : (
          // @ts-ignore React router props appear to be wrong
          <Component {...rest} {...props} />
        )}
        {showFooter && <Footer />}
      </>
    )}
  />
)
