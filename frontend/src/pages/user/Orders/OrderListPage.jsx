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
  Skeleton,
  Breadcrumbs,
  Link
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
  Sync,
  RateReview,
  NavigateNext
} from '@mui/icons-material'
import ScheduleIcon from '@mui/icons-material/Schedule';
import { getOrders, getOrderItems } from '~/services/orderService'
import { getVariantById } from '~/services/variantService'
import { useOrder } from '~/hooks/useOrder'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useCart } from '~/hooks/useCarts'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary'
import { setReorderVariantIds } from '~/redux/cart/cartSlice'
import { getUserReviews } from '~/services/reviewService'

// Define status labels with icons and colors
const statusLabels = {
  All: ['Tất cả', 'default', <ShoppingBag key="all" />],
  Processing: ['Đang xử lý', 'info', <Sync key="processing" />],
  Shipped: ['Đã gửi hàng', 'primary', <LocalShipping key="shipped" />],
  Shipping: ['Đang giao hàng', 'primary', <LocalShipping key="shipping" />],
  Delivered: ['Đã giao', 'success', <CheckCircle key="delivered" />],
  Cancelled: ['Đã hủy', 'error', <Cancel key="cancelled" />],
  Failed: ['Thất bại', 'error', <Cancel key="failed" />]
}

// Skeleton Loading Component
const OrderSkeleton = () => (
  <Card
    sx={{
      mb: 3,
      borderRadius: 3,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1px solid rgba(0,0,0,0.05)',
    }}
  >
    <CardContent sx={{ p: 3 }}>
      {/* Header skeleton */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <Skeleton variant="text" width={120} height={32} />
          <Skeleton variant="text" width={80} height={24} />
        </Box>
        <Skeleton variant="rounded" width={100} height={32} />
      </Box>

      {/* Product skeleton */}
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: 'grey.50',
          border: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <Skeleton variant="rounded" width={80} height={80} />
            <Box>
              <Skeleton variant="text" width={200} height={28} />
              <Skeleton variant="text" width={150} height={20} sx={{ mb: 0.5 }} />
              <Skeleton variant="rounded" width={80} height={20} />
            </Box>
          </Box>
          <Box textAlign="right">
            <Skeleton variant="text" width={100} height={28} />
          </Box>
        </Box>
      </Box>

      {/* Footer skeleton */}
      <Box mt={3}>
        <Divider sx={{ my: 2 }} />
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
          <Skeleton variant="text" width={80} height={24} />
          <Skeleton variant="text" width={120} height={32} />
        </Box>
        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
          <Skeleton variant="rounded" width={100} height={36} />
          <Skeleton variant="rounded" width={80} height={36} />
        </Box>
      </Box>
    </CardContent>
  </Card>
)

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
const OrderRow = ({ order, onOrderUpdate, onOrderCancelled, onReorder, reorderLoading, isRecentlyUpdated }) => {
  const [items, setItems] = useState([])
  const [loadingItems, setLoadingItems] = useState(true)
  const [openCancelModal, setOpenCancelModal] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [reviewedProducts, setReviewedProducts] = useState(new Set())
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [itemsError, setItemsError] = useState(null)
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)

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

  // Tính giá thực tế của từng variant dựa trên tỷ lệ từ order.total
  const getActualItemPrice = (item) => {
    if (!order?.total || !items?.length) return item.subtotal || 0

    // Tính tổng subtotal gốc của tất cả items
    const totalOriginalSubtotal = items.reduce((sum, orderItem) => sum + (orderItem.subtotal || 0), 0)

    // Nếu tổng subtotal gốc = 0, trả về subtotal gốc
    if (totalOriginalSubtotal === 0) return item.subtotal || 0

    // Tính tổng tiền hàng thực tế từ order.total
    const totalProductsPrice = order.total - (order.shippingFee || 0) + (order.discountAmount || 0)

    // Tính giá thực tế dựa trên tỷ lệ
    const actualPrice = ((item.subtotal || 0) / totalOriginalSubtotal) * totalProductsPrice

    return Math.round(actualPrice)
  }


  useEffect(() => {
    const fetchItems = async () => {
      try {
        setItemsError(null)
        const res = await getOrderItems(order._id)
        setItems(res || [])
      } catch (err) {
        console.error('Lỗi khi lấy sản phẩm:', err)
        setItemsError(err.message || 'Không thể tải thông tin sản phẩm')
        setItems([])
      } finally {
        setLoadingItems(false)
      }
    }

    fetchItems()
  }, [])

  // Fetch reviews for delivered orders
  useEffect(() => {
    const fetchUserReviews = async () => {
      if (!currentUser?._id || !order?._id || order.status !== 'Delivered') {
        setReviewsLoading(false)
        return
      }

      try {
        const reviews = await getUserReviews(currentUser._id)
        const reviewedProductsInOrder = reviews
          .filter((review) => review.orderId === order._id)
          .map((review) => review.productId)
        setReviewedProducts(new Set(reviewedProductsInOrder))
      } catch (err) {
        console.error('Lỗi khi lấy đánh giá người dùng:', err)
        setReviewedProducts(new Set())
      } finally {
        setReviewsLoading(false)
      }
    }

    fetchUserReviews()
  }, [currentUser, order._id, order.status])

  // Handle cancel order confirmation
  const handleCancelOrder = async () => {
    setCancelling(true)
    try {
      await cancelOrder(order._id, 'Người dùng hủy đơn')
      setOpenCancelModal(false)
      // Call parent callback to refresh orders
      if (onOrderUpdate) {
        onOrderUpdate(order._id)
      }
      // Call callback to switch to cancelled tab
      if (onOrderCancelled) {
        onOrderCancelled(order._id)
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
        boxShadow: isRecentlyUpdated
          ? '0 8px 30px rgba(26, 60, 123, 0.2)'
          : '0 4px 20px rgba(0,0,0,0.08)',
        border: isRecentlyUpdated
          ? '2px solid var(--primary-color)'
          : '1px solid rgba(0,0,0,0.05)',
        backgroundColor: isRecentlyUpdated
          ? 'rgba(26, 60, 123, 0.02)'
          : 'white',
        transition: 'all 0.3s ease',
        transform: isRecentlyUpdated ? 'scale(1.01)' : 'scale(1)',
        '&:hover': {
          boxShadow: isRecentlyUpdated
            ? '0 12px 40px rgba(26, 60, 123, 0.25)'
            : '0 8px 30px rgba(0,0,0,0.12)',
          transform: isRecentlyUpdated ? 'scale(1.01) translateY(-2px)' : 'translateY(-2px)'
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
              sx={{ color: 'var(--primary-color)' }}
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
          <Box sx={{ position: 'relative' }}>
            <Stack spacing={2}>
              {items.slice(0, 3).map((item, i) => (
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
                      borderColor: 'var(--primary-color)',
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
                          sx={{
                            mb: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: { xs: '150px', sm: '200px', md: '250px' }
                          }}
                          title={capitalizeFirstLetter(item.name)}
                        >
                          {capitalizeFirstLetter(item.name)}
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
                      {/* Hiển thị giá thực tế đã trả dựa trên tỷ lệ từ order.total */}
                      <Typography
                        fontWeight={700}
                        fontSize="1.2rem"
                        color="var(--primary-color)"
                      >
                        {getActualItemPrice(item).toLocaleString('vi-VN')}₫
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>

            {/* Fade overlay and "View Details" button when there are more than 3 items */}
            {items.length > 3 && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 120,
                  background: 'linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.7) 40%, rgba(255, 255, 255, 0.95) 100%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  pb: 2,
                  zIndex: 10,
                  pointerEvents: 'none'
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<Visibility />}
                  onClick={() => navigate(`/order-detail/${order._id}`)}
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 600,
                    backgroundColor: 'var(--primary-color)',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    boxShadow: '0 6px 20px rgba(26, 60, 123, 0.4)',
                    pointerEvents: 'auto',
                    '&:hover': {
                      backgroundColor: 'var(--primary-color)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 25px rgba(26, 60, 123, 0.5)'
                    },
                    transition: 'all 0.3s ease',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -8,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderBottom: '8px solid var(--primary-color)',
                      opacity: 0.7
                    }
                  }}
                >
                  Xem chi tiết đơn hàng
                </Button>
              </Box>
            )}
          </Box>
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
                sx={{ color: 'var(--primary-color)' }}
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
                  color: 'var(--primary-color)'
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
                    color: 'var(--primary-color)',
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
  const [orders, setOrders] = useState([]) // Lưu trữ orders theo status hiện tại
  const [loading, setLoading] = useState(true)
  const [tabLoading, setTabLoading] = useState(false) // Loading riêng cho tab switching
  const [loadingMore, setLoadingMore] = useState(false)
  const [reorderLoading, setReorderLoading] = useState(null) // Track which order is being reordered
  const [selectedTab, setSelectedTab] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const [recentlyUpdatedOrderId, setRecentlyUpdatedOrderId] = useState(null) // Track recently updated order for highlighting

  const currentUser = useSelector(selectCurrentUser)
  const userId = currentUser?._id
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Chỉ gọi useCart khi thực sự cần thiết
  const { addToCart, refresh: refreshCart, cart } = useCart()



  const fetchOrders = async (page = 1, reset = true, status = selectedTab, isTabSwitch = false, sortBy = 'updatedAt') => {
    if (!userId) return
    try {
      if (reset) {
        // Nếu là tab switch thì chỉ set tabLoading, không set loading chính
        if (isTabSwitch) {
          setTabLoading(true)
        } else {
          setLoading(true)
        }
        setCurrentPage(1)
        setHasMore(true)
      } else {
        setLoadingMore(true)
      }

      // Gọi API với status tương ứng, sắp xếp theo updatedAt để đơn hàng vừa cập nhật hiện lên đầu
      const response = await getOrders(userId, page, 10, status, sortBy)

      if (reset) {
        setOrders(response.data || [])
      } else {
        setOrders(prev => [...prev, ...(response.data || [])])
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
      if (isTabSwitch) {
        setTabLoading(false)
      } else {
        setLoading(false)
      }
      setLoadingMore(false)
    }
  }

  const loadMoreOrders = async () => {
    if (!hasMore || loadingMore) return
    const nextPage = currentPage + 1
    await fetchOrders(nextPage, false, selectedTab)
  }

  useEffect(() => {
    if (userId && !isInitialized) {
      fetchOrders(1, true, selectedTab)
      setIsInitialized(true)
    }
  }, [userId, isInitialized])

  // Handle tab change - gọi API với status tương ứng
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue)
    // Gọi API với status mới, đánh dấu là tab switch
    fetchOrders(1, true, newValue, true)
  }

  // Handle order cancellation - switch to cancelled tab
  const handleOrderCancelled = async (orderId) => {
    setSelectedTab('Cancelled')
    setRecentlyUpdatedOrderId(orderId) // Set recently updated order for highlighting
    // Thêm delay nhỏ để đảm bảo đơn hàng đã được cập nhật trong database
    await new Promise(resolve => setTimeout(resolve, 500))
    // Gọi API để lấy orders có status Cancelled, sắp xếp theo updatedAt
    await fetchOrders(1, true, 'Cancelled', true, 'updatedAt')
    // Clear highlight after 3 seconds
    setTimeout(() => setRecentlyUpdatedOrderId(null), 3000)
  }

  // Refresh orders after update (for cancel/update operations)
  const handleOrderUpdate = async (orderId) => {
    if (orderId) {
      setRecentlyUpdatedOrderId(orderId) // Set recently updated order for highlighting
    }
    // Thêm delay nhỏ để đảm bảo đơn hàng đã được cập nhật
    await new Promise(resolve => setTimeout(resolve, 300))
    await fetchOrders(1, true, selectedTab, false, 'updatedAt')
    // Clear highlight after 3 seconds if orderId is provided
    if (orderId) {
      setTimeout(() => setRecentlyUpdatedOrderId(null), 3000)
    }
  }

  // Handle reorder - logic đơn giản: nếu có trong giỏ thì bỏ qua, nếu hết hàng thì gửi quantity = 0
  const handleReorder = async (items, orderId) => {
    try {
      setReorderLoading(orderId)

      // Lặp qua từng sản phẩm trong đơn hàng
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const variantId = typeof item.variantId === 'object' ? item.variantId._id : item.variantId

        if (!variantId) {
          console.warn('Variant ID not found for item:', item)
          continue
        }

        try {
          // Kiểm tra số lượng tồn kho của variant trước
          const variantInfo = await getVariantById(variantId)

          if (!variantInfo) {
            console.warn('Variant not found for ID:', variantId)
            continue
          }

          // Kiểm tra số lượng tồn kho
          const availableQuantity = variantInfo.quantity || 0

          let quantityToAdd = 1 // Mặc định thêm 1

          // Nếu hết hàng thì gửi quantity = 0 để hiển thị "hết hàng" trong cart
          if (availableQuantity <= 0) {
            quantityToAdd = 0
            console.log(`Item ${item.name} is out of stock, adding with quantity = 0`)
            // Thêm vào giỏ hàng với quantity = 0
            await addToCart({
              variantId: variantId,
              quantity: quantityToAdd
            })
            continue
          }

          // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
          const currentCartItem = cart?.cartItems?.find(cartItem => {
            const cartVariantId = typeof cartItem.variantId === 'object'
              ? cartItem.variantId._id
              : cartItem.variantId
            return cartVariantId === variantId
          })

          const currentQuantityInCart = currentCartItem?.quantity || 0

          // Nếu đã có trong giỏ hàng và đạt số lượng tối đa thì BỎ QUA
          if (currentCartItem && currentQuantityInCart >= availableQuantity) {
            console.log(`Item ${item.name} reached max quantity in cart (${currentQuantityInCart}/${availableQuantity}), skipping`)
            continue
          }
          // Nếu đã có trong giỏ hàng nhưng chưa đạt tối đa
          else if (currentCartItem) {
            // Tính toán số lượng có thể thêm
            const canAdd = availableQuantity - currentQuantityInCart
            quantityToAdd = Math.min(1, canAdd) // Chỉ thêm tối đa 1 hoặc số lượng còn lại
            console.log(`Item ${item.name} already in cart (${currentQuantityInCart}), adding ${quantityToAdd} more`)
          }
          // Sản phẩm chưa có trong giỏ hàng
          else {
            console.log(`Adding new item ${item.name} to cart`)
          }

          // Thêm vào giỏ hàng
          await addToCart({
            variantId: variantId,
            quantity: quantityToAdd
          })
        } catch (error) {
          console.error(`Error adding item ${i + 1} to cart:`, error)
        }

        // Add small delay between requests to avoid overwhelming the server
        if (i < items.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 200))
        }
      }

      // Lưu danh sách variantId từ reorder vào Redux để cart tự động chọn
      const reorderVariantIds = items
        .map(item => typeof item.variantId === 'object' ? item.variantId._id : item.variantId)
        .filter(id => id) // Lọc bỏ các id không hợp lệ

      dispatch(setReorderVariantIds(reorderVariantIds))

      // Force refresh cart data before navigating
      await refreshCart({ silent: true })

      // Chuyển đến giỏ hàng luôn
      setTimeout(() => {
        navigate('/cart')
      }, 300)

    } catch (err) {
      console.error('Lỗi khi mua lại:', err)
    } finally {
      setReorderLoading(null) // Clear loading state
    }
  }

  // Không cần filter nữa vì đã được filter từ API
  const filteredOrders = Array.isArray(orders) ? orders : []

  // Orders are already sorted by backend (newest first), no need to reverse

  if (loading) {
    return (
      <Container maxWidth={false} sx={{ width: '96vw', maxWidth: '1800px', margin: '0 auto', py: 4 }}>
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
    <Container maxWidth={false} sx={{
      width: '96vw',
      maxWidth: '1800px',
      margin: '0 auto',
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
      {/* Breadcrumb */}
      <Box
        sx={{
          bottom: { xs: '20px', sm: '30px', md: '40px' },
          left: { xs: '20px', sm: '30px', md: '40px' },
          right: { xs: '20px', sm: '30px', md: '40px' },
          maxWidth: '1800px',
          margin: '0 auto',
          mb: 2
        }}
      >
        <Breadcrumbs
          separator={<NavigateNext fontSize='small' />}
          aria-label='breadcrumb'
        >
          <Link
            underline='hover'
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: '#007bff',
              textDecoration: 'none',
              '&:hover': {
                color: 'primary.main'
              }
            }}
            href='/'
          >
            Trang chủ
          </Link>
          <Typography
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'text.primary',
              fontWeight: 500
            }}
          >
            Đơn hàng
          </Typography>
        </Breadcrumbs>
      </Box>
      {/* Header */}
      <Box mb={4}>
        <Typography
          variant="h4"
          fontWeight="700"
          sx={{
            mb: 1,
            background: 'var(--primary-color)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Đơn hàng của tôi
        </Typography>
        <Typography variant="body1" color="var(--primary-color)">
          Quản lý và theo dõi tình trạng đơn hàng của bạn
        </Typography>
      </Box>

      {/* Enhanced Tabs */}
      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          mb: 4,
          overflow: 'hidden',
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTabs-flexContainer': {
              display: 'flex',
              justifyContent: 'space-between',
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: { xs: '0.6rem', sm: '0.75rem', md: '0.9rem', lg: '1rem' },
              minHeight: { xs: 48, sm: 56, md: 60 },
              px: { xs: 0.5, sm: 1, md: 2, lg: 3 },
              minWidth: 0,
              flex: 1,
              maxWidth: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(26, 60, 123, 0.04)',
                color: 'var(--primary-color)'
              }
            },
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0',
              transition: 'all 0.3s ease'
            }
          }}
        >
          {Object.keys(statusLabels).map((status) => {
            const [label, , icon] = statusLabels[status]
            return (
              <Tab
                key={status}
                label={
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={{ xs: 0.25, sm: 0.5, md: 0.75, lg: 1 }}
                    flexDirection={{ xs: 'column', sm: 'column', md: 'row' }}
                    sx={{
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                        lineHeight: 1,
                      }}
                    >
                      {icon}
                    </Box>
                    <Typography
                      component="span"
                      sx={{
                        fontSize: 'inherit',
                        lineHeight: 1.1,
                        textAlign: 'center',
                        fontWeight: 'inherit',
                      }}
                    >
                      {label}
                    </Typography>
                  </Box>
                }
                value={status}
              />
            )
          })}
        </Tabs>
      </Paper>

      {/* Order List */}
      {tabLoading ? (
        // Hiển thị skeleton loading khi đang chuyển tab
        <Stack spacing={3}>
          {[1, 2, 3].map((_, index) => (
            <OrderSkeleton key={index} />
          ))}
        </Stack>
      ) : filteredOrders.length === 0 ? (
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 3,
            border: '2px dashed',
            borderColor: 'grey.300',
            opacity: 0,
            animation: 'fadeIn 0.3s ease-in-out forwards',
            '@keyframes fadeIn': {
              '0%': { opacity: 0, transform: 'translateY(10px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' }
            }
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
        <Stack spacing={3} sx={{
          opacity: 0,
          animation: 'fadeIn 0.3s ease-in-out forwards',
          '@keyframes fadeIn': {
            '0%': { opacity: 0, transform: 'translateY(10px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' }
          }
        }}>
          {filteredOrders.map((order) => (
            <OrderRow
              key={order._id}
              order={order}
              onOrderUpdate={handleOrderUpdate}
              onOrderCancelled={handleOrderCancelled}
              onReorder={(items) => handleReorder(items, order._id)}
              reorderLoading={reorderLoading === order._id}
              isRecentlyUpdated={recentlyUpdatedOrderId === order._id}
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
                  borderColor: 'var(--primary-color)',
                  color: 'var(--primary-color)',
                  '&:hover': {
                    backgroundColor: 'var(--primary-color)',
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