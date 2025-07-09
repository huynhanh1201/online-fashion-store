import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Divider
} from '@mui/material'

export default function ViewOrderModal({ open, onClose, order }) {
  if (!order) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>Chi tiết đơn hàng</DialogTitle>
      <DialogContent dividers>
        <Typography variant='subtitle2'>Mã đơn hàng: {order.id}</Typography>
        <Typography variant='subtitle2' sx={{ mt: 1 }}>
          Trạng thái: {order.status}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant='h6' gutterBottom>
          Danh sách sản phẩm
        </Typography>

        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell align='right'>Số lượng</TableCell>
              <TableCell align='right'>Đơn giá</TableCell>
              <TableCell align='right'>Thành tiền</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(order?.products?.length > 0
              ? order.products
              : [
                  {
                    name: order.productName || 'Không rõ',
                    quantity: order.totalQuantity || 0,
                    price: order.totalPrice || 0
                  }
                ]
            ).map((p, index) => (
              <TableRow key={index}>
                <TableCell>{p.name}</TableCell>
                <TableCell align='right'>{p.quantity}</TableCell>
                <TableCell align='right'>
                  {Number(p.price).toLocaleString()} đ
                </TableCell>
                <TableCell align='right'>
                  {Number(p.quantity * p.price).toLocaleString()} đ
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Divider sx={{ my: 2 }} />

        <Typography variant='subtitle1'>
          Tổng số lượng: {order.totalQuantity}
        </Typography>
        <Typography variant='subtitle1'>
          Tổng tiền: {Number(order.totalPrice).toLocaleString()} đ
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}
