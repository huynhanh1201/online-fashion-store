import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Tab,
  Tabs,
  Typography,
  Box,
  Stack,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material'
import dayjs from 'dayjs'
import useProducts from '~/hook/useProducts'
import styleAdmin from '~/components/StyleAdmin.jsx'

function ViewOrderModal({
  open,
  onClose,
  order,
  histories = [],
  orderDetails = []
}) {
  const [tab, setTab] = useState(0)
  const { fetchProductById } = useProducts()
  const [productMap, setProductMap] = useState({})

  useEffect(() => {
    const fetchAllProducts = async () => {
      const map = {}
      for (const item of orderDetails) {
        if (item.productId) {
          try {
            const product = await fetchProductById(item.productId)
            map[item._id] = product
          } catch (err) {
            console.error('Lỗi khi lấy thông tin sản phẩm:', err)
          }
        }
      }
      setProductMap(map)
    }

    if (orderDetails?.length > 0) {
      fetchAllProducts()
    }
  }, [orderDetails])

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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='md'
      fullWidth
      PaperProps={{
        sx: {
          height: '80vh',
          maxHeight: '80vh',
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
              <strong>Người nhận:</strong> {order.shippingAddressId?.fullName}
            </Typography>
            <Typography>
              <strong>SĐT:</strong> {order.shippingAddressId?.phone}
            </Typography>
            <Typography>
              <strong>Địa chỉ giao hàng:</strong>{' '}
              {`${order.shippingAddressId?.address}, ${order.shippingAddressId?.ward}, ${order.shippingAddressId?.district}, ${order.shippingAddressId?.city}`}
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
                    <strong>Người cập nhật:</strong> {order.userId.name || '—'}
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
                      <TableCell>
                        {productMap[item._id]?.name || 'Không có tên'}
                      </TableCell>
                      <TableCell align='right'>{item.quantity}</TableCell>
                      <TableCell align='right'>
                        {item.priceAtOrder.toLocaleString()}₫
                      </TableCell>
                      <TableCell align='right'>
                        {(item.priceAtOrder * item.quantity).toLocaleString()}₫
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
