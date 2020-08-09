import React, { FC } from 'react'

import { Box, BoxProps } from './core'

export type PageProps = BoxProps & {
  /**
   * Squeezes the container a bit for word heavy pages to make it easier to read.
   *
   * @default
   * false
   */
  wordyPage?: boolean
}

export const Page: FC<PageProps> = ({
  children,
  wordyPage = false,
  ...rest
}) => (
  <Box
    flex="1"
    marginX="auto"
    maxWidth={wordyPage ? '700px' : '1200px'}
    // If you change this make sure to update the builder negative margin!
    paddingX={['1rem', '1rem', '2rem']}
    pb="8"
    pt="16"
    width="100%"
    {...rest}
  >
    {children}
  </Box>
)
