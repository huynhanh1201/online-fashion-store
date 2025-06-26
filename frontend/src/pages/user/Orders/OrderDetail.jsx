/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Divider,
  Chip,
  CircularProgress,
  Avatar,
  IconButton,
  Button,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Cancel, Warning, Replay } from '@mui/icons-material'
import { useOrderDetail } from '~/hooks/useOrderDetail'
import { useOrder } from '~/hooks/useOrder'
import { useCart } from '~/hooks/useCarts'
import ReviewModal from './modal/ReviewModal'
import ViewReviewModal from './modal/ViewReviewModal'
import { createReview, getUserReviews } from '~/services/reviewService'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary'

const statusLabels = {
  Processing: ['Đang xử lý', 'info'],
  Shipped: ['Đã gửi hàng', 'primary'],
  Shipping: ['Đang giao hàng', 'primary'],
  Delivered: ['Đã giao', 'success'],
  Cancelled: ['Đã hủy', 'error'],
  Failed: ['Thanh toán thất bại', 'error'],
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

const OrderDetail = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { order, items, loading, error } = useOrderDetail(orderId)
  const { cancelOrder } = useOrder()
  const { addToCart, refresh: refreshCart } = useCart()
  const currentUser = useSelector(selectCurrentUser)

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [openReviewModal, setOpenReviewModal] = useState(false)
  const [openViewReviewModal, setOpenViewReviewModal] = useState(false)
  const [reviewedProducts, setReviewedProducts] = useState(new Set())     // Track which products are reviewed
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [openCancelModal, setOpenCancelModal] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [reorderLoading, setReorderLoading] = useState(false)

  useEffect(() => {
    const fetchUserReviews = async () => {
      if (!currentUser?._id || !orderId) return
      try {
        const reviews = await getUserReviews(currentUser._id)
        // Check which products in this order have been reviewed
        const reviewedProductsInOrder = reviews
          .filter((review) => review.orderId === orderId)
          .map((review) => review.productId)
        setReviewedProducts(new Set(reviewedProductsInOrder))
      } catch (err) {
        console.error('Lỗi khi lấy đánh giá người dùng:', err)
      }
    }
    fetchUserReviews()
  }, [currentUser, orderId])
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  if (loading) return <CircularProgress />
  if (error) return <Typography color="error">Lỗi: {error.message || 'Có lỗi xảy ra'}</Typography>
  if (!order) return <Typography>Không tìm thấy đơn hàng</Typography>

  const [label, color] = statusLabels[order.status] || ['Không xác định', 'default']
  const totalProductsPrice = items.reduce((sum, item) => {
    const actualPrice = item.variantId?.discountPrice > 0
      ? item.price - item.variantId.discountPrice
      : item.price
    return sum + actualPrice * item.quantity
  }, 0)
  const formatPrice = (val) => (typeof val === 'number' ? val.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '0₫')

  // Helper functions for formatting color and size
  const capitalizeFirstLetter = (str) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  const formatSize = (str) => {
    if (!str) return ''
    return str.toUpperCase()
  }

  // Group items by product ID to handle variants
  const productGroups = items.reduce((groups, item) => {
    const productId = item.productId?._id
    if (!productId) return groups

    if (!groups[productId]) {
      groups[productId] = {
        productId,
        productName: item.productId?.name || 'Không xác định',
        variants: [],
        totalQuantity: 0,
        totalPrice: 0,
      }
    }

    groups[productId].variants.push(item)
    groups[productId].totalQuantity += item.quantity
    const actualPrice = item.variantId?.discountPrice > 0
      ? item.price - item.variantId.discountPrice
      : item.price
    groups[productId].totalPrice += actualPrice * item.quantity
    return groups
  }, {})

  const uniqueProducts = Object.values(productGroups)
  const isOrderCompleted = order.status === 'Delivered'
  const isOrderCancellable = ['Pending', 'Processing'].includes(order.status) && order.paymentStatus !== 'paid'

  const handleCancelOrder = async () => {
    setCancelling(true)
    try {
      await cancelOrder(orderId)
      console.log('Đã hủy đơn hàng:', orderId)
      setOpenCancelModal(false)
      // Refresh page or navigate back to orders list
      navigate('/orders')
    } catch (error) {
      console.error('Lỗi khi hủy đơn hàng:', error)
      // You can show a snackbar or toast here instead of alert
    } finally {
      setCancelling(false)
    }
  }

  const handleCloseModal = () => {
    setOpenReviewModal(false)
    setSelectedProduct(null)
  }

  const handleCloseViewReviewModal = () => {
    setOpenViewReviewModal(false)
    setSelectedProduct(null)
  }

  const handleSubmitReview = async (reviewData) => {
    try {
      const productId = selectedProduct?.productId
      if (reviewedProducts.has(productId)) {
        console.error('Sản phẩm này đã được đánh giá.')
        return
      }

      console.log('Review data received:', reviewData)
      console.log('Current user ID:', currentUser?._id)
      console.log('Order ID:', orderId)
      console.log('Product ID:', productId)

      // Gửi đánh giá với payload đầy đủ
      await createReview(reviewData)

      // Mark this specific product as reviewed
      setReviewedProducts(prev => new Set([...prev, productId]))
      handleCloseModal()
      setSnackbarOpen(true)
    } catch (error) {
      console.error('Lỗi gửi đánh giá:', error)
      console.error('Error details:', error)
    }
  }

  // Handle reorder - thêm tất cả items vào giỏ hàng
  const handleReorder = async () => {
    try {
      setReorderLoading(true)
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
      setReorderLoading(false)
    }
  }

  return (
    <Box maxWidth="lg" mx="auto" p={3} sx={{ minHeight: '70vh' }}>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header - similar to OrderListPage */}
          <Box display="flex" alignItems="center" mb={3}>
            <IconButton
              onClick={() => navigate(-1)}
              aria-label="Quay lại"
              sx={{
                mr: 2,
                backgroundColor: 'grey.100',
                '&:hover': { backgroundColor: 'grey.200' }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h6"
              fontWeight="600"
              sx={{ color: '#1a3c7b' }}
            >
              #{order.code}
            </Typography>
            <Typography variant="body2" color="text.secondary" ml={2}>
              {new Date(order.createdAt).toLocaleDateString('vi-VN')}
            </Typography>
            <Chip
              label={label}
              color={color === 'default' ? undefined : color}
              sx={{
                ml: 'auto',
                fontWeight: 600,
                fontSize: '0.75rem',
                height: 32
              }}
            />
          </Box>

          {/* Shipping Address Section */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: 'grey.50',
              border: '1px solid',
              borderColor: 'grey.200',
              mb: 3
            }}
          >
            <Typography variant="h6" fontWeight="600" color="#1a3c7b" gutterBottom>
              Địa Chỉ Nhận Hàng
            </Typography>
            <Stack spacing={1}>
              <Typography fontWeight="600" fontSize="1.1rem">
                {order.shippingAddress?.fullName}
              </Typography>
              <Typography color="text.secondary">
                (+84) {order.shippingAddress?.phone}
              </Typography>
              <Typography color="text.secondary">
                {order.shippingAddress?.address}, {order.shippingAddress?.ward}, {order.shippingAddress?.district}, {order.shippingAddress?.city}
              </Typography>
              {order.note && (
                <Typography color="text.secondary" fontStyle="italic">
                  Ghi chú: {order.note}
                </Typography>
              )}
            </Stack>
          </Box>

          {/* Products Section - similar to OrderListPage */}
          <Stack spacing={2}>
            {uniqueProducts.map((product, index) => (
              <Box key={product.productId}>
                {product.variants.map((variant, variantIndex) => (
                  <Box key={variant._id}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: variantIndex % 2 === 0 ? 'transparent' : 'grey.50',
                        border: '1px solid',
                        borderColor: 'grey.200',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: 'grey.100',
                          borderColor: '#1a3c7b',
                          transform: 'translateX(4px)'
                        }
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar
                            src={optimizeCloudinaryUrl(variant?.color?.image) || '/images/default.jpg'}
                            alt={variant.name}
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
                              {product.productName}
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 0.5 }}
                            >
                              {capitalizeFirstLetter(variant.color?.name)}, {formatSize(variant.size)}
                            </Typography>
                            <Chip
                              label={`Số lượng: ${variant.quantity}`}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem', height: 20 }}
                            />
                          </Box>
                        </Box>

                        <Box textAlign="right">
                          {variant.variantId?.discountPrice > 0 ? (
                            <Box display="flex" flexDirection="column" alignItems="flex-end" gap={0.5}>
                              <Typography
                                fontWeight={700}
                                fontSize="1.2rem"
                                color="#1a3c7b"
                              >
                                {formatPrice((variant.price - variant.variantId.discountPrice))}
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
                                  {formatPrice(variant.price)}
                                </Typography>
                              </Box>
                            </Box>
                          ) : (
                            <Typography
                              fontWeight={700}
                              fontSize="1.2rem"
                              color="#1a3c7b"
                            >
                              {formatPrice(variant.price * variant.quantity)}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </Box>
                    {variantIndex < product.variants.length - 1 && (
                      <Divider sx={{ my: 1 }} />
                    )}
                  </Box>
                ))}

                {/* Action Buttons */}
                <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                  {isOrderCompleted && currentUser && !reviewedProducts.has(product.productId) && (
                    <Button
                      variant="contained"
                      size="medium"
                      sx={{
                        backgroundColor: '#1A3C7B',
                        color: '#fff',
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: '#162f63',
                          boxShadow: '0 4px 12px rgba(26, 60, 123, 0.3)'
                        },
                      }}
                      onClick={() => {
                        setSelectedProduct(product)
                        setOpenReviewModal(true)
                      }}
                    >
                      Đánh giá
                    </Button>
                  )}

                  {isOrderCompleted && currentUser && reviewedProducts.has(product.productId) && (
                    <Button
                      variant="outlined"
                      size="medium"
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        color: 'success.main',
                        borderColor: 'success.main',
                        '&:hover': {
                          backgroundColor: 'success.50',
                          borderColor: 'success.main'
                        }
                      }}
                      onClick={() => {
                        setSelectedProduct(product)
                        setOpenViewReviewModal(true)
                      }}
                    >
                      ✓ Xem đánh giá
                    </Button>
                  )}

                </Box>

                {index < uniqueProducts.length - 1 && <Divider sx={{ my: 3 }} />}
              </Box>
            ))}
          </Stack>

          {/* Order Summary - similar to OrderListPage style */}
          <Divider sx={{ my: 3 }} />

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: 'primary.50',
            }}
          >
            <Typography variant="h6" fontWeight="600" mb={2}>
              Tóm tắt đơn hàng
            </Typography>

            <Stack spacing={1.5}>
              <Box display="flex" justifyContent="space-between">
                <Typography>Tổng tiền hàng:</Typography>
                <Typography fontWeight={600}>{formatPrice(totalProductsPrice)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>Phí vận chuyển:</Typography>
                <Typography fontWeight={600}>{formatPrice(order.shippingFee || 0)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography>Giảm giá:</Typography>
                <Typography fontWeight={600} color={order.couponId ? 'error' : 'inherit'}>
                  {formatPrice(order.discountAmount || 0)}
                </Typography>
              </Box>
              <Divider />
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight="600">
                  Tổng cộng:
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight="700"
                  sx={{ color: '#1a3c7b' }}
                >
                  {formatPrice(order.total)}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mt={1}>
                <Typography fontWeight="600">Phương thức thanh toán:</Typography>
                <Typography fontWeight={600}>
                  {order.paymentMethod?.toLowerCase() === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'VNPay'}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* Cancel Order Button */}
      {isOrderCancellable && (
        <Card sx={{
          mt: 2,
          px: 3,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255, 152, 0, 0.2)'
        }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h6" fontWeight="600" color="#1a3c7b">
                  Hủy đơn hàng
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Bạn có thể hủy đơn hàng này vì chưa thanh toán
                </Typography>
              </Box>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Cancel />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
                onClick={() => setOpenCancelModal(true)}
              >
                Hủy đơn
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Reorder Button - for completed, failed, or cancelled orders */}
      {(order?.status === 'Delivered' || order?.status === 'Failed' || order?.status === 'Cancelled') && (
        <Card sx={{
          mt: 2,
          px: 3,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(26, 60, 123, 0.2)'
        }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h6" fontWeight="600" color="#1a3c7b">
                  Mua lại đơn hàng
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Thêm tất cả sản phẩm từ đơn hàng này vào giỏ hàng
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={reorderLoading ? <CircularProgress size={16} /> : <Replay />}
                disabled={reorderLoading}
                onClick={handleReorder}
                sx={{
                  backgroundColor: '#1a3c7b',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  opacity: reorderLoading ? 0.7 : 1,
                  '&:hover': {
                    backgroundColor: '#162f63',
                  }
                }}
              >
                {reorderLoading ? 'Đang thêm vào giỏ...' : 'Mua lại'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{
            width: '100%',
            borderRadius: 2,
            fontWeight: 600
          }}
        >
          Cảm ơn bạn đã đánh giá!
        </Alert>
      </Snackbar>

      <ReviewModal
        open={openReviewModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitReview}
        orderItems={selectedProduct ? selectedProduct.variants : items}
        productId={selectedProduct?.productId || uniqueProducts[0]?.productId}
        userId={currentUser?._id}
        orderId={orderId}
      />

      {/* View Review Modal */}
      <ViewReviewModal
        open={openViewReviewModal}
        onClose={handleCloseViewReviewModal}
        userId={currentUser?._id}
        productId={selectedProduct?.productId}
        orderId={orderId}
        productName={selectedProduct?.productName}
      />

      {/* Cancel Order Modal */}
      <CancelOrderModal
        open={openCancelModal}
        onClose={() => setOpenCancelModal(false)}
        onConfirm={handleCancelOrder}
        order={order}
        loading={cancelling}
      />
    </Box>
  )
}

export default OrderDetail    