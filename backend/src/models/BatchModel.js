import mongoose from 'mongoose'
import { refIntegrityPlugin } from '~/plugins/refIntegrityPlugin'
const { Schema, model } = mongoose

// Tạo schema cho Danh mục sản phẩm
const batchSchema = new Schema(
  {
    variantId: {
      type: mongoose.Types.ObjectId,
      ref: 'Variant',
      required: true,
      index: true
    },
    warehouseId: {
      type: mongoose.Types.ObjectId,
      ref: 'Warehouse',
      required: true,
      index: true
    },
    batchCode: {
      type: String,
      required: true,
      trim: true
    },
    manufactureDate: {
      type: Date,
      allow: null,
      default: null
    },
    expiry: {
      type: Date,
      allow: null,
      default: null
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    importPrice: {
      type: Number,
      required: true,
      min: 0
    },
    destroy: {
      type: Boolean,
      default: false
    },
    importedAt: {
      type: Date,
      required: true,
      default: Date.now // Mặc định lấy ngày hiện tại khi tạo
    }
  },
  {
    // Tự động thêm createdAt & updatedAt
    timestamps: true
  }
)

// Gắn plugin kiểm tra liên kết
batchSchema.plugin(refIntegrityPlugin, {
  references: [{ model: 'InventoryLog', foreignField: 'batchId' }]
})

// Tạo Model
export const BatchModel = model('Batch', batchSchema)
