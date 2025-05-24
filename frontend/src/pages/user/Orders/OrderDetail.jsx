import React, { useEffect, useState } from 'react'
import {
  Box, Typography, Paper, Divider, Chip, CircularProgress, Avatar
} from '@mui/material'
import { useParams } from 'react-router-dom'
import { getOrderById, getOrderItems } from '~/services/orderService'

const OrderDetail = () => {
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

  const formatPrice = (val) =>
    typeof val === 'number'
      ? val.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
      : '0₫'

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

        <Typography fontWeight="bold" mb={1}>Sản phẩm đã mua:</Typography>
        {items.map(item => (
          <Box key={item._id} mb={2} display="flex" gap={2} alignItems="center">
            <Avatar
              src={item.image || '/default.jpg'}
              variant="square"
              sx={{ width: 64, height: 64, borderRadius: 1, objectFit: 'cover' }}
            />

            {/* Container chính giữa chứa cả tên + số lượng + giá */}
            <Box display="flex" justifyContent="space-between" alignItems="center" flex={1}>
              {/* Thông tin sản phẩm bên trái */}
              <Box textAlign="left">
                <Typography fontWeight={600}>{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Số lượng: x{item.quantity}
                </Typography>
              </Box>

              {/* Giá sản phẩm bên phải */}
              <Box textAlign="right">
                <Typography variant="body1" fontWeight={600}>
                  {item.price?.toLocaleString()} ₫
                </Typography>
                {item.originalPrice && item.originalPrice > item.price && (
                  <Typography
                    variant="body2"
                    sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                  >
                    {item.originalPrice?.toLocaleString()} ₫
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        ))}

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography fontWeight="bold">Tổng tiền hàng:</Typography>
          <Typography>{formatPrice(order.total)}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography fontWeight="bold">Phí vận chuyển:</Typography>
          <Typography>{formatPrice(0)}</Typography>
        </Box>
        {order.coupon && (
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography fontWeight="bold">Mã giảm giá:</Typography>
            <Typography color="green">
              {order.coupon.code || 'Mã giảm giá'} - {formatPrice(order.coupon.discount || 0)}
            </Typography>
          </Box>
        )}


        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography fontWeight="bold">Thành tiền:</Typography>
          <Typography color="error" fontWeight="bold">
            {formatPrice(order.finalAmount || order.total)}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" mt={2}>
          <Typography fontWeight="bold">Phương thức thanh toán:</Typography>
          <Typography>
            {order.paymentMethod?.toLowerCase() === 'cod'
              ? 'Thanh toán khi nhận hàng (COD)'
              : 'VNPay'}
          </Typography>

        </Box>
      </Paper>
    </Box>
  )
}

export default OrderDetail
