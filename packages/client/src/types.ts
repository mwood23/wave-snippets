import { SnippetDocument } from '@waves/shared'
import { Optional } from 'utility-types'

export type BaseSnippet = Optional<
  SnippetDocument,
  'owner' | 'createdOn' | 'updatedOn'
>
