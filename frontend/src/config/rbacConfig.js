import { getRoles } from '~/services/admin/roleService'
import { getPermissions } from '~/services/admin/permissionService'

// Role constants (map by name)
export const roles = {}

// Map role name => list of permissions
export const ROLE_PERMISSIONS = {}

// Danh sách tất cả quyền (nếu muốn sử dụng sau)
export const ALL_PERMISSIONS = []

// Hàm khởi tạo dữ liệu từ API
export const initRolePermissions = async () => {
  try {
    const [roleRes, permissionRes] = await Promise.all([
      getRoles(),
      getPermissions()
    ])

    const fetchedRoles = roleRes.data || []
    const fetchedPermissions = permissionRes.data || []

    // Reset
    Object.keys(roles).forEach((k) => delete roles[k])
    Object.keys(ROLE_PERMISSIONS).forEach((k) => delete ROLE_PERMISSIONS[k])
    ALL_PERMISSIONS.length = 0

    // Gán role constant
    fetchedRoles.forEach((role) => {
      roles[role.name.toUpperCase()] = role.name
      // Đảm bảo permissions là array của strings
      const permissions = Array.isArray(role.permissions)
        ? role.permissions.map((p) =>
            typeof p === 'string' ? p : p.name || p.permission
          )
        : []
      ROLE_PERMISSIONS[role.name] = permissions
    })

    // Gán danh sách quyền (nếu cần dùng sau)
    ALL_PERMISSIONS.push(...fetchedPermissions)

    console.log('=== RBAC Configuration Loaded ===')
    console.log('Roles:', roles)
    console.log('ROLE_PERMISSIONS:', ROLE_PERMISSIONS)
    console.log('ALL_PERMISSIONS:', ALL_PERMISSIONS)

    // Debug: Kiểm tra xem có role nào có quyền admin:access không
    Object.entries(ROLE_PERMISSIONS).forEach(([roleName, permissions]) => {
      if (permissions.includes('admin:access')) {
        console.log(`✅ Role "${roleName}" has admin:access permission`)
      } else {
        console.log(
          `❌ Role "${roleName}" does NOT have admin:access permission`
        )
      }
    })

    return { roles, ROLE_PERMISSIONS, ALL_PERMISSIONS }
  } catch (err) {
    console.error('Failed to init roles and permissions:', err)
    throw err
  }
}

// Kiểm tra roles đã load chưa
export const isRolesInitialized = () => {
  return Object.keys(ROLE_PERMISSIONS).length > 0
}

// Lấy quyền theo role
export const getRolePermissions = (roleName) => {
  return ROLE_PERMISSIONS[roleName] || []
}

// Kiểm tra role có quyền cụ thể không
export const hasRolePermission = (roleName, permission) => {
  const permissions = getRolePermissions(roleName)
  return permissions.includes(permission)
}
