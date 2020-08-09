import { collection } from 'typesaurus'

import { UserID } from '../types'

export type SnippetVisibility = 'unlisted' | 'public' | 'private'
export type SnippetStatus = 'draft' | 'published' | 'disabled'
export type WindowControlsType = 'blackAndWhite' | 'boxy' | 'rounded'
export type WindowControlsPosition = 'left' | 'right'

export type BackgroundColor = {
  a?: number
  b: number
  g: number
  r: number
}

// Pulled from source cause types aren't exported right
export type InputStep = {
  code: string
  focus?: string
  title: string
  subtitle: string
  showNumbers?: boolean
  lang: string
  id: string
}

export type SnippetDocument = {
  name?: string
  description?: string
  tags: string[]
  immediate: boolean
  theme: string
  defaultLanguage: string
  backgroundColor: BackgroundColor
  startingStep: number
  cycle: boolean
  steps: InputStep[]
  cycleSpeed: number
  springPreset: string
  showLineNumbers: boolean
  showBackground: boolean
  windowControlsType: WindowControlsType | null
  windowControlsPosition: WindowControlsPosition | null
  defaultWindowTitle: string
  visibility: SnippetVisibility
  owner: UserID
  createdOn?: Date
  updatedOn?: Date
  status: SnippetStatus
}

export const snippets = collection<SnippetDocument>('snippets')
