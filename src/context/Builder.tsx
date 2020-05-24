import React, { Dispatch, FC, createContext, useReducer } from 'react'

import { UnreachableCaseError, noop } from '../utils'

type BuilderState = {
  currentStep: number
  teleport: boolean
  pause: boolean
}

type BuilderAction =
  | {
      type: 'setStep'
      step: number
    }
  | {
      type: 'setTeleport'
      teleport: boolean
    }
  | {
      type: 'setPause'
      pause: boolean
    }

const initialBuilderState: BuilderState = {
  currentStep: 0,
  teleport: false,
  pause: false,
}

const BuilderStateContext = createContext<BuilderState>(initialBuilderState)
const BuilderDispatchContext = createContext<Dispatch<BuilderAction>>(noop)

const builderReducer = (state: BuilderState, action: BuilderAction) => {
  switch (action.type) {
    case 'setStep':
      return { ...state, currentStep: action.step }
    case 'setTeleport':
      return { ...state, teleport: action.teleport }
    case 'setPause':
      return { ...state, pause: action.pause }

    default:
      // eslint-disable-next-line no-case-declarations
      const { type } = action
      throw new UnreachableCaseError(type)
  }
}

export const BuilderProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(builderReducer, initialBuilderState)

  return (
    <BuilderStateContext.Provider value={state}>
      <BuilderDispatchContext.Provider value={dispatch}>
        {children}
      </BuilderDispatchContext.Provider>
    </BuilderStateContext.Provider>
  )
}

export const useBuilderState = () => {
  const context = React.useContext(BuilderStateContext)
  if (context === undefined) {
    throw new Error('useBuilderState must be used within a BuilderProvider')
  }
  return context
}
export const useBuilderDispatch = () => {
  const context = React.useContext(BuilderDispatchContext)
  if (context === undefined) {
    throw new Error('useBuilderDispatch must be used within a BuilderProvider')
  }
  return context
}
