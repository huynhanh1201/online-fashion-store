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
  NavigateNext,
} from '@mui/icons-material'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import ErrorIcon from '@mui/icons-material/Error'
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
  Shipped: ['Đã gửi hàng', 'primary', <ExitToAppIcon key="shipped" />],
  Shipping: ['Đang giao hàng', 'primary', <LocalShipping key="shipping" />],
  Delivered: ['Đã giao', 'success', <CheckCircle key="delivered" />],
  Cancelled: ['Đã hủy', 'error', <Cancel key="cancelled" />],
  Failed: ['Thất bại', 'error', <ErrorIcon key="failed" />]
}

// Skeleton Loading Component
const OrderSkeleton = () => (
  <Card
    sx={{
      mb: 2,
      borderRadius: 3,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1px solid rgba(0,0,0,0.05)'
    }}
  >
    <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Box display="flex" alignItems="center" gap={1}>
          <Skeleton variant="text" width={100} height={28} />
          <Skeleton variant="text" width={60} height={20} />
        </Box>
        <Skeleton variant="rounded" width={80} height={28} />
      </Box>
      <Box
        sx={{
          p: { xs: 1, sm: 1.5, md: 2 },
          borderRadius: 2,
          backgroundColor: 'grey.50',
          border: '1px solid',
          borderColor: 'grey.200'
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexDirection={{ xs: 'column', sm: 'row' }}
          gap={1}
        >
          <Box display="flex" alignItems="center" gap={1.5} width="100%">
            <Skeleton variant="rounded" width={60} height={60} />
            <Box flexGrow={1}>
              <Skeleton variant="text" width={150} height={24} />
              <Skeleton variant="text" width={100} height={18} sx={{ mb: 0.5 }} />
              <Skeleton variant="rounded" width={60} height={18} />
            </Box>
          </Box>
          <Box textAlign={{ xs: 'center', sm: 'right' }}>
            <Skeleton variant="text" width={80} height={24} />
          </Box>
        </Box>
      </Box>
      <Box mt={2}>
        <Divider sx={{ my: 1 }} />
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            p: { xs: 1, sm: 1.5, md: 2 },
            borderRadius: 2,
            backgroundColor: 'primary.50'
          }}
        >
          <Skeleton variant="text" width={60} height={20} />
          <Skeleton variant="text" width={100} height={28} />
        </Box>
        <Box display="flex" justifyContent="flex-end" gap={1} mt={1} flexDirection={{ xs: 'column', sm: 'row' }}>
          <Skeleton variant="rounded" width={80} height={32} />
          <Skeleton variant="rounded" width={80} height={32} />
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
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          width: { xs: '90vw', sm: '400px' }
        }
      }}
    >
      <DialogTitle sx={{ pb: 1, px: { xs: 2, sm: 3 } }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              p: 1,
              borderRadius: '50%',
              backgroundColor: 'error.50',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Warning sx={{ color: 'error.main', fontSize: { xs: 24, sm: 28 } }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              fontWeight="600"
              color="text.primary"
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              Xác nhận hủy đơn hàng
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
            >
              Đơn hàng #{order?.code}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ py: 2, px: { xs: 2, sm: 3 } }}>
        <DialogContentText sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, color: 'text.primary' }}>
          Bạn có chắc chắn muốn hủy đơn hàng này không?
          <br />
          <Typography
            component="span"
            sx={{
              fontWeight: 600,
              color: 'error.main',
              mt: 1,
              display: 'block',
              fontSize: { xs: '0.8rem', sm: '0.9rem' }
            }}
          >
            Hành động này không thể hoàn tác!
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: { xs: 2, sm: 3 }, pt: 1, flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: { xs: 2, sm: 3 },
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            width: { xs: '100%', sm: 'auto' }
          }}
        >
          Không, giữ lại
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          startIcon={loading ? (
            <CircularProgress
              size={16}
              sx={{
                color: 'inherit',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round'
                }
              }}
            />
          ) : <Cancel />}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: { xs: 2, sm: 3 },
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            width: { xs: '100%', sm: 'auto' },
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

  const capitalizeFirstLetter = (str) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  const formatSize = (str) => {
    if (!str) return ''
    return str.toUpperCase()
  }

  const getActualItemPrice = (item) => {
    if (!order?.total || !items?.length) return item.subtotal || 0
    const totalOriginalSubtotal = items.reduce((sum, orderItem) => sum + (orderItem.subtotal || 0), 0)
    if (totalOriginalSubtotal === 0) return item.subtotal || 0
    const totalProductsPrice = order.total - (order.shippingFee || 0) + (order.discountAmount || 0)
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
  }, [order._id])

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

  const handleCancelOrder = async () => {
    setCancelling(true)
    try {
      await cancelOrder(order._id, 'Người dùng hủy đơn')
      setOpenCancelModal(false)
      if (onOrderUpdate) {
        onOrderUpdate(order._id)
      }
      if (onOrderCancelled) {
        onOrderCancelled(order._id)
      }
    } catch (error) {
      console.error('Lỗi khi hủy đơn hàng:', error)
    } finally {
      setCancelling(false)
    }
  }

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 3,
        boxShadow: isRecentlyUpdated
          ? '0 8px 30px rgba(26, 60, 123, 0.2)'
          : '0 4px 20px rgba(0,0,0,0.08)',
        border: isRecentlyUpdated ? '2px solid var(--primary-color)' : '1px solid rgba(0,0,0,0.05)',
        backgroundColor: isRecentlyUpdated ? 'rgba(26, 60, 123, 0.02)' : 'white',
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
      <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1} flexWrap="wrap" gap={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography
              variant="h6"
              fontWeight="600"
              sx={{ color: 'var(--primary-color)', fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              #{order.code}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              {new Date(order.createdAt).toLocaleDateString('vi-VN')}
            </Typography>
          </Box>
          <Chip
            label={label}
            color={color === 'default' ? undefined : color}
            icon={icon}
            sx={{
              fontWeight: 600,
              fontSize: { xs: '0.65rem', sm: '0.75rem' },
              height: { xs: 28, sm: 32 }
            }}
          />
        </Box>
        {loadingItems ? (
          <Box display="flex" justifyContent="center" py={2}>
            <CircularProgress
              size={30}
              sx={{
                color: 'var(--primary-color)',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round'
                }
              }}
            />
          </Box>
        ) : (
          <Box sx={{ position: 'relative' }}>
            <Stack spacing={1}>
              {items.slice(0, 3).map((item, i) => (
                <Box
                  key={i}
                  sx={{
                    p: { xs: 1, sm: 1.5, md: 2 },
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
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"

                    gap={1}
                  >
                    <Box display="flex" alignItems="center" gap={1.5} width="100%">
                      <Avatar
                        src={optimizeCloudinaryUrl(item.color?.image) || '/images/default.jpg'}
                        alt={item.name}
                        sx={{
                          width: { xs: 60, sm: 70, md: 80 },
                          height: { xs: 60, sm: 70, md: 80 },
                          borderRadius: 2,
                          border: '2px solid white',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                          objectFit: 'cover'
                        }}
                        variant="rounded"
                      />
                      <Box flexGrow={1}>
                        <Typography
                          fontWeight={600}
                          sx={{
                            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                            mb: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: { xs: '200px', sm: '300px', md: '400px', lg: '500px' }
                          }}
                          title={capitalizeFirstLetter(item.name)}
                        >
                          {capitalizeFirstLetter(item.name)}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 0.5, fontSize: { xs: '0.75rem', sm: '0.8rem' } }}
                        >
                          Phân loại hàng: {capitalizeFirstLetter(item.color?.name)}, {formatSize(item.size)}
                        </Typography>
                        <Chip
                          label={`Số lượng: ${item.quantity}`}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: { xs: '0.65rem', sm: '0.7rem' },
                            height: { xs: 18, sm: 20 }
                          }}
                        />
                      </Box>
                    </Box>
                    <Box sx={{ alignSelf: { xs: 'flex-end', sm: 'center' }, ml: { xs: 0, sm: 1 } }}>
                      <Typography
                        fontWeight={700}
                        sx={{
                          fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                          color: 'var(--primary-color)'
                        }}
                      >
                        {getActualItemPrice(item).toLocaleString('vi-VN')}₫
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Stack>
            {items.length > 3 && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: { xs: 80, sm: 100, md: 120 },
                  background:
                    'linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.7) 40%, rgba(255, 255, 255, 0.95) 100%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  pb: { xs: 1, sm: 2 },
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
                    px: { xs: 2, sm: 3, md: 4 },
                    py: { xs: 1, sm: 1.5 },
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    width: { xs: '100%', sm: 'auto' },
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
        {!loadingItems && (
          <Box mt={2}>
            <Divider sx={{ my: 1 }} />
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                p: { xs: 1, sm: 1.5, md: 2 },
                borderRadius: 2,
                backgroundColor: 'primary.50'
              }}
            >
              <Typography
                variant="h6"
                fontWeight="600"
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                Tổng tiền:
              </Typography>
              <Typography
                variant="h5"
                fontWeight="700"
                sx={{
                  color: 'var(--primary-color)',
                  fontSize: { xs: '1.25rem', sm: '1.5rem' }
                }}
              >
                {order.total?.toLocaleString('vi-VN')}₫
              </Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="flex-end"
              gap={1}
              mt={1}
              flexDirection={{ xs: 'column', sm: 'row' }}
            >
              <Button
                startIcon={<Visibility />}
                onClick={() => navigate(`/order-detail/${order._id}`)}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  color: 'var(--primary-color)',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: { xs: 1.5, sm: 2 },
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                Xem chi tiết
              </Button>
              {(order.status === 'Delivered' || order.status === 'Failed' || order.status === 'Cancelled') && (
                <Button
                  startIcon={reorderLoading ? (
                    <CircularProgress
                      size={16}
                      sx={{
                        color: 'inherit',
                        '& .MuiCircularProgress-circle': {
                          strokeLinecap: 'round'
                        }
                      }}
                    />
                  ) : <Replay />}
                  onClick={() => onReorder && onReorder(items)}
                  disabled={reorderLoading}
                  sx={{
                    color: 'var(--primary-color)',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    px: { xs: 1.5, sm: 2 },
                    width: { xs: '100%', sm: 'auto' },
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
                    fontWeight: 600,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    px: { xs: 1.5, sm: 2 },
                    width: { xs: '100%', sm: 'auto' }
                  }}
                >
                  Hủy đơn
                </Button>
              )}
            </Box>
          </Box>
        )}
      </CardContent>
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
  const [tabLoading, setTabLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [reorderLoading, setReorderLoading] = useState(null)
  const [selectedTab, setSelectedTab] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const [recentlyUpdatedOrderId, setRecentlyUpdatedOrderId] = useState(null)

  const currentUser = useSelector(selectCurrentUser)
  const userId = currentUser?._id
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { addToCart, refresh: refreshCart, cart } = useCart()

  const fetchOrders = async (page = 1, reset = true, status = selectedTab, isTabSwitch = false, sortBy = 'updatedAt') => {
    if (!userId) return
    try {
      if (reset) {
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
      const response = await getOrders(userId, page, 10, status, sortBy)
      if (reset) {
        setOrders(response.data || [])
      } else {
        setOrders((prev) => [...prev, ...(response.data || [])])
      }
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

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue)
    fetchOrders(1, true, newValue, true)
  }

  const handleOrderCancelled = async (orderId) => {
    setSelectedTab('Cancelled')
    setRecentlyUpdatedOrderId(orderId)
    await new Promise((resolve) => setTimeout(resolve, 500))
    await fetchOrders(1, true, 'Cancelled', true, 'updatedAt')
    setTimeout(() => setRecentlyUpdatedOrderId(null), 3000)
  }

  const handleOrderUpdate = async (orderId) => {
    if (orderId) {
      setRecentlyUpdatedOrderId(orderId)
    }
    await new Promise((resolve) => setTimeout(resolve, 300))
    await fetchOrders(1, true, selectedTab, false, 'updatedAt')
    if (orderId) {
      setTimeout(() => setRecentlyUpdatedOrderId(null), 3000)
    }
  }

  const handleReorder = async (items, orderId) => {
    try {
      setReorderLoading(orderId)
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const variantId = typeof item.variantId === 'object' ? item.variantId._id : item.variantId
        if (!variantId) {
          console.warn('Variant ID not found for item:', item)
          continue
        }
        try {
          const variantInfo = await getVariantById(variantId)
          if (!variantInfo) {
            console.warn('Variant not found for ID:', variantId)
            continue
          }
          const availableQuantity = variantInfo.quantity || 0
          let quantityToAdd = 1
          if (availableQuantity <= 0) {
            quantityToAdd = 0
            console.log(`Item ${item.name} is out of stock, adding with quantity = 0`)
            await addToCart({
              variantId: variantId,
              quantity: quantityToAdd
            })
            continue
          }
          const currentCartItem = cart?.cartItems?.find((cartItem) => {
            const cartVariantId = typeof cartItem.variantId === 'object' ? cartItem.variantId._id : cartItem.variantId
            return cartVariantId === variantId
          })
          const currentQuantityInCart = currentCartItem?.quantity || 0
          if (currentCartItem && currentQuantityInCart >= availableQuantity) {
            console.log(
              `Item ${item.name} reached max quantity in cart (${currentQuantityInCart}/${availableQuantity}), skipping`
            )
            continue
          } else if (currentCartItem) {
            const canAdd = availableQuantity - currentQuantityInCart
            quantityToAdd = Math.min(1, canAdd)
            console.log(`Item ${item.name} already in cart (${currentQuantityInCart}), adding ${quantityToAdd} more`)
          } else {
            console.log(`Adding new item ${item.name} to cart`)
          }
          await addToCart({
            variantId: variantId,
            quantity: quantityToAdd
          })
        } catch (error) {
          console.error(`Error adding item ${i + 1} to cart:`, error)
        }
        if (i < items.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 200))
        }
      }
      const reorderVariantIds = items
        .map((item) => (typeof item.variantId === 'object' ? item.variantId._id : item.variantId))
        .filter((id) => id)
      dispatch(setReorderVariantIds(reorderVariantIds))
      await refreshCart({ silent: true })
      setTimeout(() => {
        navigate('/cart')
      }, 300)
    } catch (err) {
      console.error('Lỗi khi mua lại:', err)
    } finally {
      setReorderLoading(null)
    }
  }

  const filteredOrders = Array.isArray(orders) ? orders : []

  if (loading) {
    return (
      <Container
        maxWidth={false}
        sx={{
          width: '100%',
          maxWidth: { xs: '95vw', sm: '96vw', md: '96vw' },
          margin: '0 auto',
          height: '70vh',
          py: { xs: 2, sm: 3, md: 4 }
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CircularProgress
              size={50}
              thickness={4}
              sx={{
                color: 'var(--primary-color)',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round'
                }
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ShoppingBag sx={{ color: 'var(--primary-color)', fontSize: 20 }} />
            </Box>
          </Box>
          <Box textAlign="center">
            <Typography
              variant="h6"
              color="text.primary"
              sx={{
                fontSize: { xs: '1rem', sm: '1.25rem' },
                fontWeight: 600,
                mb: 0.5
              }}
            >
              Đang tải đơn hàng...
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
            >
              Vui lòng chờ trong giây lát
            </Typography>
          </Box>
        </Box>
      </Container>
    )
  }

  return (
    <Container
      maxWidth={false}
      sx={{
        width: '100%',
        maxWidth: { xs: '100vw', sm: '96vw', md: '96vw' },
        margin: '0 auto',
        py: { xs: 2, sm: 3, md: 4 },
        minHeight: '70vh',
        '& @keyframes pulse': {
          '0%': { opacity: 1 },
          '50%': { opacity: 0.4 },
          '100%': { opacity: 1 }
        }
      }}
    >
      <Box sx={{ mb: 2 }}>
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
              },
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          // component={Link}
          // to='/product'
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
      <Box mb={3}>
        <Typography
          variant="h4"
          fontWeight="700"
          sx={{
            mb: 1,
            background: 'var(--primary-color)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' }
          }}
        >
          Đơn hàng của tôi
        </Typography>
        <Typography
          variant="body1"
          color="var(--primary-color)"
          sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          Quản lý và theo dõi tình trạng đơn hàng của bạn
        </Typography>
      </Box>
      <Paper
        elevation={2}
        sx={{
          borderRadius: 3,
          mb: 3,
          overflow: 'hidden'
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTabs-flexContainer': {
              display: 'flex',
              justifyContent: 'space-between'
            },
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: { xs: '0rem', sm: '0.875rem', md: '0.9rem' },
              minHeight: { xs: 40, sm: 48, md: 56 },
              px: { xs: 0.5, sm: 2, md: 3 },
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
                    gap={{ xs: 0, sm: 0.75, md: 1 }}
                    flexDirection="row"
                    sx={{ width: '100%', height: '100%' }}
                  >
                    <Box sx={{ fontSize: { xs: '1rem', sm: '0.875rem', md: '1rem' }, lineHeight: 1 }}>
                      {icon}
                    </Box>
                    <Typography
                      component="span"
                      sx={{
                        fontSize: { xs: '0rem', sm: '0.875rem', md: '0.9rem' },
                        lineHeight: 1.1,
                        textAlign: 'center',
                        fontWeight: 'inherit',
                        display: { xs: 'none', sm: 'inline' }
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
      {
        tabLoading ? (
          <Stack spacing={2}>
            {[1, 2, 3].map((_, index) => (
              <OrderSkeleton key={index} />
            ))}
          </Stack>
        ) : filteredOrders.length === 0 ? (
          <Paper
            sx={{
              p: { xs: 3, sm: 4, md: 6 },
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
            <ShoppingBag sx={{ fontSize: { xs: 60, sm: 80 }, color: 'grey.400', mb: 2 }} />
            <Typography
              variant="h6"
              color="text.secondary"
              mb={1}
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              Không có đơn hàng nào
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
            >
              {selectedTab === 'All'
                ? 'Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!'
                : `Không có đơn hàng nào trong trạng thái "${statusLabels[selectedTab][0]}"`}
            </Typography>
          </Paper>
        ) : (
          <Stack
            spacing={2}
            sx={{
              opacity: 0,
              animation: 'fadeIn 0.3s ease-in-out forwards',
              '@keyframes fadeIn': {
                '0%': { opacity: 0, transform: 'translateY(10px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' }
              }
            }}
          >
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
            {hasMore && filteredOrders.length > 0 && (
              <Box display="flex" justifyContent="center" mt={3}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={loadMoreOrders}
                  disabled={loadingMore}
                  startIcon={loadingMore ? (
                    <CircularProgress
                      size={16}
                      sx={{
                        color: 'inherit',
                        '& .MuiCircularProgress-circle': {
                          strokeLinecap: 'round'
                        }
                      }}
                    />
                  ) : <KeyboardArrowDown />}
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: { xs: 2, sm: 3, md: 4 },
                    py: { xs: 1, sm: 1.5 },
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    width: { xs: '100%', sm: 'auto' },
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
        )
      }
    </Container >
  )
}

export default OrderListPage
