import React, { useEffect, useState } from 'react'
import { Box, Typography, Paper, Divider, Chip, CircularProgress } from '@mui/material'
import { useParams } from 'react-router-dom'
import { getOrderById, getOrderItems } from '~/services/orderService'

const OrderDetailPage = () => {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!/^[0-9a-fA-F]{24}$/.test(orderId)) return

    const fetchOrderData = async () => {
      try {
        const orderData = await getOrderById(orderId)
        const itemData = await getOrderItems(orderId)
        setOrder(orderData)
        setItems(itemData)
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết đơn hàng:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderData()
  }, [orderId])

  if (loading) return <CircularProgress />
  if (!order) return <Typography>Không tìm thấy đơn hàng</Typography>

  return (
    <Box maxWidth="md" mx="auto" p={2}>
      <Paper sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight="bold">Đơn hàng: {order._id}</Typography>
          <Chip label={order.status} color="error" />
        </Box>

        <Typography fontWeight="bold">Thông tin người nhận:</Typography>
        <Typography>{order.shippingAddress?.fullName} - {order.shippingAddress?.phone}</Typography>
        <Typography>{order.shippingAddress?.address}, {order.shippingAddress?.ward}, {order.shippingAddress?.district}, {order.shippingAddress?.city}</Typography>

        <Divider sx={{ my: 2 }} />

        <Typography fontWeight="bold">Sản phẩm:</Typography>
        {items.map(item => (
          <Box key={item._id} mb={1}>
            <Typography>{item.name}</Typography>
            <Typography variant="body2" color="text.secondary">Số lượng: {item.quantity} | Giá: {item.price?.toLocaleString()}₫</Typography>
          </Box>
        ))}

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between">
          <Typography fontWeight="bold">Tổng tiền:</Typography>
          <Typography color="error">{order.total?.toLocaleString()}₫</Typography>
        </Box>
      </Paper>
    </Box>
  )
}

export default OrderDetailPage
