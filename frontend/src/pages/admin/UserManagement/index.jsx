import * as React from 'react'
import Typography from '@mui/material/Typography'
import UserTable from './UserTable'
import useUsers from '~/hooks/admin/useUsers'
// Lazy load các modal
const EditUserModal = React.lazy(() => import('./modal/EditUserModal'))
const DeleteUserModal = React.lazy(() => import('./modal/DeleteUserModal'))
const ViewUserModal = React.lazy(() => import('./modal/ViewUserModal'))

const ROWS_PER_PAGE = 10

export default function UserManagement() {
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

  const handleOpenModal = async (type, user) => {
    if (!user || !user._id) return
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
      <Typography variant='h5' sx={{ mb: 2 }}>
        Quản lý người dùng
      </Typography>
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
