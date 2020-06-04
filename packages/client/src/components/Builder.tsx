import { SnippetDocument } from '@waves/shared'
import React, { ComponentType, FC, useState } from 'react'

import { CODE_THEMES_DICT } from '../code-themes'
import {
  PreviewProvider,
  SnippetProvider,
  usePreviewDispatch,
  usePreviewState,
  useSnippetDispatch,
  useSnippetState,
} from '../context'
import { useRenderGIF } from '../hooks'
import { Box, Flex, Text } from './core'
import { Panel } from './Panel'
import { Preview } from './Preview'
import { PreviewContainer } from './PreviewContainer'
import { TitleToolbar } from './TitleToolbar'
import { useCreateToast } from './Toast'
import { Toolbar } from './Toolbar'

type BuilderProps = {
  snippet?: SnippetDocument
}

export const BuilderComponent: FC = () => {
  const toast = useCreateToast()
  const {
    theme,
    backgroundColor,
    defaultWindowTitle,
    cycle,
    immediate,
    cycleSpeed,
    steps,
    springPreset,
    showLineNumbers,
    windowControlsType,
    windowControlsPosition,
    name,
  } = useSnippetState()
  const snippetDispatch = useSnippetDispatch()
  const previewDispatch = usePreviewDispatch()
  const { currentStep } = usePreviewState()
  const [previewKey, setPreviewKey] = useState(0)
  const [bind, renderGIFDispatch, { isLoading }] = useRenderGIF({
    imageCaptureConfig: {
      filter: (n: any) => {
        if (n.className) {
          const className = String(n.className)
          if (className.includes('eliminateOnRender')) {
            return false
          }
        }
        return true
      },
    },
    onRecordStart: () => {
      toast(
        <Box>
          <Text>Recording your snippet...</Text>
        </Box>,
      )
      console.log('Recording started...')
    },
    onBuildGIFStart: () => {
      toast(
        <Box>
          <Text>Building your GIF...</Text>
        </Box>,
      )
      console.log('Gif building started...')
    },
    onRenderComplete: (blob) => {
      const link = document.createElement('a')
      const prefix = name ?? 'waves'

      link.href = URL.createObjectURL(blob)
      link.download = `${prefix}.gif`
      document.body.appendChild(link)
      link.click()
      link.remove()

      previewDispatch({
        type: 'resetPreviewState',
      })
    },
  })
  const themeObject = CODE_THEMES_DICT[theme]

  return (
    <Box
      borderColor="gray.600"
      borderRadius="3px"
      borderWidth="2px"
      margin="0 auto"
      maxWidth="1000px"
      padding="4"
      width="100%"
    >
      <TitleToolbar />
      <Toolbar
        downloadLoading={isLoading}
        onRenderGIFClicked={() => {
          // Reset the component because we don't know what step the user is at or if we're mid animation
          previewDispatch({
            type: 'updatePreviewState',
            isPlaying: true,
          })
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
          key={previewKey}
          onTitleChanged={(e: any) =>
            snippetDispatch({
              type: 'updateSnippetState',
              defaultWindowTitle: e.target.value,
            })
          }
          title={defaultWindowTitle}
          windowBackground={themeObject.theme.colors.background}
          windowControlsPosition={
            windowControlsPosition ?? themeObject.windowControlsPosition
          }
          windowControlsType={
            windowControlsType ?? themeObject.windowControlsType
          }
        >
          <Preview
            cycle={cycle}
            cycleSpeed={cycleSpeed}
            immediate={immediate}
            onAnimationCycleEnd={() => {
              renderGIFDispatch({ type: 'stopRecording' })
            }}
            showLineNumbers={showLineNumbers}
            springPreset={springPreset}
            steps={steps}
            theme={theme}
          />
        </PreviewContainer>
      </Flex>
    </Box>
  )
}

const withSnippetProvider = <P extends BuilderProps>(
  Component: ComponentType<P>,
): FC<P> => (props) => (
  <SnippetProvider snippet={props.snippet}>
    <Component {...props} />
  </SnippetProvider>
)

const withPreviewProvider = <P extends BuilderProps>(
  Component: ComponentType<P>,
): FC<P> => (props) => {
  const { startingStep } = useSnippetState()

  return (
    <PreviewProvider initialState={{ currentStep: startingStep }}>
      <Component {...props} />
    </PreviewProvider>
  )
}

export const Builder: FC<BuilderProps> = withSnippetProvider(
  withPreviewProvider(BuilderComponent),
)
