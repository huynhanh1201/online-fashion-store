import mongoose from 'mongoose'
const { Schema, model } = mongoose

// Tạo schema cho Danh mục sản phẩm
const variantSchema = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },

    color: {
      name: {
        type: String,
        required: true,
        trim: true
      },
      image: {
        type: String,
        default: null // Optional ảnh minh họa màu
      }
    },

    size: {
      name: {
        type: String,
        required: true,
        trim: true
      }
    },

    productCode: {
      type: String,
      required: true,
      trim: true
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    importPrice: {
      type: Number,
      default: 0,
      min: 0
    },

    exportPrice: {
      type: Number,
      default: 0,
      min: 0
    },

    overridePrice: {
      type: Boolean,
      default: false
    },

    destroy: {
      type: Boolean,
      default: false
    },

    length: {
      type: Number,
      required: true,
      min: 1, // GHN yêu cầu phải > 0
      default: 30
    },
    width: {
      type: Number,
      required: true,
      min: 1,
      default: 20
    },
    height: {
      type: Number,
      required: true,
      min: 1,
      default: 2
    },
    weight: {
      type: Number,
      required: true,
      min: 1, // GHN lỗi nếu = 0
      default: 300 // gram, bạn có thể tuỳ chỉnh
    }
  },
  {
    // Tự động thêm createdAt & updatedAt
    timestamps: true
  }
)

// Tạo Model
export const VariantModel = model('Variant', variantSchema)
