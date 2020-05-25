import React, { CSSProperties, FC } from 'react'
import { SketchPicker, SketchPickerProps } from 'react-color'

import { noop } from '../utils'

type ColorPickerProps = SketchPickerProps & {
  style?: CSSProperties
}

const pickerStyle = {
  backgroundColor: 'black',
  padding: '8px 8px 0',
  margin: '0 auto 1px',
}

export const ColorPicker: FC<ColorPickerProps> = ({
  onChange = noop,
  color,
  presetColors,
  style,
  disableAlpha,
}) => {
  return (
    <React.Fragment>
      <SketchPicker
        //   @ts-ignore
        className="hello"
        color={color}
        disableAlpha={disableAlpha}
        onChangeComplete={onChange}
        presetColors={presetColors}
        styles={{ picker: style || pickerStyle }}
      />
    </React.Fragment>
  )
}

export default ColorPicker
