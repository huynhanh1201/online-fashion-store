import mongoose from 'mongoose'
const { Schema, model } = mongoose

// Tạo schema cho Danh mục sản phẩm
const websiteConfigSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      maxLength: 1000,
      trim: true,
      unique: true // key duy nhất
    },
    title: {
      type: String,
      maxLength: 1000,
      required: true,
      trim: true
    },
    description: {
      type: String,
      maxLength: 10000,
      trim: true,
      default: ''
    },
    content: {
      type: Schema.Types.Mixed, // cho phép lưu mọi cấu trúc JSON :contentReference[oaicite:1]{index=1}
      required: true
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'inactive'], // chỉ cho phép các giá trị cụ thể :contentReference[oaicite:2]{index=2}
      default: 'draft', // mặc định nếu không truyền vào :contentReference[oaicite:3]{index=3}
      required: true
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
export const WebsiteConfigModel = model('WebsiteConfig', websiteConfigSchema)
