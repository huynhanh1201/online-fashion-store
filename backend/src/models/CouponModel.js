import mongoose from 'mongoose'
const { Schema, model } = mongoose

// Định nghĩa schema cho đơn hàng
const CouponSchema = new Schema(
  {
    code: {
      type: String, // Mã giảm giá, VD: "SUMMER2025"
      required: true,
      unique: true,
      trim: true,
      uppercase: true
    },
    type: {
      type: String, // Loại giảm: 'percent' hoặc 'fixed'
      required: true,
      enum: ['percent', 'fixed']
    },
    amount: {
      type: Number, // Giá trị giảm (số % hoặc VNĐ)
      required: true,
      min: 0
    },
    minOrderValue: {
      type: Number, // Đơn tối thiểu để áp dụng mã (VNĐ)
      default: 0,
      min: 0
    },
    usageLimit: {
      type: Number, // Số lần tối đa có thể dùng mã
      default: 0,
      min: 0
    },
    usedCount: {
      type: Number, // Đếm số lần đã dùng mã
      default: 0,
      min: 0
    },
    validFrom: {
      type: Date, // Ngày bắt đầu hiệu lực
      required: true
    },
    validUntil: {
      type: Date, // Ngày kết thúc hiệu lực
      required: true
    },
    isActive: {
      type: Boolean, // Mã đang bật/tắt
      default: true
    }
  },
  {
    timestamps: true // Tự động thêm createdAt và updatedAt
  }
)

// Tạo Model
export const CouponModel = model('Coupon', CouponSchema)
