import React, { FC, ReactNode } from 'react'

import { Box, BoxProps, Icon, Text } from './core'

type MessageProps = {
  title?: ReactNode
  content?: ReactNode
  icon?: string
} & BoxProps

export const Message: FC<MessageProps> = ({
  title,
  content,
  icon,
  ...rest
}) => (
  <Box
    borderRadius="4px"
    borderWidth="1px"
    display="flex"
    mb="6"
    p="4"
    {...rest}
  >
    {icon && <Icon mr="2" name={icon} />}
    <Box>
      {title && (
        <Text
          fontSize={['1rem', '1.1rem', '1.2rem']}
          fontWeight="500"
          lineHeight="1"
          mb="2"
        >
          {title}
        </Text>
      )}
      {content && (
        <Text fontSize={['0.8rem', '0.9rem', '1rem']}>{content}</Text>
      )}
    </Box>
  </Box>
)
