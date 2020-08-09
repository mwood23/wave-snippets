import { BaseSnippet } from '../types'

export const NPM_PACKAGE_TEMPLATE: BaseSnippet = {
  tags: ['jsx'],
  steps: [
    {
      id: 'AI4iPd-yR',
      subtitle: 'app.js',
      code:
        'import { ThemeProvider, CSSReset } from "@chakra-ui/core"\n\n// Do this at the root of your application\nconst App = ({ children }) => (\n  <ThemeProvider>\n    <CSSReset />\n  </ThemeProvider>\n);',
      title: 'Inject the Theme and CSSReset at the root of your app',
      focus: '',
      lang: 'jsx',
    },
    {
      subtitle: '',
      id: 'Mrt0HYlkA',
      focus: '6[5,6,7,8,9,10,11,12,13,14,15,16]',
      title:
        'This removes browser default styles for cross browser consistency!',
      lang: 'jsx',
      code:
        'import { ThemeProvider, CSSReset } from "@chakra-ui/core"\n\n// Do this at the root of your application\nconst App = ({ children }) => (\n  <ThemeProvider>\n    <CSSReset />\n  </ThemeProvider>\n);',
    },
    {
      subtitle: 'app.js',
      focus: '',
      lang: 'jsx',
      code:
        'import { ThemeProvider, CSSReset } from "@chakra-ui/core"\nimport { Button } from "@chakra-ui/core";\n\n// Do this at the root of your application\nconst App = ({ children }) => (\n  <ThemeProvider>\n    <CSSReset />\n      <Button>⚡️Chakra!</Button>\n  </ThemeProvider>\n);',
      title: 'Import and use all the nifty components!',
      id: 'VJw0l3vOH',
    },
    {
      code:
        'import { ThemeProvider, CSSReset } from "@chakra-ui/core"\nimport { Button } from "@chakra-ui/core";\n\n// Do this at the root of your application\nconst App = ({ children }) => (\n  <ThemeProvider>\n    <CSSReset />\n      <Button color="red" fontSize="14px">⚡️Chakra!</Button>\n  </ThemeProvider>\n);',
      title: 'Add CSS as props like magic!',
      focus:
        '8[15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41]',
      id: 'f78q1fRkC',
      subtitle: '',
      lang: 'jsx',
    },
  ],
  name: 'Getting Started',
  showLineNumbers: false,
  showBackground: false,
  springPreset: 'default',
  windowControlsPosition: 'left',
  status: 'draft',
  visibility: 'unlisted',
  windowControlsType: null,
  defaultLanguage: 'jsx',
  theme: 'nightOwl',
  backgroundColor: {
    g: 151,
    b: 149,
    r: 49,
    a: 1,
  },
  cycleSpeed: 2000,
  defaultWindowTitle: '',
  startingStep: 0,
  immediate: false,
  cycle: false,
}
