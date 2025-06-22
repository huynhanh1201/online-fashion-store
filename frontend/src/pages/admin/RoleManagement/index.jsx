import React from 'react'
import { Typography, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import RoleTable from './RoleTable'
import useRoles from '~/hooks/admin/useRoles'
import usePermissions from '~/hooks/usePermissions'
import usePermission from '~/hooks/admin/usePermission.jsx'
import { PermissionWrapper, RouteGuard } from '~/components/PermissionGuard'

// Lazy load modals
const AddRoleModal = React.lazy(() => import('./modal/AddRoleModal'))
const ViewRoleModal = React.lazy(() => import('./modal/ViewRoleModal'))
const EditRoleModal = React.lazy(() => import('./modal/EditRoleModal'))
const DeleteRoleModal = React.lazy(() => import('./modal/DeleteRoleModal'))

const RoleManagement = () => {
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)
  const [selectedRole, setSelectedRole] = React.useState(null)
  const [modalType, setModalType] = React.useState(null)

  const { roles, fetchRoles, totalPages, loading, add, update, remove } =
    useRoles()

  const { hasPermission } = usePermissions()
  const { permissions, fetchPermissions } = usePermission()
  React.useEffect(() => {
    fetchRoles(page, limit)
    fetchPermissions()
  }, [page, limit])
  const handleOpenModal = (type, role) => {
    if (!role || !role._id) return
    setSelectedRole(role)
    setModalType(type)
  }

  const handleCloseModal = () => {
    setSelectedRole(null)
    setModalType(null)
  }

  const handleChangePage = (event, value) => setPage(value)

  const handleSave = async (data, type, id) => {
    try {
      if (type === 'add') {
        await add(data)
      } else if (type === 'edit') {
        await update(id, data)
      } else if (type === 'delete') {
        await remove(data)
      }
      fetchRoles(page, limit)
    } catch (err) {
      console.error('Lỗi:', err)
    }
  }

  return (
    <>
      <RoleTable
        roles={roles}
        loading={loading}
        handleOpenModal={handleOpenModal}
        addRole={() => setModalType('add')}
        page={page - 1}
        rowsPerPage={limit}
        total={totalPages}
        onPageChange={handleChangePage}
        onChangeRowsPerPage={(newLimit) => {
          setPage(1)
          setLimit(newLimit)
        }}
        permissions={{
          canCreate: hasPermission('role:create'),
          canEdit: hasPermission('role:update'),
          canDelete: hasPermission('role:delete'),
          canView: hasPermission('role:read')
        }}
      />

      <React.Suspense fallback={<></>}>
        {modalType === 'add' && (
          <AddRoleModal open onClose={handleCloseModal} onSubmit={handleSave} />
        )}

        {modalType === 'view' && selectedRole && (
          <ViewRoleModal open onClose={handleCloseModal} role={selectedRole} />
        )}

        {modalType === 'edit' && selectedRole && (
          <EditRoleModal
            open
            onClose={handleCloseModal}
            role={selectedRole}
            onSubmit={handleSave}
            p={permissions}
          />
        )}

        {modalType === 'delete' && selectedRole && (
          <DeleteRoleModal
            open
            onClose={handleCloseModal}
            role={selectedRole}
            onSubmit={handleSave}
          />
        )}
      </React.Suspense>
    </>
  )
}

export default RoleManagement
