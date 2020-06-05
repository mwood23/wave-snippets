import { keys } from '../utils'
import { BLANK_TEMPLATE } from './blank'
import { DEFAULT_TEMPLATE } from './default'
import { NPM_PACKAGE_TEMPLATE } from './npmPackage'

export const TEMPLATES_DICT = {
  default: DEFAULT_TEMPLATE,
  'blank-step': BLANK_TEMPLATE,
  'npm-package': NPM_PACKAGE_TEMPLATE,
}

export const TEMPLATES = keys(TEMPLATES_DICT)
