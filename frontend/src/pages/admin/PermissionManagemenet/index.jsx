// index.jsx
import React, { useState } from 'react'
import { Typography, Button, Paper } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import PermissionTable from './PermissionTable'
import AddPermissionModal from './modal/AddPermissionModal'
import EditPermissionModal from './modal/EditPermissionModal'
import ViewPermissionModal from './modal/ViewPermissionModal'
import DeletePermissionModal from './modal/DeletePermissionModal'

const mockPermissions = [
  {
    group: 'Khu vực',
    permissions: [
      { key: 'zone:use', label: 'Sử dụng' },
      { key: 'zone:read', label: 'Xem' },
      { key: 'zone:create', label: 'Tạo mới' },
      { key: 'zone:update', label: 'Sửa' },
      { key: 'zone:delete', label: 'Xóa' }
    ]
  },
  {
    group: 'Báo giá',
    permissions: [
      { key: 'quote:read', label: 'Xem báo giá' },
      { key: 'quote:create', label: 'Tạo báo giá' },
      { key: 'quote:update', label: 'Sửa báo giá' },
      { key: 'quote:delete', label: 'Xóa báo giá' },
      { key: 'quote:approve', label: 'Phê duyệt báo giá' },
      { key: 'quote:send', label: 'Gửi báo giá' },
      { key: 'quote:archive', label: 'Lưu trữ báo giá' }
    ]
  }
]

export default function PermissionManagementPage() {
  const [permissions, setPermissions] = useState(mockPermissions)
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openView, setOpenView] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState(null)

  const handleAdd = (newPermission) => {
    const updated = [...permissions]
    const groupIndex = updated.findIndex((g) => g.group === newPermission.group)
    if (groupIndex !== -1) {
      updated[groupIndex].permissions.push(newPermission)
    } else {
      updated.push({ group: newPermission.group, permissions: [newPermission] })
    }
    setPermissions(updated)
    setOpenAdd(false)
  }

  const handleEdit = (updatedPermission) => {
    const updated = permissions.map((group) => {
      if (group.group === updatedPermission.group) {
        return {
          ...group,
          permissions: group.permissions.map((p) =>
            p.key === updatedPermission.key ? updatedPermission : p
          )
        }
      }
      return group
    })
    setPermissions(updated)
    setOpenEdit(false)
  }

  const handleDelete = (key) => {
    const updated = permissions
      .map((group) => ({
        ...group,
        permissions: group.permissions.filter((p) => p.key !== key)
      }))
      .filter((group) => group.permissions.length > 0)
    setPermissions(updated)
    setOpenDelete(false)
  }

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography variant='h6' gutterBottom>
        Quản lý quyền
      </Typography>
      <Button
        variant='contained'
        startIcon={<AddIcon />}
        onClick={() => setOpenAdd(true)}
        sx={{ mb: 2 }}
      >
        Thêm quyền
      </Button>

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
        onConfirm={() => handleDelete(selectedPermission.key)}
      />
    </Paper>
  )
}
