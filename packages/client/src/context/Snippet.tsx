import { InputStep, SnippetDocument, snippets } from '@waves/shared'
import { produce } from 'immer'
import React, { Dispatch, FC, createContext, useEffect, useState } from 'react'
import { DropResult } from 'react-beautiful-dnd'
import { useHistory, useParams } from 'react-router-dom'
import { add, update } from 'typesaurus'
import { useDebouncedCallback } from 'use-debounce'
import { useImmerReducer } from 'use-immer'
import { Optional } from 'utility-types'

import { Box, Text, useCreateToast } from '../components'
import { firebase } from '../config/firebase'
import {
  DEFAULT_ANIMATION_PRESET,
  DEFAULT_APP_COLOR,
  DEFAULT_AUTOSAVE_THRESHOLD,
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
import { useAuthState } from './Auth'

type SnippetState = Optional<
  SnippetDocument,
  'owner' | 'createdOn' | 'updatedOn'
>

type SnippetAction =
  | ({
      type: 'updateSnippetState'
    } & Partial<SnippetDocument>)
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
  title: '',
  subtitle: '',
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
      title: '',
      subtitle: '',
      code: `var x1: any = 1\ndebugger`,
      focus: '1[1:14]',
      lang: 'typescript',
      id: 'dfgs',
    },
    {
      title: '',
      subtitle: '',
      code: `var x0: any = 3
var x1 = 1
var x0 = 3`,
      focus: '',
      lang: 'typescript',
      id: 'gfdsg',
    },
    {
      title: '',
      subtitle: '',
      code: `var x0: number = 3
var x1 = 1
var x1 = 1
var x0 = 3`,
      lang: 'typescript',
      id: '1werw',
    },
  ],
}

const SnippetStateContext = createContext<SnippetState & { isSaving: boolean }>(
  { ...initialSnippetState, isSaving: false },
)
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

export const SnippetProvider: FC<{ snippet?: SnippetState }> = ({
  children,
  snippet,
}) => {
  const toast = useCreateToast()
  const [state, dispatch] = useImmerReducer(
    snippetReducer,
    snippet ?? initialSnippetState,
  )
  const [isSaving, setIsSaving] = useState(false)
  const [currentThreshold, setCurrentThreshold] = useState(0)
  const { user } = useAuthState()
  const params = useParams<{ snippetID: string }>()
  const history = useHistory()

  /**
   * This is called on initial render and everytime a user takes an action in the app.
   * We add a threshold here for autosaving to keep us from saving on initial render and
   * saving from users taking one or two actions. Any GIF worth saving will have tons of actions.
   */
  const [debouncedCallback] = useDebouncedCallback(async () => {
    // Break early if in the process of creating a new entity
    if (isSaving) return
    setCurrentThreshold((current) => current + 1)


    if (user) {
      if (params.snippetID) {
        // @Performance: This fires an extra write on redirection, not too worried about it for now.
        console.log('autosave update')
        setIsSaving(true)
        await update(snippets, params.snippetID, {
          ...state,
          updatedOn: firebase.firestore.FieldValue.serverTimestamp(),
          owner: user.userID,
        })
        setIsSaving(false)
      } else if (currentThreshold > DEFAULT_AUTOSAVE_THRESHOLD) {
        console.log('autosave create')
        setIsSaving(true)
        const data = await add(snippets, {
          ...state,
          createdOn: firebase.firestore.FieldValue.serverTimestamp(),
          owner: user.userID,
        })

        history.push(`/${data.id}`, { skipFetch: true })

        toast(
          <Box>
            <Text>🚀Saved a new snippet!</Text>
          </Box>,
        )
        dispatch({ type: 'updateSnippetState', owner: user.userID })
        setIsSaving(false)
      }
    }
  }, 3000)

  useEffect(() => {
    debouncedCallback()
  }, [debouncedCallback, state])

  return (
    <SnippetStateContext.Provider value={{ ...state, isSaving }}>
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
