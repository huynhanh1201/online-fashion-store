import mongoose from 'mongoose'
const { Schema, model, Types } = mongoose

// Tạo schema cho Danh mục sản phẩm
const warehouseSlipSchema = new Schema(
  {
    slipId: { type: String, required: true, unique: true, trim: true },
    type: { type: String, required: true, enum: ['import', 'export'] },
    date: { type: Date, required: true },

    partner: {
      code: { type: String, required: true, trim: true },
      name: { type: String, required: true, trim: true },
      contact: { type: String, required: true, trim: true }
    },

    warehouseId: {
      type: Types.ObjectId,
      ref: 'Warehouse',
      required: true,
      index: true
    },

    items: [
      {
        variantId: {
          type: Types.ObjectId,
          ref: 'Variant',
          required: true,
          index: true
        },
        batchCode: { type: String, trim: true, default: null },
        quantity: { type: Number, required: true, min: 0 },
        unit: { type: String, required: true, trim: true }
      }
    ],

    createdBy: {
      _id: { type: mongoose.Types.ObjectId, required: true },
      name: { type: String, required: true },
      role: { type: String, required: true },
      email: { type: String, required: true }
    },
    note: { type: String, trim: true, default: '' },
    destroy: { type: Boolean, default: false }
  },
  {
    // Tự động thêm createdAt & updatedAt
    timestamps: true
  }
)

// Tạo Model
export const WarehouseSlipModel = model('WarehouseSlip', warehouseSlipSchema)
