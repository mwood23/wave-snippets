import React, { FC } from 'react'

import { Box, BoxProps, Text } from './core'

export const Editor: FC<BoxProps> = ({ ...rest }) => {
  return (
    <Box {...rest}>
      <Text>Stufffs</Text>
    </Box>
  )
}
