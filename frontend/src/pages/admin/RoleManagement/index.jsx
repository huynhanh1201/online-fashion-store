// pages/admin/roles/index.jsx
import React from 'react'
import RoleTable from './RoleTable'
import useRoles from '~/hooks/admin/useRoles'
import usePermissions from '~/hooks/usePermissions'
import { PermissionWrapper, RouteGuard } from '~/components/PermissionGuard'

const RoleManagement = () => {
  const { roles, loading, fetchRoles, add, update, remove } = useRoles()
  const [modalType, setModalType] = React.useState(null)
  const [selectedRole, setSelectedRole] = React.useState(null)
  const { hasPermission } = usePermissions()

  React.useEffect(() => {
    fetchRoles()
  }, [])

  const handleOpenModal = (type, role) => {
    if (role) setSelectedRole(role)
    setModalType(type)
  }

  const handleCloseModal = () => {
    setModalType(null)
    setSelectedRole(null)
  }

  const handleSave = async (data, type, id) => {
    if (type === 'add') {
      await add(data)
    } else if (type === 'edit') {
      await update(id, data)
    } else if (type === 'delete') {
      await remove(data)
    }
    handleCloseModal()
  }

  return (
    <RouteGuard requiredPermissions={['admin:access', 'role:read']}>
      <RoleTable
        roles={roles}
        loading={loading}
        handleOpenModal={handleOpenModal}
        permissions={{
          canCreate: hasPermission('role:create'),
          canEdit: hasPermission('role:update'),
          canDelete: hasPermission('role:delete'),
          canView: hasPermission('role:read')
        }}
      />

      {/* Modal rendering có thể thêm sau nếu cần */}
    </RouteGuard>
  )
}

export default RoleManagement
