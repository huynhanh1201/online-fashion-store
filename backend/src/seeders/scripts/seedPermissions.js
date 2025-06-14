import mongoose from 'mongoose'

import { CONNECT_DB } from '../../config/mongodb.js'
import { permissions } from '../data/permissionsRegistry.js'
import { PermissionModel } from '../../models/PermissionModel.js'

export async function seedPermissions() {
  try {
    // Kết nối MongoDB
    await CONNECT_DB()

    // Xóa permissions cũ để không bị trùng (tuỳ chọn, cẩn thận prod)
    await PermissionModel.deleteMany({})

    // Tạo mới permissions
    await PermissionModel.create(permissions)

    // eslint-disable-next-line no-useless-catch
  } catch (err) {
    throw err
  } finally {
    await mongoose.disconnect()
  }
}
