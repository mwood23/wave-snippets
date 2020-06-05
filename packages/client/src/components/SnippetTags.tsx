import React, { FC } from 'react'

import { TAGS_DICT } from '../const'
import { getColorByTagGroup, noop } from '../utils'
import { Flex, Tag, TagCloseButton, TagLabel, TagProps } from './core'

type SnippetTagsProps = {
  tags: string[]
  showCloseButton?: boolean
  onCloseButtonClicked?: (t: string) => void
} & TagProps

export const SnippetTag: FC<TagProps> = ({ children, ...rest }) => (
  <Tag rounded="full" size="sm" {...rest}>
    {children}
  </Tag>
)

export const SnippetTags: FC<SnippetTagsProps> = ({
  tags,
  showCloseButton = true,
  onCloseButtonClicked = noop,
  ...rest
}) => (
  <Flex alignItems="center">
    {tags.map((t) => {
      const foundTag = TAGS_DICT[t]
      return (
        <SnippetTag
          key={foundTag.value}
          mr="2"
          variantColor={getColorByTagGroup(foundTag.group)}
          {...rest}
        >
          <TagLabel>{foundTag.name}</TagLabel>
          {showCloseButton && (
            <TagCloseButton onClick={() => onCloseButtonClicked(t)} />
          )}
        </SnippetTag>
      )
    })}
  </Flex>
)
