import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Divider
} from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import StyleAdmin from '~/assets/StyleAdmin.jsx'
const ViewInventoryModal = ({ open, onClose, inventory }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='md' // Giới hạn tối đa
      // Bỏ fullWidth để tự co theo nội dung
      sx={{
        '& .MuiDialog-paper': {
          width: 'auto', // Chiều rộng theo nội dung
          maxWidth: 'md', // Giới hạn không vượt quá md
          minWidth: 600 // (tuỳ chọn) đảm bảo không quá nhỏ
        },
        padding: '16px 24px'
      }}
      BackdropProps={{
        sx: StyleAdmin.OverlayModal
      }}
    >
      <DialogTitle sx={{ fontWeight: 'bold', pl: 3 }}>
        Thông tin tồn kho
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ py: 0 }}>
        {inventory ? (
          <Box sx={{ mt: 1 }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong>Kho hàng</strong>
                  </TableCell>
                  <TableCell>
                    {inventory.warehouseId?.name
                      .split(' ')
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase()
                      )
                      .join(' ') || '—'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Tên biến thể</strong>
                  </TableCell>
                  <TableCell>
                    {inventory.variantId?.name
                      .split(' ')
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase()
                      )
                      .join(' ') || '—'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Mã biến thể</strong>
                  </TableCell>
                  <TableCell>{inventory.variantId?.sku || '—'}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell sx={{ width: 200 }}>
                    <strong>Trạng thái tồn kho</strong>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        inventory.status === 'in-stock'
                          ? 'Còn hàng'
                          : inventory.status === 'low-stock'
                            ? 'Cảnh báo'
                            : 'Hết hàng'
                      }
                      color={
                        inventory.status === 'in-stock'
                          ? 'success'
                          : inventory.status === 'low-stock'
                            ? 'warning'
                            : 'error'
                      }
                      size='large'
                      sx={{ width: 127, fontWeight: 800 }}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Số lượng sản phẩm</strong>
                  </TableCell>
                  <TableCell>
                    {inventory.quantity
                      ? `${Number(inventory.quantity).toLocaleString('vi-VN')}`
                      : 'N/A'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Ngưỡng cảnh báo</strong>
                  </TableCell>
                  <TableCell>{inventory.minQuantity ?? 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Giá nhập</strong>
                  </TableCell>
                  <TableCell>
                    {inventory.importPrice
                      ? `${Number(inventory.importPrice).toLocaleString('vi-VN')}₫`
                      : 'N/A'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Giá bán</strong>
                  </TableCell>
                  <TableCell>
                    {inventory.exportPrice
                      ? `${Number(inventory.exportPrice).toLocaleString('vi-VN')}₫`
                      : 'N/A'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Ngày tạo</strong>
                  </TableCell>
                  <TableCell>
                    {inventory.createdAt
                      ? new Date(inventory.createdAt).toLocaleString('vi-VN')
                      : '—'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ borderBottom: 0 }}>
                    <strong>Ngày cập nhật</strong>
                  </TableCell>
                  <TableCell sx={{ borderBottom: 0 }}>
                    {inventory.updatedAt
                      ? new Date(inventory.updatedAt).toLocaleString('vi-VN')
                      : '—'}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        ) : (
          <Typography>Không có dữ liệu tồn kho</Typography>
        )}
      </DialogContent>
      <Divider />
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button
          onClick={onClose}
          variant='outlined'
          color='error'
          sx={{ textTransform: 'none' }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewInventoryModal
