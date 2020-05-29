import React, { FC } from 'react'

import { Box, IconButton, useColorMode } from './core'

type NavProps = {}

export const Nav: FC<NavProps> = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <Box position="fixed" right="8" top="8">
      <IconButton
        aria-label="Toggle color mode"
        icon={colorMode === 'dark' ? 'sun' : 'moon'}
        onClick={toggleColorMode}
      />
    </Box>
  )
}
