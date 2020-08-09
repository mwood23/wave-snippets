import { firestore } from 'firebase-admin'
import { auth } from 'firebase-functions'

import { parseName } from './utils'
import { reportError } from './utils/errors'
import { db } from './utils/store'

const increment = firestore.FieldValue.increment(1)

export const createProfile = async (userRecord: auth.UserRecord) => {
  const usersRef = db.collection('users').doc(userRecord.uid)
  const totalsRef = db.collection('aggregations').doc('totals')

  const [firstName, lastName] = parseName(userRecord.displayName)

  const batch = db.batch()
  batch.set(usersRef, {
    userID: userRecord.uid,
    created: firestore.FieldValue.serverTimestamp(),
    lastLogin: null,
    email: userRecord.email,
    displayName: userRecord.displayName,
    firstName,
    lastName,
    photoURL: userRecord.photoURL,
    phoneNumber: userRecord.phoneNumber,
    isDisabled: userRecord.disabled,
    features: {},
    tier: 'free',
  })
  batch.set(totalsRef, { users: increment }, { merge: true })

  return batch.commit().catch((e) => {
    console.log('User created failed!', e)

    reportError(e)
  })
}
