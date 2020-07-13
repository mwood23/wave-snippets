import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { auth, region, runWith } from 'firebase-functions'

import { createMedia } from './createMedia'
import { createProfile } from './onUserCreate'
import { queueCreateExport } from './queueCreateExport'
import { catchErrors, initSentry } from './utils/errors'
import { addUserIfExists } from './utils/validateFirebaseIdToken'

initSentry()

// Sad day...
// https://stackoverflow.com/questions/49104012/firebase-functions-chain-middleware
const createMediaApp = express()

createMediaApp.use(cors({ origin: true }))
createMediaApp.use(cookieParser())
createMediaApp.use(addUserIfExists)
createMediaApp.get('/create-media', catchErrors(createMedia))

// eslint-disable-next-line import/no-commonjs
exports.export = runWith({
  timeoutSeconds: 540,
  memory: '2GB',
})
  .region('us-east1')
  // @ts-ignore
  .https.onRequest(createMediaApp)

// Separate because the functions need to be ran with different memory
const queueApp = express()

queueApp.use(cors({ origin: true }))
queueApp.use(cookieParser())
queueApp.get('/media-export', catchErrors(queueCreateExport))

// eslint-disable-next-line import/no-commonjs
exports.queue = region('us-east1').https.onRequest(queueApp)

export const createUser = auth.user().onCreate(catchErrors(createProfile))
