import mongoose from 'mongoose'
const { Schema, model } = mongoose

// Tạo schema cho Danh mục sản phẩm
const inventoryLogSchema = new Schema(
  {
    inventoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inventory',
      required: true
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    variant: {
      sku: {
        type: String,
        required: true,
        trim: true
      },
      color: {
        name: {
          type: String,
          required: true,
          trim: true
        },
        image: {
          type: String,
          required: false,
          trim: true
        }
      },
      size: {
        name: {
          type: String,
          required: true,
          trim: true
        }
      }
    },
    type: {
      type: String,
      enum: ['in', 'out', 'adjustment'],
      required: true
    },
    source: {
      type: String,
      default: 'manual',
      trim: true
    },
    amount: {
      type: Number,
      required: true
    },
    importPrice: {
      type: Number
    },
    exportPrice: {
      type: Number
    },
    note: {
      type: String,
      trim: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    // Tự động thêm createdAt & updatedAt
    timestamps: true
  }
)

// Tạo Model
export const InventoryLogModel = model('InventoryLog', inventoryLogSchema)
