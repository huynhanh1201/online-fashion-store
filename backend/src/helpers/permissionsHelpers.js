/**
 *Input: permissions: []
 * Output: [
 *   {
 *     "group": "Tài khoản",
 *     "permissions": [
 *       { "key": "user:read", "label": "Xem tài khoản nhân viên" },
 *       { "key": "user:create", "label": "Tạo tài khoản nhân viên" }
 *     ]
 *   }
 * ]
 * */
const groupPermissions = (rawData) => {
  const grouped = {}

  rawData.forEach((item) => {
    const group = item.group || 'Khác'

    if (!grouped[group]) grouped[group] = []

    grouped[group].push({
      key: item.key,
      label: item.label
    })
  })

  const result = Object.entries(grouped).map(([group, permissions]) => ({
    group,
    permissions
  }))

  return result
}

export const permissionsHelpers = {
  groupPermissions
}
