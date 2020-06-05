export const NPM_PACKAGE_TEMPLATE = {
  tags: ['jsx'],
  steps: [
    {
      id: 'AI4iPd-yR',
      subtitle: 'app.js',
      code:
        'import { ThemeProvider, CSSReset } from "@chakra-ui/core"\n\n// Do this at the root of your application\nconst App = ({ children }) => (\n  <ThemeProvider>\n    <CSSReset />\n  </ThemeProvider>\n);',
      title: 'Inject the Theme and CSSReset at the root of your app',
      stepID: 'AI4iPd-yR',
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
      stepID: 'Mrt0HYlkA',
      code:
        'import { ThemeProvider, CSSReset } from "@chakra-ui/core"\n\n// Do this at the root of your application\nconst App = ({ children }) => (\n  <ThemeProvider>\n    <CSSReset />\n  </ThemeProvider>\n);',
    },
    {
      subtitle: 'app.js',
      stepID: 'VJw0l3vOH',
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
      stepID: 'f78q1fRkC',
      subtitle: '',
      lang: 'jsx',
    },
  ],
  showLineNumbers: false,
  springPreset: 'default',
  windowControlsPosition: 'left',
  status: 'draft',
  visibility: 'private',
  windowControlsType: null,
  updatedOn: '2020-06-05T01:01:44.406Z',
  createdOn: '2020-06-04T03:53:52.388Z',
  defaultLanguage: 'jsx',
  theme: 'nightOwl',
  owner: 'nNzmTpYLb2di505n4sg1c8QYM4n1',
  backgroundColor: {
    g: 151,
    b: 149,
    r: 49,
    a: 1,
  },
  cycleSpeed: '2000',
  defaultWindowTitle: '',
  startingStep: 0,
  immediate: false,
  cycle: false,
  name: 'Installling Chakra UI',
}
