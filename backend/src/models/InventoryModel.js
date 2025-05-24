import mongoose from 'mongoose'
const { Schema, model } = mongoose

// Tạo schema cho Danh mục sản phẩm
const inventorySchema = new Schema(
  {
    productId: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    variant: {
      color: {
        name: {
          type: String,
          required: true,
          trim: true
        },
        image: String
      },
      size: {
        name: {
          type: String,
          required: true,
          trim: true
        }
      },
      sku: {
        type: String,
        required: true,
        unique: true,
        trim: true
      }
    },
    quantity: {
      type: Number,
      required: true,
      default: 0
    },
    importPrice: {
      type: Number,
      required: true
    },
    exportPrice: {
      type: Number,
      required: true
    },
    minQuantity: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['in-stock', 'out-of-stock', 'discontinued'],
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
