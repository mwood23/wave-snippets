import styled from '@emotion/styled/macro'
import { SnippetDocument } from '@waves/shared'
import React, { ComponentType, FC } from 'react'

import { CODE_THEMES_DICT } from '../code-themes'
import {
  BUILDER_MOBILE_BREAKPOINT,
  BUILDER_MOBILE_TINY_BREAKPOINT,
} from '../const'
import {
  PreviewProvider,
  SnippetProvider,
  usePreviewState,
  useSnippetDispatch,
  useSnippetState,
} from '../context'
import { Box, Flex, Text } from './core'
import { Panel } from './Panel'
import { Preview } from './Preview'
import { PreviewContainer } from './PreviewContainer'
import { TitleToolbar } from './TitleToolbar'
import { Toolbar } from './Toolbar'

type BuilderProps = {
  snippet?: SnippetDocument
}

const StyledBuilder = styled(Box)`
  @media (max-width: ${BUILDER_MOBILE_TINY_BREAKPOINT}) {
    border: none;
    padding: 0;
  }
`
const StyledBuilderContent = styled(Flex)`
  @media (max-width: ${BUILDER_MOBILE_BREAKPOINT}) {
    flex-direction: column-reverse;
    height: auto;
  }
`
const PreviewWrapper = styled.div`
  overflow-x: auto;

  @media (max-width: ${BUILDER_MOBILE_TINY_BREAKPOINT}) {
    margin: 0 -1rem;
  }
`

const MobileHelperText = styled(Text)`
  @media (min-width: ${BUILDER_MOBILE_TINY_BREAKPOINT}) {
    display: none;
  }
`

export const BuilderComponent: FC = () => {
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
    showBackground,
  } = useSnippetState()
  const snippetDispatch = useSnippetDispatch()
  const { currentStep } = usePreviewState()
  const themeObject = CODE_THEMES_DICT[theme]

  return (
    <StyledBuilder
      borderColor="gray.600"
      borderRadius="3px"
      borderWidth="2px"
      margin="0 auto"
      maxWidth="1200px"
      padding="4"
      width="100%"
    >
      <TitleToolbar />
      <Toolbar />
      <StyledBuilderContent height="450px" justifyContent="center">
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
        <Box>
          <PreviewWrapper>
            <PreviewContainer
              backgroundColor={backgroundColor}
              onTitleChanged={(e: any) =>
                snippetDispatch({
                  type: 'updateSnippetState',
                  defaultWindowTitle: e.target.value,
                })
              }
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
                cycle={cycle}
                cycleSpeed={cycleSpeed}
                immediate={immediate}
                showLineNumbers={showLineNumbers}
                springPreset={springPreset}
                steps={steps}
                theme={theme}
              />
            </PreviewContainer>
          </PreviewWrapper>
          <MobileHelperText fontSize={'xs'} mt="2" textAlign="center">
            Scroll left and right!
          </MobileHelperText>
        </Box>
      </StyledBuilderContent>
    </StyledBuilder>
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
