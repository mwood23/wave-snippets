import { collection } from 'typesaurus'

export type Tiers = 'free'

export type UserDocument = {
  created: string
  displayName: string
  email: string
  features: {}
  firstName: string
  isDisabled: boolean
  lastLogin: string | null
  lastName: string
  phoneNumber: string | null
  photoURL: string | null
  tier: Tiers
  userID: string
}

export const users = collection<UserDocument>('users')
