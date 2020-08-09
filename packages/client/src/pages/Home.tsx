import styled from '@emotion/styled'
import { SnippetDocument, snippets } from '@waves/shared'
import React, { FC, useEffect, useState } from 'react'
import { RouteComponentProps, useHistory, useLocation } from 'react-router-dom'
import { get } from 'typesaurus'

import {
  Builder,
  Hero,
  Message,
  Page,
  Spinner,
  useCreateToast,
} from '../components'
import { useGlobalState } from '../context'
import { TEMPLATES_DICT } from '../templates'
import { generateID, isMatchParamATemplate } from '../utils'

const StyledMobileWarningMessage = styled(Message)`
  @media (min-width: 700px) {
    display: none;
  }
`

export const HomePage: FC<RouteComponentProps<
  { snippetID: string },
  any,
  { skipSnippetFetch?: boolean }
>> = ({
  match: {
    params: { snippetID },
  },
}) => {
  const [data, setData] = useState<SnippetDocument | undefined>(
    // @ts-ignore Undefined is ok
    snippetID ? TEMPLATES_DICT[snippetID] : undefined,
  )
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const location = useLocation()
  // Don't want to jank the page on the autocreate redirect. This gives a better
  // user experience although it's gross.
  const [builderKey, setBuilderKey] = useState(generateID())
  const toast = useCreateToast()
  const { skipSnippetFetch } = useGlobalState()

  const isTemplateURL = isMatchParamATemplate(snippetID)

  const shouldSkipSnippetFetch =
    location.pathname === '/' || isTemplateURL || !snippetID || skipSnippetFetch

  useEffect(() => {
    if (shouldSkipSnippetFetch) return

    const getData = async () => {
      setLoading(true)
      const data = await get(snippets, snippetID).catch(() => {
        toast(
          'Permission denied. Do you have access for the requested snippet?',
        )

        history.push('/')
        setLoading(false)
      })
      if (data) {
        setData(data.data)
        setLoading(false)
      }
    }

    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snippetID])

  useEffect(() => {
    if (location.pathname === '/' || isTemplateURL) {
      // @ts-ignore
      setData(snippetID ? TEMPLATES_DICT[snippetID] : undefined)
      setBuilderKey(generateID())
    }
  }, [location.pathname, isTemplateURL, snippetID])

  return (
    <Page>
      <Hero />
      <StyledMobileWarningMessage
        content="Use desktop for the best experience!"
        title="Mobile support experimental"
      />
      {loading ? (
        <Spinner superCentered />
      ) : (
        <Builder key={builderKey} snippet={data} />
      )}
    </Page>
  )
}
