import React, { FC } from 'react'

import { Box } from './core'

export const Page: FC = ({ children }) => {
  return (
    <Box mb="8" mt="16">
      {children}
    </Box>
  )
}
