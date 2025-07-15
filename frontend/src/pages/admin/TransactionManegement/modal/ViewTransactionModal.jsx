import React from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import StyleAdmin from '~/assets/StyleAdmin.jsx'

const ViewTransactionModal = ({ open, onClose, transaction }) => {
  const statusLabel = {
    Pending: 'Chờ xử lý',
    Completed: 'Thành công',
    Failed: 'Thất bại'
  }
  const statusColor = {
    Pending: 'warning',
    Completed: 'success',
    Failed: 'error'
  }
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
  if (!transaction) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='lg'
      PaperProps={{
        sx: {
          minHeight: '63vh',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
      BackdropProps={{
        sx: StyleAdmin.OverlayModal
      }}
    >
      <DialogTitle>Xem thông tin giao dịch</DialogTitle>
      <Divider />
      <DialogContent sx={{ overflowY: 'auto', py: 0 }}>
        {transaction ? (
          <Table>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', width: '35%' }}>
                  Mã giao dịch
                </TableCell>
                <TableCell>
                  {transaction.transactionId || '(Thanh toán COD)'}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Mã đơn hàng</TableCell>
                <TableCell>
                  {typeof transaction.orderId === 'object'
                    ? transaction.orderCode
                    : 'Không có thông tin'}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  Phương thức thanh toán
                </TableCell>
                <TableCell>{transaction.method}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
                <TableCell>
                  <Chip
                    label={statusLabel[transaction.status] || '—'}
                    color={statusColor[transaction.status] || 'default'}
                    size='large'
                    sx={{ width: '120px', fontWeight: '800' }}
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Số tiền</TableCell>
                <TableCell>
                  {transaction.orderId?.total
                    ? `${transaction.orderId.total.toLocaleString('vi-VN')}₫`
                    : 'Không có thông tin'}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Ngày tạo</TableCell>
                <TableCell>{formatDate(transaction.createdAt)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Ngày cập nhật</TableCell>
                <TableCell>{formatDate(transaction.updatedAt)}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', borderBottom: 0 }}>
                  Ghi chú
                </TableCell>
                <TableCell sx={{ borderBottom: 0 }}>
                  {transaction.note || 'không có ghi chú'}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <Typography>Không có dữ liệu giao dịch</Typography>
        )}
      </DialogContent>
      <Divider />
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button
          color='error'
          onClick={onClose}
          variant='outlined'
          sx={{ textTransform: 'none' }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewTransactionModal
