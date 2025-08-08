import mongoose from 'mongoose'
import { refIntegrityPlugin } from '../plugins/refIntegrityPlugin'
const { Schema, model } = mongoose

const roleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Tên role nên duy nhất
      trim: true
    },
    label: {
      type: String,
      required: true,
      trim: true
    },
    permissions: {
      type: [String], // Mảng permission objects
      default: []
    },

    destroy: {
      type: Boolean,
      default: false // Đặt mặc định là false
    }
  },
  {
    timestamps: true
  }
)

// Gắn plugin kiểm tra liên kết
roleSchema.plugin(refIntegrityPlugin, {
  references: [{ model: 'User', foreignField: 'roleId' }]
})

// Tạo Model
export const RoleModel = model('Role', roleSchema)
