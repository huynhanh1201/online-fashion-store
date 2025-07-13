import mongoose from 'mongoose'
import { refIntegrityPlugin } from '~/plugins/refIntegrityPlugin'
const { Schema, model } = mongoose

// Tạo schema cho Danh mục sản phẩm
const warehouseSchema = new Schema(
  {
    code: {
      type: String,
      unique: true,
      trim: true, // Loại bỏ khoảng trắng đầu/cuối
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true, // Số nhà, tên đường
      trim: true
    },
    ward: {
      type: String,
      required: true, // Phường
      trim: true
    },
    district: {
      type: String,
      required: true, // Quận/Huyện
      trim: true
    },
    city: {
      type: String,
      required: true, // Thành phố/Tỉnh
      trim: true
    },
    destroy: {
      type: Boolean,
      default: false // false = chưa xóa
    },

    districtId: {
      type: String,
      required: true,
      trim: true
    },
    wardId: {
      type: String,
      required: true, // Phường
      trim: true
    },
    cityId: {
      type: String,
      required: true, // Thành phố/Tỉnh
      trim: true
    }
  },
  {
    // Tự động thêm createdAt & updatedAt
    timestamps: true
  }
)

// Gắn plugin kiểm tra liên kết
warehouseSchema.plugin(refIntegrityPlugin, {
  references: [
    { model: 'InventoryLog', foreignField: 'warehouseId' },

    {
      model: 'Inventory',
      foreignField: 'warehouseId'
    },

    {
      model: 'WarehouseSlip',
      foreignField: 'warehouseId'
    },
    {
      model: 'Batch',
      foreignField: 'warehouseId'
    }
  ]
})

// Tạo Model
export const WarehouseModel = model('Warehouse', warehouseSchema)
