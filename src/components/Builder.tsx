import React, { FC, useState } from 'react'

import { CODE_THEMES_DICT } from '../code-themes'
import {
  usePreviewDispatch,
  usePreviewState,
  useSnippetDispatch,
  useSnippetState,
} from '../context'
import { useRenderGIF } from '../hooks'
import { Box, Divider, Flex } from './core'
// import { Editor } from './Editor'
import { Preview } from './Preview'
import { PreviewContainer } from './PreviewContainer'
import { StepSelector } from './StepSelector'
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
    teleport,
    theme,
    language,
    backgroundColor,
    title,
  } = useSnippetState()
  const { pause, currentStep } = usePreviewState()
  const previewDispatch = usePreviewDispatch()
  const snippetDispatch = useSnippetDispatch()
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
            return snippetDispatch({
              type: 'updateSnippetState',
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
            // onStepChange={(step) => {
            //   return previewDispatch({ type: 'setStep', step })
            // }}
            pause={pause}
            steps={testSteps}
            teleport={teleport}
            theme={theme}
          />
        </PreviewContainer>
      </Flex>
      <Divider />
      <StepSelector currentStep={currentStep} totalSteps={testSteps.length} />
    </Box>
  )
}
