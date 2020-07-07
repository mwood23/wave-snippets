/* eslint-disable no-restricted-globals */
import React, { FC, useEffect } from 'react'

import {
  Badge,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useClipboard,
  useDisclosure,
} from './core'
import { ExportModal } from './ExportModal'
import { useCreateToast } from './Toast'

type ExportMenuProps = {
  snippetID?: string
  isLoading?: boolean
  isDisabled?: boolean
}

const createEmbed = (snippetID: string) => `<iframe
  src="${location.origin}/embed/${snippetID}"
  style="width:646px; height:450px; border:0; overflow:hidden;"
  sandbox="allow-scripts allow-same-origin">
</iframe>
`

export const ExportMenu: FC<ExportMenuProps> = ({
  snippetID,
  isLoading = false,
  isDisabled = false,
}) => {
  const embedURL = snippetID ? createEmbed(snippetID) : 'No snippet exists'
  const { isOpen, onClose, onOpen, onToggle } = useDisclosure()
  const { onCopy, hasCopied } = useClipboard(embedURL)
  const toast = useCreateToast()

  useEffect(() => {
    if (hasCopied) {
      toast(
        <Box>
          <Text>Embed copied to clipboard!</Text>
        </Box>,
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCopied])

  return (
    <>
      <Menu>
        <MenuButton
          as={Button}
          // @ts-ignore
          isDisabled={isDisabled}
          isLoading={isLoading}
          // @ts-ignore
          rightIcon="chevron-down"
        >
          Export...
        </MenuButton>
        <MenuList zIndex={1000}>
          <MenuItem isDisabled={!snippetID} onClick={onCopy}>
            Embed <Badge ml="4">Beta</Badge>
          </MenuItem>
          <MenuItem onClick={onOpen}>Export GIF/MP4</MenuItem>
        </MenuList>
      </Menu>
      <ExportModal id="ewedw" isOpen={isOpen} onClose={onClose} />
    </>
  )
}
