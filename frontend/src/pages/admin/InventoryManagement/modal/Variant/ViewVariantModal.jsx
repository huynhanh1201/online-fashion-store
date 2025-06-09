// modal/Variant/ViewVariantModal.jsx
import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material'

const ViewVariantModal = ({ open, onClose, variant }) => {
  if (!variant) return null
  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Chi tiết biến thể</DialogTitle>
      <DialogContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <strong>SKU</strong>
              </TableCell>
              <TableCell>{variant?.sku || 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Tên biến thể</strong>
              </TableCell>
              <TableCell>{variant?.name || 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Màu sắc</strong>
              </TableCell>
              <TableCell>{variant?.color?.name || 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Kích thước</strong>
              </TableCell>
              <TableCell>{variant?.size?.name || 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Giá nhập</strong>
              </TableCell>
              <TableCell>
                {variant?.importPrice
                  ? `${Number(variant?.importPrice).toLocaleString('vi-VN')}đ`
                  : 'N/A'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Giá bán</strong>
              </TableCell>
              <TableCell>
                {variant?.exportPrice
                  ? `${Number(variant?.exportPrice).toLocaleString('vi-VN')}đ`
                  : 'N/A'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Mã sản phẩm</strong>
              </TableCell>
              <TableCell>{variant?.productCode || 'N/A'}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='outlined'>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewVariantModal
