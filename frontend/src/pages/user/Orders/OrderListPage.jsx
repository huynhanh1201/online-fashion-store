import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Chip,
  Tabs,
  Tab,
  Divider,
} from '@mui/material'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { getOrders, getOrderItems } from '~/services/orderService'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
// Define status labels and corresponding tab values
const statusLabels = {
  All: ['Tất cả', 'default'],
  Pending: ['Đang chờ', 'warning'],
  Processing: ['Đang xử lý', 'info'],
  Shipped: ['Đã gửi hàng', 'primary'],
  Delivered: ['Đã giao', 'success'],
  Cancelled: ['Đã hủy', 'error'],
}

// OrderRow component (unchanged)
const OrderRow = ({ order }) => {
  const [items, setItems] = useState([])
  const [loadingItems, setLoadingItems] = useState(true)
  const navigate = useNavigate()

  const [label, color] = statusLabels[order.status] || ['Không xác định', 'default']

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await getOrderItems(order._id)
        setItems(res)
      } catch (err) {
        console.error('Lỗi khi lấy sản phẩm:', err)
      } finally {
        setLoadingItems(false)
      }
    }

    fetchItems()
  }, [order._id])

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      {/* Top: Mã đơn hàng + trạng thái */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography fontWeight="bold">Mã đơn hàng: {order.code}</Typography>
        <Chip label={label} color={color === 'default' ? undefined : color} size="small" />
      </Box>

      {/* Danh sách sản phẩm */}
      {loadingItems ? (
        <CircularProgress />
      ) : (
        items.map((item, i) => (
          <Box
            key={i}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ py: 1.5, borderTop: i > 0 ? '1px solid #eee' : 'none', cursor: 'pointer' }}
            onClick={() => navigate(`/order-detail/${order._id}`)}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                component="img"
                src={item.color?.image || '/images/default.jpg'}
                alt={item.name}
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: 1,
                  border: '1px solid #ccc',
                  objectFit: 'cover'
                }}
              />
              <Box>
                <Typography fontWeight={600}>{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.color?.name}, {item.size}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  x{item.quantity}
                </Typography>
              </Box>
            </Box>

            <Typography fontWeight={600}>
              {item.price?.toLocaleString('vi-VN')} ₫
            </Typography>
          </Box>
        ))

      )}

      {/* Bottom: tổng tiền + nút */}
      {!loadingItems && (
        <Box mt={2}>
          <Divider sx={{ mb: 2 }} />
          <Box display="flex" justifyContent="flex-end" my={3} gap={1}>
            <Typography fontWeight="bold" mb={1}>
              Thành tiền:{' '}
              <span style={{ color: '#1A3C7B', fontSize: '1.5rem' }}>
                {order.total?.toLocaleString('vi-VN')}₫
              </span>
            </Typography>
          </Box>

          <Box display="flex" justifyContent="flex-end" gap={1}>
            {order.status === 'Delivered' ? (
              <>
                <Button
                  variant="contained"
                  size="medium"
                  sx={{ backgroundColor: '#1A3C7B', color: '#fff' }}
                  onClick={() => { /* Đánh giá logic */ }}
                >
                  Đánh giá
                </Button>
                <Button
                  variant="outlined"
                  size="medium"
                  onClick={() => navigate(`/productdetail/${items[0]?.productId}`)}
                >
                  Mua lại
                </Button>
              </>
            ) : (
              <Button
                variant="outlined"
                color="error"
                size="medium"
                onClick={() => {
                  // TODO: logic hủy đơn hàng
                  console.log('Huỷ đơn:', order._id)
                }}
              >
                Hủy đơn
              </Button>
            )}
          </Box>
        </Box>
      )}


    </Paper >
  )
}


// Main OrderListPage component with tabs
const OrderListPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('All')
  const currentUser = useSelector(selectCurrentUser)
  const userId = currentUser?._id

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) return
      try {
        const orders = await getOrders(userId)
        console.log('Fetched orders:', orders) // 👈 Kiểm tra ở console
        setOrders(orders)
      } catch (error) {
        console.error('Lỗi khi lấy đơn hàng:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [userId])

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue)
  }

  // Filter orders based on selected tab
  const filteredOrders = Array.isArray(orders)
    ? selectedTab === 'All'
      ? orders
      : orders.filter((order) => order.status === selectedTab)
    : []

  if (loading) {
    return <CircularProgress sx={{ mt: 4, mx: 'auto', display: 'block' }} />
  }

  return (
    <Box maxWidth="lg" sx={{ mx: 'auto', p: 2, minHeight: '70vh' }}>
      {/* Tabs cho trạng thái */}
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2 }}
      >
        {Object.keys(statusLabels).map((status) => (
          <Tab
            key={status}
            label={statusLabels[status][0]}
            value={status}
            sx={{ textTransform: 'none', fontWeight: 500 }}
          />
        ))}
      </Tabs>

      {/* Hiển thị danh sách đơn hàng theo kiểu thẻ */}
      {filteredOrders.length === 0 ? (
        <Typography align="center" color="text.secondary" mt={4}>
          Không có đơn hàng nào trong trạng thái này
        </Typography>
      ) : (
        filteredOrders.map((order) => (
          <OrderRow key={order._id} order={order} />
        ))
      )}
    </Box>
  )

}

export default OrderListPage 