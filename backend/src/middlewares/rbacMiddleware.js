import { StatusCodes } from 'http-status-codes'
import { RoleModel } from '~/models/RoleModel'
import apiError from '~/utils/ApiError'

const isValidPermission = (requiredPermissions) => async (req, res, next) => {
  try {
    // Lấy role  người dùng từ JWT
    const userRole = req.jwtDecoded.role

    // Kiểm tra role
    if (!userRole) {
      throw new apiError(
        StatusCodes.FORBIDDEN,
        ' Forbidden: Có vấn đề với role của bạn'
      )
    }

    // Dựa theo role của user để lấy permissions
    const fullUserRole = await RoleModel.findOne({ name: userRole })

    if (!fullUserRole) {
      throw new apiError(
        StatusCodes.FORBIDDEN,
        ' Forbidden: Không tồn tại role của bạn trong hệ thống!'
      )
    }

    const fullUserPermissions = fullUserRole.permissions
    /**
     * Kiểm tra quyền truy cập.
     * Lưu ý nếu không cung cấp mảng requiredPermissions hoặc mảng rỗng thì
     * nghĩa là không check quyền => luôn cho phép truy cập API.
     * */

    const hasPermission = requiredPermissions.every((i) =>
      fullUserPermissions.includes(i)
    )

    if (!hasPermission) {
      throw new apiError(
        StatusCodes.FORBIDDEN,
        ' Forbidden: Bạn không đủ quyền truy cập API này!'
      )
    }

    // Nếu hợp lệ, tiếp tục
    next()
  } catch (error) {
    next(error)
  }
}

export const rbacMiddleware = {
  isValidPermission
}
