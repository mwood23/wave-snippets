import { InputStep, SnippetDocument, snippets } from '@waves/shared'
import { produce } from 'immer'
import React, { Dispatch, FC, createContext, useEffect, useState } from 'react'
import { DropResult } from 'react-beautiful-dnd'
import { useHistory, useParams } from 'react-router-dom'
import { add, update, value } from 'typesaurus'
import { useDebouncedCallback } from 'use-debounce'
import { useImmerReducer } from 'use-immer'

import { Box, Text, useCreateToast } from '../components'
import { ANONYMOUS_USER_KEY, DEFAULT_AUTOSAVE_THRESHOLD } from '../const'
import { DEFAULT_TEMPLATE } from '../templates/default'
import { BaseSnippet } from '../types'
import {
  UnreachableCaseError,
  generateID,
  isMatchParamTemplate,
  isNil,
  last,
  noop,
  omit,
} from '../utils'
import { useAuthState } from './Auth'

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

const initialSnippetState: BaseSnippet = DEFAULT_TEMPLATE

type SaveOrCreateSnippet = (config?: {
  /**
   * Pass to force a save or update
   */
  force?: boolean
}) => Promise<void | string>

const SnippetStateContext = createContext<
  BaseSnippet & {
    isSaving: boolean
    saveOrCreateSnippet: SaveOrCreateSnippet
  }
>({
  ...initialSnippetState,
  // eslint-disable-next-line arrow-body-style
  saveOrCreateSnippet: async () => {
    return
  },
  isSaving: false,
})
const SnippetDispatchContext = createContext<Dispatch<SnippetAction>>(noop)

const snippetReducer = produce((state: BaseSnippet, action: SnippetAction) => {
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
        ...omit(['type', 'stepIndex', 'stepID'], action),
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

export const SnippetProvider: FC<{ snippet?: BaseSnippet }> = ({
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

  // console.log(JSON.stringify(state, null, 2))

  const saveOrCreateSnippet: SaveOrCreateSnippet = async (
    // @ts-ignore Types aren't picking up the default cause of the type above
    { force = false } = {
      force: false,
    },
  ) => {
    // Break early if in the process of creating a new entity
    if (isSaving) return
    setCurrentThreshold((current) => current + 1)

    if (user || force) {
      const owner = user?.userID ?? ANONYMOUS_USER_KEY
      if (params.snippetID && !isMatchParamTemplate(params.snippetID)) {
        // @Performance: This fires an extra write on redirection, not too worried about it for now.
        console.log('autosave update', state)
        setIsSaving(true)
        await update(snippets, params.snippetID, {
          ...state,
          updatedOn: value('serverDate'),
          owner,
        })
        setIsSaving(false)

        return params.snippetID
      } else if (force || currentThreshold > DEFAULT_AUTOSAVE_THRESHOLD) {
        console.log('autosave create', state)
        setIsSaving(true)
        const data = await add(snippets, {
          ...state,
          createdOn: value('serverDate'),
          updatedOn: value('serverDate'),
          owner,
        })

        if (!force) {
          history.push(`/${data.id}`, { skipFetch: true })

          toast(
            <Box>
              <Text>
                <span aria-label="rocket" role="img">
                  🚀
                </span>
                Saved a new snippet!
              </Text>
            </Box>,
          )
        }

        dispatch({ type: 'updateSnippetState', owner })
        setIsSaving(false)

        return data.id
      }
    }
  }

  /**
   * This is called on initial render and everytime a user takes an action in the app.
   * We add a threshold here for autosaving to keep us from saving on initial render and
   * saving from users taking one or two actions. Any GIF worth saving will have tons of actions.
   */
  const [debouncedCallback] = useDebouncedCallback(saveOrCreateSnippet, 3000)

  useEffect(() => {
    debouncedCallback()
  }, [debouncedCallback, state])

  return (
    <SnippetStateContext.Provider
      value={{ ...state, isSaving, saveOrCreateSnippet }}
    >
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
