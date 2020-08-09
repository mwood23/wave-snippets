import React, { FC } from 'react'
import {
  ToastContainer as ToastContainerCore,
  ToastContainerProps,
  ToastContent,
  ToastOptions,
  toast as toastCore,
  useToast as useToastCore,
} from 'react-toastify'

import { useColorMode } from './core'

export const useCreateToast = () => {
  const { colorMode } = useColorMode()

  return (content: ToastContent, options: Partial<ToastOptions> = {}) =>
    toastCore(content, {
      // @ts-ignore Dark is missing in types
      type: colorMode === 'light' ? 'default' : 'dark',
      ...options,
    })
}

export const ToastContainer: FC<ToastContainerProps> = (props) => (
  <ToastContainerCore {...props} />
)

export const useToaster = useToastCore
