import React, { FC, useState } from 'react'

import { CODE_THEMES_DICT } from '../code-themes'
import {
  PreviewProvider,
  usePreviewState,
  useSnippetDispatch,
  useSnippetState,
} from '../context'
import { useRenderGIF } from '../hooks'
import { Box, Flex } from './core'
import { Panel } from './Panel'
import { Preview } from './Preview'
import { PreviewContainer } from './PreviewContainer'
import { Toolbar } from './Toolbar'

export const Builder: FC = () => {
  const {
    theme,
    backgroundColor,
    title,
    cycle,
    immediate,
    cycleSpeed,
    startingStep,
    steps,
  } = useSnippetState()
  const snippetDispatch = useSnippetDispatch()
  const { currentStep } = usePreviewState()
  const [previewKey, setPreviewKey] = useState(0)
  const [bind, renderGIFDispatch] = useRenderGIF()
  const themeObject = CODE_THEMES_DICT[theme]

  return (
    <PreviewProvider
      initialState={{ currentStep: startingStep }}
      key={previewKey}
    >
      <Box
        borderColor="gray.600"
        borderRadius="3px"
        borderWidth="2px"
        margin="0 auto"
        maxWidth="1000px"
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
        <Flex height="450px" justifyContent="center">
          <Panel
            containerStyleProps={{
              flex: 1,
              height: '100%',
              overflowY: 'auto',
            }}
            currentStep={currentStep}
            steps={steps}
            theme={theme}
          />
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
              onAnimationCycleEnd={() => {
                renderGIFDispatch({ type: 'stopRecording' })
              }}
              steps={steps}
              theme={theme}
            />
          </PreviewContainer>
        </Flex>
      </Box>
    </PreviewProvider>
  )
}
