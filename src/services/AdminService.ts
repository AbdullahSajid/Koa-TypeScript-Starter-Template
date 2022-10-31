import { generateJWT, matchPassword, getHashedPassword } from '../utils/AuthUtils'
import { ErrorHandler } from '../types/Common'
import { escapeRegExp } from '../utils/Common'
import AdminDAO from '../dao/AdminDAO'

class AdminService {

  async registerAdmin(payload: any) {
    if (payload.password !== payload.confirmPassword) throw new ErrorHandler(400, "Passwords do not match")
    payload.password = await getHashedPassword(payload.password)
    await AdminDAO.add(payload)
    return {
      msg: "Admin registered successfully"
    }
  }

  async loginAdmin(payload: any) {
    const attributes = { name: 1, email: 1, password: 1, role: 1 }
    const admin = await AdminDAO.findOneByFilter({ email: payload.email }, attributes)
    if (!admin) throw new ErrorHandler(401, "Invalid Credentials")
    const match = await matchPassword(payload.password, admin.password)
    if (!match) throw new ErrorHandler(401, "Invalid Credentials")
    const token = await generateJWT({
      id: String(admin._id),
      name: admin.name,
      email: admin.email,
      role: admin.role
    })
    return { token }
  }

  async updateAdmin(adminId: string, payload: any) {
    const data: any = {}
    const attributes: string[] = ["name", "email"]
    const selectAttributes = { _id: 0, name: 1, email: 1}
    attributes.forEach(attribute => {
      if (payload[attribute]) data[attribute] = payload[attribute]
    })
    console.log(adminId, data)
    const admin = await AdminDAO.findAndUpdateById(adminId, data, selectAttributes)
    return { profile: admin }
  }

  async updateAdminProfile(payload: any) {
    const data: any = {}
    const attributes: string[] = ["name", "email"]
    const selectAttributes = { _id: 0, name: 1, email: 1}
    attributes.forEach(attribute => {
      if (payload[attribute]) data[attribute] = payload[attribute]
    })
    const admin = await AdminDAO.findAndUpdateById(payload._user.id, data, selectAttributes)
    return { profile: admin }
  }

  async updateAdminPassword(payload: any) {
    if (payload.newPassword !== payload.confirmNewPassword) throw new ErrorHandler(400, "Passwords do not match")
    const admin = await AdminDAO.findById(payload._user.id, { password: 1 })
    const match = await matchPassword(payload.currentPassword, admin.password)
    if (!match) throw new ErrorHandler(412, "Current Password is wrong")
    await AdminDAO.updateById(payload._user.id, { 
      password: await getHashedPassword(payload.newPassword) 
    })
    return { 
      msg: "Password updated successfuly" 
    }
  }

  async deleteAdmin(adminId: string) {
    await AdminDAO.deleteById(adminId)
    return {
      msg: "Admin deleted successfully"
    }
  }

  async getAdmin(adminId: string) {
    const attributes = { _id: 0, name: 1, email: 1 }
    const admin = await AdminDAO.findById(adminId, attributes)
    return { profile: admin }
  }

  async getAdminProfile(payload: any) {
    const attributes = { _id: 0, name: 1, email: 1 }
    const admin = await AdminDAO.findById(payload._user.id, attributes)
    return { profile: admin }
  }

  async listAdmins(payload: any) {
    const filter: any = {}
    if (payload.adminId) filter._id = payload.adminId
    const otherFilters: string[] = ['name', 'email']
    otherFilters.forEach((otherFilter: string) => {
      if (payload[otherFilter]) filter[otherFilter] = payload[otherFilter]
    })
    if (payload.searchKeyword) {
      filter['$or'] = []
      const regexSearchExpr: any = { $regex: escapeRegExp(payload.searchKeyword), $options: 'i' }
      const otherSearchFilters: string[] = ['_id', 'name', 'email']
      otherSearchFilters.forEach((otherSearchByFilter: string) => {
        filter['$or'].push({ [otherSearchByFilter]: regexSearchExpr })
      })
    }
    const options = {
      page: payload.page,
      limit: payload.limit,
      lean: true,
      leanWithId: false,
      sort: { createdAt: -1 },
      select: 'name email',
      customLabels: { docs: 'admins', totalDocs: 'adminsCount' }
    }
    return await AdminDAO.list(filter, options)
  }
}

export default new AdminService()
