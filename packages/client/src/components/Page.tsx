import React, { FC } from 'react'

import { Box, BoxProps } from './core'

export const Page: FC<BoxProps> = ({ children, ...rest }) => (
  <Box
    flex="1"
    marginX="auto"
    maxWidth="1200px"
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
