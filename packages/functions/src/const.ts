import { config } from 'firebase-functions'

export const CLIENT_URL = config().env.clienturl
export const WAVE_DOWNLOAD_URL = `${CLIENT_URL}/download`
export const CLOUD_FUNCTIONS_URL = config().env.cloudfunctionsurl
export const SENTRY_DSN = config().env.sentrydsn
