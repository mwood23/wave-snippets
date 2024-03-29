/**
 * This is where all third party components will be exported from. This extra abstraction is here
 * for when we need to alter or migrate to a new design system. It also gives us an extra layer to add
 * defaults or enhance given components before being used in the application code.
 *
 * NOTE: useToast in Chakra is busted because we're on the new version of React Spring. Use useToaster instead
 * https://github.com/bmcmahen/toasted-notes/issues/16
 */
import {
  Icon,
  Link as LinkCore,
  LinkProps,
  Spinner as SpinnerCore,
  SpinnerProps,
  useColorMode,
} from '@chakra-ui/core'
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

export const Link: FC<LinkProps> = ({ children, ...rest }) => {
  const { colorMode } = useColorMode()
  const color = { light: 'cyan.600', dark: 'cyan.400' }

  return (
    <LinkCore color={color[colorMode]} {...rest}>
      {children} {rest.isExternal && <Icon mx="2px" name="external-link" />}
    </LinkCore>
  )
}
