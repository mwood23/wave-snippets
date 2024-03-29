import { useInfiniteQuery, useInfiniteScroll } from '@typesaurus/react'
import { SnippetDocument, snippets } from '@waves/shared'
import React, { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Doc, Query, where } from 'typesaurus'

import { Box, Flex, IconButton, Link, Spinner, Text } from './core'
import { SnippetTags } from './SnippetTags'
import { StandaloneSnippet } from './StandaloneSnippet'

type SnippetsListItemProps = {
  snippet: Doc<SnippetDocument>
}

export const SnippetsListItem: FC<SnippetsListItemProps> = ({ snippet }) => {
  const {
    data: { tags, updatedOn, createdOn, name },
    ref: { id },
  } = snippet

  return (
    <Box
      display="flex"
      flexDir="column"
      padding="2"
      width={['100%', '100%', '100%', '50%']}
    >
      <Box borderRadius="4px" borderWidth="1px" height="100%" overflow="hidden">
        <RouterLink to={`/${id}`}>
          <StandaloneSnippet cycle playOn="hover" snippet={snippet} />
        </RouterLink>
        <Box overflow="hidden">
          <Box p="6">
            <Box
              alignItems="center"
              d="flex"
              justifyContent="space-between"
              mb="4"
            >
              <Box display="flex">
                <IconButton
                  as={RouterLink}
                  icon="edit"
                  size="sm"
                  // @ts-ignore
                  to={`/${id}`}
                />
              </Box>
              <Box
                color="gray.500"
                fontSize="xs"
                fontWeight="semibold"
                letterSpacing="wide"
                ml="2"
                textTransform="uppercase"
              >
                Updated:{' '}
                {updatedOn?.toLocaleDateString() ??
                  createdOn?.toLocaleDateString()}
              </Box>
            </Box>
            <Box
              isTruncated
              as="h4"
              fontWeight="semibold"
              lineHeight="tight"
              mb="4"
            >
              {name}
            </Box>
            <Box>
              <SnippetTags showCloseButton={false} tags={tags} />
            </Box>
          </Box>
        </Box>
      </Box>
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
    method: 'desc',
    limit: 6,
  })
  useInfiniteScroll(0.3, loadMore)

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
