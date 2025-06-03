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

const ViewVariantModal = ({ open, onClose, variant, products }) => {
  if (!variant) return null

  const product = products.find((p) => p.id === variant.productId)

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
              <TableCell>{variant.sku || 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Tên biến thể</strong>
              </TableCell>
              <TableCell>{variant.name || 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Màu sắc</strong>
              </TableCell>
              <TableCell>{variant.color?.name || 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Kích thước</strong>
              </TableCell>
              <TableCell>{variant.size?.name || 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Giá nhập</strong>
              </TableCell>
              <TableCell>
                {variant.importPrice
                  ? variant.importPrice.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    })
                  : 'N/A'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Giá bán</strong>
              </TableCell>
              <TableCell>
                {variant.exportPrice
                  ? variant.exportPrice.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    })
                  : 'N/A'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Sản phẩm</strong>
              </TableCell>
              <TableCell>
                {variant.productName || product?.name || 'N/A'}
              </TableCell>
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
