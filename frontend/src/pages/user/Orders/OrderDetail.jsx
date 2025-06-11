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
  const [selectedItem, setSelectedItem] = useState(null)
  const [reviewedMap, setReviewedMap] = useState({})

  useEffect(() => {
    const fetchUserReviews = async () => {
      if (!currentUser?._id) return
      try {
        const reviews = await getUserReviews(currentUser._id)
        const map = {}
        reviews.forEach(r => {
          const productId = r.productId
          map[productId] = r._id // lưu review mới nhất
        })
        setReviewedMap(map)
      } catch (err) {
        console.error('Lỗi khi lấy đánh giá người dùng:', err)
      }
    }
    fetchUserReviews()
  }, [currentUser])

  const isReviewed = (productId) =>
    Object.prototype.hasOwnProperty.call(reviewedMap, productId?.toString());
  const allReviewed = items.every(item => isReviewed(item.productId || item.product?._id))

  if (loading) return <CircularProgress />
  if (error) return <Typography color="error">Lỗi: {error.message || 'Có lỗi xảy ra'}</Typography>
  if (!order) return <Typography>Không tìm thấy đơn hàng</Typography>

  const [label, color] = statusLabels[order.status] || ['Không xác định', 'default']
  const totalProductsPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const uniqueProductIds = [...new Set(items.map(i => i.productId || i.product?._id))]
  const isSingleProduct = uniqueProductIds.length === 1
  const formatPrice = (val) => typeof val === 'number' ? val.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '0₫'

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
    setSelectedItem(null)
  }

  const handleSubmitReview = async ({ rating, comment }) => {
    try {
      const productsToReview = selectedItem ? [selectedItem] : items

      for (const item of productsToReview) {
        const productId = item.productId || item.product?._id
        const userId = currentUser?._id
        if (!productId || !userId) continue

        const reviewId = reviewedMap[productId]
        if (reviewId) {
          await updateReview(reviewId, { rating, comment })
        } else {
          const review = await createReview({ productId, userId, rating, comment, orderId })
          setReviewedMap(prev => ({ ...prev, [productId]: review._id }))
        }
      }

      handleCloseModal()
      setSnackbarOpen(true)
    } catch (error) {
      console.error('Lỗi gửi đánh giá:', error)
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
        {items.map((item) => {
          const productId = item.productId || item.product?._id
          return (
            <Box key={item._id} mb={2} display="flex" gap={2} alignItems="center">
              <Avatar
                src={item.color?.image || '/default.jpg'}
                variant="square"
                sx={{ width: 64, height: 64, borderRadius: 1 }}
              />
              <Box flex={1}>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Phân loại: {item.color?.name}, {item.size} - x{item.quantity}
                </Typography>
                <Typography variant="body1">{formatPrice(item.price)}</Typography>
                {item.originalPrice > item.price && (
                  <Typography variant="body2" sx={{ textDecoration: 'line-through' }}>
                    {formatPrice(item.originalPrice)}
                  </Typography>
                )}
              </Box>
              {isOrderCompleted && (
                isReviewed(productId) ? (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setSelectedItem(item)
                      setOpenReviewModal(true)
                    }}
                  >
                    Đánh giá lại
                  </Button>
                ) : (
                  !isSingleProduct && (
                    <Button variant="outlined" size="small" onClick={() => {
                      setSelectedItem(item)
                      setOpenReviewModal(true)
                    }}>Đánh giá</Button>
                  )
                )
              )}
              {isReviewed(productId) && (
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  onClick={() => navigate(`/productdetail/${productId}`)}
                >
                  Mua ngay
                </Button>
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

      {isOrderCompleted && currentUser && isSingleProduct && !allReviewed && (
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
            variant="contained"
            onClick={() => {
              setSelectedItem(null)
              setOpenReviewModal(true)
            }}
          >
            Đánh giá sản phẩm
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

      {isOrderCancellable && (
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button variant="contained" color="warning" onClick={handleCancelOrder}>
            Hủy đơn hàng
          </Button>
        </Box>
      )}

      <ReviewModal
        open={openReviewModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitReview}
        orderItems={selectedItem ? [selectedItem] : items}
      />
    </Box>
  )
}

export default OrderDetail
