import styled from '@emotion/styled/macro'
import React, { FC } from 'react'
import { useRouteMatch } from 'react-router-dom'

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
  useAuthState,
  usePreviewDispatch,
  usePreviewState,
  useSnippetDispatch,
  useSnippetState,
} from '../context'
import { backgroundColorToHexAlpha, prop, rem, sortBy } from '../utils'
import { Autocomplete } from './Autocomplete'
import { ColorPicker } from './ColorPicker'
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  IconButton,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  Switch,
  Tooltip,
} from './core'
import { ExportMenu } from './ExportMenu'

type ToolbarProps = {}

const StyledLeftToolbar = styled(Flex)``
const StyledRightToolbar = styled(Flex)``
const StyledToolbarSquares = styled(Flex)``

const StyledToolbar = styled(Flex)`
  @media (max-width: 1000px) {
    flex-direction: column;
    align-items: flex-start;

    ${StyledLeftToolbar}, ${StyledRightToolbar} {
      margin-bottom: 1rem;
    }
  }

  @media (max-width: 710px) {
    flex-direction: column;
    align-items: flex-start;

    ${StyledLeftToolbar} {
      flex-direction: column;
      width: 100%;

      & > * {
        margin-bottom: 0.75rem;
      }
    }
  }
`

export const ToolbarItem = styled(Box)`
  margin-right: ${rem('10px')};

  &:last-child {
    margin-right: 0;
  }
`

export const Toolbar: FC<ToolbarProps> = () => {
  const {
    defaultLanguage,
    theme,
    backgroundColor,
    springPreset,
    showLineNumbers,
    immediate,
    showBackground,
    cycleSpeed,
    windowControlsPosition,
    windowControlsType,
    visibility,
  } = useSnippetState()
  const { isAuthed } = useAuthState()
  const { isPlaying } = usePreviewState()
  const previewDispatch = usePreviewDispatch()
  const snippetDispatch = useSnippetDispatch()
  const match = useRouteMatch<{ snippetID?: string }>()

  return (
    <StyledToolbar justifyContent="space-between" marginBottom="8">
      <StyledLeftToolbar justifyContent="center">
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
                previousLang: defaultLanguage,
                lang: suggestion.value,
              })
            }}
            options={sortBy(prop('name'), SUPPORTED_CODING_LANGAUGES)}
            value={SUPPORTED_CODING_LANGAUGES_DICT[defaultLanguage]}
            valueKey={'value'}
          />
        </ToolbarItem>
        <StyledToolbarSquares>
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
                  onChange={(color) =>
                    snippetDispatch({
                      type: 'updateSnippetState',
                      backgroundColor: color.rgb,
                    })
                  }
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
                    onChange={(e) =>
                      snippetDispatch({
                        type: 'updateSnippetState',
                        springPreset: e.target.value,
                      })
                    }
                    size="sm"
                    value={springPreset}
                  >
                    {ANIMATION_PRESETS.map((preset) => (
                      <option key={preset.value} value={preset.value}>
                        {preset.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl mb="4">
                  <FormLabel htmlFor="email">Window Controls</FormLabel>
                  <Select
                    isDisabled={immediate}
                    mb="2"
                    onChange={(e) =>
                      snippetDispatch({
                        type: 'updateSnippetState',
                        windowControlsType: e.target
                          .value as WindowControlsType,
                      })
                    }
                    placeholder="Select option"
                    size="sm"
                    value={windowControlsType ?? ''}
                  >
                    {WINDOW_CONTROL_TYPES.map((preset) => (
                      <option key={preset.value} value={preset.value}>
                        {preset.name}
                      </option>
                    ))}
                  </Select>
                  <Flex align="center">
                    <FormLabel htmlFor="window-controls-position">
                      Position
                    </FormLabel>
                    <Switch
                      id="window-controls-position"
                      onChange={() =>
                        snippetDispatch({
                          type: 'updateSnippetState',
                          windowControlsPosition:
                            windowControlsPosition === 'right'
                              ? 'left'
                              : 'right',
                        })
                      }
                      value={windowControlsPosition === 'right'}
                    />
                  </Flex>
                </FormControl>
                <FormControl mb="4">
                  <FormLabel htmlFor="email">Cycle Speed (ms)</FormLabel>
                  <Input
                    onChange={(e: any) =>
                      snippetDispatch({
                        type: 'updateSnippetState',
                        cycleSpeed: Number(e.target.value),
                      })
                    }
                    size="sm"
                    type="numeric"
                    value={cycleSpeed || ''}
                  />
                </FormControl>
                <Flex align="center" mb="4">
                  <FormLabel htmlFor="line-numbers">Line Numbers</FormLabel>
                  <Switch
                    id="line-numbers"
                    isChecked={showLineNumbers}
                    onChange={() =>
                      snippetDispatch({
                        type: 'updateSnippetState',
                        showLineNumbers: !showLineNumbers,
                      })
                    }
                  />
                </Flex>
                <Flex align="center" mb="4">
                  <FormLabel htmlFor="slide-show">No Animation</FormLabel>
                  <Switch
                    id="slide-show"
                    isChecked={immediate}
                    onChange={() =>
                      snippetDispatch({
                        type: 'updateSnippetState',
                        immediate: !immediate,
                      })
                    }
                  />
                </Flex>
                <Flex align="center">
                  <FormLabel htmlFor="showBackground">
                    Show Background
                  </FormLabel>
                  <Switch
                    id="showBackground"
                    isChecked={showBackground}
                    onChange={() =>
                      snippetDispatch({
                        type: 'updateSnippetState',
                        showBackground: !showBackground,
                      })
                    }
                  />
                </Flex>
              </PopoverContent>
            </Popover>
          </ToolbarItem>
        </StyledToolbarSquares>
      </StyledLeftToolbar>
      <StyledRightToolbar alignItems="center">
        {isAuthed && (
          <Flex align="center" mr="2">
            <FormLabel htmlFor="visibility">
              Public{' '}
              <Tooltip
                aria-label="Make public info"
                label="Making a snippet public lets everyone see and search for it!"
                placement="top"
              >
                <Icon name="info-outline" />
              </Tooltip>
            </FormLabel>
            <Switch
              id="visibility"
              isChecked={visibility === 'public'}
              onChange={() =>
                snippetDispatch({
                  type: 'updateSnippetState',
                  visibility: 'public',
                })
              }
            />
          </Flex>
        )}
        <ToolbarItem>
          <IconButton
            // @ts-ignore
            icon={isPlaying ? 'pause' : 'play'}
            onClick={() =>
              previewDispatch({
                type: 'updatePreviewState',
                isPlaying: !isPlaying,
              })
            }
          />
        </ToolbarItem>
        <ToolbarItem>
          <ExportMenu snippetID={match.params?.snippetID} />
        </ToolbarItem>
      </StyledRightToolbar>
    </StyledToolbar>
  )
}
