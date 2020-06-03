import React, { FC } from 'react'

import { Builder, Hero, Page } from '../components'

export const HomePage: FC = () => (
  <Page>
    <Hero />
    <Builder />
  </Page>
)
