import mongoose from 'mongoose'
const { Schema, model } = mongoose

// Tạo schema cho Danh mục sản phẩm
const partnerSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      index: true, // index để tìm kiếm nhanh theo tên
      trim: true
    },
    type: {
      type: String,
      enum: ['supplier', 'customer', 'both'],
      required: true,
      default: 'supplier'
    },
    contact: {
      phone: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      website: { type: String, trim: true, default: null }
    },
    taxCode: {
      type: String,
      trim: true,
      default: null
    },
    address: {
      street: { type: String, trim: true, default: null },
      ward: { type: String, trim: true, default: null },
      district: { type: String, trim: true, default: null },
      city: { type: String, trim: true, default: null }
    },
    bankInfo: {
      bankName: { type: String, trim: true, default: null },
      accountNumber: { type: String, trim: true, default: null },
      accountHolder: { type: String, trim: true, default: null }
    },
    note: {
      type: String,
      default: null
    },
    destroy: {
      type: Boolean,
      default: false
    }
  },
  {
    // Tự động thêm createdAt & updatedAt
    timestamps: true
  }
)

// Tạo Model
export const PartnerModel = model('Partner', partnerSchema)
