import React from 'react'
import { Navigate } from 'react-router-dom'
import usePermissions from '~/hooks/usePermissions'

// Component bảo vệ route - chuyển hướng nếu không có quyền
const RouteGuard = ({ children, requiredPermissions = [], fallbackPath = '/login' }) => {
  const { hasAllPermissions, canAccessAdmin, currentUser, permissions } = usePermissions()

  // Fallback cho admin roles
  const isAdminRole = ['owner', 'technical_admin', 'staff'].includes(currentUser?.role)
  const hasNoPermissions = permissions.length === 0

  // Nếu cần quyền admin access
  if (requiredPermissions.includes('admin:access') && !canAccessAdmin()) {
    return <Navigate to={fallbackPath} replace />
  }

  // Nếu cần các quyền khác
  if (requiredPermissions.length > 0 && !hasAllPermissions(requiredPermissions)) {
    // Fallback: nếu là admin role và không có permissions từ API, cho phép truy cập
    if (isAdminRole && hasNoPermissions) {
      return children
    }
    return <Navigate to={fallbackPath} replace />
  }

  return children
}

// Component ẩn/hiện element dựa trên quyền
const PermissionWrapper = ({
  children,
  requiredPermissions = [],
  requireAll = true,
  fallback = null
}) => {
  const { hasPermission, hasAllPermissions, hasAnyPermission } = usePermissions()

  let hasAccess = false

  if (requiredPermissions.length === 0) {
    hasAccess = true
  } else if (requiredPermissions.length === 1) {
    hasAccess = hasPermission(requiredPermissions[0])
  } else {
    hasAccess = requireAll
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions)
  }

  return hasAccess ? children : fallback
}

// Component kiểm tra quyền admin
const AdminOnly = ({ children, fallback = null }) => {
  const { canAccessAdmin } = usePermissions()
  return canAccessAdmin() ? children : fallback
}

// Component kiểm tra role cụ thể
const RoleGuard = ({ children, allowedRoles = [], fallback = null }) => {
  const { isRole } = usePermissions()
  const hasRole = allowedRoles.some(role => isRole(role))
  return hasRole ? children : fallback
}

export { RouteGuard, PermissionWrapper, AdminOnly, RoleGuard }