import mongoose from 'mongoose'
const { Schema, model } = mongoose

// Định nghĩa schema cho đơn hàng
const OrderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    couponId: {
      type: Schema.Types.ObjectId,
      ref: 'Coupon'
    },
    couponCode: {
      type: String,
      trim: true,
      uppercase: true
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    shippingAddressId: {
      type: Schema.Types.ObjectId,
      ref: 'ShippingAddress',
      required: true
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'vnpay', 'momo', 'paypal', 'credit_card'],
      default: null
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: null
    },
    isDelivered: {
      type: Boolean,
      default: false
    },
    note: {
      type: String,
      default: null,
      trim: true
    }
  },
  {
    timestamps: true // Tự động thêm và cập nhật createdAt & updatedAt :contentReference[oaicite:0]{index=0}:contentReference[oaicite:1]{index=1}
  }
)

// Tạo Model
export const OrderModel = model('Order', OrderSchema)
