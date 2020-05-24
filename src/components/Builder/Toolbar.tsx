import { Button, Flex } from '@chakra-ui/core'
import React, { FC } from 'react'

import { useBuilderDispatch, useBuilderState } from '../../context'

type ToolbarProps = {
  onRenderGIFClicked: any
}

export const Toolbar: FC<ToolbarProps> = ({ onRenderGIFClicked }) => {
  const { teleport, pause } = useBuilderState()
  const dispatch = useBuilderDispatch()

  return (
    <Flex>
      <Button
        onClick={() => {
          return dispatch({ type: 'setTeleport', teleport: !teleport })
        }}
      >
        Teleport
      </Button>
      <Button
        onClick={() => {
          return dispatch({ type: 'setPause', pause: !pause })
        }}
      >
        Pause
      </Button>
      <Button onClick={onRenderGIFClicked}>Download</Button>
    </Flex>
  )
}
