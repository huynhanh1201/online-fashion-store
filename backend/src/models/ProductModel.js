import mongoose from 'mongoose'
import { refIntegrityPlugin } from '~/plugins/refIntegrityPlugin'
const { Schema, model } = mongoose

import './SizePaletteModel'
import './ColorPaletteModel'
import './VariantModel'
import './OrderItemModel'
import './ReviewModel'

// Tạo schema cho Sản phẩm
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Loại bỏ khoảng trắng đầu/cuối
      text: true // Tạo text index.jsx để tìm kiếm nhanh :contentReference[oaicite:0]{index.jsx=0}
    },
    description: {
      type: String,
      default: '', // Nếu không truyền, để chuỗi rỗng
      trim: true,
      text: true // Tạo text index.jsx cho mô tả :contentReference[oaicite:1]{index.jsx=1}
    },
    quantity: {
      type: Number,
      required: true,
      default: 0, // Nếu không truyền, để mặc định là 0
      min: 0 // Giá không thể âm :contentReference[oaicite:2]{index.jsx=2}
    },
    image: [
      {
        type: String,
        trim: true // Mỗi phần tử là URL chuỗi, trim khoảng trắng
      }
    ],
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    slug: {
      type: String,
      // required: true,
      lowercase: true, // Chuyển về chữ thường
      trim: true
      // unique: true // Bắt buộc duy nhất để làm URL-friendly :contentReference[oaicite:3]{index.jsx=3}
    },
    destroy: {
      type: Boolean,
      default: false // Soft-delete mặc định là false
    },
    importPrice: {
      type: Number,
      required: true,
      min: 0 // Giá không thể âm :contentReference[oaicite:2]{index.jsx=2}
    },
    exportPrice: {
      type: Number,
      required: true,
      min: 0 // Giá không thể âm :contentReference[oaicite:2]{index.jsx=2}
    },
    productCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
      // Ví dụ: AT01 – Mã định danh duy nhất của sản phẩm
    },

    packageSize: {
      length: {
        type: Number,
        required: true,
        min: 0
      },
      width: {
        type: Number,
        required: true,
        min: 0
      },
      height: {
        type: Number,
        required: true,
        min: 0
      },
      weight: {
        type: Number,
        required: true,
        min: 0
      }
    },

    status: {
      type: String,
      enum: ['draft', 'active', 'inactive'], // Trạng thái sản phẩm
      default: 'draft' // Mặc định là 'draft'
    }
  },
  {
    // Tự động thêm createdAt & updatedAt
    timestamps: true
  }
)

// Gắn plugin kiểm tra liên kết
productSchema.plugin(refIntegrityPlugin, {
  references: [
    { model: 'SizePalette', foreignField: 'productId' },
    {
      model: 'ColorPalette',
      foreignField: 'productId'
    },
    {
      model: 'Variant',
      foreignField: 'productId'
    },
    {
      model: 'OrderItem',
      foreignField: 'productId'
    },
    {
      model: 'Review',
      foreignField: 'productId'
    }
  ]
})

// Tạo Model
export const ProductModel = model('Product', productSchema)
