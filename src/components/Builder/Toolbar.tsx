import React, { FC } from 'react'

import { CODE_THEMES, CODE_THEMES_DICT } from '../../code-themes'
import {
  SUPPORTED_CODING_LANGAUGES,
  SUPPORTED_CODING_LANGAUGES_DICT,
} from '../../const'
import { useBuilderDispatch, useBuilderState } from '../../context'
import { Autocomplete } from '../Autocomplete'
import { Button, Flex } from '../core'

type ToolbarProps = {
  onRenderGIFClicked: any
}

export const Toolbar: FC<ToolbarProps> = ({ onRenderGIFClicked }) => {
  const { teleport, pause, language, theme } = useBuilderState()
  const dispatch = useBuilderDispatch()

  return (
    <Flex>
      <Autocomplete
        onSelect={({ suggestion }) => {
          dispatch({
            type: 'updateBuilderState',
            theme: suggestion.key,
          })
        }}
        options={CODE_THEMES}
        value={CODE_THEMES_DICT[theme]}
        valueKey={'key'}
      />
      <Autocomplete
        onSelect={({ suggestion }) => {
          dispatch({
            type: 'updateBuilderState',
            language: suggestion.value,
          })
        }}
        options={SUPPORTED_CODING_LANGAUGES}
        value={SUPPORTED_CODING_LANGAUGES_DICT[language]}
        valueKey={'value'}
      />

      <Button
        onClick={() => {
          return dispatch({ type: 'updateBuilderState', teleport: !teleport })
        }}
      >
        Teleport
      </Button>
      <Button
        onClick={() => {
          return dispatch({ type: 'updateBuilderState', pause: !pause })
        }}
      >
        {pause ? 'Unpause' : 'Pause'}
      </Button>
      <Button onClick={onRenderGIFClicked}>Download</Button>
    </Flex>
  )
}
