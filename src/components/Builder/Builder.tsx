import React, { FC, useState } from 'react'

import { useBuilderState } from '../../context'
import { useRenderGIF } from '../../hooks'
import { Box, Flex } from '../core'
import { Editor } from '../Editor'
import { Preview } from '../Preview'
import { Toolbar } from './Toolbar'

const testSteps = [
  {
    code: `var x1: any = 1\ndebugger`,
    focus: '2',
  },
  {
    code: `var x0: any = 3
var x1 = 1
var x0 = 3`,
  },
  {
    code: `var x0: number = 3
var x1 = 1
var x1 = 1
var x0 = 3`,
  },
]

export const Builder: FC = () => {
  const { pause, teleport, theme, language } = useBuilderState()
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
          language={language}
          onAnimationCycleEnd={() => {
            dispatch({ type: 'stopRecording' })
          }}
          pause={pause}
          steps={testSteps}
          teleport={teleport}
          theme={theme}
        />
      </Flex>
    </Box>
  )
}
