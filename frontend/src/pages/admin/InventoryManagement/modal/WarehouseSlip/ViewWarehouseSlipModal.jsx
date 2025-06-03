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
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <strong>Mã phiếu</strong>
              </TableCell>
              <TableCell>{slip.slipId || 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Loại</strong>
              </TableCell>
              <TableCell>
                <Chip
                  label={slip.type}
                  color={slip.type === 'Nhập' ? 'success' : 'error'}
                  size='small'
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Kho</strong>
              </TableCell>
              <TableCell>{slip.warehouseId?.name || 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Đối tác</strong>
              </TableCell>
              <TableCell>{slip.partnerId?.name || 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Trạng thái</strong>
              </TableCell>
              <TableCell>
                <Chip
                  label={
                    slip.status === 'pending' ? 'Đang xử lý' : 'Hoàn thành'
                  }
                  color={slip.status === 'pending' ? 'warning' : 'success'}
                  size='small'
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Ngày tạo</strong>
              </TableCell>
              <TableCell>
                {slip.createdAt
                  ? new Date(slip.createdAt).toLocaleString('vi-VN')
                  : 'N/A'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Ghi chú</strong>
              </TableCell>
              <TableCell>{slip.note || 'Không có'}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

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
