import { Box } from '@chakra-ui/core'
import React, { FC } from 'react'

export const Page: FC = ({ children }) => {
  return (
    <Box mb="8" mt="24">
      {children}
    </Box>
  )
}
