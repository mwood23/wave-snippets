import { config } from 'firebase-functions'

export const WAVE_DOWNLOAD_URL = config().env.downloadurl
export const CLOUD_FUNCTIONS_URL = config().env.cloudfunctionsurl
