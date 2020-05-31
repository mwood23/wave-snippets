import styled from '@emotion/styled'
import React, { FC } from 'react'

import {
  CODE_THEMES,
  CODE_THEMES_DICT,
  WindowControlsType,
} from '../code-themes'
import {
  ANIMATION_PRESETS,
  SUPPORTED_CODING_LANGAUGES,
  SUPPORTED_CODING_LANGAUGES_DICT,
  WINDOW_CONTROL_TYPES,
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
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  Switch,
} from './core'

type ToolbarProps = {
  onRenderGIFClicked: any
  downloadLoading?: boolean
}

export const ToolbarItem = styled(Box)`
  margin-right: ${rem('10px')};

  &:last-child {
    margin-right: 0;
  }
`

export const Toolbar: FC<ToolbarProps> = ({
  onRenderGIFClicked,
  downloadLoading,
}) => {
  const {
    defaultLanguage,
    theme,
    backgroundColor,
    springPreset,
    showLineNumbers,
    immediate,
    cycle,
    cycleSpeed,
    windowControlsPosition,
    windowControlsType,
  } = useSnippetState()
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
            <PopoverContent padding="4" width="230px" zIndex={1000}>
              <FormControl mb="4">
                <FormLabel htmlFor="email">Animation Preset</FormLabel>
                <Select
                  isDisabled={immediate}
                  onChange={(e) => {
                    return snippetDispatch({
                      type: 'updateSnippetState',
                      springPreset: e.target.value,
                    })
                  }}
                  placeholder="Select option"
                  size="sm"
                  value={springPreset}
                >
                  {ANIMATION_PRESETS.map((preset) => {
                    return (
                      <option key={preset.value} value={preset.value}>
                        {preset.name}
                      </option>
                    )
                  })}
                </Select>
              </FormControl>
              <FormControl mb="4">
                <FormLabel htmlFor="email">Window Controls</FormLabel>
                <Select
                  isDisabled={immediate}
                  mb="2"
                  onChange={(e) => {
                    return snippetDispatch({
                      type: 'updateSnippetState',
                      windowControlsType: e.target.value as WindowControlsType,
                    })
                  }}
                  placeholder="Select option"
                  size="sm"
                  value={windowControlsType ?? ''}
                >
                  {WINDOW_CONTROL_TYPES.map((preset) => {
                    return (
                      <option key={preset.value} value={preset.value}>
                        {preset.name}
                      </option>
                    )
                  })}
                </Select>
                <Flex align="center">
                  <FormLabel htmlFor="window-controls-position">
                    Position
                  </FormLabel>
                  <Switch
                    id="window-controls-position"
                    onChange={() => {
                      return snippetDispatch({
                        type: 'updateSnippetState',
                        windowControlsPosition:
                          windowControlsPosition === 'right' ? 'left' : 'right',
                      })
                    }}
                    value={windowControlsPosition === 'right'}
                  />
                </Flex>
              </FormControl>
              <FormControl mb="4">
                <FormLabel htmlFor="email">Cycle Speed (ms)</FormLabel>
                <Input
                  onChange={(e: any) => {
                    return snippetDispatch({
                      type: 'updateSnippetState',
                      cycleSpeed: e.target.value,
                    })
                  }}
                  size="sm"
                  type="numeric"
                  value={cycleSpeed}
                />
              </FormControl>
              <Flex align="center" mb="4">
                <FormLabel htmlFor="line-numbers">Line Numbers</FormLabel>
                <Switch
                  id="line-numbers"
                  onChange={() => {
                    return snippetDispatch({
                      type: 'updateSnippetState',
                      showLineNumbers: !showLineNumbers,
                    })
                  }}
                  value={showLineNumbers}
                />
              </Flex>
              <Flex align="center" mb="4">
                <FormLabel htmlFor="slide-show">No Animation</FormLabel>
                <Switch
                  id="slide-show"
                  onChange={() => {
                    return snippetDispatch({
                      type: 'updateSnippetState',
                      immediate: !immediate,
                    })
                  }}
                  value={immediate}
                />
              </Flex>
              <Flex align="center">
                <FormLabel htmlFor="cycle">Cycle</FormLabel>
                <Switch
                  id="cycle"
                  onChange={() => {
                    return snippetDispatch({
                      type: 'updateSnippetState',
                      cycle: !cycle,
                    })
                  }}
                  value={cycle}
                />
              </Flex>
            </PopoverContent>
          </Popover>
        </ToolbarItem>
      </Flex>
      <Flex>
        <ToolbarItem>
          <IconButton
            // @ts-ignore
            icon={isPlaying ? 'pause' : 'play'}
            isDisabled={downloadLoading}
            onClick={() => {
              return previewDispatch({
                type: 'updatePreviewState',
                isPlaying: !isPlaying,
              })
            }}
          />
        </ToolbarItem>
        <ToolbarItem>
          <Button
            isLoading={downloadLoading}
            leftIcon={'download'}
            onClick={onRenderGIFClicked}
          >
            Download
          </Button>
        </ToolbarItem>
      </Flex>
    </Flex>
  )
}
