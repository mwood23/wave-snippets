import { SnippetDocument, snippets } from '@waves/shared'
import React, { FC, useEffect, useState } from 'react'
import { RouteComponentProps, useHistory, useLocation } from 'react-router-dom'
import { get } from 'typesaurus'

import { Builder, Hero, Page, Spinner, useCreateToast } from '../components'

export const HomePage: FC<RouteComponentProps<
  { snippetID: string },
  any,
  { skipFetch?: boolean }
>> = ({
  match: {
    params: { snippetID },
  },
  location: { state },
}) => {
  const [data, setData] = useState<SnippetDocument>()
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const location = useLocation()
  const toast = useCreateToast()

  useEffect(() => {
    // Clear history after the initial redirect
    if (state?.skipFetch) {
      history.replace(location.pathname, null)
    }
  }, [state?.skipFetch])

  useEffect(() => {
    // We want to skip this fetch when we redirect from an auto-create
    if (!snippetID || state?.skipFetch) return

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
  }, [snippetID, state])

  console.log(data)

  return (
    <Page>
      <Hero />
      {state?.skipFetch ? (
        <Builder />
      ) : loading && !data ? (
        <Spinner superCentered />
      ) : (
        <Builder snippet={data} />
      )}
    </Page>
  )
}
