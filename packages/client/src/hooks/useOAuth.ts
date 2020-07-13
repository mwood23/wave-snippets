import { captureException } from '@sentry/browser'
import { useState } from 'react'

import { firebase } from '../config/firebase'
import { UnreachableCaseError } from '../utils'
import { useConvertKit } from './useConvertKit'

type EnabledProviders = 'google' | 'github'

type UseOAuthOptions = {
  provider: EnabledProviders
}

const getAuthProvider = (provider: EnabledProviders) => {
  switch (provider) {
    case 'github':
      return new firebase.auth.GithubAuthProvider()
    case 'google':
      return new firebase.auth.GoogleAuthProvider()
    default:
      throw new UnreachableCaseError(provider)
  }
}

export const useOAuth = ({
  provider,
}: UseOAuthOptions): [
  typeof loginCall,
  { loading: typeof loading; error: typeof error; data: typeof data },
] => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [data, setData] = useState<firebase.auth.UserCredential>()
  const [subscribeToNewsletter] = useConvertKit()

  const authProvider = getAuthProvider(provider)

  const loginCall = async () => {
    setLoading(true)

    const result = await firebase
      .auth()
      .signInWithPopup(authProvider)
      .catch(function (err) {
        setLoading(false)
        setError(err.message)

        captureException(err)
      })

    if (result) {
      setLoading(false)
      setData(result)

      if (result.additionalUserInfo?.isNewUser && result.user?.email) {
        subscribeToNewsletter(result.user?.email)
      }
    }
  }

  return [loginCall, { loading, error, data }]
}
