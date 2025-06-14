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
  Stack
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

  const [selectedProduct, setSelectedProduct] = useState(null)


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
    const productId = item.productId?._id
    if (!productId) return groups

    if (!groups[productId]) {
      groups[productId] = {
        productId,
        productName: item.productId?.name || 'Không xác định',
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
  // const allProductsReviewed = uniqueProducts.every(product => isReviewed(product.productId))

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
    setSelectedProduct(null)
  }


  const handleSubmitReview = async ({ rating, comment }) => {
    try {
      if (selectedProduct) {
        // Review specific product
        const productId = selectedProduct.productId
        const userId = currentUser?._id
        if (!productId || !userId) return

        const reviewId = reviewedMap[productId]
        if (reviewId) {
          // Update existing review
          await updateReview(reviewId, { rating, comment })
        } else {
          // Create new review
          const review = await createReview({ productId, userId, rating, comment, orderId })
          setReviewedMap(prev => ({ ...prev, [productId]: review._id }))
        }
      } else {
        // Review all unreviewed products in the order
        for (const product of uniqueProducts) {
          const productId = product.productId
          const userId = currentUser?._id
          if (!productId || !userId || isReviewed(productId)) continue

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

        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Địa Chỉ Nhận Hàng
        </Typography>

        <Typography fontWeight="bold" mb={1}>{order.shippingAddress?.fullName}</Typography>

        <Typography>
          (+84) {order.shippingAddress?.phone}
        </Typography>

        <Typography>
          {order.shippingAddress?.address}, {order.shippingAddress?.ward}, {order.shippingAddress?.district}, {order.shippingAddress?.city}
        </Typography>

        {order.note && (
          <Typography color="text.secondary">
            Ghi chú: {order.note}
          </Typography>
        )}

        <Divider sx={{ my: 2 }} />


        {/* <Typography fontWeight="bold" mb={1}>Sản phẩm đã mua:</Typography> */}

        {uniqueProducts.map((product) => {
          const productReviewed = isReviewed(product.productId)

          return (
            <Box key={product.productId} mb={3}>
              {/* Tên sản phẩm */}
              {/* <Typography fontWeight={600} fontSize="1.1rem" mb={1}>
                Sản phẩm: {product.productName}
              </Typography> */}

              {/* Danh sách biến thể */}
              {product.variants.map((variant, index) => (
                <Box key={variant._id}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    px={1}
                    py={1.5}
                    gap={2}
                  >
                    {/* Ảnh sản phẩm */}
                    <Avatar
                      src={variant?.color?.image || '/default.jpg'}
                      variant="square"
                      sx={{ width: 84, height: 84, borderRadius: 1 }}
                    />

                    {/* Thông tin sản phẩm và biến thể */}
                    <Box flex={1}>
                      <Typography fontWeight={500} >
                        {product.productName}
                      </Typography>
                      <Typography variant='body2' color="text.primary">
                        {variant.color?.name}, Size {variant.size}
                      </Typography>
                      <Typography variant='body2' fontWeight={500}>
                        x{variant.quantity}
                      </Typography>
                    </Box>

                    {/* Giá tiền */}
                    <Box textAlign="right" minWidth={100}>
                      <Typography variant="body2" fontWeight={600}>
                        {formatPrice(variant.price * variant.quantity)}
                      </Typography>
                      {variant.originalPrice > variant.price && (
                        <Typography
                          variant="body2"
                          color="text.disabled"
                          sx={{ textDecoration: 'line-through', fontSize: '0.85rem' }}
                        >
                          {formatPrice(variant.originalPrice * variant.quantity)}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* Divider sau mỗi biến thể, trừ cái cuối */}
                  {index < product.variants.length - 1 && <Divider />}
                </Box>
              ))}

              {/* Nút hành động */}
              <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
                {isOrderCompleted && currentUser && (
                  <Button
                    variant="contained"
                    size="medium"
                    sx={{
                      backgroundColor: '#1A3C7B',
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: '#162f63',
                      },
                    }}
                    onClick={() => {
                      setSelectedProduct(product);
                      setOpenReviewModal(true);
                    }}
                  >
                    {productReviewed ? 'Sửa đánh giá' : 'Đánh giá'}
                  </Button>
                )}

                <Button
                  variant="outlined"
                  size="medium"
                  sx={{
                    color: '#1A3C7B',
                    borderColor: '#1A3C7B',
                    '&:hover': {
                      borderColor: '#1A3C7B',
                      backgroundColor: 'rgba(26, 60, 123, 0.04)', // nhẹ khi hover
                    },
                  }}
                  onClick={() => navigate(`/productdetail/${product.productId}`)}
                >
                  Mua lại
                </Button>
              </Box>


              {/* Divider giữa các sản phẩm */}
              {uniqueProducts.indexOf(product) < uniqueProducts.length - 1 && (
                <Divider sx={{ mt: 3 }} />
              )}
            </Box>
          )
        })}


        <Divider sx={{ my: 2 }} />
        
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography fontWeight="bold">Tổng tiền hàng:</Typography>
          <Typography fontWeight={600}>{formatPrice(totalProductsPrice)}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography fontWeight="bold">Phí vận chuyển:</Typography>
          <Typography fontWeight={600}>{formatPrice(order.shippingFee || 0)}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography fontWeight="bold">Mã giảm giá:</Typography>
          <Typography fontWeight={600} color={order.couponId ? 'error' : 'inherit'}>
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
        orderItems={selectedProduct ? selectedProduct.variants : items} // chỉ truyền variants của sản phẩm đang chọn
        products={selectedProduct ? [selectedProduct] : uniqueProducts}
      />

    </Box>
  )
}

export default OrderDetail