import { TEMPLATES } from '../templates'

export const isMatchParamATemplate = (param?: string) =>
  // @ts-ignore String union to string. That's what we want to check!
  param ? TEMPLATES.includes(param) : false
