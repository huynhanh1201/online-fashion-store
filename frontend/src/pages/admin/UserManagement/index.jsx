// import React from 'react'
// import UserTable from './UserTable'
//
// import useUsers from '~/hooks/admin/useUsers'
// import usePermissions from '~/hooks/usePermissions'
// import { PermissionWrapper, RouteGuard } from '~/components/PermissionGuard'
//
// // Lazy load các modal
// const ViewUserModal = React.lazy(() => import('./modal/ViewUserModal'))
// const EditUserModal = React.lazy(() => import('./modal/EditUserModal'))
// const DeleteUserModal = React.lazy(() => import('./modal/DeleteUserModal'))
//
// const UserManagement = () => {
//   const [page, setPage] = React.useState(1)
//   const [selectedUser, setSelectedUser] = React.useState(null)
//   const [limit, setLimit] = React.useState(10)
//   const [modalType, setModalType] = React.useState(null)
//   const [filters, setFilters] = React.useState({
//     sort: 'newest'
//   })
//
//   const { users, totalPages, fetchUsers, Loading, removeUser, updateUser } =
//     useUsers()
//
//   const { hasPermission } = usePermissions()
//
//   React.useEffect(() => {
//     fetchUsers(page, limit, filters)
//   }, [page, limit, filters])
//
//   const handleOpenModal = (type, user) => {
//     if (!user || !user._id) return
//     setSelectedUser(user)
//     setModalType(type)
//   }
//
//   const handleCloseModal = () => {
//     setSelectedUser(null)
//     setModalType(null)
//   }
//
//   const handleChangePage = (event, value) => setPage(value)
//
//   const handleSave = async (data, type, id) => {
//     try {
//       if (type === 'edit') {
//         await updateUser(id, data)
//       } else if (type === 'delete') {
//         await removeUser(data)
//       }
//     } catch (error) {
//       console.error('Lỗi:', error)
//     }
//   }
//
//   const isEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2)
//
//   const handleFilter = (newFilters) => {
//     if (!isEqual(filters, newFilters)) {
//       setPage(1)
//       setFilters(newFilters)
//     }
//   }
//
//   return (
//     <RouteGuard requiredPermissions={['admin:access', 'user:read']}>
//       <UserTable
//         users={users}
//         loading={Loading}
//         handleOpenModal={handleOpenModal}
//         onFilters={handleFilter}
//         fetchUsers={fetchUsers}
//         page={page - 1}
//         rowsPerPage={limit}
//         total={totalPages}
//         onPageChange={handleChangePage}
//         onChangeRowsPerPage={(newLimit) => {
//           setPage(1)
//           setLimit(newLimit)
//         }}
//         permissions={{
//           canEdit: hasPermission('user:update'),
//           canDelete: hasPermission('user:delete'),
//           canView: hasPermission('user:read')
//         }}
//       />
//
//       <React.Suspense fallback={<></>}>
//         {modalType === 'view' && selectedUser && (
//           <ViewUserModal open onClose={handleCloseModal} user={selectedUser} />
//         )}
//
//         <PermissionWrapper requiredPermissions={['user:update']}>
//           {modalType === 'edit' && selectedUser && (
//             <EditUserModal
//               open
//               onClose={handleCloseModal}
//               user={selectedUser}
//               onSave={handleSave}
//             />
//           )}
//         </PermissionWrapper>
//
//         <PermissionWrapper requiredPermissions={['user:delete']}>
//           {modalType === 'delete' && selectedUser && (
//             <DeleteUserModal
//               open
//               onClose={handleCloseModal}
//               user={selectedUser}
//               onDelete={handleSave}
//             />
//           )}
//         </PermissionWrapper>
//       </React.Suspense>
//     </RouteGuard>
//   )
// }
//
// export default UserManagement

import * as React from 'react'
import { Typography, Box } from '@mui/material'
import UserTable from './UserTable'
import useUsers from '~/hooks/admin/useUsers'
import usePermissions from '~/hooks/usePermissions'
// Lazy load các modal
const EditUserModal = React.lazy(() => import('./modal/EditUserModal'))
const DeleteUserModal = React.lazy(() => import('./modal/DeleteUserModal'))
const ViewUserModal = React.lazy(() => import('./modal/ViewUserModal'))

const ROWS_PER_PAGE = 10

export default function UserManagement() {
  const { hasPermission } = usePermissions()
  const [page, setPage] = React.useState(1)
  const [filters, setFilters] = React.useState()
  const [selectedUser, setSelectedUser] = React.useState(null)
  const [modalType, setModalType] = React.useState(null)
  const [ModalComponent, setModalComponent] = React.useState(null)

  const { users, fetchUsers, removeUser, Loading } = useUsers()
  // Gọi API duy nhất một lần khi component mount
  React.useEffect(() => {
    const loadData = async () => {
      await fetchUsers(page, ROWS_PER_PAGE)
    }
    loadData()
  }, [page])

  // Kiểm tra quyền truy cập user management
  if (!hasPermission('user:read')) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant='h6' color='error'>
          Bạn không có quyền truy cập quản lý người dùng
        </Typography>
      </Box>
    )
  }

  const handleOpenModal = async (type, user) => {
    if (!user || !user._id) return

    // Kiểm tra quyền trước khi mở modal
    if (type === 'view' && !hasPermission('user:read')) return
    if (type === 'edit' && !hasPermission('user:update')) return
    if (type === 'delete' && !hasPermission('user:delete')) return

    setSelectedUser(user)
    setModalType(type)

    if (type === 'view') {
      const { default: Modal } = await import('./modal/ViewUserModal.jsx')
      setModalComponent(() => Modal)
    }
    if (type === 'edit') {
      const { default: Modal } = await import('./modal/EditUserModal.jsx')
      setModalComponent(() => Modal)
    }
    if (type === 'delete') {
      const { default: Modal } = await import('./modal/DeleteUserModal.jsx')
      setModalComponent(() => Modal)
    }
  }

  const handleCloseModal = () => {
    setSelectedUser(null)
    setModalType(null)
  }

  const handleDeleteUser = async (id) => {
    await removeUser(id, page) // ← truyền đúng page hiện tại
    handleCloseModal()
  }
  return (
    <>
      <UserTable
        users={users}
        page={page}
        loading={Loading}
        handleOpenModal={handleOpenModal}
        onFilter={(filters) => {
          setFilters(filters)
          fetchUsers(1, ROWS_PER_PAGE, filters)
        }}
      />

      {modalType === 'view' && selectedUser && (
        <ViewUserModal open onClose={handleCloseModal} user={selectedUser} />
      )}
      {ModalComponent && selectedUser && (
        <ModalComponent
          open
          onClose={handleCloseModal}
          user={selectedUser}
          onSave={modalType === 'edit' ? fetchUsers : undefined}
          onDelete={
            modalType === 'delete'
              ? () => handleDeleteUser(selectedUser._id)
              : undefined
          }
        />
      )}
      {modalType === 'delete' && selectedUser && (
        <DeleteUserModal
          open
          onClose={handleCloseModal}
          user={selectedUser}
          onDelete={() => handleDeleteUser(selectedUser._id)}
        />
      )}
    </>
  )
}
