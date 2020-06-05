import { BackgroundColor } from '@waves/shared'
import { pipe as pipeVal } from 'fp-ts/lib/pipeable'
import { rgb, rgba } from 'polished'
import { groupWith, sort, uniq } from 'ramda'
import shortID from 'shortid'

import { TagGroup } from '../const'
import { UnreachableCaseError } from './unreachableCaseError'

export { pipe as pipeVal } from 'fp-ts/lib/pipeable'
export {
  allPass,
  concat,
  equals,
  flatten,
  forEachObjIndexed,
  groupBy,
  groupWith,
  head,
  includes,
  isEmpty,
  isNil,
  last,
  map,
  mapObjIndexed,
  maxBy,
  merge,
  mergeDeepWith,
  min,
  minBy,
  omit,
  pick,
  sort,
  startsWith,
  symmetricDifference,
  times,
  toString,
  uniq,
  prop,
  sortBy,
} from 'ramda'
export { noop, isArray, omitBy } from 'ramda-adjunct'
export * from './unreachableCaseError'
export * from './normalizeArray'
export * from './stepUtils'
export * from './styledUtils'

export const generateID = shortID.generate

export const sortNumberArray = (a: number[]) =>
  sort<typeof a[0]>((a, b) => a - b)(a)

export const groupArrayBySequence = (arr: number[]) =>
  pipeVal(
    arr,
    uniq,
    sortNumberArray,
    groupWith<typeof arr[0]>((a, b) => a + 1 === b),
  )

export const backgroundColorToHex = (color: BackgroundColor) =>
  rgb({
    red: color.r,
    green: color.g,
    blue: color.b,
  })
export const backgroundColorToHexAlpha = (color: BackgroundColor) =>
  rgba({
    red: color.r,
    green: color.g,
    blue: color.b,
    alpha: color.a ?? 1,
  })

export const getColorByTagGroup = (domain: TagGroup) => {
  switch (domain) {
    case 'area':
      return 'purple'
    case 'challenge':
      return 'red'
    case 'general':
      return 'blue'
    case 'language':
      return 'orange'

    default:
      throw new UnreachableCaseError(domain)
  }
}
