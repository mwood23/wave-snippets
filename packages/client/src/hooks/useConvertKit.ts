import { captureException } from '@sentry/browser'
import { useLocation } from 'react-router-dom'

import { useCreateToast } from '../components'
import { getReferrer } from '../utils'

export const useConvertKit = () => {
  const toast = useCreateToast()
  const location = useLocation()

  const subscribeToConvertKit = async (email: string) => {
    try {
      const referrer = getReferrer()
      const bodyString = JSON.stringify({
        email_address: email,
        tags: ['1715347'], // This scopes them to wave-snippets
        fields: {
          referrer: referrer.url,
          referrer_params: referrer.params,
          subscribed_url: location.pathname,
        },
      })

      const response = await fetch(
        'https://app.convertkit.com/forms/1514201/subscriptions',
        {
          method: 'post',
          body: bodyString,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        },
      )

      const json = await response.json()

      if (json.status === 'success') {
        return
      }

      toast('Could not subscribe you to the list. Please try again.')
    } catch (err) {
      toast('Could not subscribe you to the list. Please try again.')

      captureException(err)
    }
  }

  return [subscribeToConvertKit]
}
