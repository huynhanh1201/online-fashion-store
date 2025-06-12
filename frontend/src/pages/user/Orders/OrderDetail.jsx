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
  Alert
} from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useOrderDetail } from '~/hooks/useOrderDetail'
import ReviewModal from './modal/ReviewModal'
import { createReview, getUserReviews, updateReview } from '~/services/reviewService'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

const statusLabels = {
  Pending: ['Đang chờ', 'warning'],
  Processing: ['Đang xử lý', 'info'],
  Shipped: ['Đã gửi hàng', 'primary'],
  Delivered: ['Đã giao', 'success'],
  Cancelled: ['Đã hủy', 'error'],
}

const OrderDetail = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { order, items, loading, error } = useOrderDetail(orderId)
  const currentUser = useSelector(selectCurrentUser)

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [openReviewModal, setOpenReviewModal] = useState(false)
  const [reviewedMap, setReviewedMap] = useState({})

  useEffect(() => {
    const fetchUserReviews = async () => {
      if (!currentUser?._id) return
      try {
        const reviews = await getUserReviews(currentUser._id)
        const map = {}
        reviews.forEach(r => {
          const productId = r.productId
          map[productId] = r._id
        })
        setReviewedMap(map)
      } catch (err) {
        console.error('Lỗi khi lấy đánh giá người dùng:', err)
      }
    }
    fetchUserReviews()
  }, [currentUser])

  if (loading) return <CircularProgress />
  if (error) return <Typography color="error">Lỗi: {error.message || 'Có lỗi xảy ra'}</Typography>
  if (!order) return <Typography>Không tìm thấy đơn hàng</Typography>

  const [label, color] = statusLabels[order.status] || ['Không xác định', 'default']
  const totalProductsPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const formatPrice = (val) => typeof val === 'number' ? val.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '0₫'

  // Group items by product ID to handle variants
  const productGroups = items.reduce((groups, item) => {
    const productId = item.productId || item.product?._id
    if (!groups[productId]) {
      groups[productId] = {
        productId,
        productName: item.product?.name || item.productName || item.name,
        variants: [],
        totalQuantity: 0,
        totalPrice: 0
      }
    }
    groups[productId].variants.push(item)
    groups[productId].totalQuantity += item.quantity
    groups[productId].totalPrice += item.price * item.quantity
    return groups
  }, {})

  const uniqueProducts = Object.values(productGroups)
  const isReviewed = (productId) => Object.prototype.hasOwnProperty.call(reviewedMap, productId?.toString())
  const allProductsReviewed = uniqueProducts.every(product => isReviewed(product.productId))
  
  const isPaid = order.paymentStatus === 'paid'
  const isOrderCompleted = order.status === 'Delivered'
  const isOrderCancellable = ['Pending', 'Processing'].includes(order.status) && !isPaid

  const handleCancelOrder = async () => {
    try {
      console.log('Hủy đơn hàng:', orderId)
      navigate('/orders')
    } catch (err) {
      console.error('Lỗi khi hủy đơn hàng:', err)
    }
  }

  const handleCloseModal = () => {
    setOpenReviewModal(false)
  }

  const handleSubmitReview = async ({ rating, comment }) => {
    try {
      // Review all unreviewed products in the order
      for (const product of uniqueProducts) {
        const productId = product.productId
        const userId = currentUser?._id
        if (!productId || !userId || isReviewed(productId)) continue

        const review = await createReview({ productId, userId, rating, comment, orderId })
        setReviewedMap(prev => ({ ...prev, [productId]: review._id }))
      }

      handleCloseModal()
      setSnackbarOpen(true)
    } catch (error) {
      console.error('Lỗi gửi đánh giá:', error)
    }
  }

  const handleUpdateReview = async (productId, { rating, comment }) => {
    try {
      const reviewId = reviewedMap[productId]
      if (reviewId) {
        await updateReview(reviewId, { rating, comment })
        setSnackbarOpen(true)
      }
    } catch (error) {
      console.error('Lỗi cập nhật đánh giá:', error)
    }
  }

  return (
    <Box maxWidth="lg" mx="auto" p={2} sx={{ minHeight: '70vh' }}>
      <Paper sx={{ p: 2 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <IconButton onClick={() => navigate(-1)} aria-label="Quay lại">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" fontWeight="bold" ml={1}>Đơn hàng: {order.code}</Typography>
          <Chip label={label} color={color} sx={{ ml: 'auto' }} />
        </Box>

        <Typography fontWeight="bold">Thông tin người nhận:</Typography>
        <Typography>{order.shippingAddress?.fullName} - {order.shippingAddress?.phone}</Typography>
        <Typography>{order.shippingAddress?.address}, {order.shippingAddress?.ward}, {order.shippingAddress?.district}, {order.shippingAddress?.city}</Typography>

        <Divider sx={{ my: 2 }} />

        <Typography fontWeight="bold" mb={1}>Sản phẩm đã mua:</Typography>
        {uniqueProducts.map((product) => {
          const firstVariant = product.variants[0]
          const hasMultipleVariants = product.variants.length > 1
          const productReviewed = isReviewed(product.productId)
          
          return (
            <Box key={product.productId} mb={2}>
              {/* Product header */}
              <Box display="flex" gap={2} alignItems="flex-start" mb={1}>
                <Avatar
                  src={firstVariant.color?.image || '/default.jpg'}
                  variant="square"
                  sx={{ width: 64, height: 64, borderRadius: 1 }}
                />
                <Box flex={1}>
                  <Typography variant="h6" mb={1}>{product.productName}</Typography>
                  
                  {/* Show variants */}
                  {product.variants.map((variant, index) => (
                    <Box key={variant._id} mb={0.5}>
                      <Typography variant="body2" color="text.secondary">
                        {hasMultipleVariants && `Loại ${index + 1}: `}
                        {variant.color?.name}, {variant.size} - x{variant.quantity} = {formatPrice(variant.price * variant.quantity)}
                      </Typography>
                      {variant.originalPrice > variant.price && (
                        <Typography variant="body2" sx={{ textDecoration: 'line-through', ml: hasMultipleVariants ? 2 : 0 }}>
                          {formatPrice(variant.originalPrice * variant.quantity)}
                        </Typography>
                      )}
                    </Box>
                  ))}
                  
                  {hasMultipleVariants && (
                    <Typography variant="body1" fontWeight="bold" mt={1}>
                      Tổng: {formatPrice(product.totalPrice)} ({product.totalQuantity} sản phẩm)
                    </Typography>
                  )}
                </Box>

                {/* Action buttons */}
                <Box display="flex" flexDirection="column" gap={1} alignItems="flex-end">
                  {isOrderCompleted && currentUser && (
                    <>
                      {productReviewed ? (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            // Handle individual product review update
                            setOpenReviewModal(true)
                          }}
                        >
                          Sửa đánh giá
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            // Handle individual product review
                            setOpenReviewModal(true)
                          }}
                        >
                          Đánh giá
                        </Button>
                      )}
                    </>
                  )}
                  
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/productdetail/${product.productId}`)}
                  >
                    Mua lại
                  </Button>
                </Box>
              </Box>
              
              {/* Divider between products */}
              {uniqueProducts.indexOf(product) < uniqueProducts.length - 1 && (
                <Divider sx={{ mt: 2 }} />
              )}
            </Box>
          )
        })}

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography fontWeight="bold">Tổng tiền hàng:</Typography>
          <Typography>{formatPrice(totalProductsPrice)}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography fontWeight="bold">Phí vận chuyển:</Typography>
          <Typography>{formatPrice(order.shippingFee || 0)}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography fontWeight="bold">Mã giảm giá:</Typography>
          <Typography color={order.couponId ? 'error' : 'inherit'}>
            {formatPrice(order.discountAmount || 0)}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography fontWeight="bold">Thành tiền:</Typography>
          <Typography fontWeight="bold" variant="h5">
            {formatPrice(order.total)}
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

      {/* Global review button - only show if order is completed and there are unreviewed products */}
      {isOrderCompleted && currentUser && !allProductsReviewed && (
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
            variant="contained"
            onClick={() => setOpenReviewModal(true)}
          >
            Đánh giá tất cả sản phẩm
          </Button>
        </Box>
      )}

      {/* Cancel order button */}
      {isOrderCancellable && (
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button variant="contained" color="warning" onClick={handleCancelOrder}>
            Hủy đơn hàng
          </Button>
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          Cảm ơn bạn đã đánh giá!
        </Alert>
      </Snackbar>

      <ReviewModal
        open={openReviewModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitReview}
        orderItems={items}
        products={uniqueProducts}
      />
    </Box>
  )
}

export default OrderDetail