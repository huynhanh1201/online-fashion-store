import mongoose from 'mongoose'
import { refIntegrityPlugin } from '~/plugins/refIntegrityPlugin'
const { Schema, model } = mongoose

// Tạo schema cho người dùng
const userSchema = new Schema(
  {
    // Họ tên đầy đủ
    name: {
      type: String,
      required: true, // bắt buộc
      minlength: 3, // tối thiểu 3 ký tự
      maxlength: 50, // tối đa 50 ký tự
      trim: true
    },

    // Email đăng nhập, bắt buộc và không được trùng
    email: {
      type: String,
      required: true,
      unique: true, // tạo unique index.jsx trên email :contentReference[oaicite:3]{index.jsx=3}
      lowercase: true,
      trim: true,
      maxlength: 100
    },

    // Mật khẩu (đã hash bằng bcrypt)
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 128
    },

    // Anh đại diện người dùng
    avatarUrl: {
      type: String, // Lưu URL ảnh
      default: 'images/default-avatar.png', // Giá trị mặc định nếu chưa có ảnh
      trim: true, // Loại bỏ khoảng trắng đầu/cuối
      match: /\.(jpeg|jpg|png|gif)$/ // Chỉ cho phép các định dạng ảnh phổ biến
    },

    // Vai trò người dùng: 'user' hoặc 'HeaderAdmin'
    role: {
      type: String,
      enum: ['owner', 'technical_admin', 'staff', 'customer'],
      default: 'customer'
    },

    // Slug cho tên người dùng
    slug: {
      type: String,
      required: false
    },

    // Soft delete flag
    destroy: {
      type: Boolean,
      default: false
    },

    // Trạng thái tài khoản đã xác thực email hay chưa
    isActive: {
      type: Boolean,
      default: false
    },

    // Xác thực email
    verifyToken: {
      type: String
    }
  },
  {
    // Tự động thêm createdAt & updatedAt :contentReference[oaicite:4]{index.jsx=4}
    timestamps: true
  }
)

// Gắn plugin kiểm tra liên kết
userSchema.plugin(refIntegrityPlugin, {
  references: [
    { model: 'ShippingAddress', foreignField: 'userId' },

    {
      model: 'Product',
      foreignField: 'categoryId'
    }
  ]
})

// Tạo Model
export const UserModel = model('User', userSchema)
