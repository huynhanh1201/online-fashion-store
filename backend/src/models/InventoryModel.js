import mongoose from 'mongoose'
const { Schema, model } = mongoose

// Tạo schema cho Danh mục sản phẩm
const inventorySchema = new Schema(
  {
    variantId: {
      type: Schema.Types.ObjectId,
      ref: 'Variant',
      required: true
    },
    warehouseId: {
      type: Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    minQuantity: {
      type: Number,
      required: true,
      default: 10,
      min: 0
    },
    importPrice: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    exportPrice: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    status: {
      type: String,
      required: true,
      enum: ['in-stock', 'low-stock', 'out-of-stock'],
      default: 'in-stock'
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
export const InventoryModel = model('Inventory', inventorySchema)
