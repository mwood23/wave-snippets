import { SnippetDocument } from '@waves/shared'
import React, { FC } from 'react'
import { Doc } from 'typesaurus'

import { CODE_THEMES_DICT } from '../code-themes'
import { PreviewProvider } from '../context'
import { Preview } from './Preview'
import { PreviewContainer } from './PreviewContainer'

export type StandaloneSnippetProps = {
  snippet: Doc<SnippetDocument>
}

export const StandaloneSnippet: FC<StandaloneSnippetProps> = ({
  snippet: {
    data: {
      backgroundColor,
      cycle,
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
}) => {
  const themeObject = CODE_THEMES_DICT[theme]

  return (
    <PreviewProvider>
      <PreviewContainer
        readOnly
        responsive
        backgroundColor={backgroundColor}
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
          responsive
          cycle={cycle}
          cycleSpeed={cycleSpeed}
          immediate={immediate}
          playOnInit={true}
          showLineNumbers={showLineNumbers}
          springPreset={springPreset}
          steps={steps}
          theme={theme}
        />
      </PreviewContainer>
    </PreviewProvider>
  )
}
