import { SnippetDocument } from '@waves/shared'
import { produce } from 'immer'
import React, { Dispatch, FC, createContext } from 'react'
import { DropResult } from 'react-beautiful-dnd'
import { useImmerReducer } from 'use-immer'

import {
  DEFAULT_ANIMATION_PRESET,
  DEFAULT_APP_COLOR,
  DEFAULT_CYCLE,
  DEFAULT_CYCLE_SPEED,
  DEFAULT_IMMEDIATE,
  DEFAULT_PREVIEW_THEME,
  DEFAULT_SHOW_NUMBERS,
  DEFAULT_SNIPPET_STATUS,
  DEFAULT_SNIPPET_VISIBILITY,
  DEFAULT_STARTING_STEP,
  DEFAULT_WINDOWS_CONTROLS_POSITION,
  DEFAULT_WINDOWS_CONTROLS_TYPE,
  DEFAULT_WINDOW_TITLE,
} from '../const'
import {
  UnreachableCaseError,
  generateID,
  isNil,
  last,
  noop,
  omit,
} from '../utils'

// Pulled from source cause types aren't exported right
export type InputStep = {
  code: string
  focus?: string
  title?: string
  subtitle?: string
  showNumbers?: boolean
  lang: string
  id: string
}

type SnippetState = Omit<SnippetDocument, 'owner' | 'createdOn' | 'updatedOn'>

type SnippetAction =
  | ({
      type: 'updateSnippetState'
    } & Partial<SnippetState>)
  | {
      type: 'resetSnippetState'
    }
  | {
      type: 'updateLanguage'
      lang: string
      previousLang: string
    }
  | ({
      type: 'updateStep'
      stepID: string
    } & Partial<InputStep>)
  | {
      type: 'addStep'
    }
  | {
      type: 'duplicateLastStep'
    }
  | {
      type: 'removeStep'
      stepID: string
    }
  | {
      type: 'reorderStep'
      dropResult: DropResult
    }

const createEmptyStep = ({
  snippetLanguage,
}: {
  snippetLanguage: string
}): InputStep => ({
  code: '// Type code here',
  focus: '',
  lang: snippetLanguage,
  id: generateID(),
})

const initialSnippetState: SnippetState = {
  immediate: DEFAULT_IMMEDIATE,
  theme: DEFAULT_PREVIEW_THEME,
  defaultLanguage: 'typescript',
  tags: ['typescript'],
  defaultWindowTitle: DEFAULT_WINDOW_TITLE,
  springPreset: DEFAULT_ANIMATION_PRESET,
  showLineNumbers: DEFAULT_SHOW_NUMBERS,
  windowControlsType: DEFAULT_WINDOWS_CONTROLS_TYPE,
  windowControlsPosition: DEFAULT_WINDOWS_CONTROLS_POSITION,
  backgroundColor: DEFAULT_APP_COLOR,
  startingStep: DEFAULT_STARTING_STEP,
  cycleSpeed: DEFAULT_CYCLE_SPEED,
  cycle: DEFAULT_CYCLE,
  status: DEFAULT_SNIPPET_STATUS,
  visibility: DEFAULT_SNIPPET_VISIBILITY,
  steps: [
    {
      code: `var x1: any = 1\ndebugger`,
      // focus: '1[1:14]',
      lang: 'typescript',
      id: 'dfgs',
    },
    {
      code: `var x0: any = 3
var x1 = 1
var x0 = 3`,
      focus: '',
      lang: 'typescript',
      id: 'gfdsg',
    },
    {
      code: `var x0: number = 3
var x1 = 1
var x1 = 1
var x0 = 3`,
      lang: 'typescript',
      id: '1werw',
    },
  ],
}

const SnippetStateContext = createContext<SnippetState>(initialSnippetState)
const SnippetDispatchContext = createContext<Dispatch<SnippetAction>>(noop)

const snippetReducer = produce((state: SnippetState, action: SnippetAction) => {
  switch (action.type) {
    case 'updateSnippetState':
      return { ...state, ...omit(['type'], action) }
    case 'updateLanguage':
      return {
        ...state,
        defaultLanguage: action.lang,
        tags: [
          ...state.tags.filter((t) => t !== action.previousLang),
          action.lang,
        ],
        steps: state.steps.map((s) => ({ ...s, lang: action.lang })),
      }
    case 'updateStep':
      // eslint-disable-next-line no-case-declarations
      const stepToUpdate = state.steps.findIndex((s) => s.id === action.stepID)

      if (stepToUpdate === -1) {
        console.warn('Step ID does not exist!')
        return
      }

      state.steps[stepToUpdate] = {
        ...state.steps[stepToUpdate],
        ...omit(['type', 'stepIndex'], action),
      }
      return
    case 'addStep':
      state.steps.push(
        createEmptyStep({ snippetLanguage: state.defaultLanguage }),
      )
      return
    case 'duplicateLastStep':
      // eslint-disable-next-line no-case-declarations
      const lastStep = last(state.steps)
      if (!lastStep) return

      state.steps.push({ ...lastStep, id: generateID() })
      return
    case 'reorderStep':
      if (isNil(action.dropResult.destination)) return

      // eslint-disable-next-line no-case-declarations
      const [removed] = state.steps.splice(action.dropResult.source.index, 1)
      state.steps.splice(action.dropResult.destination.index, 0, removed)

      return
    case 'removeStep':
      state.steps = state.steps.filter((step) => step.id !== action.stepID)
      return

    case 'resetSnippetState':
      return { ...initialSnippetState }

    default:
      // eslint-disable-next-line no-case-declarations
      const { type } = action
      throw new UnreachableCaseError(type)
  }
})

export const SnippetProvider: FC = ({ children }) => {
  const [state, dispatch] = useImmerReducer(snippetReducer, initialSnippetState)

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
