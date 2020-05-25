import React, { FC, useState } from 'react'

import { CODE_THEMES_DICT } from '../code-themes'
import {
  PreviewProvider,
  useSnippetDispatch,
  useSnippetState,
} from '../context'
import { useRenderGIF } from '../hooks'
import { Box, Divider, Flex } from './core'
// import { Editor } from './Editor'
import { Preview } from './Preview'
import { PreviewContainer } from './PreviewContainer'
import { PreviewStepSelector } from './PreviewStepSelector'
import { Toolbar } from './Toolbar'

export const Builder: FC = () => {
  const {
    theme,
    language,
    backgroundColor,
    title,
    cycle,
    immediate,
    cycleSpeed,
    startingStep,
    steps,
  } = useSnippetState()
  const snippetDispatch = useSnippetDispatch()
  const [previewKey, setPreviewKey] = useState(0)
  const [bind, renderGIFDispatch] = useRenderGIF()
  const themeObject = CODE_THEMES_DICT[theme]

  return (
    <PreviewProvider
      initialState={{ currentStep: startingStep }}
      key={previewKey}
    >
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
              cycle={cycle}
              cycleSpeed={cycleSpeed}
              immediate={immediate}
              language={language}
              onAnimationCycleEnd={() => {
                renderGIFDispatch({ type: 'stopRecording' })
              }}
              steps={steps}
              theme={theme}
            />
          </PreviewContainer>
        </Flex>
        <Divider />
        <PreviewStepSelector totalSteps={steps.length} />
      </Box>
    </PreviewProvider>
  )
}
