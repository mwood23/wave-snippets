import styled from '@emotion/styled'
import { SnippetDocument, snippets } from '@waves/shared'
import React, { FC, useEffect, useRef, useState } from 'react'
import { usePrevious } from 'react-delta'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import { get } from 'typesaurus'

import {
  Builder,
  Hero,
  Message,
  Page,
  Spinner,
  useCreateToast,
} from '../components'
import { TEMPLATES_DICT } from '../templates'
import { isMatchParamTemplate } from '../utils'

const StyledMobileWarningMessage = styled(Message)`
  @media (min-width: 700px) {
    display: none;
  }
`

export const HomePage: FC<RouteComponentProps<
  { snippetID: string },
  any,
  { skipFetch?: boolean }
>> = ({
  match: {
    params: { snippetID },
  },
}) => {
  const [data, setData] = useState<SnippetDocument>()
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const initialSnippetID = useRef<string | undefined>(snippetID)
  const previousSnippetID = usePrevious(snippetID)
  const toast = useCreateToast()

  const isTemplateURL = isMatchParamTemplate(snippetID)

  // Skip fetch when redirecting from an autosave. Aka from / to /:snippetID or if using a template
  const shouldSkipFetch =
    !initialSnippetID.current || !snippetID || isTemplateURL

  // Reset the builder when from /:snippetID to / (clicking the logo to take you home)
  const shouldResetBuilder =
    (!!initialSnippetID.current && !snippetID) || isTemplateURL

  useEffect(() => {
    if (shouldResetBuilder) {
      // Reset ref too!
      initialSnippetID.current = undefined
      setData(undefined)
    }
  }, [setData, shouldResetBuilder, snippetID])

  useEffect(() => {
    // We want to skip this fetch when we redirect from an auto-create
    if (shouldSkipFetch) return

    const getData = async () => {
      setLoading(true)
      const data = await get(snippets, snippetID).catch((e) => {
        console.log(e)
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
  }, [snippetID, shouldSkipFetch])

  return (
    <Page>
      <Hero />
      <StyledMobileWarningMessage
        content="Use desktop for the best experience!"
        title="Mobile support experimental"
      />
      {loading ? (
        <Spinner superCentered />
      ) : // @ts-ignore
      isTemplateURL || isMatchParamTemplate(previousSnippetID) ? (
        // @ts-ignore Doing check for safety above
        <Builder snippet={TEMPLATES_DICT[snippetID]} />
      ) : !data ? (
        <Builder />
      ) : (
        <Builder snippet={data} />
      )}
    </Page>
  )
}
