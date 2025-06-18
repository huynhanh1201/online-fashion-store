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
        lowercase: true,
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
        lowercase: true,
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
      lowercase: true,
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

    overridePackageSize: {
      type: Boolean,
      default: false
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
    }
  },
  {
    // Tự động thêm createdAt & updatedAt
    timestamps: true
  }
)

// Tạo Model
export const VariantModel = model('Variant', variantSchema)
