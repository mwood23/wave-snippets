import styled from '@emotion/styled'
import { SnippetDocument, snippets } from '@waves/shared'
import React, { FC, useEffect, useRef, useState } from 'react'
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
  const toast = useCreateToast()

  // Skip fetch when redirecting from an autosave. Aka from / to /:snippetID
  const shouldSkipFetch = !initialSnippetID.current || !snippetID

  // Reset the builder when from /:snippetID to / (clicking the logo to take you home)
  const shouldResetBuilder = !!initialSnippetID.current && !snippetID

  console.log({
    shouldSkipFetch,
    shouldResetBuilder,
  })

  useEffect(() => {
    if (shouldResetBuilder) {
      // Reset ref too!
      initialSnippetID.current = undefined
      setData(undefined)
    }
  }, [setData, shouldResetBuilder])

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
  }, [snippetID, shouldSkipFetch])

  console.log(data)
  return (
    <Page>
      <Hero />
      <StyledMobileWarningMessage
        content="Rendering GIFs in the browser from DOM elements takes a lot of
          resources. Use desktop for the best experience!"
        title="Mobile support experimental"
      />
      {loading ? (
        <Spinner superCentered />
      ) : !data ? (
        <>
          {console.log('in here')}
          <Builder />
        </>
      ) : (
        <Builder snippet={data} />
      )}
    </Page>
  )
}
