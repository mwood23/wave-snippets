import domtoimage from 'dom-to-image'
import { Ref, useReducer } from 'react'

import { UnreachableCaseError } from '../utils'

type RenderGIFOptions = {}

type RenderGIFState = {
  isLoading: boolean
  isRecording: boolean
}

const initialRenderGIFState: RenderGIFState = {
  isLoading: false,
  isRecording: false,
}

type RenderGIFAction =
  | {
      type: 'startRender'
    }
  | {
      type: 'startRecording'
    }
  | {
      type: 'stopRecording'
    }
  | {
      type: 'renderComplete'
    }

const renderGIFReducer = (state: RenderGIFState, action: RenderGIFAction) => {
  switch (action.type) {
    case 'startRender':
      return { ...state, isLoading: true, isRecording: true }
    case 'startRecording':
      return { ...state, isRecording: true }
    case 'stopRecording':
      return { ...state, isRecording: false }
    case 'renderComplete':
      return { ...state, isLoading: false }

    default:
      // eslint-disable-next-line no-case-declarations
      const { type } = action
      throw new UnreachableCaseError(type)
  }
}

export const useRenderGIF = (
  _options?: RenderGIFOptions,
): [typeof renderGIF, RenderGIFState] => {
  const [state, dispatch] = useReducer(renderGIFReducer, initialRenderGIFState)

  const renderGIF = async (_ref: Ref<any>) => {
    dispatch({ type: 'startRender' })
  }

  return [renderGIF, state]
}
