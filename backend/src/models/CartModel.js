import mongoose from 'mongoose'
const { Schema, model } = mongoose

// Tạo schema cho Giỏ hàng
const cartItemSchema = new Schema(
  {
    variantId: {
      type: Schema.Types.ObjectId,
      ref: 'Variant',
      required: true
    },
    color: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 50
    },
    size: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 10
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    }
  },
  { _id: false }
)

const cartSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true // để lookup nhanh theo user
    },
    cartItems: {
      type: [cartItemSchema],
      default: []
    }
  },
  {
    timestamps: true // tự tạo createdAt & updatedAt
  }
)

// Tạo Model
export const CartModel = model('Cart', cartSchema)
