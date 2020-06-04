import styled from '@emotion/styled'
import { map, sortBy } from 'ramda'
import React, { FC, useRef } from 'react'

import { MAX_NUMBER_OF_TAGS, TAGS, TAGS_DICT, Tag as TagType } from '../const'
import { useSnippetDispatch, useSnippetState } from '../context'
import { useSearch } from '../hooks'
import { getColorByTagGroup, pipeVal } from '../utils'
import {
  Box,
  Flex,
  IconButton,
  Input,
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Tag,
  TagCloseButton,
  TagIcon,
  TagLabel,
  TagProps,
  Text,
} from './core'

type TitleToolbarProps = {}

const SnippetTag: FC<TagProps> = ({ children, ...rest }) => (
  <Tag rounded="full" size="sm" {...rest}>
    {children}
  </Tag>
)

const TagTriggerButton = styled(IconButton)`
  /* emotion-disable-server-rendering-unsafe-selector-warning-please-do-not-use-this-
 the-warning-exists-for-a-reason */
  &[aria-expanded='true'] {
    transform: rotate(-45deg);
  }
`

export const TitleToolbar: FC<TitleToolbarProps> = () => {
  const snippetDispatch = useSnippetDispatch()
  const { name, tags: activeSnippetTags } = useSnippetState()
  const { searchText, setSearchText, results } = useSearch<TagType>({
    collection: TAGS,
    uidFieldName: 'value',
    // @ts-ignore Types getting lost even though they're right :(
    indexes: ['name', 'aliases'],
  })
  const searchInputRef = useRef<any>()
  const hasMaxTags = activeSnippetTags.length >= MAX_NUMBER_OF_TAGS

  return (
    <Flex justifyContent="space-between" mb="4">
      <Input
        onChange={(e: any) => {
          snippetDispatch({
            type: 'updateSnippetState',
            name: e.target.value,
          })
        }}
        placeholder="Add name..."
        value={name ?? ''}
        variant="unstyled"
        width="300px"
      />
      <Flex alignItems="center">
        {activeSnippetTags.map((t) => {
          const foundTag = TAGS_DICT[t]
          return (
            <SnippetTag
              key={foundTag.value}
              mr="2"
              variantColor={getColorByTagGroup(foundTag.group)}
            >
              <TagLabel>{foundTag.name}</TagLabel>
              <TagCloseButton
                onClick={() => {
                  snippetDispatch({
                    // Move this to its own action if this gets more complicated than a one liner
                    type: 'updateSnippetState',
                    tags: activeSnippetTags.filter(
                      (activeTag) => activeTag !== t,
                    ),
                  })
                }}
              />
            </SnippetTag>
          )
        })}

        <Popover
          closeOnBlur={false}
          initialFocusRef={searchInputRef}
          placement="bottom-end"
        >
          <PopoverTrigger>
            <TagTriggerButton
              aria-label="Add Tag"
              icon="add"
              ml="2"
              rounded="full"
              size="sm"
            />
          </PopoverTrigger>
          <PopoverContent
            height="300px"
            overflowY="auto"
            p="2"
            pt="0"
            width="225px"
            zIndex={100}
          >
            <PopoverHeader mb="3" position="relative">
              <Input
                onChange={(e: any) => {
                  setSearchText(e.target.value)
                }}
                placeholder="Search..."
                pr="4"
                ref={searchInputRef}
                size="sm"
                value={searchText}
                variant="unstyled"
              />
              <Box
                position="absolute"
                right="0"
                style={{
                  transform: 'translateY(-50%)',
                }}
                top="50%"
              >
                <Text fontSize="xs" fontWeight="500">
                  {activeSnippetTags.length}/{MAX_NUMBER_OF_TAGS}
                </Text>
              </Box>
            </PopoverHeader>
            <Flex flexWrap="wrap">
              {pipeVal(
                results,
                sortBy((a) => a.name),
                map((t) => {
                  const isActivelySelected = activeSnippetTags.some(
                    (activeTags) => activeTags === t.value,
                  )
                  return (
                    <SnippetTag
                      cursor="pointer"
                      key={t.value}
                      mb="2"
                      mr="1"
                      onClick={() => {
                        snippetDispatch({
                          // Move this to its own action if this gets more complicated than a one liner
                          type: 'updateSnippetState',
                          tags: [...activeSnippetTags, t.value],
                        })
                      }}
                      opacity={hasMaxTags ? 0.8 : 1}
                      pointerEvents={
                        hasMaxTags || isActivelySelected ? 'none' : 'auto'
                      }
                      rounded="full"
                      size="sm"
                      variantColor={getColorByTagGroup(t.group)}
                    >
                      {isActivelySelected && <TagIcon icon="check" />}
                      <TagLabel>{t.name}</TagLabel>
                    </SnippetTag>
                  )
                }),
              )}
            </Flex>
          </PopoverContent>
        </Popover>
      </Flex>
    </Flex>
  )
}
