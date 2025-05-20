import mongoose from 'mongoose'
const { Schema, model } = mongoose

// Định nghĩa schema cho đơn hàng
const OrderStatusHistorySchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      required: true
    },
    note: {
      type: String,
      default: null
    },
    updatedBy: {
      name: {
        type: String,
        required: true,
        trim: true // Tên người cập nhật
      },
      role: {
        type: String,
        required: true,
        enum: ['customer', 'admin'] // hoặc các role khác bạn có
      }
    }
  },
  {
    timestamps: {
      createdAt: false, // tắt createdAt
      updatedAt: 'updatedAt' // bật updatedAt với tên custom
    }
  }
)

// Tạo Model
export const OrderStatusHistoryModel = model(
  'OrderStatusHistory',
  OrderStatusHistorySchema
)
