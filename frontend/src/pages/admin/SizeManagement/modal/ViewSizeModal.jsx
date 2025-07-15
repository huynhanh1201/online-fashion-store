import React from 'react'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Chip from '@mui/material/Chip'

import StyleAdmin from '~/assets/StyleAdmin.jsx'

const ViewSizeModal = ({ open, onClose, size }) => {
  if (!size) return null

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
      <DialogTitle>Xem thông tin kích thước</DialogTitle>
      <Divider sx={{ my: 0 }} />
      <DialogContent sx={{ overflowY: 'auto', py: 0 }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', width: '35%' }}>
                Tên kích thước
              </TableCell>
              <TableCell>{size.name.toUpperCase() || 'Không có tên'}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
              <TableCell>
                <Chip
                  label={size.destroy ? 'Ngừng hiển thị' : 'Đang hoạt động'}
                  color={size.destroy ? 'error' : 'success'}
                  size='medium'
                  sx={{ width: 140, fontWeight: 700 }}
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Ngày tạo</TableCell>
              <TableCell>{formatDate(size.createdAt)}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', borderBottom: 0 }}>
                Ngày cập nhật
              </TableCell>
              <TableCell sx={{ borderBottom: 0 }}>
                {formatDate(size.updatedAt)}
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

export default ViewSizeModal
