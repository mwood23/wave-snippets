import {
  DEFAULT_ANIMATION_PRESET,
  DEFAULT_APP_COLOR,
  DEFAULT_CYCLE,
  DEFAULT_CYCLE_SPEED,
  DEFAULT_IMMEDIATE,
  DEFAULT_PREVIEW_THEME,
  DEFAULT_SHOW_NUMBERS,
  DEFAULT_SNIPPET_STATUS,
  DEFAULT_SNIPPET_VISIBILITY,
  DEFAULT_STARTING_STEP,
  DEFAULT_WINDOWS_CONTROLS_POSITION,
  DEFAULT_WINDOWS_CONTROLS_TYPE,
  DEFAULT_WINDOW_TITLE,
} from '../const'
import { BaseSnippet } from '../types'

export const DEFAULT_TEMPLATE: BaseSnippet = {
  immediate: DEFAULT_IMMEDIATE,
  theme: DEFAULT_PREVIEW_THEME,
  defaultLanguage: 'typescript',
  tags: ['typescript'],
  defaultWindowTitle: DEFAULT_WINDOW_TITLE,
  springPreset: DEFAULT_ANIMATION_PRESET,
  showLineNumbers: DEFAULT_SHOW_NUMBERS,
  windowControlsType: DEFAULT_WINDOWS_CONTROLS_TYPE,
  windowControlsPosition: DEFAULT_WINDOWS_CONTROLS_POSITION,
  backgroundColor: DEFAULT_APP_COLOR,
  startingStep: DEFAULT_STARTING_STEP,
  cycleSpeed: DEFAULT_CYCLE_SPEED,
  cycle: DEFAULT_CYCLE,
  status: DEFAULT_SNIPPET_STATUS,
  visibility: DEFAULT_SNIPPET_VISIBILITY,
  name: 'Hello world',
  steps: [
    {
      title: 'Welcome to Wave Snippets!',
      code:
        "import React, {CSSProperties} from 'react'\n\ntype WaveyProps = {\n  style: CSSProperties\n}\n\nexport const Wavey: FC<WaveyProps> = () => {\n  return (\n    <div>\n      <p>Wavey</p>\n    </div>\n  )\n}",
      focus: '',
      id: '1',
      lang: 'tsx',
      subtitle: '',
    },
    {
      code:
        "import React, {CSSProperties} from 'react'\n\ntype WaveyProps = {\n  style: CSSProperties\n  waves: string[]\n}\n\nexport const Wavey: FC<WaveyProps> = ({waves = []}) => {\n  return (\n    <div>\n      <p>Wavey</p>\n    </div>\n  )\n}",
      focus: '',
      title: 'Add code in steps to explain complicated concepts',
      id: 'bDfKaplp_',
      subtitle: '',
      lang: 'tsx',
    },
    {
      subtitle: '',
      focus: '',
      id: 'xvN4QKERN',
      title: 'Download and share them with the world!',
      code:
        "import React, {CSSProperties} from 'react'\n\ntype WaveyProps = {\n  style: CSSProperties\n  waves: string[]\n}\n\nexport const Wavey: FC<WaveyProps> = ({waves = []}) => {\n  return (\n    <div>\n      <p>Wavey</p>\n      {waves.map(wave => {\n        return (\n          <p>Stay wavy: {wave}</p>\n        )\n      })}\n    </div>\n  )\n}",
      lang: 'tsx',
    },
  ],
}
