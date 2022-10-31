import { DefaultContext } from 'koa'
import { validate, forwardError } from '../utils/Common'
import AdminService from '../services/AdminService'

export const registerAdmin = async (ctx: DefaultContext) => {
  try {
    validate(ctx)
    const response = await AdminService.registerAdmin(ctx.request.body)
    ctx.body = { success: true, ...response }
  }
  catch (e) {
    forwardError(ctx, e)
  }
}

export const loginAdmin = async (ctx: DefaultContext) => {
  try {
    validate(ctx)
    const response = await AdminService.loginAdmin(ctx.request.body)
    ctx.body = { success: true, ...response }
  }
  catch (e) {
    forwardError(ctx, e)
  }
}

export const updateAdmin = async (ctx: DefaultContext) => {
  try {
    validate(ctx)
    const response = await AdminService.updateAdmin(ctx.params.adminId, ctx.request.body)
    ctx.body = { success: true, ...response }
  }
  catch (e) {
    forwardError(ctx, e)
  }
}

export const updateAdminProfile = async (ctx: DefaultContext) => {
  try {
    validate(ctx)
    const response = await AdminService.updateAdminProfile(ctx.request.body)
    ctx.body = { success: true, ...response }
  }
  catch (e) {
    forwardError(ctx, e)
  }
}

export const updateAdminPassword = async (ctx: DefaultContext) => {
  try {
    validate(ctx)
    const response = await AdminService.updateAdminPassword(ctx.request.body)
    ctx.body = { success: true, ...response }
  }
  catch (e) {
    forwardError(ctx, e)
  }
}

export const deleteAdmin = async (ctx: DefaultContext) => {
  try {
    validate(ctx)
    const response = await AdminService.deleteAdmin(ctx.params.adminId)
    ctx.body = { success: true, ...response }
  }
  catch (e) {
    forwardError(ctx, e)
  }
}

export const getAdmin = async (ctx: DefaultContext) => {
  try {
    validate(ctx)
    const response = await AdminService.getAdmin(ctx.params.adminId)
    ctx.body = { success: true, ...response }
  }
  catch (e) {
    forwardError(ctx, e)
  }
}

export const getAdminProfile = async (ctx: DefaultContext) => {
  try {
    validate(ctx)
    const response = await AdminService.getAdminProfile(ctx.request.body)
    ctx.body = { success: true, ...response }
  }
  catch (e) {
    forwardError(ctx, e)
  }
}

export const listAdmins = async (ctx: DefaultContext) => {
  try {
    validate(ctx)
    const response = await AdminService.listAdmins(ctx.query)
    ctx.body = { success: true, ...response }
  }
  catch (e) {
    forwardError(ctx, e)
  }
}
