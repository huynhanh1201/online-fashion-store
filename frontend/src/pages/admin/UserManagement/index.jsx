import React from 'react'
import UserTable from './UserTable'

import useUsers from '~/hooks/admin/useUsers'
import useRoles from '~/hooks/admin/useRoles.js'
import usePermissions from '~/hooks/usePermissions'
import { PermissionWrapper, RouteGuard } from '~/components/PermissionGuard'

// Lazy load các Chart
const ViewUserModal = React.lazy(() => import('./modal/ViewUserModal'))
const EditUserModal = React.lazy(() => import('./modal/EditUserModal'))
const DeleteUserModal = React.lazy(() => import('./modal/DeleteUserModal'))
const RestoreUserModal = React.lazy(() => import('./modal/RestoreUserModal'))

const UserManagement = () => {
  const { roles, fetchRoles } = useRoles()
  const [page, setPage] = React.useState(1)
  const [selectedUser, setSelectedUser] = React.useState(null)
  const [modalType, setModalType] = React.useState(null)
  const [filters, setFilters] = React.useState({
    sort: 'newest',
    role: 'customer',
    destroy: 'false'
  })

  const {
    users,
    totalPages,
    fetchUsers,
    Loading,
    removeUser,
    update,
    Restore,
    ROWS_PER_PAGE,
    setROWS_PER_PAGE
  } = useUsers()
  const { hasPermission } = usePermissions()

  React.useEffect(() => {
    fetchRoles(1, 10000)
  }, [])

  React.useEffect(() => {
    fetchUsers(page, ROWS_PER_PAGE, filters)
  }, [page, ROWS_PER_PAGE, filters])

  const handleOpenModal = (type, user) => {
    if (!user || !user._id) return
    setSelectedUser(user)
    setModalType(type)
  }

  const handleCloseModal = () => {
    setSelectedUser(null)
    setModalType(null)
  }

  const handleChangePage = (event, value) => setPage(value)

  const handleSave = async (data, type, id) => {
    try {
      if (type === 'edit') {
        await update(id, data)
      } else if (type === 'delete') {
        await removeUser(data)
      } else if (type === 'restore') {
        await Restore(data)
      }
    } catch (error) {
      console.error('Lỗi:', error)
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
    <RouteGuard requiredPermissions={['admin:access', 'user:use']}>
      <UserTable
        users={users}
        loading={Loading}
        handleOpenModal={handleOpenModal}
        onFilters={handleFilter}
        fetchUsers={fetchUsers}
        page={page - 1}
        rowsPerPage={ROWS_PER_PAGE}
        total={totalPages}
        onPageChange={handleChangePage}
        onChangeRowsPerPage={(newLimit) => {
          setPage(1)
          setROWS_PER_PAGE(newLimit)
        }}
        permissions={{
          canEdit: hasPermission('user:update'),
          canDelete: hasPermission('user:delete'),
          canView: hasPermission('user:read'),
          canRestore: hasPermission('user:restore')
        }}
        roles={roles}
        filters={filters}
      />

      <React.Suspense fallback={<></>}>
        {modalType === 'view' && selectedUser && (
          <ViewUserModal open onClose={handleCloseModal} user={selectedUser} />
        )}

        <PermissionWrapper requiredPermissions={['user:update']}>
          {modalType === 'edit' && selectedUser && (
            <EditUserModal
              open
              onClose={handleCloseModal}
              user={selectedUser}
              onSave={handleSave}
              roles={roles}
            />
          )}
        </PermissionWrapper>

        <PermissionWrapper requiredPermissions={['user:delete']}>
          {modalType === 'delete' && selectedUser && (
            <DeleteUserModal
              open
              onClose={handleCloseModal}
              user={selectedUser}
              onDelete={handleSave}
            />
          )}
        </PermissionWrapper>
        <PermissionWrapper requiredPermissions={['user:restore']}>
          {modalType === 'restore' && selectedUser && (
            <RestoreUserModal
              open
              onClose={handleCloseModal}
              user={selectedUser}
              onRestore={handleSave}
            />
          )}
        </PermissionWrapper>
      </React.Suspense>
    </RouteGuard>
  )
}

export default UserManagement
