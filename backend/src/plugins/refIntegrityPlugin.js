import mongoose from 'mongoose'
import apiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

/**
 * Plugin kiểm tra ràng buộc liên kết (giống foreign key constraint trong SQL)
 * @param {mongoose.Schema} schema - Schema cần kiểm tra
 * @param {Object} options
 * @param {Array<{ model: string, foreignField: string }>} options.references - Danh sách model liên kết
 */
export const refIntegrityPlugin = (schema, { references = [] }) => {
  // Hàm kiểm tra xem document có đang bị liên kết bởi model khác không
  const checkReferences = async (doc) => {
    for (const { model, foreignField } of references) {
      const RefModel = mongoose.model(model)
      const count = await RefModel.countDocuments({ [foreignField]: doc._id })

      if (count > 0) {
        throw new apiError(
          StatusCodes.UNPROCESSABLE_ENTITY,
          `${doc.constructor.modelName} đang bị liên kết bởi ${model} qua field '${foreignField}' (${count} bản ghi)`
        )
      }
    }
  }

  // Hook: Model.deleteOne({ ... })
  schema.pre('deleteOne', { document: false, query: true }, async function () {
    const doc = await this.model.findOne(this.getFilter())
    if (doc) await checkReferences(doc)
  })

  // Hook: Model.findOneAndDelete() hoặc findByIdAndDelete()
  // schema.pre('findOneAndDelete', async function () {
  //   const doc = await this.model.findOne(this.getQuery())
  //   if (doc) await checkReferences(doc)
  // })

  // Hook: chặn update nếu cần (optional)
  // schema.pre('findOneAndUpdate', async function () {
  //   const doc = await this.model.findOne(this.getQuery())
  //   if (doc) await checkReferences(doc)
  // })

  // Hook: chặn update nếu cần (optional)
  schema.pre('updateOne', async function () {
    const doc = await this.model.findOne(this.getQuery())
    if (doc) await checkReferences(doc)
  })
}
