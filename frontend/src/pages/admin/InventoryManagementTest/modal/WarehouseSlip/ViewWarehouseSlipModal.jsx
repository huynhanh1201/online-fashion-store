// modal/WarehouseSlip/ViewWarehouseSlipModal.jsx
import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip
} from '@mui/material'

const ViewWarehouseSlipModal = ({ open, onClose, slip }) => {
  if (!slip) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>
        Chi tiết phiếu {slip.type === 'import' ? 'nhập' : 'xuất'} kho
      </DialogTitle>
      <DialogContent>
        <Typography variant='subtitle1' gutterBottom>
          <strong>Mã phiếu:</strong> {slip.slipId || 'N/A'}
        </Typography>
        <Typography variant='subtitle1' gutterBottom>
          <strong>Loại: </strong>
          <Chip
            label={slip.type}
            color={slip.type === 'Nhập' ? 'success' : 'error'}
            size='small'
          />
        </Typography>
        <Typography variant='subtitle1' gutterBottom>
          <strong>Kho:</strong> {slip.warehouseId.name}
        </Typography>
        <Typography variant='subtitle1' gutterBottom>
          <strong>Đối tác:</strong> {slip.partnerId.name}
        </Typography>
        <Typography variant='subtitle1' gutterBottom>
          <strong>Trạng thái:</strong>{' '}
          <Chip
            label={slip.status === 'pending' ? 'Đang xử lý' : 'Hoàn thành'}
            color={slip.status === 'pending' ? 'warning' : 'success'}
            size='small'
          />
        </Typography>
        <Typography variant='subtitle1' gutterBottom>
          <strong>Ngày tạo:</strong>{' '}
          {slip.createdAt
            ? new Date(slip.createdAt).toLocaleString('vi-VN')
            : 'N/A'}
        </Typography>
        <Typography variant='subtitle1' gutterBottom>
          <strong>Ghi chú:</strong> {slip.note || 'Không có'}
        </Typography>

        <Typography variant='h6' gutterBottom sx={{ mt: 2 }}>
          Danh sách mặt hàng
        </Typography>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>Mã biến thể</TableCell>
              <TableCell>Biến thể</TableCell>
              <TableCell align='right'>Số lượng</TableCell>
              <TableCell>Đơn vị</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slip.items.length > 0 ? (
              slip.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.variantId.sku}</TableCell>
                  <TableCell>{item.variantId.name}</TableCell>
                  <TableCell align='right'>{item.quantity || 0}</TableCell>
                  <TableCell>{item.unit || 'cái'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align='center'>
                  Không có mặt hàng
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewWarehouseSlipModal
