import { auth as admin_auth, firestore, initializeApp } from 'firebase-admin'
import { config } from 'firebase-functions'

initializeApp(config().firebase)

export const db = firestore()
export const auth = admin_auth()
