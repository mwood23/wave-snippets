import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/jsx/jsx'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/css/css'
import 'codemirror/mode/clike/clike'
import 'codemirror/mode/shell/shell'
import 'codemirror/mode/coffeescript/coffeescript'
import 'codemirror/mode/clojure/clojure'
import 'codemirror/mode/dart/dart'
import 'codemirror/mode/diff/diff'
import 'codemirror/mode/dockerfile/dockerfile'
import 'codemirror-mode-elixir'
import 'codemirror/mode/elm/elm'
import 'codemirror/mode/go/go'
import 'codemirror/mode/groovy/groovy'
import 'codemirror/mode/haskell/haskell'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/octave/octave'
import 'codemirror/mode/mllike/mllike'
import 'codemirror/mode/php/php'
import 'codemirror/mode/python/python'
import 'codemirror/mode/r/r'
import 'codemirror/mode/ruby/ruby'
import 'codemirror/mode/rust/rust'
import 'codemirror/mode/sass/sass'
import 'codemirror/mode/sql/sql'
import 'codemirror/mode/stylus/stylus'
import 'codemirror/mode/swift/swift'
import 'codemirror/mode/yaml/yaml'

import styled from '@emotion/styled'
import { InputStep } from '@waves/shared'
import React, { FC, useEffect, useRef, useState } from 'react'
import { Controlled as CodeMirror } from 'react-codemirror2'
import { usePrevious } from 'react-delta'

import { DEFAULT_STEP_MESSAGE } from '../const'
import {
  ParsedFocus,
  addFocusToSelection,
  addLineToFocus,
  allPass,
  concat,
  deserializeFocus,
  equals,
  groupArrayBySequence,
  head,
  isArray,
  last,
  mapObjIndexed,
  mergeDeepWith,
  pick,
  removeLineFromFocus,
  serializeFocus,
  times,
  uniq,
} from '../utils'
import { Box, BoxProps, IconButton, Tooltip, useColorMode } from './core'

type EditorProps = {
  containerStyleProps?: BoxProps
  theme?: string
  step: InputStep
  onChange: (
    editor: CodeMirror.Editor,
    data: CodeMirror.EditorChange,
    value: {
      code: string
      focus: string
    },
  ) => void
  onFocusChanged: (serializedFocus: string, stepID: string) => void
  language: string | { name: string; [x: string]: any }
}

const getLineNumbers = (str: string) => str.split(/\r\n|\r|\n/).length

const EditorContainer = styled(Box)`
  .CodeMirror {
    height: 250px;
  }

  .CodeMirror-gutter-elt {
    cursor: pointer;
  }

  .waves-highlight-line,
  .waves-highlight-column {
    background-color: ${(props) =>
      // @ts-ignore
      props.theme.colors.whiteAlpha['400']};
  }
`

export const Editor: FC<EditorProps> = ({
  step,
  onChange,
  onFocusChanged,
  containerStyleProps = {},
  theme,
  language,
}) => {
  const { colorMode } = useColorMode()
  const editorRef = useRef<CodeMirror.Editor>()
  const [parsedFocus, setParsedFocus] = useState(
    step.focus ? deserializeFocus(step.focus) : {},
  )
  const previousParsedFocus = usePrevious<ParsedFocus>(parsedFocus)

  useEffect(() => {
    if (!editorRef.current || equals(previousParsedFocus, parsedFocus)) {
      return
    }

    onFocusChanged(serializeFocus(parsedFocus), step.id)

    /**
     * Clear all marks and line highlights and rebuild the focus states
     */
    editorRef.current?.getAllMarks().forEach((m) => {
      m.clear()
    })

    const numberOfLines = editorRef.current?.lineCount()
    if (numberOfLines !== undefined) {
      times((line) => {
        editorRef.current?.removeLineClass(
          Number(line),
          'background',
          'waves-highlight-line',
        )
      }, numberOfLines)
    }

    mapObjIndexed((value, lineNumber, _object) => {
      const line = Number(lineNumber)
      // Must be precisely true because column specific styles are an array of numbers
      if (value === true) {
        editorRef.current?.addLineClass(
          Number(line),
          'background',
          'waves-highlight-line',
        )
      }

      if (isArray(value)) {
        const columnGroupsToMark = groupArrayBySequence(value)

        columnGroupsToMark.forEach((columnGroup) => {
          if (columnGroup.length > 0) {
            editorRef.current?.markText(
              { line, ch: head(columnGroup)! }, // length check above
              { line, ch: last(columnGroup)! + 1 }, // +1 because of how code mirror does positions
              {
                className: 'waves-highlight-column',
                inclusiveLeft: false,
                inclusiveRight: false,
              },
            )
          }
        })
      }
    }, parsedFocus)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedFocus, step, editorRef])

  return (
    <EditorContainer {...containerStyleProps}>
      <Box mb="2">
        <Tooltip
          hasArrow
          aria-label="Highlight selection"
          label="Highlight Selection"
          placement="top"
          showDelay={200}
        >
          <IconButton
            aria-label="Highlight selection"
            icon="plus-square"
            mr="2"
            onMouseDown={(e) => {
              e.preventDefault()

              if (!editorRef.current) return

              const selections = editorRef.current.listSelections()
              setParsedFocus((f) => {
                let newFocus: any
                selections?.forEach(({ anchor, head }) => {
                  if (!editorRef.current) return

                  const anchorContent = editorRef.current.getLine(anchor.line)
                  const headContent = editorRef.current.getLine(head.line)

                  newFocus = mergeDeepWith(
                    (a, b) => {
                      if (allPass([isArray])(a, b))
                        //   @ts-ignore
                        return uniq(concat<number[]>(a, b))

                      return true
                    },
                    newFocus,
                    addFocusToSelection({
                      anchor: { ...anchor, content: anchorContent },
                      head: { ...head, content: headContent },
                      parsedFocus: f,
                    }),
                  )
                })

                return newFocus
              })
            }}
            size="xs"
          />
        </Tooltip>
        <Tooltip
          hasArrow
          aria-label="Clear Selections"
          label="Clear Selections"
          placement="top"
          showDelay={200}
        >
          <IconButton
            aria-label="Clear all Selections"
            icon="minus"
            onMouseDown={(e) => {
              e.preventDefault()

              editorRef.current?.getAllMarks().forEach((m) => {
                m.clear()
              })

              const numberOfLines = editorRef.current?.lineCount()
              if (numberOfLines !== undefined) {
                times((line) => {
                  editorRef.current?.removeLineClass(
                    Number(line),
                    'background',
                    'waves-highlight-line',
                  )
                }, numberOfLines)
              }

              setParsedFocus({})
            }}
            size="xs"
          />
        </Tooltip>
      </Box>
      <CodeMirror
        editorDidMount={(editor) => {
          editorRef.current = editor
        }}
        onBeforeChange={(editor, data, value) => {
          const numberOfLines = getLineNumbers(value)
          let newParsedFocus = { ...parsedFocus }

          // Normalize the focus just in case the user is deleting lines. If we don't do this
          // the waves previewer might explode because we have focus for something that doesn't exist
          if (numberOfLines !== undefined) {
            newParsedFocus = pick(
              times((i) => `${i}`, numberOfLines - 1), // Minus one because things are 0 indexed
              parsedFocus,
            )
          }

          onChange(editor, data, {
            code: value,
            focus: serializeFocus(newParsedFocus),
          })
        }}
        onGutterClick={(editor, lineNumber) => {
          // Has to be a function because CodeMirror holds onto a ref of this function
          setParsedFocus((f) => {
            if (f[lineNumber] === true) {
              // Remove like class
              editor.removeLineClass(lineNumber, 'background')

              // And any associated column marks
              return removeLineFromFocus(lineNumber, f)
            }

            editor.addLineClass(
              lineNumber,
              'background',
              'waves-highlight-line',
            )

            return addLineToFocus(lineNumber, f)
          })
        }}
        options={{
          mode: language,
          indentUnit: 2,
          lineNumbers: true,
          spellcheck: true,
          extraKeys: {
            'Shift-Tab': 'indentLess',
          },
          lineWrapping: true,
          smartIndent: true,
          theme: theme ?? colorMode === 'dark' ? 'dracula' : 'eclipse',
          tabSize: 2,
          maxHighlightLength: Infinity,
        }}
        value={step.code}
      />
    </EditorContainer>
  )
}
