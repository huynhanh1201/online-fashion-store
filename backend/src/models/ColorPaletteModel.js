import mongoose from 'mongoose'
const { Schema, model } = mongoose

// Tạo schema cho Danh mục sản phẩm
const colorPaletteSchema = new Schema(
  {
    // productId: ID sản phẩm liên kết (tham chiếu users)
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true // tạo index.jsx để truy vấn nhanh theo product
    },
    colors: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
          minlength: 1,
          maxlength: 100
        },
        image: {
          type: String,
          required: true,
          trim: true
        },
        isActive: {
          type: Boolean,
          default: true
        }
      }
    ]
  },
  {
    // Tự động thêm createdAt & updatedAt
    timestamps: true
  }
)

// Tạo Model
export const ColorPaletteModel = model('ColorPalette', colorPaletteSchema)
