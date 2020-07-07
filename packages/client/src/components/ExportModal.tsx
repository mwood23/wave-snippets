import React, { FC } from 'react'
import { Required } from 'utility-types'

import {
  Button,
  IModal,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from './core'

type ExportModalProps = Required<
  Omit<IModal, 'children'>,
  'isOpen' | 'onClose'
> & {
  id: string
  name?: string
}

export const ExportModal: FC<ExportModalProps> = ({ id, isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Modal Title</ModalHeader>
      <ModalCloseButton />
      <ModalBody>hello</ModalBody>

      <ModalFooter>
        <Button mr={3} onClick={onClose} variantColor="blue">
          Close
        </Button>
        <Button variant="ghost">Secondary Action</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
)
