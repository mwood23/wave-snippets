import { useInfiniteQuery, useInfiniteScroll } from '@typesaurus/react'
import { SnippetDocument, snippets } from '@waves/shared'
import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Doc, Query, where } from 'typesaurus'

import { CODE_THEMES_DICT } from '../code-themes'
import { PreviewProvider } from '../context'
import { Box, Flex, Link, Spinner, Text } from './core'
import { Preview } from './Preview'
import { PreviewContainer } from './PreviewContainer'

type SnippetsListItemProps = {
  snippet: Doc<SnippetDocument>
}

export const SnippetsListItem: FC<SnippetsListItemProps> = ({
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
    <Box padding="2" width="50%">
      <PreviewProvider>
        <PreviewContainer
          readOnly
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
    </Box>
  )
}

type SnippetsListProps = {
  /**
   * For for certain snippets. Defaults to all public snippets.
   */
  query?: Query<SnippetDocument, keyof SnippetDocument>[]
}

export const SnippetsList: FC<SnippetsListProps> = ({
  query = [where('visibility', '==', 'public')],
}) => {
  const [snips, loadMore] = useInfiniteQuery(snippets, query, {
    field: 'updatedOn',
    method: 'asc',
    limit: 4,
  })
  useInfiniteScroll(0.3, loadMore)

  console.log(snips)

  return (
    <Flex flexWrap="wrap" width="100%">
      {snips ? (
        snips.length === 0 ? (
          <Text>
            No snippets available. {/*
            // @ts-ignore */}
            <Link as={RouterLink} to="/">
              Create one?
            </Link>
          </Text>
        ) : (
          snips.map((snippet) => (
            <SnippetsListItem key={snippet.ref.id} snippet={snippet} />
          ))
        )
      ) : (
        <Spinner superCentered />
      )}
    </Flex>
  )
}
