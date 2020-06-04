import React, { FC } from 'react'
import { where } from 'typesaurus'

import { Hero, Page } from '../components'
import { SnippetsList } from '../components/SnippetsList'
import { useAuthState } from '../context'

export const MySnippetsPage: FC = () => {
  const { user } = useAuthState()

  return (
    <Page>
      <Hero />
      <SnippetsList query={[where('owner', '==', user!.userID)]} />
    </Page>
  )
}
