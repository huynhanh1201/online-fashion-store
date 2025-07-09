import mongoose from 'mongoose'
const { Schema, model } = mongoose

// Tạo schema cho Danh mục sản phẩm
const inventoryLogSchema = new Schema(
  {
    inventoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Inventory',
      required: true
    },
    warehouseId: {
      type: mongoose.Types.ObjectId,
      ref: 'Warehouse',
      required: true,
      index: true
    },
    batchId: {
      type: Schema.Types.ObjectId,
      ref: 'Batch',
      default: null // Nếu không có batch thì có thể để null
    },
    type: {
      type: String,
      enum: ['in', 'out', 'adjustment'],
      required: true
    },
    source: {
      type: String,
      required: true // Đảm bảo log có nguồn gốc rõ ràng
    },
    amount: {
      type: Number,
      required: true
    },
    importPrice: {
      type: Number,
      default: 0 // Có thể null nhưng mặc định là 0 để dễ tính toán
    },
    exportPrice: {
      type: Number,
      default: 0
    },
    note: {
      type: String,
      default: ''
    },
    createdBy: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      role: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      }
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    // Tự động thêm createdAt & updatedAt
    timestamps: true
  }
)

// Tạo Model
export const InventoryLogModel = model('InventoryLog', inventoryLogSchema)
