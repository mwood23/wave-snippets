import { SnippetDocument } from '@waves/shared'
import React, { FC } from 'react'
import { Doc } from 'typesaurus'

import { CODE_THEMES_DICT } from '../code-themes'
import { PreviewProvider, usePreviewDispatch } from '../context'
import { Preview } from './Preview'
import { PreviewContainer } from './PreviewContainer'

export type StandaloneSnippetProps = {
  snippet: Doc<SnippetDocument>
  playOn?: 'init' | 'hover'
  cycle?: boolean
}

export const StandaloneSnippetComponent: FC<StandaloneSnippetProps> = ({
  snippet: {
    data: {
      backgroundColor,
      cycleSpeed,
      immediate,
      showLineNumbers,
      springPreset,
      steps,
      windowControlsPosition,
      windowControlsType,
      theme,
      defaultWindowTitle,
    },
  },
  playOn = 'init',
  cycle,
}) => {
  const themeObject = CODE_THEMES_DICT[theme]
  const dispatch = usePreviewDispatch()

  return (
    <PreviewContainer
      readOnly
      responsive
      backgroundColor={backgroundColor}
      title={defaultWindowTitle}
      windowBackground={themeObject.theme.colors.background}
      windowControlsPosition={
        windowControlsPosition ?? themeObject.windowControlsPosition
      }
      windowControlsType={windowControlsType ?? themeObject.windowControlsType}
      {...(playOn === 'hover'
        ? {
            onMouseEnter: () =>
              dispatch({ type: 'updatePreviewState', isPlaying: true }),
            onMouseLeave: () =>
              dispatch({ type: 'updatePreviewState', isPlaying: false }),
          }
        : {})}
    >
      <Preview
        responsive
        cycle={cycle}
        cycleSpeed={cycleSpeed}
        immediate={immediate}
        playOnInit={playOn === 'init'}
        showLineNumbers={showLineNumbers}
        springPreset={springPreset}
        steps={steps}
        theme={theme}
      />
    </PreviewContainer>
  )
}

export const StandaloneSnippet: FC<StandaloneSnippetProps> = (props) => (
  <PreviewProvider>
    <StandaloneSnippetComponent {...props} />
  </PreviewProvider>
)
