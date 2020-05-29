import React, { FC } from 'react'

import { CODE_THEMES, CODE_THEMES_DICT } from '../code-themes'
import {
  SUPPORTED_CODING_LANGAUGES,
  SUPPORTED_CODING_LANGAUGES_DICT,
} from '../const'
import {
  usePreviewDispatch,
  usePreviewState,
  useSnippetDispatch,
  useSnippetState,
} from '../context'
import { Autocomplete } from './Autocomplete'
import { ColorPicker } from './ColorPicker'
import {
  Button,
  Flex,
  IconButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './core'

type ToolbarProps = {
  onRenderGIFClicked: any
}

export const Toolbar: FC<ToolbarProps> = ({ onRenderGIFClicked }) => {
  const {
    immediate,
    defaultLanguage,
    theme,
    backgroundColor,
  } = useSnippetState()
  const { isPlaying } = usePreviewState()
  const previewDispatch = usePreviewDispatch()
  const snippetDispatch = useSnippetDispatch()

  return (
    <Flex justifyContent="center" marginBottom="8">
      <Autocomplete
        onSelect={({ suggestion }) => {
          snippetDispatch({
            type: 'updateSnippetState',
            theme: suggestion.key,
          })
        }}
        options={CODE_THEMES}
        value={CODE_THEMES_DICT[theme]}
        valueKey={'key'}
      />
      <Autocomplete
        onSelect={({ suggestion }) => {
          snippetDispatch({
            type: 'updateLanguage',
            lang: suggestion.value,
          })
        }}
        options={SUPPORTED_CODING_LANGAUGES}
        value={SUPPORTED_CODING_LANGAUGES_DICT[defaultLanguage]}
        valueKey={'value'}
      />

      <Popover>
        <PopoverTrigger>
          <IconButton aria-label="Settings dropdown" icon="settings" />
        </PopoverTrigger>
        <PopoverContent width="230px" zIndex={1000}>
          <ColorPicker
            color={backgroundColor}
            onChange={(color) => {
              return snippetDispatch({
                type: 'updateSnippetState',
                backgroundColor: color.rgb,
              })
            }}
          />
        </PopoverContent>
      </Popover>

      <Button
        onClick={() => {
          return snippetDispatch({
            type: 'updateSnippetState',
            immediate: !immediate,
          })
        }}
      >
        Teleport
      </Button>
      <Button
        onClick={() => {
          return previewDispatch({
            type: 'updatePreviewState',
            isPlaying: !isPlaying,
          })
        }}
      >
        {isPlaying ? 'Pause' : 'Unpause'}
      </Button>
      <Button onClick={onRenderGIFClicked}>Download</Button>
    </Flex>
  )
}
