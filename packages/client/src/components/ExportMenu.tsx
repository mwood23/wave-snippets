/* eslint-disable no-restricted-globals */
import React, { FC } from 'react'

import { useSnippetState } from '../context'
import { Button, useDisclosure } from './core'
import { ExportModal } from './ExportModal'

type ExportMenuProps = {
  snippetID?: string
  isLoading?: boolean
  isDisabled?: boolean
}

// const createEmbed = (snippetID: string) => `<iframe
//   src="${location.origin}/embed/${snippetID}"
//   style="width:646px; height:450px; border:0; overflow:hidden;"
//   sandbox="allow-scripts allow-same-origin">
// </iframe>
// `

export const ExportMenu: FC<ExportMenuProps> = () => {
  // const embedURL = snippetID ? createEmbed(snippetID) : 'No snippet exists'
  const { isOpen, onClose, onOpen } = useDisclosure()
  const { steps } = useSnippetState()
  // const { onCopy, hasCopied } = useClipboard(embedURL)
  // const toast = useCreateToast()

  // useEffect(() => {
  //   if (hasCopied) {
  //     toast(
  //       <Box>
  //         <Text>Embed copied to clipboard!</Text>
  //       </Box>,
  //     )
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [hasCopied])

  return (
    <>
      {/* Just doing media exports for now. */}
      {/* <Menu>
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
      </Menu> */}

      <Button isDisabled={steps.length <= 1} onClick={onOpen}>
        Export
      </Button>
      <ExportModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}
