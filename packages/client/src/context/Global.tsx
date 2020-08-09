import React, {
  Dispatch,
  FC,
  createContext,
  useContext,
  useReducer,
} from 'react'

import { UnreachableCaseError, noop, omit } from '../utils'

type GlobalState = {
  skipSnippetFetch: boolean
}

type GlobalAction =
  | ({
      type: 'updateGlobalState'
    } & Partial<GlobalState>)
  | {
      type: 'resetGlobalState'
    }

const initialGlobalState: GlobalState = {
  /**
   * Helper to tell the home page to not query for a template after it has been autosaved.
   * This prevents loading jank and saves a request to the server. There is other logic for skipping
   * fetches like if the param is a template so check out packages/client/src/pages/Home.tsx for
   * everything.
   */
  skipSnippetFetch: false,
}

const GlobalStateContext = createContext<GlobalState | undefined>(undefined)
const GlobalDispatchContext = createContext<Dispatch<GlobalAction> | undefined>(
  undefined,
)

const globalReducer = (state: GlobalState, action: GlobalAction) => {
  switch (action.type) {
    case 'updateGlobalState':
      return { ...state, ...omit(['type'], action) }
    case 'resetGlobalState':
      return { ...initialGlobalState }

    default:
      // eslint-disable-next-line no-case-declarations
      const { type } = action
      throw new UnreachableCaseError(type)
  }
}

/**
 * Global state provides small helpers that need to be lifted to the top of the application.
 * Use this wisely and as a last resort!
 */
export const GlobalProvider: FC<{ initialState?: Partial<GlobalState> }> = ({
  children,
  initialState,
}) => {
  const [state, dispatch] = useReducer(globalReducer, {
    ...initialGlobalState,
    ...initialState,
  })

  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={dispatch ?? noop}>
        {children}
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  )
}

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext)
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalProvider')
  }
  return context
}
export const useGlobalDispatch = () => {
  const context = useContext(GlobalDispatchContext)
  if (context === undefined) {
    throw new Error('useGlobalDispatch must be used within a GlobalProvider')
  }
  return context
}
