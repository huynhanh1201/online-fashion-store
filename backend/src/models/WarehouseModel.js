import mongoose from 'mongoose'
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
    }
  },
  {
    // Tự động thêm createdAt & updatedAt
    timestamps: true
  }
)

// Tạo Model
export const WarehouseModel = model('Warehouse', warehouseSchema)
