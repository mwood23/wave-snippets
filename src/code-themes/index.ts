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

import { normalizeArray } from '../utils'

export type CodeTheme = typeof CODE_THEMES[0]

// Types could be a lot tougher here, but since this could live in a DB someday I'm leaving them loose.
export const CODE_THEMES = [
  {
    key: 'dracula',
    name: 'Dracula',
    theme: dracula,
  },
  {
    key: 'duotoneDark',
    name: 'Duotone Dark',
    theme: duotoneDark,
  },
  {
    key: 'duotoneLight',
    name: 'Duotone Light',
    theme: duotoneLight,
  },
  {
    key: 'github',
    name: 'Github',
    theme: github,
  },
  {
    key: 'nightOwl',
    name: 'Night Owl',
    theme: nightOwl,
  },
  {
    key: 'oceanicNext',
    name: 'Oceanic Next',
    theme: oceanicNext,
  },
  {
    key: 'shadesOfPurple',
    name: 'Shades of Purple',
    theme: shadesOfPurple,
  },
  {
    key: 'ultramin',
    name: 'Ultramin',
    theme: ultramin,
  },
  {
    key: 'vsDark',
    name: 'VS Code',
    theme: vsDark,
  },
]

export const CODE_THEMES_DICT = normalizeArray(CODE_THEMES, 'key')
