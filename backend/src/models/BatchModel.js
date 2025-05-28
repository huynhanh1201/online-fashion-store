import mongoose from 'mongoose'
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
      required: true
    },
    expiry: {
      type: Date,
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
    }
  },
  {
    // Tự động thêm createdAt & updatedAt
    timestamps: true
  }
)

// Tạo Model
export const BatchModel = model('Batch', batchSchema)
