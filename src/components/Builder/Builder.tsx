import React, { FC, useState } from 'react'

import { CODE_THEMES_DICT } from '../../code-themes'
import { useBuilderDispatch, useBuilderState } from '../../context'
import { useRenderGIF } from '../../hooks'
import { Box, Flex } from '../core'
// import { Editor } from '../Editor'
import { Preview } from '../Preview'
import { PreviewContainer } from '../PreviewContainer'
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
  const {
    pause,
    teleport,
    theme,
    language,
    backgroundColor,
    title,
  } = useBuilderState()
  const builderDispatch = useBuilderDispatch()
  const [previewKey, setPreviewKey] = useState(0)
  const [bind, renderGIFDispatch] = useRenderGIF()
  const themeObject = CODE_THEMES_DICT[theme]

  return (
    <Box
      border="2px solid white"
      borderRadius="2px"
      margin="0 auto"
      maxWidth="900px"
      padding="4"
      width="100%"
    >
      <Toolbar
        onRenderGIFClicked={() => {
          // Reset the component because we don't know what step the user is at or if we're mid animation
          setPreviewKey(Math.random())
          renderGIFDispatch({ type: 'startRecording' })
        }}
      />
      <Flex justifyContent="center">
        {/* <Editor flex={1} /> */}
        <PreviewContainer
          {...bind}
          backgroundColor={backgroundColor}
          onTitleChanged={(e: any) => {
            return builderDispatch({
              type: 'updateBuilderState',
              title: e.target.value,
            })
          }}
          title={title}
          windowBackground={themeObject.theme.colors.background}
          windowControlsPosition={themeObject.windowControlsPosition}
          windowControlsType={themeObject.windowControlsType}
        >
          <Preview
            key={previewKey}
            language={language}
            onAnimationCycleEnd={() => {
              renderGIFDispatch({ type: 'stopRecording' })
            }}
            pause={pause}
            steps={testSteps}
            teleport={teleport}
            theme={theme}
          />
        </PreviewContainer>
      </Flex>
    </Box>
  )
}
