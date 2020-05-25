import React, { CSSProperties, FC } from 'react'

import {
  WINDOW_CONTROLS_TYPE_DICT,
  WindowControlsPosition,
  WindowControlsType,
} from '../code-themes'
import { Box, Flex, Input } from './core'

export type WindowTitleBarProps = {
  windowControlsType: WindowControlsType
  windowControlsPosition?: WindowControlsPosition
  title?: string
  onTitleChanged: ((event: React.FormEvent<any>) => void) &
    ((event: React.ChangeEvent<HTMLInputElement>) => void)
  inputStyle?: CSSProperties
}

export const WindowTitleBar: FC<WindowTitleBarProps> = ({
  windowControlsType,
  windowControlsPosition = 'left',
  title,
  onTitleChanged,
  inputStyle,
}) => {
  const WindowControls = WINDOW_CONTROLS_TYPE_DICT[windowControlsType]

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Box minWidth="60px">
        {windowControlsPosition === 'left' && <WindowControls />}
      </Box>
      <Input
        onChange={onTitleChanged}
        style={inputStyle}
        textAlign="center"
        value={title}
        variant="unstyled"
        width="180px"
      />
      <Box minWidth="60px">
        {windowControlsPosition === 'right' && <WindowControls />}
      </Box>
    </Flex>
  )
}
