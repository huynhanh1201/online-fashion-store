import React from 'react'
import { Typography, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import RoleTable from './RoleTable'
import useRoles from '~/hooks/admin/useRoles'
import usePermissions from '~/hooks/usePermissions'
import usePermission from '~/hooks/admin/usePermission.js'
import { PermissionWrapper, RouteGuard } from '~/components/PermissionGuard'

// Lazy load modals
const AddRoleModal = React.lazy(() => import('./modal/AddRoleModal'))
const ViewRoleModal = React.lazy(() => import('./modal/ViewRoleModal'))
const EditRoleModal = React.lazy(() => import('./modal/EditRoleModal'))
const DeleteRoleModal = React.lazy(() => import('./modal/DeleteRoleModal'))

const RoleManagement = () => {
  const [page, setPage] = React.useState(1)
  const [filters, setFilters] = React.useState({
    status: 'false',
    sort: 'newest'
  })
  const [selectedRole, setSelectedRole] = React.useState(null)
  const [modalType, setModalType] = React.useState(null)

  const {
    roles,
    fetchRoles,
    totalPages,
    loading,
    add,
    update,
    remove,
    ROWS_PER_PAGE,
    setROWS_PER_PAGE
  } = useRoles()

  const { hasPermission } = usePermissions()
  const { permissions, fetchPermissions } = usePermission()
  React.useEffect(() => {
    fetchRoles(page, ROWS_PER_PAGE, filters)
  }, [page, ROWS_PER_PAGE, filters])
  React.useEffect(() => {
    fetchPermissions()
  }, [])
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
    } catch (err) {
      console.error('Lỗi:', err)
    }
  }
  const isEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2)

  const handleFilter = (newFilters) => {
    if (!isEqual(filters, newFilters)) {
      setPage(1)
      setFilters(newFilters)
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
        rowsPerPage={ROWS_PER_PAGE}
        total={totalPages}
        onPageChange={handleChangePage}
        onChangeRowsPerPage={(newLimit) => {
          setPage(1)
          setROWS_PER_PAGE(newLimit)
        }}
        permissions={{
          canCreate: hasPermission('role:create'),
          canEdit: hasPermission('role:update'),
          canDelete: hasPermission('role:delete'),
          canView: hasPermission('role:read')
        }}
        onFilter={handleFilter}
      />

      <React.Suspense fallback={<></>}>
        {modalType === 'add' && (
          <AddRoleModal
            open
            onClose={handleCloseModal}
            onSubmit={handleSave}
            p={permissions}
          />
        )}

        {modalType === 'view' && selectedRole && (
          <ViewRoleModal
            open
            onClose={handleCloseModal}
            role={selectedRole}
            p={permissions}
          />
        )}

        {modalType === 'edit' && selectedRole && (
          <EditRoleModal
            open
            onClose={handleCloseModal}
            onSubmit={handleSave}
            p={permissions}
            defaultValues={selectedRole}
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
