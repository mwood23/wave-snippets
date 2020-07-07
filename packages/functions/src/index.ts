import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { region, runWith } from 'firebase-functions'

import { createMedia } from './createMedia'
import { queueCreateExport } from './queueCreateExport'
import { addUserIfExists } from './utils/validateFirebaseIdToken'

// Sad day...
// https://stackoverflow.com/questions/49104012/firebase-functions-chain-middleware
const createMediaApp = express()

createMediaApp.use(cors({ origin: true }))
createMediaApp.use(cookieParser())
createMediaApp.use(addUserIfExists)
createMediaApp.get('/create-media', createMedia)

// eslint-disable-next-line import/no-commonjs
exports.export = runWith({
  timeoutSeconds: 540,
  memory: '2GB',
})
  .region('us-east1')
  // @ts-ignore
  .https.onRequest(createMediaApp)

// eslint-disable-next-line import/no-commonjs
exports.queueCreateExport = region('us-east1').https.onRequest(
  queueCreateExport,
)
