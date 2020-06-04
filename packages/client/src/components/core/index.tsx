/**
 * This is where all third party components will be exported from. This extra abstraction is here
 * for when we need to alter or migrate to a new design system. It also gives us an extra layer to add
 * defaults or enhance given components before being used in the application code.
 *
 * NOTE: useToast in Chakra is busted because we're on the new version of React Spring. Use useToaster instead
 * https://github.com/bmcmahen/toasted-notes/issues/16
 */
import { Spinner as SpinnerCore, SpinnerProps } from '@chakra-ui/core'
import React, { FC } from 'react'

export * from '@chakra-ui/core'

export const Spinner: FC<
  SpinnerProps & {
    /**
     * Center and element vertical and horizontal to it's nearest relatively positioned ancestor.
     */
    superCentered?: boolean
  }
> = ({ superCentered = false, ...props }) => (
  <SpinnerCore
    {...(superCentered
      ? {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }
      : {})}
    {...props}
  />
)
