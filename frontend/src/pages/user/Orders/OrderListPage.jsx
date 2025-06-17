/* eslint-disable no-console */
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
  Card,
  CardContent,
  Avatar,
  Stack,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material'
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  ShoppingBag,
  LocalShipping,
  Cancel,
  CheckCircle,
  Replay,
  Visibility,
  Warning
} from '@mui/icons-material'
import { getOrders, getOrderItems } from '~/services/orderService'
import { useOrder } from '~/hooks/useOrder'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useCart } from '~/hooks/useCarts'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary'

// Define status labels with icons and colors
const statusLabels = {
  All: ['Tất cả', 'default', <ShoppingBag key="all" />],
  Pending: ['Đang chờ', 'warning', <KeyboardArrowUp key="pending" />],
  Processing: ['Đang xử lý', 'info',],
  Shipped: ['Đã gửi hàng', 'primary', <LocalShipping key="shipped" />],
  Delivered: ['Đã giao', 'success', <CheckCircle key="delivered" />],
  Cancelled: ['Đã hủy', 'error', <Cancel key="cancelled" />],
  Failed: ['Thanh toán thất bại', 'error', <Cancel key="failed" />]
}

// Confirmation Modal Component
const CancelOrderModal = ({ open, onClose, onConfirm, order, loading }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: '50%',
              backgroundColor: 'error.50',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Warning sx={{ color: 'error.main', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="600" color="text.primary">
              Xác nhận hủy đơn hàng
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Đơn hàng #{order?.code}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ py: 2 }}>
        <DialogContentText sx={{ fontSize: '1rem', color: 'text.primary' }}>
          Bạn có chắc chắn muốn hủy đơn hàng này không?
          <br />
          <Typography
            component="span"
            sx={{
              fontWeight: 600,
              color: 'error.main',
              mt: 1,
              display: 'block'
            }}
          >
            Hành động này không thể hoàn tác!
          </Typography>
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3
          }}
        >
          Không, giữ lại
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : <Cancel />}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)'
          }}
        >
          {loading ? 'Đang hủy...' : 'Có, hủy đơn'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// Enhanced OrderRow component
const OrderRow = ({ order, onOrderUpdate }) => {
  const [items, setItems] = useState([])
  const [loadingItems, setLoadingItems] = useState(true)
  const [openCancelModal, setOpenCancelModal] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const navigate = useNavigate()

  const [label, color, icon] = statusLabels[order.status] || ['Không xác định', 'default', <Cancel key="unknown" />]
  const { addToCart } = useCart()
  const { cancelOrder } = useOrder()



  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await getOrderItems(order._id)
        console.log('order items:', res)
        setItems(res)
      } catch (err) {
        console.error('Lỗi khi lấy sản phẩm:', err)
      } finally {
        setLoadingItems(false)
      }
    }

    fetchItems()
  }, [order._id])

  // Handle cancel order confirmation
  const handleCancelOrder = async () => {
    setCancelling(true)
    try {
      await cancelOrder(order._id, 'Người dùng hủy đơn')
      console.log('Đã hủy đơn hàng:', order._id)
      setOpenCancelModal(false)
      // Call parent callback to refresh orders
      if (onOrderUpdate) {
        onOrderUpdate()
      }
    } catch (error) {
      console.error('Lỗi khi hủy đơn hàng:', error)
      // You can show a snackbar or toast here instead of alert
    } finally {
      setCancelling(false)
    }
  }

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header: Order code + Status */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography
              variant="h6"
              fontWeight="600"
              sx={{ color: '#1a3c7b' }}
            >
              #{order.code}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(order.createdAt).toLocaleDateString('vi-VN')}
            </Typography>
          </Box>
          <Chip
            label={label}
            color={color === 'default' ? undefined : color}
            icon={icon}
            sx={{
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 32
            }}
          />
        </Box>

        {/* Product List */}
        {loadingItems ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress size={40} />
          </Box>
        ) : (
          <Stack spacing={2}>
            {items.map((item, i) => (
              <Box
                key={i}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'grey.50',
                  border: '1px solid',
                  borderColor: 'grey.200',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'grey.100',
                    borderColor: '#1a3c7b',
                    transform: 'translateX(4px)'
                  }
                }}
                onClick={() => navigate(`/order-detail/${order._id}`)}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      src={optimizeCloudinaryUrl(item.color?.image) || '/images/default.jpg'}
                      alt={item.name}
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 2,
                        border: '2px solid white',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                      }}
                      variant="rounded"
                    />
                    <Box>
                      <Typography
                        fontWeight={600}
                        fontSize="1.1rem"
                        sx={{ mb: 0.5 }}
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        {item.color?.name} • {item.size}
                      </Typography>
                      <Chip
                        label={`Số lượng: ${item.quantity}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem', height: 20 }}
                      />
                    </Box>
                  </Box>

                  <Box textAlign="right">
                    <Typography
                      fontWeight={700}
                      fontSize="1.2rem"
                      color="#1a3c7b"
                    >
                      {item.price?.toLocaleString('vi-VN')}₫
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Stack>
        )}

        {/* Footer: Total + Actions */}
        {!loadingItems && (
          <Box mt={3}>
            <Divider sx={{ my: 2 }} />

            {/* Total Amount */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                p: 2,
                borderRadius: 2,
                backgroundColor: 'primary.50',
              }}
            >
              <Typography variant="h6" fontWeight="600">
                Tổng tiền:
              </Typography>
              <Typography
                variant="h5"
                fontWeight="700"
                sx={{ color: '#1a3c7b' }}
              >
                {order.total?.toLocaleString('vi-VN')}₫
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <Button
                startIcon={<Visibility />}
                onClick={() => navigate(`/order-detail/${order._id}`)}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  color: '#1a3c7b'
                }}
              >
                Xem chi tiết
              </Button>

              {order.status === 'Delivered' ? (
                <Button
                  startIcon={<Replay />}
                  onClick={async () => {
                    try {
                      // Lặp qua từng sản phẩm trong đơn hàng, chỉ thêm 1 sản phẩm mỗi loại vào giỏ
                      for (const item of items) {
                        const variantId = typeof item.variantId === 'object' ? item.variantId._id : item.variantId
                        if (!variantId) continue
                        await addToCart({ variantId, quantity: 1 })
                      }

                      navigate('/cart')
                    } catch (err) {
                      console.error('Lỗi khi mua lại:', err)
                    }
                  }}
                  sx={{
                    color: '#1a3c7b',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                  }}
                >
                  Mua lại
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Cancel />}
                  onClick={() => setOpenCancelModal(true)}
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Hủy đơn
                </Button>
              )}
            </Box>
          </Box>
        )}
      </CardContent>

      {/* Cancel Order Modal */}
      <CancelOrderModal
        open={openCancelModal}
        onClose={() => setOpenCancelModal(false)}
        onConfirm={handleCancelOrder}
        order={order}
        loading={cancelling}
      />
    </Card>
  )
}

// Enhanced Main OrderListPage component
const OrderListPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('All')
  const currentUser = useSelector(selectCurrentUser)
  const userId = currentUser?._id

  const fetchOrders = async () => {
    if (!userId) return
    try {
      setLoading(true)
      const orders = await getOrders(userId)
      console.log('Fetched orders:', orders)   // 👈 Kiểm tra ở console
      setOrders(orders)
    } catch (error) {
      console.error('Lỗi khi lấy đơn hàng:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
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

  // Reverse the filtered orders to show newest at the top
  const reversedOrders = [...filteredOrders].reverse()

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <CircularProgress size={50} />
          <Typography variant="h6" color="text.secondary">
            Đang tải đơn hàng...
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, minHeight: '70vh' }}>
      {/* Header */}
      <Box mb={4}>
        <Typography
          variant="h4"
          fontWeight="700"
          sx={{
            mb: 1,
            background: '#1a3c7b',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Đơn hàng của tôi
        </Typography>
        <Typography variant="body1" color="#1a3c7b">
          Quản lý và theo dõi tình trạng đơn hàng của bạn
        </Typography>
      </Box>

      {/* Enhanced Tabs */}
      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          mb: 4,
          overflow: 'hidden'
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              minHeight: 60,
              px: 3
            },
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0'
            }
          }}
        >
          {Object.keys(statusLabels).map((status) => {
            const [label, , icon] = statusLabels[status]
            return (
              <Tab
                key={status}
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    {icon}
                    {label}
                  </Box>
                }
                value={status}
              />
            )
          })}
        </Tabs>
      </Paper>

      {/* Order List */}
      {reversedOrders.length === 0 ? (
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 3,
            border: '2px dashed',
            borderColor: 'grey.300'
          }}
        >
          <ShoppingBag sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" mb={1}>
            Không có đơn hàng nào
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedTab === 'All'
              ? 'Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!'
              : `Không có đơn hàng nào trong trạng thái "${statusLabels[selectedTab][0]}"`
            }
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={3}>
          {reversedOrders.map((order) => (
            <OrderRow key={order._id} order={order} onOrderUpdate={fetchOrders} />
          ))}
        </Stack>
      )}
    </Container>
  )
}

export default OrderListPage  