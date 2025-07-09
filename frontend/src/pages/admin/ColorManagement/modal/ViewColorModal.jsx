import React from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Chip from '@mui/material/Chip'

import StyleAdmin from '~/assets/StyleAdmin.jsx'

const ViewColorModal = ({ open, onClose, color }) => {
  if (!color) return null

  const statusLabel = {
    active: 'Hiển thị',
    inactive: 'Ẩn'
  }

  const statusColor = {
    active: 'success',
    inactive: 'default'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Không có thông tin'
    const date = new Date(dateString)
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='sm'
      BackdropProps={{
        sx: StyleAdmin.OverlayModal
      }}
    >
      <DialogTitle>Xem thông tin màu sắc</DialogTitle>
      <Divider sx={{ my: 0 }} />
      <DialogContent sx={{ overflowY: 'auto', py: 0 }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', width: '35%' }}>
                Tên màu
              </TableCell>
              <TableCell>
                {color?.name
                  .split(' ')
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(' ') || 'Không có tên'}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
              <TableCell>
                <Chip
                  label={color.destroy ? 'Ngừng hiển thị' : 'Đang hoạt động'}
                  color={color.destroy ? 'error' : 'success'}
                  size='lagre'
                  sx={{ width: 120, fontWeight: 800 }}
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Ngày tạo</TableCell>
              <TableCell>{formatDate(color.createdAt)}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', borderBottom: 0 }}>
                Ngày cập nhật
              </TableCell>
              <TableCell sx={{ borderBottom: 0 }}>
                {formatDate(color.updatedAt)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
      <Divider sx={{ my: 0 }} />
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button
          onClick={onClose}
          color='error'
          variant='outlined'
          sx={{ textTransform: 'none' }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewColorModal
