import mongoose from 'mongoose'
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
    }
  },
  {
    timestamps: true
  }
)

// Tạo Model
export const RoleModel = model('Role', roleSchema)
