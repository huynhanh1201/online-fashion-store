import { useSelector } from 'react-redux'
import { useEffect, useState, useCallback } from 'react'
import { selectCurrentUser } from '~/redux/user/userSlice'
import {
  ROLE_PERMISSIONS,
  initRolePermissions,
  isRolesInitialized
} from '~/config/rbacConfig'

const usePermissions = () => {
  const currentUser = useSelector(selectCurrentUser)
  const [rolesLoaded, setRolesLoaded] = useState(isRolesInitialized())
  const [loading, setLoading] = useState(false)

  // Tải roles từ API nếu chưa có
  useEffect(() => {
    let isMounted = true

    const loadRoles = async () => {
      if (!isRolesInitialized()) {
        setLoading(true)
        try {
          await initRolePermissions()
          if (isMounted) {
            setRolesLoaded(true)
            setLoading(false)
          }
        } catch (error) {
          console.error('Failed to load roles in usePermissions:', error)
          if (isMounted) {
            setRolesLoaded(false)
            setLoading(false)
          }
        }
      } else {
        setRolesLoaded(true)
        setLoading(false)
      }
    }

    loadRoles()

    return () => {
      isMounted = false
    }
  }, [])

  const getUserPermissions = useCallback(() => {
    if (!currentUser?.role || !rolesLoaded) {
      console.log('getUserPermissions: No user role or roles not loaded', {
        hasUser: !!currentUser,
        userRole: currentUser?.role,
        rolesLoaded
      })
      return []
    }

    const permissions = ROLE_PERMISSIONS[currentUser.role] || []
    console.log(
      `getUserPermissions for role "${currentUser.role}":`,
      permissions
    )
    return permissions
  }, [currentUser, rolesLoaded])

  const hasPermission = useCallback(
    (permission) => getUserPermissions().includes(permission),
    [getUserPermissions]
  )

  const hasAnyPermission = useCallback(
    (permissions) => permissions.some((p) => getUserPermissions().includes(p)),
    [getUserPermissions]
  )

  const hasAllPermissions = useCallback(
    (permissions) => permissions.every((p) => getUserPermissions().includes(p)),
    [getUserPermissions]
  )

  const canAccessAdmin = useCallback(() => {
    const hasAccess = hasPermission('admin:access')
    console.log('canAccessAdmin check:', {
      currentUser: currentUser?.email || 'No user',
      role: currentUser?.role || 'No role',
      hasAccess,
      allPermissions: getUserPermissions()
    })
    return hasAccess
  }, [hasPermission, currentUser, getUserPermissions])

  const isRole = useCallback(
    (role) => currentUser?.role === role,
    [currentUser]
  )

  return {
    currentUser,
    getUserPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessAdmin,
    isRole,
    rolesLoaded,
    loading,
    isRolesInitialized: () => isRolesInitialized()
  }
}

export default usePermissions
