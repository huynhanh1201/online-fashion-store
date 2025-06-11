import React from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'
import StyleAdmin from '~/assets/StyleAdmin.jsx'

const ViewDiscountModal = ({ open, onClose, discount }) => {
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
      <DialogTitle>Chi tiết mã giảm giá</DialogTitle>
      <DialogContent>
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
              <TableCell>{discount.amount ?? '—'}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>Kích hoạt</strong>
              </TableCell>
              <TableCell>
                <Chip
                  label={
                    discount.isActive ? 'Đang hoạt động' : 'Không hoạt động'
                  }
                  color={discount.isActive ? 'success' : 'error'}
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>Giá trị đơn hàng tối thiểu</strong>
              </TableCell>
              <TableCell>{discount.minOrderValue ?? '—'}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>Số lượt sử dụng tối đa</strong>
              </TableCell>
              <TableCell>{discount.usageLimit ?? '—'}</TableCell>
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
              <TableCell>
                {discount.validFrom
                  ? new Date(discount.validFrom).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })
                  : '—'}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>Hiệu lực đến</strong>
              </TableCell>
              <TableCell>
                {discount.validUntil
                  ? new Date(discount.validUntil).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })
                  : '—'}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={onClose} variant='contained' color='error'>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewDiscountModal
