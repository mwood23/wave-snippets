import React, { FC } from 'react'

import { Builder, Hero, Page } from '../components'

export const HomePage: FC = () => {
  return (
    <Page>
      <Hero />
      <Builder />
    </Page>
  )
}
