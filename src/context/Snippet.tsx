import React, { Dispatch, FC, createContext, useReducer } from 'react'
import { RGBColor } from 'react-color'

import { DEFAULT_PREVIEW_THEME } from '../const'
import { UnreachableCaseError, noop, omit } from '../utils'

export type BackgroundColor = RGBColor

type SnippetState = {
  teleport: boolean
  theme: string
  language: string
  backgroundColor: BackgroundColor
  title: string
}

type SnippetAction =
  | ({
      type: 'updateSnippetState'
    } & Partial<SnippetState>)
  | {
      type: 'resetSnippetState'
    }

const initialSnippetState: SnippetState = {
  teleport: false,
  theme: DEFAULT_PREVIEW_THEME,
  language: 'typescript',
  backgroundColor: {
    r: 51,
    g: 197,
    b: 173,
    a: 100,
  },
  title: '',
}

const SnippetStateContext = createContext<SnippetState>(initialSnippetState)
const SnippetDispatchContext = createContext<Dispatch<SnippetAction>>(noop)

const snippetReducer = (state: SnippetState, action: SnippetAction) => {
  switch (action.type) {
    case 'updateSnippetState':
      return { ...state, ...omit(['type'], action) }
    case 'resetSnippetState':
      return { ...initialSnippetState }

    default:
      // eslint-disable-next-line no-case-declarations
      const { type } = action
      throw new UnreachableCaseError(type)
  }
}

export const SnippetProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(snippetReducer, initialSnippetState)

  return (
    <SnippetStateContext.Provider value={state}>
      <SnippetDispatchContext.Provider value={dispatch}>
        {children}
      </SnippetDispatchContext.Provider>
    </SnippetStateContext.Provider>
  )
}

export const useSnippetState = () => {
  const context = React.useContext(SnippetStateContext)
  if (context === undefined) {
    throw new Error('useSnippetState must be used within a SnippetProvider')
  }
  return context
}
export const useSnippetDispatch = () => {
  const context = React.useContext(SnippetDispatchContext)
  if (context === undefined) {
    throw new Error('useSnippetDispatch must be used within a SnippetProvider')
  }
  return context
}
