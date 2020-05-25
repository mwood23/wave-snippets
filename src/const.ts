import { normalizeArray } from './utils'

export const DEFAULT_CYCLE_SPEED = 4000
export const DEFAULT_PREVIEW_THEME = 'nightOwl'

export const SUPPORTED_CODING_LANGAUGES = [
  {
    value: 'markup',
    aliases: ['html', 'xml', 'svg', 'mathml', 'ssml', 'atom', 'rss'],
    name: 'Markup',
  },
  {
    value: 'css',
    aliases: [],
    name: 'CSS',
  },
  {
    value: 'clike',
    aliases: [],
    name: 'C-like',
  },
  {
    value: 'javascript',
    aliases: ['js'],
    name: 'JavaScript',
  },
  // {
  //   value: 'abap',
  //   aliases: [],
  //   name: 'ABAP',
  // },
  // {
  //   value: 'abnf',
  //   aliases: [],
  //   name: 'Augmented Backus–Naur form',
  // },
  // {
  //   value: 'actionscript',
  //   aliases: [],
  //   name: 'ActionScript',
  // },
  // {
  //   value: 'ada',
  //   aliases: [],
  //   name: 'Ada',
  // },
  // {
  //   value: 'al',
  //   aliases: [],
  //   name: 'AL',
  // },
  // {
  //   value: 'antlr4',
  //   aliases: ['g4'],
  //   name: 'ANTLR4',
  // },
  // {
  //   value: 'apacheconf',
  //   aliases: [],
  //   name: 'Apache Configuration',
  // },
  // {
  //   value: 'apl',
  //   aliases: [],
  //   name: 'APL',
  // },
  // {
  //   value: 'applescript',
  //   aliases: [],
  //   name: 'AppleScript',
  // },
  // {
  //   value: 'aql',
  //   aliases: [],
  //   name: 'AQL',
  // },
  // {
  //   value: 'arduino',
  //   aliases: [],
  //   name: 'Arduino',
  // },
  // {
  //   value: 'arff',
  //   aliases: [],
  //   name: 'ARFF',
  // },
  // {
  //   value: 'asciidoc',
  //   aliases: ['adoc'],
  //   name: 'AsciiDoc',
  // },
  // {
  //   value: 'asm6502',
  //   aliases: [],
  //   name: '6502 Assembly',
  // },
  // {
  //   value: 'aspnet',
  //   aliases: [],
  //   name: 'ASP.NET (C#)',
  // },
  // {
  //   value: 'autohotkey',
  //   aliases: [],
  //   name: 'AutoHotkey',
  // },
  // {
  //   value: 'autoit',
  //   aliases: [],
  //   name: 'AutoIt',
  // },
  {
    value: 'bash',
    aliases: ['shell'],
    name: 'Bash',
  },
  // {
  //   value: 'basic',
  //   aliases: [],
  //   name: 'BASIC',
  // },
  // {
  //   value: 'batch',
  //   aliases: [],
  //   name: 'Batch',
  // },
  // {
  //   value: 'bbcode',
  //   aliases: ['shortcode'],
  //   name: 'BBcode',
  // },
  // {
  //   value: 'bison',
  //   aliases: [],
  //   name: 'Bison',
  // },
  // {
  //   value: 'bnf',
  //   aliases: ['rbnf'],
  //   name: 'Backus–Naur form',
  // },
  // {
  //   value: 'brainfuck',
  //   aliases: [],
  //   name: 'Brainfuck',
  // },
  // {
  //   value: 'brightscript',
  //   aliases: [],
  //   name: 'BrightScript',
  // },
  // {
  //   value: 'bro',
  //   aliases: [],
  //   name: 'Bro',
  // },
  {
    value: 'c',
    aliases: [],
    name: 'C',
  },
  // {
  //   value: 'concurnas',
  //   aliases: ['conc'],
  //   name: 'Concurnas',
  // },
  {
    value: 'csharp',
    aliases: ['cs', 'dotnet'],
    name: 'C#',
  },
  {
    value: 'cpp',
    aliases: [],
    name: 'C++',
  },
  // {
  //   value: 'cil',
  //   aliases: [],
  //   name: 'CIL',
  // },
  {
    value: 'coffeescript',
    aliases: ['coffee'],
    name: 'CoffeeScript',
  },
  // {
  //   value: 'cmake',
  //   aliases: [],
  //   name: 'CMake',
  // },
  {
    value: 'clojure',
    aliases: [],
    name: 'Clojure',
  },
  // {
  //   value: 'crystal',
  //   aliases: [],
  //   name: 'Crystal',
  // },
  // {
  //   value: 'csp',
  //   aliases: [],
  //   name: 'Content-Security-Policy',
  // },
  {
    value: 'css-extras',
    aliases: [],
    name: 'CSS Extras',
  },
  // {
  //   value: 'd',
  //   aliases: [],
  //   name: 'D',
  // },
  {
    value: 'dart',
    aliases: [],
    name: 'Dart',
  },
  // {
  //   value: 'dax',
  //   aliases: [],
  //   name: 'DAX',
  // },
  {
    value: 'diff',
    aliases: [],
    name: 'Diff',
  },
  // {
  //   value: 'django',
  //   aliases: ['jinja2'],
  //   name: 'Django/Jinja2',
  // },
  // {
  //   value: 'dns-zone-file',
  //   aliases: ['dns-zone'],
  //   name: 'DNS zone file',
  // },
  {
    value: 'docker',
    aliases: ['dockerfile'],
    name: 'Docker',
  },
  // {
  //   value: 'ebnf',
  //   aliases: [],
  //   name: 'Extended Backus–Naur form',
  // },
  // {
  //   value: 'eiffel',
  //   aliases: [],
  //   name: 'Eiffel',
  // },
  // {
  //   value: 'ejs',
  //   aliases: ['eta'],
  //   name: 'EJS',
  // },
  {
    value: 'elixir',
    aliases: [],
    name: 'Elixir',
  },
  {
    value: 'elm',
    aliases: [],
    name: 'Elm',
  },
  // {
  //   value: 'etlua',
  //   aliases: [],
  //   name: 'Embedded Lua templating',
  // },
  // {
  //   value: 'erb',
  //   aliases: [],
  //   name: 'ERB',
  // },
  // {
  //   value: 'erlang',
  //   aliases: [],
  //   name: 'Erlang',
  // },
  // {
  //   value: 'excel-formula',
  //   aliases: ['xlsx', 'xls'],
  //   name: 'Excel Formula',
  // },
  // {
  //   value: 'fsharp',
  //   aliases: [],
  //   name: 'F#',
  // },
  // {
  //   value: 'factor',
  //   aliases: [],
  //   name: 'Factor',
  // },
  // {
  //   value: 'firestore-security-rules',
  //   aliases: [],
  //   name: 'Firestore security rules',
  // },
  // {
  //   value: 'flow',
  //   aliases: [],
  //   name: 'Flow',
  // },
  // {
  //   value: 'fortran',
  //   aliases: [],
  //   name: 'Fortran',
  // },
  // {
  //   value: 'ftl',
  //   aliases: [],
  //   name: 'FreeMarker Template Language',
  // },
  // {
  //   value: 'gcode',
  //   aliases: [],
  //   name: 'G-code',
  // },
  // {
  //   value: 'gdscript',
  //   aliases: [],
  //   name: 'GDScript',
  // },
  // {
  //   value: 'gedcom',
  //   aliases: [],
  //   name: 'GEDCOM',
  // },
  // {
  //   value: 'gherkin',
  //   aliases: [],
  //   name: 'Gherkin',
  // },
  {
    value: 'git',
    aliases: [],
    name: 'Git',
  },
  // {
  //   value: 'glsl',
  //   aliases: [],
  //   name: 'GLSL',
  // },
  // {
  //   value: 'gml',
  //   aliases: ['gamemakerlanguage'],
  //   name: 'GameMaker Language',
  // },
  {
    value: 'go',
    aliases: [],
    name: 'Go',
  },
  {
    value: 'graphql',
    aliases: [],
    name: 'GraphQL',
  },
  {
    value: 'groovy',
    aliases: [],
    name: 'Groovy',
  },
  // {
  //   value: 'haml',
  //   aliases: [],
  //   name: 'Haml',
  // },
  // {
  //   value: 'handlebars',
  //   aliases: [],
  //   name: 'Handlebars',
  // },
  {
    value: 'haskell',
    aliases: ['hs'],
    name: 'Haskell',
  },
  // {
  //   value: 'haxe',
  //   aliases: [],
  //   name: 'Haxe',
  // },
  // {
  //   value: 'hcl',
  //   aliases: [],
  //   name: 'HCL',
  // },
  // {
  //   value: 'hlsl',
  //   aliases: [],
  //   name: 'HLSL',
  // },
  // {
  //   value: 'http',
  //   aliases: [],
  //   name: 'HTTP',
  // },
  // {
  //   value: 'hpkp',
  //   aliases: [],
  //   name: 'HTTP Public-Key-Pins',
  // },
  // {
  //   value: 'hsts',
  //   aliases: [],
  //   name: 'HTTP Strict-Transport-Security',
  // },
  // {
  //   value: 'ichigojam',
  //   aliases: [],
  //   name: 'IchigoJam',
  // },
  // {
  //   value: 'icon',
  //   aliases: [],
  //   name: 'Icon',
  // },
  // {
  //   value: 'iecst',
  //   aliases: [],
  //   name: 'Structured Text (IEC 61131-3)',
  // },
  // {
  //   value: 'inform7',
  //   aliases: [],
  //   name: 'Inform 7',
  // },
  // {
  //   value: 'ini',
  //   aliases: [],
  //   name: 'Ini',
  // },
  // {
  //   value: 'io',
  //   aliases: [],
  //   name: 'Io',
  // },
  // {
  //   value: 'j',
  //   aliases: [],
  //   name: 'J',
  // },
  {
    value: 'java',
    aliases: [],
    name: 'Java',
  },
  // {
  //   value: 'javadoc',
  //   aliases: [],
  //   name: 'JavaDoc',
  // },
  // {
  //   value: 'javadoclike',
  //   aliases: [],
  //   name: 'JavaDoc-like',
  // },
  // {
  //   value: 'javastacktrace',
  //   aliases: [],
  //   name: 'Java stack trace',
  // },
  // {
  //   value: 'jolie',
  //   aliases: [],
  //   name: 'Jolie',
  // },
  // {
  //   value: 'jq',
  //   aliases: [],
  //   name: 'JQ',
  // },
  // {
  //   value: 'jsdoc',
  //   aliases: [],
  //   name: 'JSDoc',
  // },
  {
    value: 'js-extras',
    aliases: [],
    name: 'JS Extras',
  },
  // {
  //   value: 'js-templates',
  //   aliases: [],
  //   name: 'JS Templates',
  // },
  {
    value: 'json',
    aliases: ['webmanifest'],
    name: 'JSON',
  },
  // {
  //   value: 'jsonp',
  //   aliases: [],
  //   name: 'JSONP',
  // },
  // {
  //   value: 'json5',
  //   aliases: [],
  //   name: 'JSON5',
  // },
  // {
  //   value: 'julia',
  //   aliases: [],
  //   name: 'Julia',
  // },
  // {
  //   value: 'keyman',
  //   aliases: [],
  //   name: 'Keyman',
  // },
  {
    value: 'kotlin',
    aliases: [],
    name: 'Kotlin',
  },
  // {
  //   value: 'latex',
  //   aliases: ['tex', 'context'],
  //   name: 'LaTeX',
  // },
  // {
  //   value: 'latte',
  //   aliases: [],
  //   name: 'Latte',
  // },
  {
    value: 'less',
    aliases: [],
    name: 'Less',
  },
  // {
  //   value: 'lilypond',
  //   aliases: ['ly'],
  //   name: 'LilyPond',
  // },
  // {
  //   value: 'liquid',
  //   aliases: [],
  //   name: 'Liquid',
  // },
  // {
  //   value: 'lisp',
  //   aliases: ['emacs', 'elisp', 'emacs-lisp'],
  //   name: 'Lisp',
  // },
  // {
  //   value: 'livescript',
  //   aliases: [],
  //   name: 'LiveScript',
  // },
  // {
  //   value: 'llvm',
  //   aliases: [],
  //   name: 'LLVM IR',
  // },
  // {
  //   value: 'lolcode',
  //   aliases: [],
  //   name: 'LOLCODE',
  // },
  // {
  //   value: 'lua',
  //   aliases: [],
  //   name: 'Lua',
  // },
  {
    value: 'makefile',
    aliases: [],
    name: 'Makefile',
  },
  {
    value: 'markdown',
    aliases: ['md'],
    name: 'Markdown',
  },
  // {
  //   value: 'markup-templating',
  //   aliases: [],
  //   name: 'Markup templating',
  // },
  {
    value: 'matlab',
    aliases: [],
    name: 'MATLAB',
  },
  // {
  //   value: 'mel',
  //   aliases: [],
  //   name: 'MEL',
  // },
  // {
  //   value: 'mizar',
  //   aliases: [],
  //   name: 'Mizar',
  // },
  // {
  //   value: 'monkey',
  //   aliases: [],
  //   name: 'Monkey',
  // },
  // {
  //   value: 'moonscript',
  //   aliases: ['moon'],
  //   name: 'MoonScript',
  // },
  // {
  //   value: 'n1ql',
  //   aliases: [],
  //   name: 'N1QL',
  // },
  // {
  //   value: 'n4js',
  //   aliases: ['n4jsd'],
  //   name: 'N4JS',
  // },
  // {
  //   value: 'nand2tetris-hdl',
  //   aliases: [],
  //   name: 'Nand To Tetris HDL',
  // },
  // {
  //   value: 'nasm',
  //   aliases: [],
  //   name: 'NASM',
  // },
  // {
  //   value: 'neon',
  //   aliases: [],
  //   name: 'NEON',
  // },
  // {
  //   value: 'nginx',
  //   aliases: [],
  //   name: 'nginx',
  // },
  // {
  //   value: 'nim',
  //   aliases: [],
  //   name: 'Nim',
  // },
  // {
  //   value: 'nix',
  //   aliases: [],
  //   name: 'Nix',
  // },
  // {
  //   value: 'nsis',
  //   aliases: [],
  //   name: 'NSIS',
  // },
  {
    value: 'objectivec',
    aliases: ['objc'],
    name: 'Objective-C',
  },
  {
    value: 'ocaml',
    aliases: [],
    name: 'OCaml',
  },
  // {
  //   value: 'opencl',
  //   aliases: [],
  //   name: 'OpenCL',
  // },
  // {
  //   value: 'oz',
  //   aliases: [],
  //   name: 'Oz',
  // },
  // {
  //   value: 'parigp',
  //   aliases: [],
  //   name: 'PARI/GP',
  // },
  // {
  //   value: 'parser',
  //   aliases: [],
  //   name: 'Parser',
  // },
  // {
  //   value: 'pascal',
  //   aliases: ['objectpascal'],
  //   name: 'Pascal',
  // },
  // {
  //   value: 'pascaligo',
  //   aliases: [],
  //   name: 'Pascaligo',
  // },
  // {
  //   value: 'pcaxis',
  //   aliases: ['px'],
  //   name: 'PC-Axis',
  // },
  // {
  //   value: 'peoplecode',
  //   aliases: ['pcode'],
  //   name: 'PeopleCode',
  // },
  // {
  //   value: 'perl',
  //   aliases: [],
  //   name: 'Perl',
  // },
  {
    value: 'php',
    aliases: [],
    name: 'PHP',
  },
  // {
  //   value: 'phpdoc',
  //   aliases: [],
  //   name: 'PHPDoc',
  // },
  {
    value: 'php-extras',
    aliases: [],
    name: 'PHP Extras',
  },
  // {
  //   value: 'plsql',
  //   aliases: [],
  //   name: 'PL/SQL',
  // },
  // {
  //   value: 'powerquery',
  //   aliases: ['pq', 'mscript'],
  //   name: 'PowerQuery',
  // },
  // {
  //   value: 'powershell',
  //   aliases: [],
  //   name: 'PowerShell',
  // },
  // {
  //   value: 'processing',
  //   aliases: [],
  //   name: 'Processing',
  // },
  // {
  //   value: 'prolog',
  //   aliases: [],
  //   name: 'Prolog',
  // },
  // {
  //   value: 'properties',
  //   aliases: [],
  //   name: '.properties',
  // },
  // {
  //   value: 'protobuf',
  //   aliases: [],
  //   name: 'Protocol Buffers',
  // },
  // {
  //   value: 'pug',
  //   aliases: [],
  //   name: 'Pug',
  // },
  // {
  //   value: 'puppet',
  //   aliases: [],
  //   name: 'Puppet',
  // },
  // {
  //   value: 'pure',
  //   aliases: [],
  //   name: 'Pure',
  // },
  // {
  //   value: 'purebasic',
  //   aliases: ['pbfasm'],
  //   name: 'PureBasic',
  // },
  {
    value: 'python',
    aliases: ['py'],
    name: 'Python',
  },
  // {
  //   value: 'q',
  //   aliases: [],
  //   name: 'Q (kdb+ database)',
  // },
  // {
  //   value: 'qml',
  //   aliases: [],
  //   name: 'QML',
  // },
  // {
  //   value: 'qore',
  //   aliases: [],
  //   name: 'Qore',
  // },
  {
    value: 'r',
    aliases: [],
    name: 'R',
  },
  // {
  //   value: 'racket',
  //   aliases: ['rkt'],
  //   name: 'Racket',
  // },
  {
    value: 'jsx',
    aliases: [],
    name: 'React JSX',
  },
  {
    value: 'tsx',
    aliases: [],
    name: 'React TSX',
  },
  // {
  //   value: 'renpy',
  //   aliases: ['rpy'],
  //   name: "Ren'py",
  // },
  {
    value: 'reason',
    aliases: [],
    name: 'Reason',
  },
  // {
  //   value: 'regex',
  //   aliases: [],
  //   name: 'Regex',
  // },
  // {
  //   value: 'rest',
  //   aliases: [],
  //   name: 'reST (reStructuredText)',
  // },
  // {
  //   value: 'rip',
  //   aliases: [],
  //   name: 'Rip',
  // },
  // {
  //   value: 'roboconf',
  //   aliases: [],
  //   name: 'Roboconf',
  // },
  // {
  //   value: 'robotframework',
  //   aliases: ['robot'],
  //   name: 'Robot Framework',
  // },
  {
    value: 'ruby',
    aliases: ['rb'],
    name: 'Ruby',
  },
  {
    value: 'rust',
    aliases: [],
    name: 'Rust',
  },
  // {
  //   value: 'sas',
  //   aliases: [],
  //   name: 'SAS',
  // },
  {
    value: 'sass',
    aliases: [],
    name: 'Sass (Sass)',
  },
  {
    value: 'scss',
    aliases: [],
    name: 'Sass (Scss)',
  },
  // {
  //   value: 'scala',
  //   aliases: [],
  //   name: 'Scala',
  // },
  // {
  //   value: 'scheme',
  //   aliases: [],
  //   name: 'Scheme',
  // },
  // {
  //   value: 'shell-session',
  //   aliases: [],
  //   name: 'Shell session',
  // },
  // {
  //   value: 'smalltalk',
  //   aliases: [],
  //   name: 'Smalltalk',
  // },
  // {
  //   value: 'smarty',
  //   aliases: [],
  //   name: 'Smarty',
  // },
  // {
  //   value: 'solidity',
  //   aliases: [],
  //   name: 'Solidity (Ethereum)',
  // },
  // {
  //   value: 'solution-file',
  //   aliases: ['sln'],
  //   name: 'Solution file',
  // },
  // {
  //   value: 'soy',
  //   aliases: [],
  //   name: 'Soy (Closure Template)',
  // },
  // {
  //   value: 'sparql',
  //   aliases: ['rq'],
  //   name: 'SPARQL',
  // },
  // {
  //   value: 'splunk-spl',
  //   aliases: [],
  //   name: 'Splunk SPL',
  // },
  // {
  //   value: 'sqf',
  //   aliases: [],
  //   name: 'SQF: Status Quo Function (Arma 3)',
  // },
  {
    value: 'sql',
    aliases: [],
    name: 'SQL',
  },
  {
    value: 'stylus',
    aliases: [],
    name: 'Stylus',
  },
  {
    value: 'swift',
    aliases: [],
    name: 'Swift',
  },
  // {
  //   value: 'tap',
  //   aliases: [],
  //   name: 'TAP',
  // },
  // {
  //   value: 'tcl',
  //   aliases: [],
  //   name: 'Tcl',
  // },
  // {
  //   value: 'textile',
  //   aliases: [],
  //   name: 'Textile',
  // },
  // {
  //   value: 'toml',
  //   aliases: [],
  //   name: 'TOML',
  // },
  // {
  //   value: 'tt2',
  //   aliases: [],
  //   name: 'Template Toolkit 2',
  // },
  // {
  //   value: 'turtle',
  //   aliases: ['trig'],
  //   name: 'Turtle',
  // },
  // {
  //   value: 'twig',
  //   aliases: [],
  //   name: 'Twig',
  // },
  {
    value: 'typescript',
    aliases: ['ts'],
    name: 'TypeScript',
  },
  // {
  //   value: 't4-cs',
  //   aliases: ['t4'],
  //   name: 'T4 Text Templates (C#)',
  // },
  // {
  //   value: 't4-vb',
  //   aliases: [],
  //   name: 'T4 Text Templates (VB)',
  // },
  // {
  //   value: 't4-templating',
  //   aliases: [],
  //   name: 'T4 templating',
  // },
  // {
  //   value: 'unrealscript',
  //   aliases: ['uscript', 'uc'],
  //   name: 'UnrealScript',
  // },
  // {
  //   value: 'vala',
  //   aliases: [],
  //   name: 'Vala',
  // },
  // {
  //   value: 'vbnet',
  //   aliases: [],
  //   name: 'VB.Net',
  // },
  // {
  //   value: 'velocity',
  //   aliases: [],
  //   name: 'Velocity',
  // },
  // {
  //   value: 'verilog',
  //   aliases: [],
  //   name: 'Verilog',
  // },
  // {
  //   value: 'vhdl',
  //   aliases: [],
  //   name: 'VHDL',
  // },
  // {
  //   value: 'vim',
  //   aliases: [],
  //   name: 'vim',
  // },
  // {
  //   value: 'visual-basic',
  //   aliases: ['vb'],
  //   name: 'Visual Basic',
  // },
  // {
  //   value: 'warpscript',
  //   aliases: [],
  //   name: 'WarpScript',
  // },
  {
    value: 'wasm',
    aliases: [],
    name: 'WebAssembly',
  },
  // {
  //   value: 'wiki',
  //   aliases: [],
  //   name: 'Wiki markup',
  // },
  // {
  //   value: 'xeora',
  //   aliases: ['xeoracube'],
  //   name: 'Xeora',
  // },
  // {
  //   value: 'xml-doc',
  //   aliases: [],
  //   name: 'XML doc (.net)',
  // },
  // {
  //   value: 'xojo',
  //   aliases: [],
  //   name: 'Xojo (REALbasic)',
  // },
  // {
  //   value: 'xquery',
  //   aliases: [],
  //   name: 'XQuery',
  // },
  {
    value: 'yaml',
    aliases: ['yml'],
    name: 'YAML',
  },
  // {
  //   value: 'zig',
  //   aliases: [],
  //   name: 'Zig',
  // },
]

export const SUPPORTED_CODING_LANGAUGES_DICT = normalizeArray(
  SUPPORTED_CODING_LANGAUGES,
  'value',
)
