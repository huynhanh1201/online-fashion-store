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
      index: true // tạo index để truy vấn nhanh theo product
    },

    // Tên màu hiển thị
    name: {
      type: String,
      required: true,
      trim: true // tự động loại bỏ khoảng trắng đầu/cuối
    },

    // Hình ảnh minh họa cho màu (có thể là URL hoặc đường dẫn)
    image: {
      type: String,
      required: true,
      trim: true // tự động loại bỏ khoảng trắng đầu/cuối
    },

    // Cờ bật/tắt màu trong UI
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    // Tự động thêm createdAt & updatedAt
    timestamps: true
  }
)

// Tạo Model
export const ColorPaletteModel = model('ColorPalette', colorPaletteSchema)
