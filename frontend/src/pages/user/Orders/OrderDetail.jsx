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
import { createReview, getUserReviews, getUserReviewForProduct } from '~/services/reviewService'
import { getVariantById } from '~/services/variantService'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { setReorderVariantIds } from '~/redux/cart/cartSlice'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary'

const statusLabels = {
  Processing: ['Đang xử lý', 'info'],
  Shipped: ['Đã gửi hàng', 'primary'],
  Shipping: ['Đang giao hàng', 'primary'],
  Delivered: ['Đã giao', 'success'],
  Cancelled: ['Đã hủy', 'error'],
  Failed: ['Thanh toán thất bại', 'error'],
}

// Review Button Component with fallback check
const ReviewButtonComponent = ({
  product,
  reviewedProducts,
  setReviewedProducts,
  reviewsLoading,
  isOrderCompleted,
  currentUser,
  setSelectedProduct,
  setOpenReviewModal,
  setOpenViewReviewModal,
  checkProductReview
}) => {
  const [checking, setChecking] = useState(false)
  const [isReviewed, setIsReviewed] = useState(null) // null = chưa xác định, true/false = đã xác định

  useEffect(() => {
    // Chỉ cập nhật khi không đang loading
    if (!reviewsLoading) {
      const productIdString = product.productId?.toString() || product.productId
      const wasReviewed = reviewedProducts.has(productIdString)
      console.log(`Product ${productIdString} - isReviewed:`, wasReviewed)
      setIsReviewed(wasReviewed)
    }
  }, [reviewedProducts, product.productId, reviewsLoading])

  // Kiểm tra và xử lý click đánh giá
  const handleReviewClick = async () => {
    const productIdString = product.productId?.toString() || product.productId
    console.log('handleReviewClick: Started', {
      productId: productIdString,
      isReviewed,
      checking
    })
    setSelectedProduct(product)

    if (!isReviewed && !checking && isReviewed !== null) {
      setChecking(true)
      console.log('handleReviewClick: Checking with server for orderId and productId...')

      // Double-check với server để đảm bảo chính xác theo orderId cụ thể
      const hasReview = await checkProductReview(productIdString)
      console.log('handleReviewClick: Server check result for this order:', hasReview)

      if (hasReview) {
        // Nếu đã có đánh giá cho đơn hàng này, cập nhật state và hiển thị modal xem đánh giá
        console.log('handleReviewClick: Product already reviewed for this order, updating state')
        setIsReviewed(true)
        setReviewedProducts(prev => new Set([...prev, productIdString]))
        setOpenViewReviewModal(true)
      } else {
        // Nếu chưa có đánh giá cho đơn hàng này, mở modal để đánh giá
        console.log('handleReviewClick: Product not reviewed for this order, opening review modal')
        setOpenReviewModal(true)
      }
      setChecking(false)
    } else if (isReviewed) {
      // Nếu đã đánh giá, mở modal xem đánh giá
      console.log('handleReviewClick: Product already reviewed for this order, opening view modal')
      setOpenViewReviewModal(true)
    }
  }

  // Hiển thị loading khi đang fetch hoặc chưa xác định trạng thái
  if (reviewsLoading || !isOrderCompleted || !currentUser || isReviewed === null) {
    return (reviewsLoading || isReviewed === null) && isOrderCompleted && currentUser ? <CircularProgress size={20} /> : null
  }

  return (
    <Button
      variant={isReviewed ? "outlined" : "contained"}
      size="medium"
      disabled={checking || isReviewed === null}
      sx={isReviewed ? {
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 600,
        color: 'var(--accent-color)',
        borderColor: 'success.main',
        '&:hover': {
          backgroundColor: 'var(--accent-color)',
          borderColor: 'success.main'
        }
      } : {
        backgroundColor: 'var(--primary-color)',
        color: '#fff',
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 600,
        '&:hover': {
          backgroundColor: 'var(--accent-color)',
          boxShadow: '0 4px 12px rgba(26, 60, 123, 0.3)'
        },
      }}
      onClick={(e) => {
        e.stopPropagation()
        handleReviewClick()
      }}
      startIcon={checking ? <CircularProgress size={16} /> : null}
    >
      {checking ? 'Kiểm tra...' : isReviewed === null ? 'Đang tải...' : isReviewed ? 'Xem đánh giá' : 'Đánh giá'}
    </Button>
  )
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
  const { addToCart, refresh: refreshCart, cart } = useCart()
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [openReviewModal, setOpenReviewModal] = useState(false)
  const [openViewReviewModal, setOpenViewReviewModal] = useState(false)
  const [reviewedProducts, setReviewedProducts] = useState(new Set())     // Track which products are reviewed
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [openCancelModal, setOpenCancelModal] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [reorderLoading, setReorderLoading] = useState(false)
  const [reviewsLoading, setReviewsLoading] = useState(true) // Loading state for reviews

  // Function to check if a specific product has been reviewed for THIS ORDER
  // Kiểm tra chính xác theo orderID để đảm bảo không duplicate review trong cùng 1 đơn hàng
  const checkProductReview = async (productId) => {
    if (!currentUser?._id || !orderId || !productId) {
      console.log('checkProductReview: Missing required data', { userId: currentUser?._id, orderId, productId })
      return false
    }

    try {
      console.log('checkProductReview: Calling API for', { userId: currentUser._id, productId, orderId })
      const reviews = await getUserReviewForProduct(currentUser._id, productId, orderId)

      // Kiểm tra chính xác orderId trong từng review để đảm bảo chính xác
      const hasReviewForThisOrder = reviews && reviews.some(review => {
        const reviewOrderId = review.orderId?.toString() || review.orderId
        // Lấy productId từ object hoặc string
        const reviewProductId = review.productId?._id || review.productId?.id || review.productId
        const currentOrderId = orderId?.toString() || orderId
        const currentProductId = productId?.toString() || productId
        return reviewOrderId === currentOrderId && (reviewProductId?.toString() || reviewProductId) === currentProductId
      })

      console.log('checkProductReview: API response', {
        reviews,
        hasReviewForThisOrder,
        orderId,
        productId
      })
      return hasReviewForThisOrder
    } catch (error) {
      console.error('Error checking product review:', error)
      return false
    }
  }

  useEffect(() => {
    const fetchUserReviews = async () => {
      // Chỉ fetch khi có đầy đủ thông tin cần thiết
      if (!currentUser?._id || !orderId || !order) {
        setReviewsLoading(false)
        return
      }

      setReviewsLoading(true)
      try {
        const reviews = await getUserReviews(currentUser._id)

        // Check which products in this order have been reviewed
        // Filter theo chính xác orderID để tránh conflict với review từ order khác
        const reviewedProductsInOrder = reviews
          .filter((review) => {
            // Đảm bảo so sánh chính xác orderId (có thể là string hoặc ObjectId)
            const reviewOrderId = review.orderId?.toString() || review.orderId
            const currentOrderId = orderId?.toString() || orderId
            return reviewOrderId === currentOrderId
          })
          .map((review) => {
            // Lấy productId từ object hoặc string
            const productId = review.productId?._id || review.productId?.id || review.productId
            return productId?.toString() || productId
          })

        setReviewedProducts(new Set(reviewedProductsInOrder))

        console.log(`Order ${orderId}: Found ${reviewedProductsInOrder.length} reviewed products:`, reviewedProductsInOrder)
      } catch (err) {
        console.error('Lỗi khi lấy đánh giá người dùng:', err)
        setReviewedProducts(new Set()) // Set empty set on error
      } finally {
        setReviewsLoading(false)
      }
    }
    fetchUserReviews()
  }, [currentUser, orderId, order]) // Thêm order vào dependencies
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
  const formatPrice = (val) => (typeof val === 'number' ? val.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '0 ₫')

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
      const productId = selectedProduct?.productId?.toString() || selectedProduct?.productId

      // Kiểm tra đầy đủ trước khi gửi đánh giá
      if (!productId || !orderId || !currentUser?._id) {
        console.error('Thiếu thông tin cần thiết để đánh giá.')
        handleCloseModal()
        return
      }

      // Double-check với server trước khi gửi đánh giá theo orderId cụ thể
      const hasExistingReview = await checkProductReview(productId)
      if (hasExistingReview) {
        console.error(`Sản phẩm ${productId} đã được đánh giá trong đơn hàng ${orderId}.`)
        // Cập nhật state và đóng modal
        setReviewedProducts(prev => new Set([...prev, productId]))
        setSnackbarOpen(true)
        handleCloseModal()
        return
      }

      // Kiểm tra state local
      if (reviewedProducts.has(productId)) {
        console.error('Sản phẩm này đã được đánh giá.')
        setSnackbarOpen(true)
        handleCloseModal()
        return
      }

      // Gửi đánh giá với payload đầy đủ
      const result = await createReview(reviewData)

      if (result) {
        // Mark this specific product as reviewed ngay lập tức
        console.log('handleSubmitReview: Review submitted successfully, updating state for productId:', productId)
        setReviewedProducts(prev => {
          const newSet = new Set([...prev, productId])
          console.log('handleSubmitReview: Updated reviewedProducts:', newSet)
          return newSet
        })
        handleCloseModal()
        setSnackbarOpen(true)
      }
    } catch (error) {
      console.error('Lỗi gửi đánh giá:', error)
      // Hiển thị lỗi cho user nếu cần
      if (error?.message?.includes('đã được đánh giá') || error?.message?.includes('already reviewed')) {
        // Nếu server báo đã được đánh giá, cập nhật state
        const productId = selectedProduct?.productId
        if (productId) {
          setReviewedProducts(prev => new Set([...prev, productId]))
        }
      }
      handleCloseModal()
    }
  }

  // Handle reorder - logic đơn giản: nếu có trong giỏ thì bỏ qua, nếu hết hàng thì gửi quantity = 0
  const handleReorder = async () => {
    try {
      setReorderLoading(true)

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
          const variantInfo = await getVariantId(variantId)

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
            console.log(`Item ${item.productId?.name || item.name} is out of stock, adding with quantity = 0`)
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
            console.log(`Item ${item.productId?.name || item.name} reached max quantity in cart (${currentQuantityInCart}/${availableQuantity}), skipping`)
            continue
          }
          // Nếu đã có trong giỏ hàng nhưng chưa đạt tối đa
          else if (currentCartItem) {
            // Tính toán số lượng có thể thêm
            const canAdd = availableQuantity - currentQuantityInCart
            quantityToAdd = Math.min(1, canAdd) // Chỉ thêm tối đa 1 hoặc số lượng còn lại
            console.log(`Item ${item.productId?.name || item.name} already in cart (${currentQuantityInCart}), adding ${quantityToAdd} more`)
          }
          // Sản phẩm chưa có trong giỏ hàng
          else {
            console.log(`Adding new item ${item.productId?.name || item.name} to cart`)
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
      setReorderLoading(false)
    }
  }

  // Handle click on product to navigate to product detail page
  const handleProductClick = (productId) => {
    navigate(`/productdetail/${productId}`)
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
              sx={{ color: 'var(--primary-color)' }}
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
            <Typography variant="h6" fontWeight="600" color="var(--primary-color)" gutterBottom>
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
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: 'grey.100',
                          borderColor: 'var(--primary-color)',
                          transform: 'translateX(4px)'
                        }
                      }}
                      onClick={() => handleProductClick(product.productId)}
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
                              Phân loại hàng: {capitalizeFirstLetter(variant.color?.name)}, {formatSize(variant.size)}
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
                                color="var(--primary-color)"
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
                              color="var(--primary-color)"
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
                  <ReviewButtonComponent
                    product={product}
                    reviewedProducts={reviewedProducts}
                    setReviewedProducts={setReviewedProducts}
                    reviewsLoading={reviewsLoading}
                    isOrderCompleted={isOrderCompleted}
                    currentUser={currentUser}
                    setSelectedProduct={setSelectedProduct}
                    setOpenReviewModal={setOpenReviewModal}
                    setOpenViewReviewModal={setOpenViewReviewModal}
                    checkProductReview={checkProductReview}
                  />
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
                  sx={{ color: 'var(--primary-color)' }}
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
                <Typography variant="h6" fontWeight="600" color="var(--primary-color)">
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
                <Typography variant="h6" fontWeight="600" color="var(--primary-color)">
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
                  backgroundColor: 'var(--primary-color)',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  opacity: reorderLoading ? 0.7 : 1,
                  '&:hover': {
                    backgroundColor: 'var(--accent-color)',
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