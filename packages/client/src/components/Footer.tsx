import React, { FC } from 'react'
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom'

import { Box, Flex, Link, LinkProps, Text } from './core'

type FooterProps = {}

const WavesFooterLink: FC<LinkProps> = ({ children, ...props }) => (
  <Link mr="4" {...props}>
    {children}
  </Link>
)

const InternalLink: FC<LinkProps & RouterLinkProps> = ({
  children,
  ...props
}) => (
  <WavesFooterLink
    // @ts-ignore
    as={RouterLink}
    {...props}
  >
    {children}
  </WavesFooterLink>
)

export const Footer: FC<FooterProps> = () => (
  <Flex
    alignItems="center"
    flexDir="column"
    justifyContent="center"
    pb="8"
    pt="4"
    px="4"
  >
    <Flex alignItems="center" justifyContent="center" mb="2">
      <InternalLink to="/about">About</InternalLink>
      <WavesFooterLink
        isExternal
        href="mailto:hi@marcuswood.io?subject=Wave Snippets Feedback"
      >
        Feedback
      </WavesFooterLink>
      <InternalLink to="/terms-and-conditions">Terms</InternalLink>
      <InternalLink to="/privacy-policy">Privacy</InternalLink>
    </Flex>
    <Box>
      <Text>
        created by{' '}
        <WavesFooterLink isExternal href="https://www.marcuswood.io">
          Marcus Wood
        </WavesFooterLink>
      </Text>
    </Box>
  </Flex>
)
