import { UserDocument } from '@waves/shared'
import React, { FC, createContext, useEffect, useState } from 'react'

import { useCreateToast } from '../components'
import { firebase } from '../config/firebase'

type UnauthedState = {
  isAuthed: false
  isLoading: boolean
  user: null
}

type AuthedState = {
  isAuthed: true
  isLoading: boolean
  user: UserDocument
}

export type AuthState = UnauthedState | AuthedState

export type AuthDispatch = {
  logout: () => Promise<void>
}

export const initialAuthState: AuthState = {
  isAuthed: false,
  isLoading: true,
  user: null,
}

const AuthStateContext = createContext<AuthState>(initialAuthState)
const AuthDispatchContext = createContext<AuthDispatch>({
  logout: () => Promise.resolve(),
})

export const AuthProvider: FC = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState)
  const toast = useCreateToast()

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    let unsubscribeFromUserListener = () => {}

    const unsubscribe = firebase.auth().onAuthStateChanged(async (userAuth) => {
      if (!userAuth) {
        setAuthState({
          isAuthed: false,
          isLoading: false,
          user: null,
        })
      } else {
        const db = firebase.firestore()
        unsubscribeFromUserListener = await db
          .collection('users')
          .doc(userAuth.uid)
          .onSnapshot(
            (doc) => {
              const userInfo = doc.data()

              // @ts-ignore
              console.log(firebase.auth().currentUser.getIdToken())

              // We don't handle the error case because when a user is created a cloud function is fired and
              // sometimes it doesn't complete by the time this is called. However, since it's a subscription
              // it'll eventually come through for us.
              if (userInfo) {
                setAuthState({
                  isAuthed: true,
                  isLoading: false,
                  user: userInfo as UserDocument,
                })
              }
            },
            (e) => {
              toast(`Error: ${e.message}`)
            },
          )
      }
    })

    return () => {
      unsubscribe()
      unsubscribeFromUserListener()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthStateContext.Provider value={authState}>
      <AuthDispatchContext.Provider
        value={{
          logout: async () => {
            await firebase.auth().signOut()

            // Refresh the page to clear out the cache and make sure everything took holt
            window.location.href = '/'
          },
        }}
      >
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  )
}

export const useAuthState = () => {
  const context = React.useContext(AuthStateContext)
  if (context === undefined) {
    throw new Error('useAuthState must be used within a AuthProvider')
  }
  return context
}
export const useAuthDispatch = () => {
  const context = React.useContext(AuthDispatchContext)
  if (context === undefined) {
    throw new Error('useAuthDispatch must be used within a AuthProvider')
  }
  return context
}
