import React, { FC } from 'react'

import { Box } from './core'

export const Page: FC = ({ children }) => (
  <Box
    flex="1"
    marginX="auto"
    maxWidth="1200px"
    padding="0 2rem"
    pb="8"
    pt="12"
    width="100%"
  >
    {children}
  </Box>
)
