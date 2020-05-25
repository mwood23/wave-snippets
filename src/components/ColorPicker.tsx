import { Global, css } from '@emotion/core'
import React, { FC } from 'react'
import { SketchPicker, SketchPickerProps } from 'react-color'

import { noop } from '../utils'
import { useColorMode, useTheme } from './core'

// http://casesandberg.github.io/react-color/
type ColorPickerProps = SketchPickerProps

export const ColorPicker: FC<ColorPickerProps> = ({
  onChange = noop,
  color,
  presetColors,
  disableAlpha,
}) => {
  const { colorMode } = useColorMode()
  const theme = useTheme()
  const bgColor = {
    light: theme.colors.gray['200'],
    dark: theme.colors.blackAlpha['400'],
  }
  const inputBackgroundColor = {
    light: theme.colors.white,
    dark: theme.colors.blackAlpha['400'],
  }

  const pickerStyle = {
    backgroundColor: bgColor[colorMode],
    padding: '8px 8px 0',
    margin: '0 auto 1px',
  }

  return (
    <>
      <SketchPicker
        color={color}
        disableAlpha={disableAlpha}
        onChangeComplete={onChange}
        presetColors={presetColors}
        // https://github.com/casesandberg/react-color/blob/5f7af5dec0cf03f600afa56cff446c9383e01e5a/src/components/sketch/Sketch.js#L10
        // @ts-ignore
        styles={{ picker: pickerStyle }}
      />
      <Global
        styles={css`
          .sketch-picker {
            input {
              background-color: ${inputBackgroundColor[colorMode]};
              font-size: 0.7rem;
            }
          }
        `}
      />
    </>
  )
}

export default ColorPicker
