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

const ViewWarehouseSlipModal = ({
  open,
  onClose,
  slip,
  warehouses,
  variants,
  partners
}) => {
  if (!slip) return null

  // Lấy thông tin kho, đối tác, và ánh xạ items
  const warehouse = warehouses.find((w) => w.id === slip.warehouseId)
  const partner = partners.find((p) => p.id === slip.partnerId)
  const enrichedItems =
    slip.items?.map((item) => {
      const variant = variants.find((v) => v.id === item.variantId)
      return {
        ...item,
        variantName: variant ? variant.name : 'N/A'
      }
    }) || []

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
          <strong>Loại:</strong> {slip.type === 'import' ? 'Nhập' : 'Xuất'}
        </Typography>
        <Typography variant='subtitle1' gutterBottom>
          <strong>Kho:</strong> {warehouse ? warehouse.name : 'N/A'}
        </Typography>
        <Typography variant='subtitle1' gutterBottom>
          <strong>Đối tác:</strong> {partner ? partner.name : 'N/A'}
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
              <TableCell>Biến thể</TableCell>
              <TableCell align='right'>Số lượng</TableCell>
              <TableCell>Đơn vị</TableCell>
              <TableCell>Ghi chú</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {enrichedItems.length > 0 ? (
              enrichedItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.variantName}</TableCell>
                  <TableCell align='right'>{item.quantity || 0}</TableCell>
                  <TableCell>{item.unit || 'cái'}</TableCell>
                  <TableCell>{item.note || 'Không có'}</TableCell>
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
