import Admin from '../models/Admin'
import { ErrorHandler } from '../types/Common'
import { IAdmin } from '../types/Common'

class AdminDAO {

  async add(payload: any): Promise<IAdmin> {
    const admin = new Admin(payload)
    return await admin.save()
  }

  async isFoundById(id: string): Promise<boolean> {
    const admin = await Admin.findOne({ _id: id }).select({ _id: 1 }).lean()
    if (!admin) return false
    return true
  }

  async findById(id: string, attributes?: any): Promise<IAdmin> {
    const admin = await Admin.findOne({ _id: id }).select(attributes).lean()
    if (!admin) throw new ErrorHandler(404, "Admin does not exist")
    return admin
  }

  async findAndUpdateById(id: string, data: any, attributes?: any): Promise<IAdmin> {
    const admin = await Admin.findOneAndUpdate({ _id: id }, data, { runValidators: true, new: true }).select(attributes).lean()
    if (!admin) throw new ErrorHandler(404, "Admin does not exist")
    return admin
  }

  async findAndDeleteById(id: string, attributes?: any): Promise<IAdmin> {
    const admin = await Admin.findOneAndDelete({ _id: id }).select(attributes).lean()
    if (!admin) throw new ErrorHandler(404, "Admin does not exist")
    return admin
  }

  async findOneByFilter(filter: any, attributes?: any): Promise<IAdmin | null> {
    return await Admin.findOne(filter).select(attributes).lean()
  }

  async findByFilter(filter: any, attributes?: any): Promise<IAdmin[]> {
    return await Admin.find(filter).select(attributes).lean()
  }

  async updateById(id: string, data: any): Promise<void> {
    const res = await Admin.updateOne({ _id: id }, data, { runValidators: true }).lean()
    if (!res.n) throw new ErrorHandler(404, "Admin does not exist")
    if (res.n !== res.nModified) throw new ErrorHandler(500, "An error occured during updation")
  }

  async updateOneByFilter(filter: any, data: any): Promise<void> {
    const res = await Admin.updateOne(filter, data, { runValidators: true }).lean()
    if (res.n !== res.nModified) throw new ErrorHandler(500, "An error occured during updation")
  }

  async updateByFilter(filter: any, data: any): Promise<void> {
    const res = await Admin.updateMany(filter, data, { runValidators: true }).lean()
    if (res.n !== res.nModified) throw new ErrorHandler(500, "An error occured during updation")
  }

  async deleteById(id: string): Promise<void> {
    const res = await Admin.deleteOne({ _id: id })
    if (res.n !== res.deletedCount) throw new ErrorHandler(500, "An error occured during deletion")
  }

  async deleteOneByFilter(filter: any): Promise<void> {
    const res = await Admin.deleteOne(filter)
    if (res.n !== res.deletedCount) throw new ErrorHandler(500, "An error occured during deletion")
  }

  async count(): Promise<number> {
    return await Admin.find().estimatedDocumentCount()
  }

  async countByFilter(filter: any): Promise<number> {
    return await Admin.countDocuments(filter)
  }

  async list(filter: any, options: any): Promise<any> {
    return await Admin.paginate(filter, options)
  }
}

export default new AdminDAO()
