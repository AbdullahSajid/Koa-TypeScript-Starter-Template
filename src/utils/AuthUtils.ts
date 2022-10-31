const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
import { returnError } from './Common'
import { ErrorHandler } from '../types/Common'
const privateKey = fs.readFileSync(path.join(__dirname, '../../private/private.key'), 'utf8')
const publicKey = fs.readFileSync(path.join(__dirname, '../../private/public.key'), 'utf8')

export const generateJWT = (data: any) => {
  const options = { 
    expiresIn: '7d',
    issuer: "Express Typescript Boilerplate",
    audience: "www.example.com",
    subject: data.id, 
    algorithm: "RS256"
  }
  return new Promise((resolve, reject) => {
    jwt.sign(data, privateKey, options, function(err: any, token: any) {
      if (err) return reject(returnError(500, "Token Creation Failed"))
      resolve(token)
    })
  })
}

export const verifyJWT = (token: any) => {
  return new Promise((resolve, reject) => {
    const options = { 
      issuer: "Express Typescript Boilerplate",
      audience: "www.example.com",
      algorithm: ["RS256"]
    }
    jwt.verify(token, publicKey, options, (err: any, decode: any) => {
      if (err) {
        if (err.name == 'TokenExpiredError') return reject(returnError(406, "Token Expired"))
        if (err.name == 'JsonWebTokenError') return reject(returnError(406, "Token Malformed"))
        if (err.name == 'NotBeforeError') return reject(returnError(400, "Token Inactive"))
      }
      resolve(decode)
    })
  })
}

export const verifyBT = (token: string) => {
  if (token === process.env.BEARER_TOKEN) return { role: 'service' }
  else throw new ErrorHandler(406, 'Token Malformed')
}

export const getHashedPassword = async (password: string) => {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

export const matchPassword = async (password: string, hashPassword: string) => {
  return await bcrypt.compare(password, hashPassword)
}
