// index.jsx
import React, { useState, useEffect } from 'react'
import { Typography, Button, Paper, CircularProgress } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import PermissionTable from './PermissionTable'
import AddPermissionModal from './modal/AddPermissionModal'
import EditPermissionModal from './modal/EditPermissionModal'
import ViewPermissionModal from './modal/ViewPermissionModal'
import DeletePermissionModal from './modal/DeletePermissionModal'
import usePermissions from '~/hooks/admin/usePermission.js'

export default function PermissionManagementPage() {
  const {
    permissions,
    fetchPermissions,
    add,
    update,
    remove,
    loading,
    totalPages
  } = usePermissions()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openView, setOpenView] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState(null)

  useEffect(() => {
    fetchPermissions(page, limit)
  }, [page, limit])

  const handleAdd = async (data) => {
    await add(data)
    setOpenAdd(false)
  }

  const handleEdit = async (updated) => {
    await update(updated._id, updated)
    setOpenEdit(false)
  }

  const handleDelete = async () => {
    await remove(selectedPermission._id)
    setOpenDelete(false)
  }
  const handleChangePage = (event, value) => setPage(value)
  return (
    <>
      <PermissionTable
        data={permissions}
        onEdit={(perm) => {
          setSelectedPermission(perm)
          setOpenEdit(true)
        }}
        onView={(perm) => {
          setSelectedPermission(perm)
          setOpenView(true)
        }}
        onDelete={(perm) => {
          setSelectedPermission(perm)
          setOpenDelete(true)
        }}
        onAdd={() => {
          setOpenAdd(true)
        }}
        loading={loading}
        page={page - 1}
        rowsPerPage={limit}
        total={totalPages}
        onPageChange={handleChangePage}
        onChangeRowsPerPage={(newLimit) => {
          setPage(1)
          setLimit(newLimit)
        }}
      />

      <AddPermissionModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={handleAdd}
      />
      <EditPermissionModal
        open={openEdit}
        defaultValues={selectedPermission}
        onClose={() => setOpenEdit(false)}
        onSuccess={handleEdit}
      />
      <ViewPermissionModal
        open={openView}
        permission={selectedPermission}
        onClose={() => setOpenView(false)}
      />
      <DeletePermissionModal
        open={openDelete}
        permission={selectedPermission}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
      />
    </>
  )
}
