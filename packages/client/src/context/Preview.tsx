import React, {
  Dispatch,
  FC,
  createContext,
  useContext,
  useReducer,
} from 'react'

import { UnreachableCaseError, noop, omit } from '../utils'

type PreviewState = {
  currentStep: number
  isPlaying: boolean
}

type PreviewAction =
  | {
      type: 'setStep'
      step: number
    }
  | ({
      type: 'updatePreviewState'
    } & Partial<PreviewState>)
  | {
      type: 'resetPreviewState'
    }

const initialPreviewState: PreviewState = {
  currentStep: 0,
  isPlaying: false,
}

const PreviewStateContext = createContext<PreviewState>(initialPreviewState)
const PreviewDispatchContext = createContext<Dispatch<PreviewAction>>(noop)

const previewReducer = (state: PreviewState, action: PreviewAction) => {
  switch (action.type) {
    case 'setStep':
      return { ...state, currentStep: action.step, isPlaying: false }
    case 'updatePreviewState':
      return { ...state, ...omit(['type'], action) }
    case 'resetPreviewState':
      return { ...initialPreviewState }

    default:
      // eslint-disable-next-line no-case-declarations
      const { type } = action
      throw new UnreachableCaseError(type)
  }
}

export const PreviewProvider: FC<{ initialState?: Partial<PreviewState> }> = ({
  children,
  initialState,
}) => {
  const [state, dispatch] = useReducer(previewReducer, {
    ...initialPreviewState,
    ...initialState,
  })

  return (
    <PreviewStateContext.Provider value={state}>
      <PreviewDispatchContext.Provider value={dispatch}>
        {children}
      </PreviewDispatchContext.Provider>
    </PreviewStateContext.Provider>
  )
}

export const usePreviewState = () => {
  const context = useContext(PreviewStateContext)
  if (context === undefined) {
    throw new Error('usePreviewState must be used within a PreviewProvider')
  }
  return context
}
export const usePreviewDispatch = () => {
  const context = useContext(PreviewDispatchContext)
  if (context === undefined) {
    throw new Error('usePreviewDispatch must be used within a PreviewProvider')
  }
  return context
}
