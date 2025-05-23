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
  IconButton
} from '@mui/material'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { getOrders, getOrderItems } from '~/services/orderService'
import { useNavigate } from 'react-router-dom'

const OrderRow = ({ order }) => {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])
  const [loadingItems, setLoadingItems] = useState(false)
  const navigate = useNavigate()

  const toggleOpen = async () => {
    setOpen(!open)
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

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={toggleOpen}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{order._id}</TableCell>
        <TableCell>{order.shippingAddress?.fullName}</TableCell>
        <TableCell>{order.shippingAddress?.address}, {order.shippingAddress?.district}</TableCell>
        <TableCell>{order.total?.toLocaleString()}₫</TableCell>
        <TableCell>{order.status}</TableCell>
        <TableCell>
          <Button variant="outlined" size="small" onClick={() => navigate(`/orders/${order._id}`)}>
            Xem chi tiết
          </Button>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={7} sx={{ p: 0, border: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box p={2}>
              {loadingItems ? (
                <CircularProgress size={20} />
              ) : (
                items.map((item, index) => (
                  <Box key={index} display="flex" alignItems="center" gap={2} mb={1}>
                    <Box
                      component="img"
                      src={item.image || '/images/default.jpg'}
                      alt={item.name}
                      width={60}
                      height={60}
                      sx={{ objectFit: 'contain', border: '1px solid #eee' }}
                    />
                    <Box>
                      <Typography variant="body2" fontWeight="bold">{item.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Phân loại hàng: {item.variant || 'Không rõ'} - x{item.quantity}
                      </Typography>
                      <Typography variant="body2" color="error">
                        <s>{item.originalPrice?.toLocaleString()}₫</s> {item.price?.toLocaleString()}₫
                      </Typography>
                    </Box>
                  </Box>
                ))
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

  if (loading) return <CircularProgress sx={{ mt: 4, mx: 'auto', display: 'block' }} />

  return (
    <Box maxWidth="lg" sx={{ mx: 'auto', p: 2 }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>Danh sách đơn hàng</Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>ID</TableCell>
              <TableCell>Người nhận</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell>Thanh toán</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map(order => (
              <OrderRow key={order._id} order={order} />
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  )
}

export default OrderListPage
