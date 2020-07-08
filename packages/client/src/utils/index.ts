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
  keys,
} from 'ramda'
export { noop, isArray, omitBy } from 'ramda-adjunct'
export * from './unreachableCaseError'
export * from './normalizeArray'
export * from './stepUtils'
export * from './styledUtils'
export * from './snippetUtils'

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

/**
 * Helper to parse the referrer URL if there is one.
 * This is pretty dumb at the moment because there could be valuable if the referrer
 * is an internal page or param? We could potentially append certain params at channels
 * to get better insights on where people are coming in from.
 */
export function getReferrer() {
  const a = document.createElement('a')
  a.href = document.referrer

  return { url: a.hostname ?? '', params: a.search ?? '' }
}
