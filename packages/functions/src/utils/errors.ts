/**
 * Pulled from here: https://github.com/httptoolkit/accounts/blob/master/src/errors.ts
 */
import { captureException, captureMessage, flush, init } from '@sentry/node'

import { SENTRY_DSN } from '../const'

type Handler = (...args: any[]) => void

let sentryInitialized = false
export function initSentry() {
  if (SENTRY_DSN) {
    init({
      dsn: SENTRY_DSN,
    })
    sentryInitialized = true
  }
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
