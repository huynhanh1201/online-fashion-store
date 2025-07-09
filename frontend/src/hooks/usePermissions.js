import { useSelector } from 'react-redux'
import { useState, useEffect, useCallback } from 'react'
import { selectCurrentUser } from '~/redux/user/userSlice'
import AuthorizedAxiosInstance from '~/utils/authorizedAxios.js'
import { API_ROOT } from '~/utils/constants.js'

// Bộ nhớ tạm để cache quyền theo role tránh gọi lại API nếu role không đổi
const permissionsCache = {}

const usePermissions = () => {
  const currentUser = useSelector(selectCurrentUser)
  const [permissions, setPermissions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Async: lấy quyền theo role hiện tại
  const getUserPermissions = useCallback(async () => {
    const roleName = currentUser?.role
    if (!roleName) return []

    // Nếu đã có trong cache → trả lại ngay
    if (permissionsCache[roleName]) return permissionsCache[roleName]

    try {
      setIsLoading(true)
      const query = new URLSearchParams({
        page: 1,
        limit: 10,
        roleName
      }).toString()

      const res = await AuthorizedAxiosInstance.get(
        `${API_ROOT}/v1/roles?${query}`
      )
      const permissions = res?.data?.data?.[0]?.permissions || []

      // Lưu vào cache
      permissionsCache[roleName] = permissions

      return permissions
    } catch (error) {
      console.error('Lỗi khi lấy quyền người dùng:', error)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [currentUser?.role])

  // Load permissions khi component mount hoặc role thay đổi
  useEffect(() => {
    const loadPermissions = async () => {
      if (currentUser?.role) {
        const userPermissions = await getUserPermissions()
        setPermissions(userPermissions)
        setIsInitialized(true)
      } else {
        setPermissions([])
        setIsInitialized(true)
      }
    }

    loadPermissions()
  }, [currentUser?.role, getUserPermissions])

  // Sync functions để sử dụng trong render
  const hasPermission = useCallback(
    (permission) => {
      return permissions.includes(permission)
    },
    [permissions]
  )

  const hasAnyPermission = useCallback(
    (permissionsToCheck) => {
      return permissionsToCheck.some((p) => permissions.includes(p))
    },
    [permissions]
  )

  const hasAllPermissions = useCallback(
    (permissionsToCheck) => {
      return permissionsToCheck.every((p) => permissions.includes(p))
    },
    [permissions]
  )

  const canAccessAdmin = useCallback(() => {
    // Kiểm tra quyền admin:access từ API trước
    const hasAdminPermission = hasPermission('admin:access')

    // Fallback: nếu không có quyền admin:access từ API, kiểm tra role
    if (!hasAdminPermission) {
      const isAdminRole = ['owner', 'technical_admin', 'staff'].includes(
        currentUser?.role
      )
      return isAdminRole
    }

    return hasAdminPermission
  }, [hasPermission, currentUser?.role])

  const isRole = useCallback(
    (role) => {
      return currentUser?.role === role
    },
    [currentUser?.role]
  )

  // Async versions (giữ lại để backward compatibility)
  const hasPermissionAsync = async (permission) => {
    const userPermissions = await getUserPermissions()
    return userPermissions.includes(permission)
  }

  const hasAnyPermissionAsync = async (permissionsToCheck) => {
    const userPermissions = await getUserPermissions()
    return permissionsToCheck.some((p) => userPermissions.includes(p))
  }

  const hasAllPermissionsAsync = async (permissionsToCheck) => {
    const userPermissions = await getUserPermissions()
    return permissionsToCheck.every((p) => userPermissions.includes(p))
  }

  const canAccessAdminAsync = async () => hasPermissionAsync('admin:access')

  return {
    currentUser,
    permissions,
    isLoading,
    isInitialized,
    getUserPermissions,
    // Sync functions (recommended for render)
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessAdmin,
    isRole,
    // Async functions (for backward compatibility)
    hasPermissionAsync,
    hasAnyPermissionAsync,
    hasAllPermissionsAsync,
    canAccessAdminAsync
  }
}

export default usePermissions
