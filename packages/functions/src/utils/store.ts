import {
  auth as admin_auth,
  storage as firebaseStorage,
  firestore,
  initializeApp,
} from 'firebase-admin'
import { config } from 'firebase-functions'

initializeApp(config().firebase)

export const db = firestore()
export const auth = admin_auth()
export const storage = firebaseStorage()
