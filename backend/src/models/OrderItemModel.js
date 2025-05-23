import mongoose from 'mongoose'
const { Schema, model } = mongoose

// Định nghĩa schema cho đơn hàng
const OrderItemSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order', // Tham chiếu đến đơn hàng
      required: true
    },
    image: [
      {
        type: String,
        trim: true // Mỗi phần tử là URL chuỗi, trim khoảng trắng
      }
    ],
    name: {
      type: String,
      required: true // tên sản phẩm lúc đặt không được bỏ trống
    },
    price: {
      type: Number,
      required: true, // giá từng món lúc đặt bắt buộc phải có
      min: 0 // giá tối thiểu 0
    },
    quantity: {
      type: Number,
      required: true, // số lượng không được bỏ trống
      min: 1 // tối thiểu 1 sản phẩm
    },
    subtotal: {
      type: Number,
      required: true, // subtotal = price * quantity
      min: 0 // tối thiểu 0
    }
  },
  {
    timestamps: true // Tự động thêm createdAt và updatedAt
  }
)

// Tạo Model
export const OrderItemModel = model('OrderItem', OrderItemSchema)
