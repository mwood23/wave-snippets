import { firestore } from 'firebase-admin'
import { auth } from 'firebase-functions'

import { reportError } from './utils/errors'
import { db } from './utils/store'

const increment = firestore.FieldValue.increment(1)

export const createProfile = async (userRecord: auth.UserRecord) => {
  const usersRef = db.collection('users').doc(userRecord.uid)
  const totalsRef = db.collection('aggregations').doc('totals')

  let firstName = ''
  let lastName = ''
  if (userRecord.displayName) {
    const splitName = userRecord.displayName.split(/(\s+)/)
    firstName = splitName[0] ?? ''
    lastName = splitName[2] ?? ''
  }

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
