import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'

import dayjs from 'dayjs'
import styleAdmin from '~/assets/StyleAdmin.jsx'

function ViewOrderModal({
  open,
  onClose,
  order,
  histories = [],
  orderDetails = []
}) {
  const [tab, setTab] = useState(0)
  if (!order) return null
  const handleTabChange = (_, newValue) => setTab(newValue)

  const renderStatusLabel = (status) => {
    const map = {
      Pending: 'Đang chờ',
      Processing: 'Đang xử lý',
      Shipped: 'Đã gửi hàng',
      Delivered: 'Đã giao',
      Cancelled: 'Đã hủy'
    }
    return map[status] || '—'
  }
  console.log('order', order)
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='md'
      fullWidth
      PaperProps={{
        sx: {
          height: '81vh',
          maxHeight: '81vh',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
      BackdropProps={{ sx: styleAdmin.OverlayModal }}
    >
      <DialogTitle>Xem chi tiết đơn hàng</DialogTitle>
      <Divider />
      <DialogContent dividers sx={{ flex: 1, overflowY: 'auto' }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          sx={{
            mb: 2,
            borderBottom: '1px solid #001f5d',
            '& .MuiTab-root': { color: '#000', textTransform: 'none' },
            '& .Mui-selected': {
              color: '#001f5d !important',
              fontWeight: '900'
            },
            '& .MuiTabs-indicator': { backgroundColor: '#001f5d' }
          }}
        >
          <Tab label='Thông tin đơn hàng' />
          <Tab label='Lịch sử đơn hàng' />
          <Tab label='Danh sách sản phẩm' />
        </Tabs>

        {tab === 0 && (
          <Stack spacing={2}>
            <Typography>
              <strong>Mã đơn hàng:</strong> {order._id}
            </Typography>
            <Typography>
              <strong>Người nhận:</strong> {order.shippingAddress?.fullName}
            </Typography>
            <Typography>
              <strong>SĐT:</strong> {order.shippingAddress?.phone}
            </Typography>
            <Typography>
              <strong>Địa chỉ giao hàng:</strong>{' '}
              {`${order.shippingAddress?.address}, ${order.shippingAddress?.ward}, ${order.shippingAddress?.district}, ${order.shippingAddress?.city}`}
            </Typography>
            <Typography>
              <strong>Phương thức thanh toán:</strong>{' '}
              {order.paymentMethod?.toUpperCase()}
            </Typography>

            <Box display='flex' alignItems='center' gap={1}>
              <Typography component='span'>
                <strong>Trạng thái thanh toán:</strong>
              </Typography>
              <Chip
                label={
                  order.paymentStatus === 'Pending'
                    ? 'Đang chờ'
                    : order.paymentStatus === 'Completed'
                      ? 'Đã thanh toán'
                      : order.paymentStatus === 'Failed'
                        ? 'Thất bại'
                        : '—'
                }
                color={
                  order.paymentStatus === 'Completed'
                    ? 'success'
                    : order.paymentStatus === 'Failed'
                      ? 'error'
                      : 'warning'
                }
                size='small'
              />
            </Box>

            <Box display='flex' alignItems='center' gap={1}>
              <Typography component='span'>
                <strong>Trạng thái đơn hàng:</strong>
              </Typography>
              <Chip
                label={renderStatusLabel(order.status)}
                color={
                  order.status === 'Cancelled'
                    ? 'error'
                    : order.status === 'Pending'
                      ? 'warning'
                      : 'success'
                }
                size='small'
              />
            </Box>

            <Box display='flex' alignItems='center' gap={1}>
              <Typography component='span'>
                <strong>Giao hàng:</strong>
              </Typography>
              <Chip
                label={order.isDelivered ? 'Đã giao' : 'Chưa giao'}
                color={order.isDelivered ? 'success' : 'default'}
                size='small'
              />
            </Box>

            <Typography>
              <strong>Giảm giá:</strong>{' '}
              {order.discountAmount > 0
                ? `- ${order.discountAmount.toLocaleString()}₫`
                : 'Không có'}
            </Typography>
            <Typography>
              <strong>Tổng tiền:</strong> {order.total.toLocaleString()}₫
            </Typography>
            <Typography>
              <strong>Lời nhắn:</strong> {order.note || 'Không có'}
            </Typography>
            <Typography>
              <strong>Ngày tạo:</strong>{' '}
              {dayjs(order.createdAt).format('DD/MM/YYYY HH:mm')}
            </Typography>
            <Typography>
              <strong>Ngày cập nhật:</strong>{' '}
              {dayjs(order.updatedAt).format('DD/MM/YYYY HH:mm')}
            </Typography>
          </Stack>
        )}

        {tab === 1 && (
          <Box>
            {histories.length === 0 ? (
              <Typography>Không có lịch sử cập nhật.</Typography>
            ) : (
              histories.map((h) => (
                <Box key={h._id} mb={2} p={1} border={1} borderRadius={2}>
                  <Typography>
                    <strong>Trạng thái:</strong> {renderStatusLabel(h.status)}
                  </Typography>
                  <Typography>
                    <strong>Ghi chú:</strong> {h.note || 'Không có'}
                  </Typography>
                  <Typography>
                    <strong>Người cập nhật:</strong> {h.updatedBy.name || ''}
                  </Typography>
                  <Typography>
                    <strong>Quyền: </strong>{' '}
                    {h.updatedBy.role === 'admin' ? 'QUẢN TRỊ' : 'KHÁCH HÀNG'}
                  </Typography>
                  <Typography>
                    <strong>Thời gian:</strong>{' '}
                    {dayjs(h.updatedAt).format('DD/MM/YYYY HH:mm')}
                  </Typography>
                </Box>
              ))
            )}
          </Box>
        )}

        {tab === 2 && (
          <Box>
            {orderDetails.length === 0 ? (
              <Typography>Không có sản phẩm trong đơn hàng.</Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tên sản phẩm</TableCell>
                    <TableCell align='right'>Số lượng</TableCell>
                    <TableCell align='right'>Đơn giá</TableCell>
                    <TableCell align='right'>Thành tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderDetails.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.name || 'Không có tên'}</TableCell>
                      <TableCell align='right'>{item.quantity}</TableCell>
                      <TableCell align='right'>
                        {item.subtotal.toLocaleString()}₫
                      </TableCell>
                      <TableCell align='right'>
                        {(item.subtotal * item.quantity).toLocaleString()}₫
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Box>
        )}
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant='contained' color='error' onClick={onClose}>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewOrderModal
