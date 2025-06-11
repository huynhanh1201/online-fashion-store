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

import StyleAdmin from '~/assets/StyleAdmin.jsx'

const ViewTransactionModal = ({ open, onClose, transaction }) => {
  const statusLabel = {
    Pending: 'Chờ xử lý',
    Completed: 'Thành công',
    Failed: 'Thất bại'
  }

  if (!transaction) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='md'
      PaperProps={{
        sx: {
          height: '80vh',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
      BackdropProps={{
        sx: StyleAdmin.OverlayModal
      }}
    >
      <DialogTitle>Chi tiết giao dịch</DialogTitle>
      <DialogContent sx={{ overflowY: 'auto' }}>
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
                    ? transaction.orderId._id
                    : transaction.orderId}
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
                  {statusLabel[transaction.status] || 'Không xác định'}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Số tiền</TableCell>
                <TableCell>
                  {transaction.orderId?.total
                    ? `${transaction.orderId.total.toLocaleString()} VNĐ`
                    : 'Không có thông tin'}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Ngày tạo</TableCell>
                <TableCell>
                  {/*{new Date(transaction.createdAt).toLocaleString()}*/}
                  {new Date(transaction.createdAt).toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Ghi chú</TableCell>
                <TableCell>{transaction.note || ' '}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <Typography>Không có dữ liệu giao dịch</Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={onClose} variant='contained'>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewTransactionModal
