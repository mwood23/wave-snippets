import { collection } from 'typesaurus'

export type LikeCollection = 'snippets'

export type LikeDocument = {
  snippetID: string
  userID: string
  likedAt: string
  collection: LikeCollection
}

export const likes = collection<LikeDocument>('likes')
