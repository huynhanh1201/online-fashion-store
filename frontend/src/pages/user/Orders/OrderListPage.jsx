import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Collapse,
  IconButton,
  Chip
} from '@mui/material'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { getOrders, getOrderItems } from '~/services/orderService'
import { useNavigate } from 'react-router-dom'

const statusLabels = {
  Pending: ['Đang chờ', 'warning'],
  Processing: ['Đang xử lý', 'info'],
  Shipped: ['Đã gửi hàng', 'primary'],
  Delivered: ['Đã giao', 'success'],
  Cancelled: ['Đã hủy', 'error'],
}

const OrderRow = ({ order }) => {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])
  const [loadingItems, setLoadingItems] = useState(false)
  const navigate = useNavigate()

  const toggleOpen = async () => {
    setOpen(prev => !prev)
    if (!open && items.length === 0) {
      setLoadingItems(true)
      try {
        const res = await getOrderItems(order._id)
        setItems(res)
      } catch (err) {
        console.error('Lỗi khi lấy sản phẩm:', err)
      } finally {
        setLoadingItems(false)
      }
    }
  }

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const [label, color] = statusLabels[order.status] || ['Không xác định', 'default']

  return (
    <>
      <TableRow hover>
        <TableCell padding="checkbox">
          <IconButton size="small" onClick={toggleOpen}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ minWidth: 150, cursor: 'pointer' }} onClick={() => navigate(`/order-detail/${order._id}`)}>{order._id}</TableCell>
        <TableCell sx={{ minWidth: 140 }}>{order.shippingAddress?.fullName}</TableCell>
        <TableCell sx={{ minWidth: 200 }}>
          {order.shippingAddress?.address}, {order.shippingAddress?.district}
        </TableCell>
        <TableCell sx={{ minWidth: 120 }}>{order.total?.toLocaleString('vi-VN')} ₫</TableCell>
        <TableCell sx={{ minWidth: 120 }}>
          <Chip label={label} color={color === 'default' ? undefined : color} size="small" />
        </TableCell>

        <TableCell>
          <Button variant="outlined" size="small" onClick={() => navigate(`/order-detail/${order._id}`)}>
            Xem chi tiết
          </Button>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={7} sx={{ p: 0, border: 0, backgroundColor: '#fafafa' }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box p={2}>
              {loadingItems ? (
                <CircularProgress size={24} />
              ) : (
                <>
                  {items.map((item, i) => (

                    <Box
                      key={i}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ borderBottom: '2px solid #ccc', py: 1.5 }}
                    >
                      <Box display="flex" alignItems="center" gap={2}>
                        <Box
                          component="img"
                          src={item.color?.image || '/images/default.jpg'}
                          alt={item.name}
                          sx={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 1, border: '1px solid #ddd' }}
                        />
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Màu: {item.color?.name} | Size: {item.size}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Số lượng: x{item.quantity}
                          </Typography>
                        </Box>
                      </Box>


                      <Box textAlign="right" minWidth={120}>
                        <Typography variant="body1" fontWeight={600}>
                          {item.price?.toLocaleString()} ₫
                        </Typography>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <Typography variant="body2" sx={{ textDecoration: 'line-through', color: '#999' }}>
                            {item.originalPrice?.toLocaleString()} ₫
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  ))}

                  <Box mt={2} textAlign="right">
                    <Typography variant="subtitle1" fontWeight="bold">
                      Tổng: {totalAmount.toLocaleString()} ₫
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

const OrderListPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { orders } = await getOrders()
        setOrders(orders)
      } catch (error) {
        console.error('Lỗi khi lấy đơn hàng:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading)
    return <CircularProgress sx={{ mt: 4, mx: 'auto', display: 'block' }} />

  return (
    <Box maxWidth="xl" sx={{ mx: 'auto', p: 2, minHeight: '70vh' }}>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>ID Đơn hàng</TableCell>
              <TableCell>Người nhận</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell>Thành tiền</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 8, fontSize: '1.2rem', color: 'text.secondary' }}>
                  Hiện tại không có đơn hàng nào
                </TableCell>
              </TableRow>
            ) : (
              orders.map(order => <OrderRow key={order._id} order={order} />)
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  )
}

export default OrderListPage
