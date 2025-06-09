import mongoose from 'mongoose'
const { Schema, model } = mongoose

const permissionSchema = new Schema(
  {
    key: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    group: {
      type: String,
      required: true
    }
  },
  {
    _id: false
  }
)

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
      type: [permissionSchema], // Mảng permission objects
      default: []
    }
  },
  {
    timestamps: true
  }
)

// Tạo Model
export const RoleModel = model('Role', roleSchema)
