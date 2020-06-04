import React, { FC } from 'react'

import { Box } from './core'

export const Page: FC = ({ children }) => (
  <Box flex="1" mb="8" mt="12">
    {children}
  </Box>
)
