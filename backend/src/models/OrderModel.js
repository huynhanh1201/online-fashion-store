import mongoose from 'mongoose'
import { refIntegrityPlugin } from '~/plugins/refIntegrityPlugin'
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
    shippingAddress: {
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
      }
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: [
        'Pending',
        'Processing',
        'Shipping',
        'Shipped',
        'Delivered',
        'Cancelled',
        'Failed'
      ],
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
    },

    shippingFee: {
      type: Number,
      default: 0,
      min: 0
    },

    code: {
      type: String,
      unique: true,
      trim: true,
      required: true
    }
  },
  {
    timestamps: true // Tự động thêm và cập nhật createdAt & updatedAt :contentReference[oaicite:0]{index.jsx=0}:contentReference[oaicite:1]{index.jsx=1}
  }
)

// Gắn plugin kiểm tra liên kết
OrderSchema.plugin(refIntegrityPlugin, {
  references: [
    { model: 'PaymentSessionDraft', foreignField: 'orderId' },

    {
      model: 'OrderItem',
      foreignField: 'orderId'
    },

    {
      model: 'PaymentTransaction',
      foreignField: 'orderId'
    },

    {
      model: 'OrderStatusHistory',
      foreignField: 'orderId'
    },

    {
      model: 'Review',
      foreignField: 'orderId'
    }
  ]
})

// Tạo Model
export const OrderModel = model('Order', OrderSchema)
