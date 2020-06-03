/**
 * Taken from Code-surfer/step-parser!
 */

import flat from 'array.prototype.flat'

import {
  forEachObjIndexed,
  isArray,
  maxBy,
  min,
  minBy,
  omit,
  omitBy,
  pipeVal,
  sortNumberArray,
  startsWith,
  symmetricDifference,
  times,
  toString,
} from '.'

type LineIndex = number
type ColumnIndex = number

export type ParsedFocusLine = true | number[]
export type ParsedFocus = Record<number, ParsedFocusLine>

export function fromEntries<K extends string | number | symbol, V>(
  pairs: [K, V][],
) {
  const result = {} as Record<K, V>

  let index = -1,
    // eslint-disable-next-line prefer-const
    length = pairs == null ? 0 : pairs.length

  while (++index < length) {
    const pair = pairs[index]
    result[pair[0]] = pair[1]
  }

  return result
}

export function deserializeFocus(focus: string) {
  if (!focus) {
    throw new Error('Focus cannot be empty')
  }

  const parts = focus.split(/,(?![^[]*\])/g).map(parsePart)
  return fromEntries(flat(parts))
}

type Part = [LineIndex, true | ColumnIndex[]]

function parsePart(part: string): Part[] {
  // a part could be
  // - a line number: "2"
  // - a line range: "5:9"
  // - a line number with a column selector: "2[1,3:5,9]"
  const columnsMatch = part.match(/(\d+)\[(.+)\]/)
  if (columnsMatch) {
    const [, line, columns] = columnsMatch
    const columnsList = columns.split(',').map(expandString)
    const lineIndex = Number(line) - 1
    const columnIndexes = flat(columnsList).map((c) => {
      return c - 1
    })
    return [[lineIndex, columnIndexes]]
  }
  return expandString(part).map((lineNumber) => {
    return [lineNumber - 1, true]
  })
}

function expandString(part: string) {
  // Transforms something like
  // - "1:3" to [1,2,3]
  // - "4" to [4]
  const [start, end] = part.split(':')

  if (!isNaturalNumber(start)) {
    throw new FocusNumberError(start)
  }

  const startNumber = Number(start)

  if (startNumber < 1) {
    throw new LineOrColumnNumberError()
  }

  if (!end) {
    return [startNumber]
  }
  if (!isNaturalNumber(end)) {
    throw new FocusNumberError(end)
  }

  const list: number[] = []
  for (let i = startNumber; i <= +end; i++) {
    list.push(i)
  }
  return list
}

function isNaturalNumber(n: any) {
  n = n.toString() // force the value in case it is not
  const n1 = Math.abs(n),
    n2 = parseInt(n, 10)
  return !isNaN(n1) && n2 === n1 && n1.toString() === n
}

export function getFocusSize(focus: Record<LineIndex, true | ColumnIndex[]>) {
  const lineIndexList = Object.keys(focus).map((k) => {
    return +k
  })
  // eslint-disable-next-line prefer-spread
  const focusStart = Math.min.apply(Math, lineIndexList)
  // eslint-disable-next-line prefer-spread
  const focusEnd = Math.max.apply(Math, lineIndexList)
  return {
    focusCenter: (focusStart + focusEnd + 1) / 2,
    focusCount: focusEnd - focusStart + 1,
  }
}

export class LineOrColumnNumberError extends Error {
  constructor() {
    super(`Invalid line or column number in focus string`)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class FocusNumberError extends Error {
  number: string
  constructor(number: string) {
    super(`Invalid number "${number}" in focus string`)
    this.number = number
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

/**
 * Custom code below!
 */

// Doesn't create shorthand like 4:7 since it doesn't have to. We make everything 4,5,6,7
export function serializeFocus(parsedFocus: Record<number, true | number[]>) {
  let focusString = ''

  forEachObjIndexed((val, lineNumber) => {
    // Deserialized is 0 indexed while serialized numbers start at 1
    const serializedLineNumber = Number(lineNumber) + 1

    if (val === true) {
      // Can cause something like this ,1,2,3 (note leading comma)
      focusString = `${focusString},${serializedLineNumber}`
    }

    if (isArray(val)) {
      focusString = `${focusString},${serializedLineNumber}[${val
        .map((v) => {
          // Columns are 0 base indexed until they're serialized as well. 0 = 1
          return Number(v) + 1
        })
        .join(',')}]`
    }
  }, parsedFocus)

  return startsWith(',', focusString)
    ? focusString.replace(',', '')
    : focusString
}

export const removeLineFromFocus = (
  lineNumber: number,
  parsedFocus: ParsedFocus,
) => {
  return omit([toString(lineNumber)], parsedFocus)
}

export const addLineToFocus = (
  lineNumber: number,
  parsedFocus: ParsedFocus,
): ParsedFocus => {
  return { ...parsedFocus, [lineNumber]: true }
}

type CodeMirrorPositionWithContent = CodeMirror.Position & { content: string }

export const addFocusToSelection = ({
  anchor,
  head,
  parsedFocus,
}: {
  anchor: CodeMirrorPositionWithContent
  head: CodeMirrorPositionWithContent
  parsedFocus: ParsedFocus
}): ParsedFocus => {
  const startingLine = minBy<CodeMirrorPositionWithContent>(
    (x) => {
      return x.line + x.ch // I think this will work?
    },
    anchor,
    head,
  )
  const endingLine = maxBy<CodeMirrorPositionWithContent>(
    (x) => {
      return x.line + x.ch
    },
    anchor,
    head,
  )

  const startingLineNumber = startingLine.line
  const endingLineNumber = endingLine.line
  const numberOfLinesSelectionSpans = Math.abs(
    startingLineNumber - endingLineNumber,
  )
  let newParsedFocus: ParsedFocus = parsedFocus

  if (numberOfLinesSelectionSpans === 0) {
    newParsedFocus = {
      ...parsedFocus,
      [startingLineNumber]: computeNewFocusForLine(
        parsedFocus[startingLineNumber],
        createContiguousArray(startingLine.ch)(endingLine.ch),
      ),
    }
  }

  if (numberOfLinesSelectionSpans === 1) {
    newParsedFocus = {
      ...parsedFocus,
      [startingLineNumber]: computeNewFocusForLine(
        parsedFocus[startingLineNumber],
        createContiguousArray(startingLine.ch)(startingLine.content.length),
      ),
      [endingLineNumber]: computeNewFocusForLine(
        parsedFocus[endingLineNumber],
        createContiguousArray(0)(endingLine.ch),
      ),
    }
  }

  const createFocusedLinesObject = () => {
    const linesObject: any = {}

    // Start at one since we use character styles for line 1
    // Subtract 1 because we do the same for the last line
    for (let index = 1; index < numberOfLinesSelectionSpans - 1; index++) {
      linesObject[index] = true
    }

    return linesObject
  }
  if (numberOfLinesSelectionSpans > 1) {
    newParsedFocus = {
      ...parsedFocus,
      [startingLineNumber]: computeNewFocusForLine(
        parsedFocus[startingLineNumber],
        createContiguousArray(startingLine.ch)(startingLine.content.length),
      ),
      ...createFocusedLinesObject(),
      [endingLineNumber]: computeNewFocusForLine(
        parsedFocus[endingLineNumber],
        createContiguousArray(0)(endingLine.ch),
      ),
    }
  }

  // Selecting a full line places the end position on the next line in codemirror. Here we check for that
  // and take it out because that's not in the codemirror spec.
  return omitBy<ParsedFocusLine, ParsedFocus>((val) => {
    return isArray(val) && val.length === 0
  }, newParsedFocus)
}

const createContiguousArray = (x1: number) => {
  return (x2: number) => {
    const startCharacter = min(x1)(x2)

    return times((i) => {
      return startCharacter + i
    }, Math.abs(x1 - x2))
  }
}

/**
 * Takes in a line and returns the symmetric difference if the user already has a selection for a given
 * line. Otherwise it returns the new data.
 */
const computeNewFocusForLine = (
  line: ParsedFocusLine,
  newArraySelection: number[],
) => {
  // If there's already items focused toggle the ones in there off and toggle
  // the new ones in there
  if (isArray(line)) {
    return pipeVal(
      line,
      symmetricDifference(newArraySelection),
      sortNumberArray,
    )
  }
  return newArraySelection
}
