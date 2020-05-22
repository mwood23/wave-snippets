import React, { CSSProperties, FC } from 'react'
import { Preview as SmooshPreview } from 'react-smooshpack'
import { PreviewProps } from 'react-smooshpack/dist/types/components/Preview/Preview'

export const Preview: FC<
  Partial<PreviewProps> & {
    style: CSSProperties
  }
> = (props) => {
  return <SmooshPreview {...props} />
}
