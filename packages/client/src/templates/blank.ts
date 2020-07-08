import { BaseSnippet } from '../types'

export const BLANK_TEMPLATE: BaseSnippet = {
  cycle: false,
  steps: [
    {
      focus: '',
      subtitle: '',
      code: '',
      title: '',
      lang: 'typescript',
      id: '1',
    },
  ],
  backgroundColor: {
    g: 197,
    r: 11,
    b: 234,
    a: 100,
  },
  name: 'Blank',
  theme: 'nightOwl',
  tags: ['typescript'],
  cycleSpeed: 1500,
  immediate: false,
  showLineNumbers: false,
  windowControlsPosition: null,
  windowControlsType: null,
  startingStep: 0,
  springPreset: 'default',
  status: 'draft',
  defaultWindowTitle: 'hello.ts',
  visibility: 'unlisted',
  defaultLanguage: 'typescript',
}
