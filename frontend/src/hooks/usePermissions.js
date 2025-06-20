import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { ROLE_PERMISSIONS } from '~/config/rbacConfig'

// Custom hook dùng để kiểm tra quyền hạn của user theo role và permission (RBAC - Role-Based Access Control)
const usePermissions = () => {
  const currentUser = useSelector(selectCurrentUser)

  // Lấy quyền của user hiện tại để truyền vào hasPermission
  const getUserPermissions = () => {
    if (!currentUser || !currentUser.role) {
      return []
    }
    // Lấy role của ng dùng để truyền vào ROLE_PERMISSIONS để lấy ra danh sách quyền của user đó
    return ROLE_PERMISSIONS[currentUser.role] || []
  }

  // Kiểm tra user có quyền cụ thể không nhận vào permission để kiểm tra
  const hasPermission = (permission) => {
    // Lấy và gán vào biến userPermissions 1 mảng danh sách các quyền của user hiện tại
    const userPermissions = getUserPermissions()
    // Kiểm tra permission đầu vào có nằm trong mảng userPermissions hay không
    return userPermissions.includes(permission)
  }

  // Kiểm tra xem người dùng có ít nhất một quyền trong danh sách các quyền được truyền vào
  const hasAnyPermission = (permissions) => {
    // Lấy và gán vào biến userPermissions 1 mảng danh sách các quyền
    const userPermissions = getUserPermissions()
    return permissions.some(permission => userPermissions.includes(permission))
  }

  // Kiểm tra user có tất cả các quyền không
  const hasAllPermissions = (permissions) => {
    const userPermissions = getUserPermissions()
    return permissions.every(permission => userPermissions.includes(permission))
  }

  // Kiểm tra user có thể truy cập trang admin không
  const canAccessAdmin = () => {
    return hasPermission('admin:access')
  }

  // Kiểm tra role của user
  const isRole = (role) => {
    return currentUser?.role === role
  }

  // Kiểm tra user có phải admin không (owner hoặc technical_admin)
  const isAdmin = () => {
    return isRole('owner') || isRole('technical_admin')
  }

  // Kiểm tra user có phải staff không
  const isStaff = () => {
    return isRole('staff')
  }

  // Kiểm tra user có phải customer không
  const isCustomer = () => {
    return isRole('customer')
  }

  return {
    currentUser,
    getUserPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessAdmin,
    isRole,
    isAdmin,
    isStaff,
    isCustomer
  }
}

export default usePermissions