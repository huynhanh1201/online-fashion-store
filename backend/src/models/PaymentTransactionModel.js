import mongoose from 'mongoose'
const { Schema, model } = mongoose

// Tạo schema cho Sản phẩm
const paymentTransactionSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true
    },
    method: {
      type: String,
      enum: ['COD', 'momo', 'vnpay', 'paypal', 'credit_card'],
      required: true
    },
    transactionId: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Pending',
      required: true
    },
    paidAt: {
      type: Date,
      default: null
    },
    note: {
      type: String,
      trim: true,
      default: ''
    },
    destroy: {
      type: Boolean,
      default: false // Soft-delete mặc định là false
    },
    orderCode: {
      type: String,
      required: true
    }
  },
  {
    // Tự động thêm createdAt & updatedAt
    timestamps: true
  }
)

// Tạo Model
export const PaymentTransactionModel = model(
  'PaymentTransaction',
  paymentTransactionSchema
)
