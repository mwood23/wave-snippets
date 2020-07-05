import { runWith } from 'firebase-functions'

import { createMedia } from './createMedia'

export * from './onUserCreate'

// eslint-disable-next-line import/no-commonjs
exports.createMedia = runWith({
  timeoutSeconds: 540,
  memory: '1GB',
})
  .region('us-east1')
  .https.onRequest(createMedia)
