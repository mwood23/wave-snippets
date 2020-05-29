import { pipe as pipeVal } from 'fp-ts/lib/pipeable'
import { groupWith, sort, uniq } from 'ramda'
export { pipe as pipeVal } from 'fp-ts/lib/pipeable'
export {
  omit,
  sort,
  pick,
  isNil,
  isEmpty,
  includes,
  times,
  flatten,
  mapObjIndexed,
  groupBy,
  groupWith,
  uniq,
  last,
  head,
  equals,
  symmetricDifference,
  merge,
  forEachObjIndexed,
  maxBy,
  min,
  minBy,
  startsWith,
  toString,
  mergeDeepWith,
  allPass,
  concat,
} from 'ramda'
export { noop, isArray, omitBy } from 'ramda-adjunct'
export * from './unreachableCaseError'
export * from './normalizeArray'
export * from './stepUtils'

export const sortNumberArray = (a: number[]) => {
  return sort<typeof a[0]>((a, b) => {
    return a - b
  })(a)
}

export const groupArrayBySequence = (arr: number[]) => {
  return pipeVal(
    arr,
    uniq,
    sortNumberArray,
    groupWith<typeof arr[0]>((a, b) => {
      return a + 1 === b
    }),
  )
}
