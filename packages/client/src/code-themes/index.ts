import 'codemirror/theme/dracula.css'
import 'codemirror/theme/eclipse.css'

import {
  dracula,
  duotoneDark,
  duotoneLight,
  github,
  nightOwl,
  oceanicNext,
  shadesOfPurple,
  ultramin,
  vsDark,
} from '@code-surfer/themes'
import { CodeSurferStyles } from '@code-surfer/themes/dist/utils'

import { normalizeArray } from '../utils'
import { WindowControlsPosition, WindowControlsType } from './windowControls'

export * from './windowControls'

export type CodeTheme = {
  key: string
  name: string
  codeMirrorMap: string
  windowControlsType: WindowControlsType
  windowControlsPosition: WindowControlsPosition
  theme: {
    colors: {
      background: string
      primary: string
      text: string
    }
    styles: {
      CodeSurfer: CodeSurferStyles
    }
  }
}

// Types could be a lot tougher here, but since this could live in a DB someday I'm leaving them loose.
export const CODE_THEMES: CodeTheme[] = [
  {
    key: 'dracula',
    name: 'Dracula',
    windowControlsType: 'rounded',
    windowControlsPosition: 'left',
    codeMirrorMap: 'dracula',
    // @ts-ignore Internal types are wrong :(
    theme: dracula,
  },
  {
    key: 'duotoneDark',
    name: 'Duotone Dark',
    windowControlsType: 'rounded',
    windowControlsPosition: 'left',
    codeMirrorMap: 'dracula',
    // @ts-ignore Internal types are wrong :(
    theme: duotoneDark,
  },
  {
    key: 'duotoneLight',
    name: 'Duotone Light',
    windowControlsType: 'rounded',
    windowControlsPosition: 'left',
    codeMirrorMap: 'eclipse',
    // @ts-ignore Internal types are wrong :(
    theme: duotoneLight,
  },
  {
    key: 'github',
    name: 'Github',
    windowControlsType: 'rounded',
    windowControlsPosition: 'left',
    codeMirrorMap: 'eclipse',
    // @ts-ignore Internal types are wrong :(
    theme: github,
  },
  {
    key: 'nightOwl',
    name: 'Night Owl',
    windowControlsType: 'rounded',
    windowControlsPosition: 'left',
    codeMirrorMap: 'dracula',
    // @ts-ignore Internal types are wrong :(
    theme: nightOwl,
  },
  {
    key: 'oceanicNext',
    name: 'Oceanic Next',
    windowControlsType: 'rounded',
    windowControlsPosition: 'left',
    codeMirrorMap: 'dracula',
    // @ts-ignore Internal types are wrong :(
    theme: oceanicNext,
  },
  {
    key: 'shadesOfPurple',
    name: 'Shades of Purple',
    windowControlsType: 'rounded',
    windowControlsPosition: 'left',
    codeMirrorMap: 'dracula',
    // @ts-ignore Internal types are wrong :(
    theme: shadesOfPurple,
  },
  {
    key: 'ultramin',
    name: 'Ultramin',
    windowControlsType: 'rounded',
    windowControlsPosition: 'left',
    codeMirrorMap: 'dracula',
    // @ts-ignore Internal types are wrong :(
    theme: ultramin,
  },
  {
    key: 'vsDark',
    name: 'VS Code',
    windowControlsType: 'rounded',
    windowControlsPosition: 'left',
    codeMirrorMap: 'dracula',
    // @ts-ignore Internal types are wrong :(
    theme: vsDark,
  },
]

export const CODE_THEMES_DICT = normalizeArray(CODE_THEMES, 'key')
