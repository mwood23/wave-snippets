import React, { FC } from 'react'

import { Hero, Page } from '../components'
import { SnippetsList } from '../components/SnippetsList'

export const GalleryPage: FC = () => (
  <Page>
    <Hero />
    <SnippetsList />
  </Page>
)
