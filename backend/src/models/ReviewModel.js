import mongoose from 'mongoose'
const { Schema, model } = mongoose

// Tạo schema cho Danh mục sản phẩm
const reviewSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: {
      type: String,
      required: true,
      trim: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    destroy: {
      type: Boolean,
      default: false // Mặc định không xóa mềm
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true
    }
  },
  {
    timestamps: true
  }
)

// Tạo Model
export const ReviewModel = model('Review', reviewSchema)
