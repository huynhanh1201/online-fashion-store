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
  Warning,
  Sync
} from '@mui/icons-material'
import ScheduleIcon from '@mui/icons-material/Schedule';
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
  Processing: ['Đang xử lý', 'info', <Sync key="processing" />],
  Shipped: ['Đã gửi hàng', 'primary', <LocalShipping key="shipped" />],
  Shipping: ['Đang giao hàng', 'primary', <LocalShipping key="shipping" />],
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
const OrderRow = ({ order, onOrderUpdate, onOrderCancelled, onReorder, reorderLoading }) => {
  const [items, setItems] = useState([])
  const [loadingItems, setLoadingItems] = useState(true)
  const [openCancelModal, setOpenCancelModal] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const navigate = useNavigate()

  const [label, color, icon] = statusLabels[order.status] || ['Không xác định', 'default', <Cancel key="unknown" />]
  const { cancelOrder } = useOrder()

  // Helper functions for formatting color and size
  const capitalizeFirstLetter = (str) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  const formatSize = (str) => {
    if (!str) return ''
    return str.toUpperCase()
  }


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
  }, [])

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
      // Call callback to switch to cancelled tab
      if (onOrderCancelled) {
        onOrderCancelled()
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
                        Phân loại hàng: {capitalizeFirstLetter(item.color?.name)}, {formatSize(item.size)}
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
                    {item.variantId?.discountPrice > 0 ? (
                      <Box display="flex" flexDirection="column" alignItems="flex-end" gap={0.5}>
                        <Typography
                          fontWeight={700}
                          fontSize="1.2rem"
                          color="#1a3c7b"
                        >
                          {(item.price - item.variantId.discountPrice)?.toLocaleString('vi-VN')}₫
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography
                            variant="body2"
                            sx={{
                              textDecoration: 'line-through',
                              color: 'text.secondary',
                              fontSize: '0.9rem'
                            }}
                          >
                            {item.price?.toLocaleString('vi-VN')}₫
                          </Typography>
                        </Box>
                      </Box>
                    ) : (
                      <Typography
                        fontWeight={700}
                        fontSize="1.2rem"
                        color="#1a3c7b"
                      >
                        {item.price?.toLocaleString('vi-VN')}₫
                      </Typography>
                    )}
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

              {(order.status === 'Delivered' || order.status === 'Failed' || order.status === 'Cancelled') && (
                <Button
                  startIcon={reorderLoading ? <CircularProgress size={16} /> : <Replay />}
                  onClick={() => onReorder && onReorder(items)}
                  disabled={reorderLoading}
                  sx={{
                    color: '#1a3c7b',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                    opacity: reorderLoading ? 0.7 : 1
                  }}
                >
                  {reorderLoading ? 'Đang thêm vào giỏ...' : 'Mua lại'}
                </Button>
              )}

              {order.status === 'Processing' && (
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
  const [allOrders, setAllOrders] = useState([]) // Lưu trữ tất cả orders
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [reorderLoading, setReorderLoading] = useState(null) // Track which order is being reordered
  const [selectedTab, setSelectedTab] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const currentUser = useSelector(selectCurrentUser)
  const userId = currentUser?._id
  const navigate = useNavigate()

  // Chỉ gọi useCart khi thực sự cần thiết
  const { addToCart, refresh: refreshCart } = useCart()

  const fetchOrders = async (page = 1, reset = true) => {
    if (!userId) return
    try {
      if (reset) {
        setLoading(true)
        setCurrentPage(1)
        setHasMore(true)
      } else {
        setLoadingMore(true)
      }

      // Lấy tất cả orders (không filter theo status)
      const response = await getOrders(userId, page, 10, 'All') // Luôn lấy tất cả
      console.log('Fetched orders:', response) // Kiểm tra ở console

      if (reset) {
        setAllOrders(response.data || [])
      } else {
        setAllOrders(prev => [...prev, ...(response.data || [])])
      }

      // Kiểm tra nếu còn trang tiếp theo
      const hasMoreData = response.data && response.data.length === 10
      setHasMore(hasMoreData)

      if (!reset) {
        setCurrentPage(page)
      }
    } catch (error) {
      console.error('Lỗi khi lấy đơn hàng:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMoreOrders = async () => {
    if (!hasMore || loadingMore) return
    const nextPage = currentPage + 1
    await fetchOrders(nextPage, false)
  }

  useEffect(() => {
    if (userId && !isInitialized) {
      fetchOrders(1, true)
      setIsInitialized(true)
    }
  }, [userId, isInitialized])

  // Handle tab change - chỉ thay đổi selectedTab, không gọi API
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue)
  }

  // Handle order cancellation - switch to cancelled tab
  const handleOrderCancelled = () => {
    setSelectedTab('Cancelled')
  }

  // Refresh orders after update (for cancel/update operations)
  const handleOrderUpdate = () => {
    fetchOrders(1, true)
  }

  // Handle reorder - chỉ gọi useCart khi thực sự cần
  const handleReorder = async (items, orderId) => {
    try {
      setReorderLoading(orderId) // Set loading for specific order
      console.log('Items to add back to cart:', items)
      console.log('Total items to process:', items.length)

      let successCount = 0

      // Lặp qua từng sản phẩm trong đơn hàng - luôn gửi quantity = 1
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const variantId = typeof item.variantId === 'object' ? item.variantId._id : item.variantId

        console.log(`Processing item ${i + 1}/${items.length}:`, {
          name: item.name,
          variantId: variantId,
          quantity: 1 // Luôn luôn là 1
        })

        if (!variantId) {
          console.warn('Variant ID not found for item:', item)
          continue
        }

        try {
          // Đảm bảo quantity luôn là 1
          const result = await addToCart({
            variantId: variantId,
            quantity: 1
          })

          console.log(`Item ${i + 1} add to cart result:`, result)

          if (result) {
            successCount++
          }
        } catch (error) {
          console.error(`Error adding item ${i + 1} to cart:`, error)
        }

        // Add small delay between requests to avoid overwhelming the server
        if (i < items.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 200))
        }
      }

      console.log(`Add to cart results: ${successCount} success`)

      if (successCount > 0) {
        // Force refresh cart data before navigating
        console.log('Refreshing cart data...')
        await refreshCart({ silent: true })

        setTimeout(() => {
          navigate('/cart')
        }, 300) // Tăng thời gian chờ để đảm bảo cart đã refresh
      } else {
        console.error('No items were added to cart')
      }
    } catch (err) {
      console.error('Lỗi khi mua lại:', err)
    } finally {
      setReorderLoading(null) // Clear loading state
    }
  }

  // Filter orders theo selectedTab phía client
  const filteredOrders = Array.isArray(allOrders)
    ? selectedTab === 'All'
      ? allOrders
      : allOrders.filter(order => order.status === selectedTab)
    : []

  // Orders are already sorted by backend (newest first), no need to reverse

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
    <Container maxWidth="lg" sx={{
      py: 4,
      minHeight: '70vh',
      // Thêm CSS animation cho skeleton
      '& @keyframes pulse': {
        '0%': {
          opacity: 1,
        },
        '50%': {
          opacity: 0.4,
        },
        '100%': {
          opacity: 1,
        },
      }
    }}>
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
      {filteredOrders.length === 0 ? (
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
          {filteredOrders.map((order) => (
            <OrderRow
              key={order._id}
              order={order}
              onOrderUpdate={handleOrderUpdate}
              onOrderCancelled={handleOrderCancelled}
              onReorder={(items) => handleReorder(items, order._id)}
              reorderLoading={reorderLoading === order._id}
            />
          ))}

          {/* Load More Button */}
          {hasMore && filteredOrders.length > 0 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Button
                variant="outlined"
                size="large"
                onClick={loadMoreOrders}
                disabled={loadingMore}
                startIcon={loadingMore ? <CircularProgress size={20} /> : <KeyboardArrowDown />}
                sx={{
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  border: '2px solid',
                  borderColor: '#1a3c7b',
                  color: '#1a3c7b',
                  '&:hover': {
                    backgroundColor: '#1a3c7b',
                    color: 'white',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(26, 60, 123, 0.3)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {loadingMore ? 'Đang tải...' : 'Xem thêm đơn hàng'}
              </Button>
            </Box>
          )}
        </Stack>
      )}
    </Container>
  )
}

export default OrderListPage