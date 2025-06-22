import mongoose from 'mongoose'
import { refIntegrityPlugin } from '~/plugins/refIntegrityPlugin'
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
variantSchema.plugin(refIntegrityPlugin, {
  references: [
    { model: 'Inventory', foreignField: 'variantId' },

    {
      model: 'Batch',
      foreignField: 'variantId'
    },

    {
      model: 'WarehouseSlip',
      foreignField: 'variantId'
    },

    {
      model: 'CartItem',
      foreignField: 'variantId'
    }
  ]
})

// Tạo Model
export const VariantModel = model('Variant', variantSchema)
