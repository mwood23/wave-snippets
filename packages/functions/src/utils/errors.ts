/**
 * Pulled from here: https://github.com/httptoolkit/accounts/blob/master/src/errors.ts
 */
import { captureException, captureMessage, flush, init } from '@sentry/node'

type Handler = (...args: any[]) => void

let sentryInitialized = false
export function initSentry() {
  init({
    dsn:
      'https://c51f36745b61415cb84e48d77cf3e26f@o180781.ingest.sentry.io/5317376',
    environment: process.env.REACT_APP_ENV,
  })
  sentryInitialized = true
}

export async function reportError(error: Error | string) {
  console.warn(error)
  if (!sentryInitialized) return

  if (typeof error === 'string') {
    captureMessage(error)
  } else {
    captureException(error)
  }

  await flush()
}

export function catchErrors(handler: Handler): Handler {
  return async function (_event) {
    try {
      // @ts-ignore
      // eslint-disable-next-line prefer-rest-params, no-invalid-this
      return await handler.call(this, ...arguments)
    } catch (e) {
      // Catches sync errors & promise rejections, because we're async
      await reportError(e)
      throw e
    }
  }
}
