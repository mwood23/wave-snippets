import styled from '@emotion/styled'
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
import { backgroundColorToHexAlpha, rem } from '../utils'
import { Autocomplete } from './Autocomplete'
import { ColorPicker } from './ColorPicker'
import {
  Box,
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

export const ToolbarItem = styled(Box)`
  margin-right: ${rem('10px')};

  &:last-child {
    margin-right: 0;
  }
`

export const Toolbar: FC<ToolbarProps> = ({ onRenderGIFClicked }) => {
  const { defaultLanguage, theme, backgroundColor } = useSnippetState()
  const { isPlaying } = usePreviewState()
  const previewDispatch = usePreviewDispatch()
  const snippetDispatch = useSnippetDispatch()

  return (
    <Flex justifyContent="space-between" marginBottom="8">
      <Flex justifyContent="center">
        <ToolbarItem>
          <Autocomplete
            leftInputIcon="palette"
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
        </ToolbarItem>
        <ToolbarItem>
          <Autocomplete
            leftInputIcon="codingLanguage"
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
        </ToolbarItem>
        <ToolbarItem>
          <Popover>
            <PopoverTrigger>
              {/*
          // @ts-ignore */}
              <IconButton
                backgroundColor={`${backgroundColorToHexAlpha(
                  backgroundColor,
                )} !important`}
              />
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
        </ToolbarItem>

        <ToolbarItem>
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
        </ToolbarItem>

        {/* <Button
        onClick={() => {
          return snippetDispatch({
            type: 'updateSnippetState',
            immediate: !immediate,
          })
        }}
      >
        Teleport
      </Button> */}
      </Flex>
      <Flex>
        <ToolbarItem>
          <IconButton
            // @ts-ignore
            icon={isPlaying ? 'pause' : 'play'}
            onClick={() => {
              return previewDispatch({
                type: 'updatePreviewState',
                isPlaying: !isPlaying,
              })
            }}
          />
        </ToolbarItem>
        <ToolbarItem>
          <Button leftIcon="download" onClick={onRenderGIFClicked}>
            Download
          </Button>
        </ToolbarItem>
      </Flex>
    </Flex>
  )
}
