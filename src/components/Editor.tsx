import { Box, BoxProps, Text } from '@chakra-ui/core'
import React, { FC } from 'react'

export const Editor: FC<BoxProps> = ({ ...rest }) => {
  return (
    <Box {...rest}>
      <Text>Stufffs</Text>
    </Box>
  )
}
