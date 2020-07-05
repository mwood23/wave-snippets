import { useGet } from '@typesaurus/react'
import { snippets } from '@waves/shared'
import React, { FC } from 'react'
import { RouteComponentProps } from 'react-router-dom'

import { Box, Spinner } from '../components'
import { StandaloneSnippet } from '../components/StandaloneSnippet'

type EmbedPageProps = {} & RouteComponentProps<{ snippetID: string }>

export const EmbedPage: FC<EmbedPageProps> = ({
  match: {
    params: { snippetID },
  },
}) => {
  const snippet = useGet(snippets, snippetID)

  if (!snippet) {
    return <Spinner superCentered />
  }

  return (
    <Box>
      <StandaloneSnippet snippet={snippet} />
    </Box>
  )
}
