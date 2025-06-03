import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Table,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material'

const ViewBatchModal = ({ open, onClose, batch }) => {
  if (!batch) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Chi Tiết Lô Hàng</DialogTitle>
      <DialogContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <strong>Mã lô</strong>
              </TableCell>
              <TableCell>{batch.batchCode || 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Tên biến thể</strong>
              </TableCell>
              <TableCell>{batch.variantId?.name || 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Số lượng</strong>
              </TableCell>
              <TableCell>{batch.quantity ?? 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Giá nhập</strong>
              </TableCell>
              <TableCell>
                {batch.importPrice
                  ? batch.importPrice.toLocaleString('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    })
                  : 'N/A'}
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

export default ViewBatchModal
