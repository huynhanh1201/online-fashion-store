import React from 'react'
import AccountTable from './AccountTable.jsx'

import useAccount from '~/hooks/admin/useAccount.js'
import useRoles from '~/hooks/admin/useRoles.js'
import usePermissions from '~/hooks/usePermissions'
import { PermissionWrapper, RouteGuard } from '~/components/PermissionGuard'

// Lazy load các Chart
const ViewAccountModal = React.lazy(
  () => import('./modal/ViewAccountModal.jsx')
)
const EditAccountModal = React.lazy(
  () => import('./modal/EditAccountModal.jsx')
)
const DeleteAccountModal = React.lazy(
  () => import('./modal/DeleteAccountModal.jsx')
)
const AddAccountModal = React.lazy(() => import('./modal/AddAccountModal.jsx'))
const RestoreAccountModal = React.lazy(
  () => import('./modal/RestoreAccountModal.jsx')
)
const AccountManagement = () => {
  const { roles, fetchRoles } = useRoles()
  const [page, setPage] = React.useState(1)
  const [selectedUser, setSelectedUser] = React.useState(null)
  const [modalType, setModalType] = React.useState(null)
  const [filters, setFilters] = React.useState({
    sort: 'newest',
    destroy: 'false'
  })

  const {
    users,
    fetchUsers,
    Loading,
    removeUser,
    update,
    add,
    ROWS_PER_PAGE,
    setROWS_PER_PAGE,
    Restore
  } = useAccount()

  const { hasPermission } = usePermissions()

  React.useEffect(() => {
    fetchRoles(1, 10000, { destroy: 'false' })
  }, [])

  React.useEffect(() => {
    fetchUsers(page, ROWS_PER_PAGE, filters)
  }, [page, ROWS_PER_PAGE, filters])
  // Lọc bỏ role === 'customer'
  const filteredUsers = React.useMemo(
    () => users.filter((user) => user?.role !== 'customer'),
    [users]
  )

  // Tính lại số trang dựa trên số lượng user đã lọc
  const filteredTotalPages = React.useMemo(
    () => Math.ceil(filteredUsers.length / ROWS_PER_PAGE),
    [filteredUsers, ROWS_PER_PAGE]
  )

  // Lấy danh sách user theo trang hiện tại
  const usersToShow = React.useMemo(() => {
    const startIndex = (page - 1) * ROWS_PER_PAGE
    return filteredUsers.slice(startIndex, startIndex + ROWS_PER_PAGE)
  }, [filteredUsers, page, ROWS_PER_PAGE])

  const handleOpenModal = (type, user = null) => {
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
      if (type === 'add') {
        await add(data)
      } else if (type === 'edit') {
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
    <RouteGuard requiredPermissions={['admin:access', 'account:use']}>
      <AccountTable
        users={usersToShow}
        loading={Loading}
        handleOpenModal={handleOpenModal}
        onFilters={handleFilter}
        fetchUsers={fetchUsers}
        page={page - 1}
        rowsPerPage={ROWS_PER_PAGE}
        total={filteredUsers.length}
        onPageChange={handleChangePage}
        onChangeRowsPerPage={(newLimit) => {
          setPage(1)
          setROWS_PER_PAGE(newLimit)
        }}
        permissions={{
          canAdd: hasPermission('user:create'),
          canEdit: hasPermission('user:update'),
          canDelete: hasPermission('user:delete'),
          canView: hasPermission('user:read')
        }}
        roles={roles}
        filters={filters}
      />

      <React.Suspense fallback={<></>}>
        {modalType === 'view' && selectedUser && (
          <ViewAccountModal
            open
            onClose={handleCloseModal}
            user={selectedUser}
            roles={roles}
          />
        )}

        <PermissionWrapper requiredPermissions={['user:create']}>
          {modalType === 'add' && (
            <AddAccountModal
              open
              onClose={handleCloseModal}
              onSave={handleSave}
              roles={roles}
            />
          )}
        </PermissionWrapper>

        <PermissionWrapper requiredPermissions={['user:update']}>
          {modalType === 'edit' && selectedUser && (
            <EditAccountModal
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
            <DeleteAccountModal
              open
              onClose={handleCloseModal}
              user={selectedUser}
              onDelete={handleSave}
            />
          )}
        </PermissionWrapper>
        <PermissionWrapper requiredPermissions={['user:restore']}>
          {modalType === 'restore' && selectedUser && (
            <RestoreAccountModal
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

export default AccountManagement
