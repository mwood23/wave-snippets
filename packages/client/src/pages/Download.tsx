import { useGet } from '@typesaurus/react'
import { snippets } from '@waves/shared'
import React, { FC, useRef } from 'react'
import { RouteComponentProps } from 'react-router-dom'

import { CODE_THEMES_DICT } from '../code-themes'
import { Preview, PreviewContainer, Spinner } from '../components'
import { PreviewProvider } from '../context'

type DownloadPageProps = {} & RouteComponentProps<{ snippetID: string }>

export const DownloadPage: FC<DownloadPageProps> = ({
  match: {
    params: { snippetID },
  },
}) => {
  const snippet = useGet(snippets, snippetID)
  const previewRef = useRef<HTMLDivElement>()

  if (!snippet) {
    return <Spinner superCentered />
  }

  const {
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
      showBackground,
    },
  } = snippet

  const themeObject = CODE_THEMES_DICT[theme]
  return (
    <PreviewProvider>
      <PreviewContainer
        readOnly
        responsive
        backgroundColor={backgroundColor}
        showBackground={showBackground}
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
          onAnimationCycleEnd={() => {
            // Putting at this level since it's the innermost of the divs. Not sure if puppeteer would do something
            // weird otherwise.
            previewRef.current?.classList.add('snippet-preview-complete')
          }}
          playOnInit={true}
          ref={previewRef}
          showLineNumbers={showLineNumbers}
          springPreset={springPreset}
          steps={steps}
          theme={theme}
        />
      </PreviewContainer>
    </PreviewProvider>
  )
}
