import { DefaultContext } from 'koa'
import { validationResults } from 'koa-req-validation'
import { ErrorHandler } from '../types/Common'
import { DEFAULT_LANGUAGE, LANGUAGES } from '../constants/DefaultConstants'

// common functions
export const capitalize = (str: string) => {
  str = str.trim()
  str = str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase()
  return str
}

export const capitalizeEachWord = (str: string) => {
  const words = str.trim().split(' ')
  words.forEach((word, index) => {
    words[index] = word[0].toUpperCase() + word.slice(1)
  })
  return words.join(' ')
}

export const pluralize = (word: string, count: number) => {
  return count + ' ' + word + (count > 1 ? 's' : '')
}

export const roundUptoTwoDecimals = (num: string) => {
  const number = parseFloat(num)
  if (isNaN(number)) throw new ErrorHandler(400, "Value is not a number")
  return Math.round(number * 100) / 100
}

export const getLanguage = (lang: string) => {
  if (LANGUAGES.includes(lang)) return lang
  return DEFAULT_LANGUAGE
}

export const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const escapeRegExp = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const errorFormatter = (error: any) => {
  return [{
    param: error.param,
    msg: error.msg || `${error.param} is invalid`
  }]
}

export const validate = (ctx: any) => {
  const results = validationResults(ctx)
  if (results.hasErrors()) {
    throw new ErrorHandler(400, 'Validation Error', errorFormatter(results.array()[0]))
  }
}

export const returnError = (statusCode: number, errorMessage: string) => {
  const error: any = new Error(errorMessage)
  error.statusCode = statusCode || 400
  return error
}

export const forwardError = (ctx: DefaultContext, error: ErrorHandler) => {
  const e: any = { success: false }
  ctx.status = e.statusCode = error.statusCode || 400
  e.msg = error.message || "An error occured"
  e.errors = error.errors
  ctx.body = e
  // if (error.stack) ctx.log.error(error.stack)
}
