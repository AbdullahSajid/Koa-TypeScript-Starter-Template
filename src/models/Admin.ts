import { model, Schema, Document, Query, PaginateModel } from "mongoose"
import { IAdmin } from '../types/Common'
import { mongooseErrorHandler } from '../utils/DBUtils'
import mongoosePaginate from 'mongoose-paginate-v2'

const AdminSchema: Schema = new Schema({
  _id: { type: String },
  name: { type: String, required: true, trim: true, minlength: 4, maxlength: 20 },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 40 },
  password: { type: String, required: true, select: false },
  role: { type: String, required: true, enum: ['spradmin', 'admin'], default: 'admin' },
  __v: { type: Number, select: false }
}, { timestamps: true })

export interface AdminDocument extends IAdmin, Document {}
interface AdminModel<T extends Document> extends PaginateModel<T> {}

AdminSchema.post(['save'], function(error: any, doc: Document, next: any) {
  mongooseErrorHandler(error)
})
AdminSchema.post(['findOneAndUpdate', 'updateOne', 'updateMany'], function(error: any, res: any, next: any) {
  mongooseErrorHandler(error)
})

AdminSchema.set('toObject', { virtuals: true })
AdminSchema.set('toJSON', { virtuals: true })

AdminSchema.plugin(mongoosePaginate)

export default model<AdminDocument>('Admin', AdminSchema, 'admins') as AdminModel<AdminDocument>
