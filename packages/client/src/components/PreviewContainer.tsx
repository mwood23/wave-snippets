import styled from '@emotion/styled'
import { BackgroundColor } from '@waves/shared'
import React, { ReactNode, forwardRef } from 'react'

import { Box } from './core'
import { WindowTitleBar, WindowTitleBarProps } from './WindowTitleBar'

type PreviewContainerProps = {
  backgroundColor: BackgroundColor
  windowBackground: string
  children: ReactNode
  className?: string
  responsive?: boolean
  onMouseEnter?: (event: React.MouseEvent<any, MouseEvent>) => void
  onMouseLeave?: (event: React.MouseEvent<any, MouseEvent>) => void
} & WindowTitleBarProps

const Background = styled(Box)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`

const Window = styled(Box)`
  position: relative;
  z-index: 10;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.55) 0px 20px 68px;
`

// eslint-disable-next-line react/display-name
export const PreviewContainer = forwardRef<any, PreviewContainerProps>(
  (
    {
      children,
      backgroundColor,
      windowBackground,
      title,
      onTitleChanged,
      readOnly = false,
      responsive = false,
      windowControlsType,
      windowControlsPosition,
      className,
      onMouseEnter,
      onMouseLeave,
    },
    ref,
  ) => (
    <Box
      className={className}
      height={responsive ? 'auto' : '450px'}
      margin="0 auto"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      paddingX="8"
      paddingY="12"
      position="relative"
      ref={ref}
      width={responsive ? '100%' : '646px'}
    >
      <Window
        background={windowBackground}
        paddingBottom="4"
        paddingLeft="4"
        paddingRight="4"
        paddingTop="4"
      >
        <WindowTitleBar
          onTitleChanged={onTitleChanged}
          readOnly={readOnly}
          title={title}
          windowControlsPosition={windowControlsPosition}
          windowControlsType={windowControlsType}
        />
        {children}
      </Window>

      {/* If the user clears the colors gives them the transparent checkerboard */}
      <Background background="white" className="eliminateOnRender" />
      <Background
        background="url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==)"
        className="eliminateOnRender"
      />
      {/* Background the user selects */}
      <Background
        background={`rgba(${backgroundColor.r},${backgroundColor.g},${backgroundColor.b},${backgroundColor.a})`}
      />
    </Box>
  ),
)
