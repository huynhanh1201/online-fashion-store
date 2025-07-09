import React from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'
import StyleAdmin from '~/assets/StyleAdmin.jsx'

const ViewDiscountModal = ({ open, onClose, discount }) => {
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
  if (!discount) return null
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='lg'
      BackdropProps={{
        sx: StyleAdmin.OverlayModal
      }}
    >
      <DialogTitle>Thông tin mã giảm giá</DialogTitle>
      <Divider />
      <DialogContent sx={{ py: 0 }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <strong>Mã giảm giá</strong>
              </TableCell>
              <TableCell>{discount.code || '—'}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>Loại giảm giá</strong>
              </TableCell>
              <TableCell>
                {discount.type === 'fixed'
                  ? 'Giảm theo số tiền'
                  : 'Giảm theo phần trăm'}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>
                  {discount.type === 'fixed'
                    ? 'Giá trị giảm (VNĐ)'
                    : 'Giá trị giảm (%)'}
                </strong>
              </TableCell>
              <TableCell>
                {discount.type === 'fixed'
                  ? `${discount.amount?.toLocaleString('vi-VN') ?? '—'}đ`
                  : `${discount.amount ?? '—'}%`}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>Trạng thái hoạt động</strong>
              </TableCell>
              <TableCell>
                <Chip
                  label={
                    discount.isActive ? 'Đang hoạt động' : 'Không hoạt động'
                  }
                  color={discount.isActive ? 'success' : 'error'}
                  size='large'
                  sx={{ width: '127px', fontWeight: '800' }}
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>Giá trị đơn hàng tối thiểu</strong>
              </TableCell>
              <TableCell>
                {discount.minOrderValue.toLocaleString('vi-VN')}đ
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>Số lượt sử dụng tối đa</strong>
              </TableCell>
              <TableCell>
                {discount.usageLimit.toLocaleString('vi-VN') ?? '—'}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>Số lượt còn lại</strong>
              </TableCell>
              <TableCell>
                {discount.usageLimit != null && discount.usedCount != null
                  ? discount.usageLimit - discount.usedCount
                  : '—'}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>Hiệu lực từ</strong>
              </TableCell>
              <TableCell>{formatDate(discount.createdAt)}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>Hiệu lực đến</strong>
              </TableCell>
              <TableCell>{formatDate(discount.updatedAt)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
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

export default ViewDiscountModal
