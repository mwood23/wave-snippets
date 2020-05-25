import { always } from 'ramda'
export { omit, pick, isNil, isEmpty, includes, times } from 'ramda'
export * from './unreachableCaseError'
export * from './normalizeArray'

// TODO: Should be able to accept N number of args without types blowing up
export const noop = always(undefined)
