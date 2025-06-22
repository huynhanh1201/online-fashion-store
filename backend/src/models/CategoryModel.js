import mongoose from 'mongoose'

import { refIntegrityPlugin } from '~/plugins/refIntegrityPlugin'

const { Schema, model } = mongoose

// Tạo schema cho Danh mục sản phẩm
const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Loại bỏ khoảng trắng đầu/cuối,
      unique: true // ⚡ bật unique index.jsx
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
    },
    image: {
      type: String,
      default: null // Chuỗi rỗng nếu không có ảnh
    },

    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null
    }
  },
  {
    // Tự động thêm createdAt & updatedAt
    timestamps: true
  }
)

// Gắn plugin kiểm tra liên kết
categorySchema.plugin(refIntegrityPlugin, {
  references: [
    { model: 'Category', foreignField: 'parent' },

    {
      model: 'Product',
      foreignField: 'categoryId'
    }
  ]
})

// Tạo Model
export const CategoryModel = model('Category', categorySchema)
