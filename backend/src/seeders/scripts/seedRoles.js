import mongoose from 'mongoose'

import { RoleModel } from '../../models/RoleModel.js'
import { CONNECT_DB } from '../../config/mongodb.js'
import { roles } from '../data/rolesData.js'

export async function seedRoles() {
  try {
    // Kết nối MongoDB
    await CONNECT_DB()

    // Xóa roles cũ để không bị trùng (tuỳ chọn, cẩn thận prod)
    await RoleModel.deleteMany({})

    // Tạo mới roles
    await RoleModel.create(roles)

    // eslint-disable-next-line no-useless-catch
  } catch (err) {
    throw err
  } finally {
    await mongoose.disconnect()
  }
}
