import mongoose from 'mongoose'
const { Schema, model } = mongoose

// Định nghĩa schema cho đơn hàng
const ShippingAddressSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true // để lookup nhanh theo user
    },

    fullName: {
      type: String,
      required: true, // Họ tên người nhận
      trim: true
    },
    phone: {
      type: String,
      required: true, // Số điện thoại liên hệ
      trim: true
    },
    address: {
      type: String,
      required: true, // Số nhà, tên đường
      trim: true
    },
    ward: {
      type: String,
      required: true, // Phường
      trim: true
    },
    district: {
      type: String,
      required: true, // Quận/Huyện
      trim: true
    },
    city: {
      type: String,
      required: true, // Thành phố/Tỉnh
      trim: true
    },
    destroy: {
      type: Boolean,
      default: false // Soft-delete mặc định là false
    }
  },
  {
    timestamps: true // Tự động thêm createdAt và updatedAt
  }
)

// Tạo Model
export const ShippingAddressModel = model(
  'ShippingAddress',
  ShippingAddressSchema
)
