import { normalizeArray } from './utils'

export const DEFAULT_CYCLE_SPEED = 1500
export const DEFAULT_PREVIEW_THEME = 'nightOwl'
export const DEFAULT_CYCLE = false
export const DEFAULT_IMMEDIATE = false

// TODO: Finish this mapping
// https://codemirror.net/mode/clike/index.html
export const SUPPORTED_CODING_LANGAUGES = [
  {
    value: 'markup',
    aliases: ['html', 'xml', 'svg', 'mathml', 'ssml', 'atom', 'rss'],
    name: 'Markup',
    codeMirrorMap: '',
  },
  {
    value: 'markup',
    aliases: ['html', 'xml', 'svg'],
    name: 'HTML',
    codeMirrorMap: 'text/html',
  },
  { value: 'css', aliases: [], name: 'CSS', codeMirrorMap: 'css' },
  { value: 'clike', aliases: [], name: 'C-like', codeMirrorMap: '' },
  {
    value: 'javascript',
    aliases: ['js'],
    name: 'JavaScript',
    codeMirrorMap: 'javascript',
  },
  { value: 'bash', aliases: ['shell'], name: 'Bash', codeMirrorMap: 'shell' },
  { value: 'c', aliases: [], name: 'C', codeMirrorMap: 'clike' },
  {
    value: 'csharp',
    aliases: ['cs', 'dotnet'],
    name: 'C#',
    codeMirrorMap: 'clike',
  },
  { value: 'cpp', aliases: [], name: 'C++', codeMirrorMap: 'clike' },
  {
    value: 'coffeescript',
    aliases: ['coffee'],
    name: 'CoffeeScript',
    codeMirrorMap: 'coffeescript',
  },
  { value: 'clojure', aliases: [], name: 'Clojure', codeMirrorMap: 'clojure' },
  { value: 'dart', aliases: [], name: 'Dart', codeMirrorMap: 'dart' },
  { value: 'diff', aliases: [], name: 'Diff', codeMirrorMap: 'diff' },
  {
    value: 'docker',
    aliases: ['dockerfile'],
    name: 'Docker',
    codeMirrorMap: 'dockerfile',
  },
  { value: 'elixir', aliases: [], name: 'Elixir', codeMirrorMap: '' },
  { value: 'elm', aliases: [], name: 'Elm', codeMirrorMap: 'elm' },
  { value: 'git', aliases: [], name: 'Git', codeMirrorMap: '' },
  { value: 'go', aliases: [], name: 'Go', codeMirrorMap: 'go' },
  { value: 'graphql', aliases: [], name: 'GraphQL', codeMirrorMap: '' },
  { value: 'groovy', aliases: [], name: 'Groovy', codeMirrorMap: 'groovy' },
  {
    value: 'haskell',
    aliases: ['hs'],
    name: 'Haskell',
    codeMirrorMap: 'haskell',
  },
  { value: 'java', aliases: [], name: 'Java', codeMirrorMap: 'java' },
  {
    value: 'json',
    aliases: ['webmanifest'],
    name: 'JSON',
    codeMirrorMap: { name: 'javascript', json: true },
  },
  { value: 'kotlin', aliases: [], name: 'Kotlin', codeMirrorMap: 'clike' },
  { value: 'less', aliases: [], name: 'Less', codeMirrorMap: '' },
  { value: 'makefile', aliases: [], name: 'Makefile', codeMirrorMap: '' },
  {
    value: 'markdown',
    aliases: ['md'],
    name: 'Markdown',
    codeMirrorMap: 'markdown',
  },
  { value: 'matlab', aliases: [], name: 'MATLAB', codeMirrorMap: '' },
  {
    value: 'objectivec',
    aliases: ['objc'],
    name: 'Objective-C',
    codeMirrorMap: '',
  },
  { value: 'ocaml', aliases: [], name: 'OCaml', codeMirrorMap: '' },
  { value: 'php', aliases: [], name: 'PHP', codeMirrorMap: 'php' },
  { value: 'python', aliases: ['py'], name: 'Python', codeMirrorMap: 'python' },
  { value: 'r', aliases: [], name: 'R', codeMirrorMap: 'r' },
  { value: 'jsx', aliases: [], name: 'React JSX', codeMirrorMap: 'jsx' },
  {
    value: 'tsx',
    aliases: [],
    name: 'React TSX',
    codeMirrorMap: {
      name: 'jsx',
      base: { name: 'javascript', typescript: true },
    },
  },
  { value: 'reason', aliases: [], name: 'Reason', codeMirrorMap: '' },
  { value: 'ruby', aliases: ['rb'], name: 'Ruby', codeMirrorMap: 'ruby' },
  { value: 'rust', aliases: [], name: 'Rust', codeMirrorMap: 'rust' },
  { value: 'sass', aliases: [], name: 'Sass', codeMirrorMap: 'sass' },
  { value: 'sql', aliases: [], name: 'SQL', codeMirrorMap: 'sql' },
  { value: 'stylus', aliases: [], name: 'Stylus', codeMirrorMap: 'stylus' },
  { value: 'swift', aliases: [], name: 'Swift', codeMirrorMap: 'swift' },
  {
    value: 'typescript',
    aliases: ['ts'],
    name: 'TypeScript',
    codeMirrorMap: { name: 'javascript', typescript: true },
  },
  { value: 'wasm', aliases: [], name: 'WebAssembly', codeMirrorMap: '' },
  { value: 'yaml', aliases: ['yml'], name: 'YAML', codeMirrorMap: '' },
]

export const SUPPORTED_CODING_LANGAUGES_DICT = normalizeArray(
  SUPPORTED_CODING_LANGAUGES,
  'value',
)
