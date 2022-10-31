import mongoose from 'mongoose'
import { ErrorHandler } from '../types/Common'
import { capitalize } from '../utils/Common'

export const getMongooseSession = async () => {
  return await mongoose.startSession()
}

export const mongooseErrorHandler = (error: any) => {
  const errors = []
  if (error.name === "ValidationError") {
    for (const field in error.errors) {
      if (error.errors[field].name == "CastError") {
        errors.push({
          param: error.errors[field].path,
          msg: `${capitalize(error.errors[field].path)} type is invalid`
        })
      }
      if (error.errors[field].name == "ValidatorError") {
        if (error.errors[field].kind == "required") {
          errors.push({
            param: error.errors[field].path,
            msg: `${capitalize(error.errors[field].path)} is required`
          })
        }
        else if (["min", "max"].includes(error.errors[field].kind)) {
          const matches = error.errors[field].message.match(/\((\d+)\)/g)
          const allowedCharacters = matches[matches.length - 1]
          errors.push({
            param: error.errors[field].path,
            msg: `${capitalize(error.errors[field].path)} ${error.errors[field].kind == "min" ? 
            "must not be less than " + allowedCharacters : 
            "must not exceed " + allowedCharacters }`
          })
        }
        else if (["minlength", "maxlength"].includes(error.errors[field].kind)) {
          const matches = error.errors[field].message.match(/\((\d+)\)/g)
          const allowedCharacters = matches[matches.length - 1]
          errors.push({
            param: error.errors[field].path,
            msg: `${capitalize(error.errors[field].path)} ${error.errors[field].kind == "minlength" ? 
            "must not be less than " + allowedCharacters + " characters" : 
            "must not exceed " + allowedCharacters + " characters" }`
          })
        }
        else if (error.errors[field].kind == "enum") {
          errors.push({
            param: error.errors[field].path,
            msg: `${capitalize(error.errors[field].path)} must be one of these` +
            ` [${error.errors[field].properties.enumValues}]`
          })
        }
        else {
          errors.push({
            param: error.errors[field].path,
            msg: `${capitalize(error.errors[field].path)} is invalid`
          })
        }
      }
    }
  }
  else if (error.name === 'MongoError') {
    if (error.code === 11000) {
      errors.push({
        param: Object.keys(error.keyPattern)[0],
        msg: `${capitalize(Object.keys(error.keyPattern)[0])} already exists`
      })
    }
  }
  throw new ErrorHandler(400, "Validation Error", errors)
}
