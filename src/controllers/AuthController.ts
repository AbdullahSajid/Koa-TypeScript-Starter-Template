import { DefaultContext, Next } from 'koa'
import { forwardError } from "../utils/Common"
import { ErrorHandler } from '../types/Common'
import { verifyJWT, verifyBT } from '../utils/AuthUtils'
import { checkAnonymousRateLimiter, checkGeneralRateLimiter } from '../config/rateLimiter'

export const authenticate = async (ctx: DefaultContext, next: Next) => {
  try {
    if (ctx.headers && ctx.headers.authorization) {
      if (ctx.headers.authorization.split(' ')[0] === 'JWT') {
        const token = ctx.headers.authorization.split(' ')[1]
        const user = await verifyJWT(token)
        ctx.request.body._user = user
        return next()
      }
      else if (ctx.headers.authorization.split(' ')[0] === 'Bearer') {
        const token = ctx.headers.authorization.split(' ')[1]
        const user = verifyBT(token)
        if (!ctx.request.body._user) ctx.request.body._user = user
        return next()
      }
    }
    throw new ErrorHandler(401, 'Authorization Header Not Present')
  } catch (e) {
    forwardError(ctx, e)
  }
}

export const authorize = (roles: string | string[]) => {
  return async (ctx: DefaultContext, next: Next) => {
    try {
      roles = Array.isArray(roles) ? [...new Set(roles)] : [roles]
      if (roles.includes('all') || 
        (roles.includes('admin') && ctx.request.body._user.role === 'spradmin') ||
        roles.includes(ctx.request.body._user.role)) {
        await checkGeneralRateLimiter(ctx)
        return next()
      }
      else throw new ErrorHandler(403, 'Unauthorized')
    }
    catch (e) {
      forwardError(ctx, e)
    }
  }
}

export const anonymousAuthorize = async (ctx: DefaultContext, next: Next) => {
  try {
    await checkAnonymousRateLimiter(ctx)
    next()
  }
  catch (e) {
    forwardError(ctx, e)
  }
}
