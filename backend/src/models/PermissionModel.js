import mongoose from 'mongoose'
const { Schema, model } = mongoose

const permissionSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true // key phải duy nhất: ví dụ "user:create"
    },
    label: {
      type: String,
      required: true // Nhãn hiển thị cho UI, ví dụ: "Tạo tài khoản nhân viên"
    },
    group: {
      type: String,
      required: true // Nhóm chức năng, ví dụ: "Tài khoản", "Sản phẩm"
    }
  },
  {
    timestamps: true
  }
)

// Tạo Model
export const PermissionModel = model('Permission', permissionSchema)
