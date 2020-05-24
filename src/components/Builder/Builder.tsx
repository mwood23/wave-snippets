import { Box, Flex } from '@chakra-ui/core'
import React, { FC, useState } from 'react'

import { useBuilderState } from '../../context'
import { useRenderGIF } from '../../hooks'
import { Editor } from '../Editor'
import { Preview } from '../Preview'
import { Toolbar } from './Toolbar'

const testSteps = [
  {
    code: `var x1 = 1\ndebugger`,
    focus: '2',
    lang: 'js',
  },
  {
    code: `var x0 = 3
var x1 = 1
var x0 = 3`,
    lang: 'js',
  },
  {
    code: `var x0 = 3
var x1 = 1
var x1 = 1
var x0 = 3`,
    lang: 'js',
  },
]

export const Builder: FC = () => {
  const { pause, teleport } = useBuilderState()
  const [previewKey, setPreviewKey] = useState(0)
  const [bind, dispatch] = useRenderGIF()

  return (
    <Box
      border="2px solid white"
      borderRadius="2px"
      margin="0 auto"
      padding="4"
      width="700px"
    >
      <Toolbar
        onRenderGIFClicked={() => {
          // Reset the component because we don't know what step the user is at or if we're mid animation
          setPreviewKey(Math.random())
          dispatch({ type: 'startRecording' })
        }}
      />
      <Flex>
        <Editor flex={1} />
        <Preview
          {...bind}
          key={previewKey}
          onAnimationCycleEnd={() => {
            dispatch({ type: 'stopRecording' })
          }}
          pause={pause}
          steps={testSteps}
          teleport={teleport}
        />
      </Flex>
    </Box>
  )
}
