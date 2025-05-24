import mongoose from 'mongoose'
const { Schema, model } = mongoose

// Tạo schema cho Danh mục sản phẩm
const sizeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Loại bỏ khoảng trắng đầu/cuối
      unique: true // Đảm bảo tên màu không trùng lặp
    },
    destroy: {
      type: Boolean,
      default: false // Mặc định không xóa mềm
    }
  },
  {
    // Tự động thêm createdAt & updatedAt
    timestamps: true
  }
)

// Tạo Model
export const SizeModel = model('Size', sizeSchema)
