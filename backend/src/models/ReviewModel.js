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
    },

    images: {
      type: [String],
      default: []
    },
    videos: {
      type: [String],
      default: []
    },

    moderationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      required: true
    },
    moderatedAt: {
      type: Date,
      default: null // chỉ có khi đã kiểm duyệt
    },
    moderatedBy: {
      _id: { type: mongoose.Types.ObjectId },
      name: { type: String },
      role: { type: String },
      email: { type: String }
    }
  },
  {
    timestamps: true
  }
)

// Tạo Model
export const ReviewModel = model('Review', reviewSchema)
