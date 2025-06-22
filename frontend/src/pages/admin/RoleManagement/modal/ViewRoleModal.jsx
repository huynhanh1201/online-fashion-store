import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Chip,
  Divider
} from '@mui/material'

const ViewRoleModal = ({ open, onClose, role }) => {
  if (!role) return null

  const formatDateTime = (isoString) => {
    if (!isoString) return 'Không xác định'
    const date = new Date(isoString)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Chi tiết vai trò</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Typography>
            <strong>Tên vai trò:</strong> {role.name}
          </Typography>
          <Typography>
            <strong>Hiển thị:</strong> {role.label}
          </Typography>
          <Typography>
            <strong>Ngày tạo:</strong> {formatDateTime(role.createdAt)}
          </Typography>
          <Typography>
            <strong>Ngày cập nhật:</strong> {formatDateTime(role.updatedAt)}
          </Typography>

          <Divider />
          <Typography variant='h6'>Danh sách quyền</Typography>
          <Stack direction='row' spacing={1} flexWrap='wrap'>
            {(role.permissions || []).map((p) => (
              <Chip key={p} label={p} color='primary' variant='outlined' />
            ))}
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='contained' color='primary'>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewRoleModal
