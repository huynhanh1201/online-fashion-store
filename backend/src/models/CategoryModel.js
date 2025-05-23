import mongoose from 'mongoose'
const { Schema, model } = mongoose

// Tạo schema cho Danh mục sản phẩm
const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Loại bỏ khoảng trắng đầu/cuối,
      unique: true // ⚡ bật unique index
    },
    slug: {
      type: String,
      required: true,
      lowercase: true, // Chuyển về chữ thường
      trim: true,
      unique: true // Đảm bảo không trùng lặp
    },
    description: {
      type: String,
      default: '', // Nếu không truyền sẽ là chuỗi rỗng
      trim: true
    },
    destroy: {
      type: Boolean,
      default: false // Soft-delete mặc định là false
    }
  },
  {
    // Tự động thêm createdAt & updatedAt
    timestamps: true
  }
)

// Tạo Model
export const CategoryModel = model('Category', categorySchema)
