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
  Breadcrumbs,
  Link,
  Skeleton,
  Container
} from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Cancel, Warning, Replay, NavigateNext } from '@mui/icons-material'
import { useOrderDetail } from '~/hooks/useOrderDetail'
import { useOrder } from '~/hooks/useOrder'
import { useCart } from '~/hooks/useCarts'
import ReviewModal from './modal/ReviewModal'
import ViewReviewModal from './modal/ViewReviewModal'
import {
  createReview,
  getUserReviews,
  getUserReviewForProduct
} from '~/services/reviewService'
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
  Failed: ['Thanh toán thất bại', 'error']
}

// Loading Component
const OrderDetailSkeleton = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Skeleton */}
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" width={300} height={24} />
      </Box>

      {/* Order Info Card Skeleton */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Skeleton variant="text" width={150} height={32} />
          <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: 2 }} />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <Skeleton variant="text" width={120} height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" width={200} height={20} sx={{ mb: 2 }} />
            <Skeleton variant="text" width={100} height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" width={150} height={20} />
          </Box>
          <Box>
            <Skeleton variant="text" width={140} height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" width={180} height={20} sx={{ mb: 2 }} />
            <Skeleton variant="text" width={120} height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" width={160} height={20} />
          </Box>
        </Box>
      </Paper>

      {/* Products Skeleton */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Skeleton variant="text" width={150} height={28} sx={{ mb: 3 }} />

        {[1, 2, 3].map((item) => (
          <Box key={item} sx={{ mb: 3, pb: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Skeleton variant="rectangular" width={80} height={80} sx={{ borderRadius: 2 }} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="70%" height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="50%" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="40%" height={20} />
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Skeleton variant="text" width={80} height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" width={60} height={20} />
              </Box>
            </Box>
          </Box>
        ))}
      </Paper>

      {/* Order Summary Skeleton */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Skeleton variant="text" width={120} height={28} sx={{ mb: 3 }} />

        {[1, 2, 3, 4].map((item) => (
          <Box key={item} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Skeleton variant="text" width={150} height={20} />
            <Skeleton variant="text" width={100} height={20} />
          </Box>
        ))}

        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Skeleton variant="text" width={100} height={24} />
          <Skeleton variant="text" width={120} height={24} />
        </Box>
      </Paper>
    </Container>
  )
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
    if (!reviewsLoading) {
      const productIdString = product.productId?.toString() || product.productId
      const wasReviewed = reviewedProducts.has(productIdString)
      setIsReviewed(wasReviewed)
    }
  }, [reviewedProducts, product.productId, reviewsLoading])

  const handleReviewClick = async () => {
    const productIdString = product.productId?.toString() || product.productId
    setSelectedProduct(product)

    if (!isReviewed && !checking && isReviewed !== null) {
      setChecking(true)
      const hasReview = await checkProductReview(productIdString)
      if (hasReview) {
        setIsReviewed(true)
        setReviewedProducts((prev) => new Set([...prev, productIdString]))
        setOpenViewReviewModal(true)
      } else {
        setOpenReviewModal(true)
      }
      setChecking(false)
    } else if (isReviewed) {
      setOpenViewReviewModal(true)
    }
  }

  if (
    reviewsLoading ||
    !isOrderCompleted ||
    !currentUser ||
    isReviewed === null
  ) {
    return (reviewsLoading || isReviewed === null) &&
      isOrderCompleted &&
      currentUser ? (
      <Skeleton
        variant="rectangular"
        width={100}
        height={32}
        sx={{
          borderRadius: 2,
          animation: 'pulse 1.5s ease-in-out infinite'
        }}
      />
    ) : null
  }

  return (
    <Button
      variant={isReviewed ? 'outlined' : 'contained'}
      size='small'
      disabled={checking || isReviewed === null}
      sx={{
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 600,
        fontSize: { xs: '0.75rem', sm: '0.875rem' },
        px: { xs: 1.5, sm: 2 },
        ...(isReviewed
          ? {
            color: 'var(--primary-color)',
            borderColor: 'var(--primary-color)',
            '&:hover': {
              color: '#fff',
              backgroundColor: 'var(--accent-color)',
              borderColor: 'var(--primary-color)'
            }
          }
          : {
            backgroundColor: 'var(--primary-color)',
            color: '#fff',
            '&:hover': {
              backgroundColor: 'var(--accent-color)',
              boxShadow: '0 4px 12px rgba(26, 60, 123, 0.3)'
            }
          })
      }}
      onClick={(e) => {
        e.stopPropagation()
        handleReviewClick()
      }}
      startIcon={checking ? (
        <CircularProgress
          size={16}
          sx={{
            color: 'inherit',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round'
            }
          }}
        />
      ) : null}
    >
      {checking
        ? 'Kiểm tra...'
        : isReviewed === null
          ? 'Đang tải...'
          : isReviewed
            ? 'Xem đánh giá'
            : 'Đánh giá'}
    </Button>
  )
}

// Confirmation Modal Component
const CancelOrderModal = ({ open, onClose, onConfirm, order, loading }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='xs'
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
        <Box display='flex' alignItems='center' gap={2}>
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
            <Warning
              sx={{ color: 'error.main', fontSize: { xs: 24, sm: 28 } }}
            />
          </Box>
          <Box>
            <Typography
              variant='h6'
              fontWeight='600'
              color='text.primary'
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              Xác nhận hủy đơn hàng
            </Typography>
            <Typography
              variant='body2'
              color='text.secondary'
              sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
            >
              Đơn hàng #{order?.code}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ py: 2, px: { xs: 2, sm: 3 } }}>
        <DialogContentText
          sx={{
            fontSize: { xs: '0.875rem', sm: '1rem' },
            color: 'text.primary'
          }}
        >
          Bạn có chắc chắn muốn hủy đơn hàng này không?
          <br />
          <Typography
            component='span'
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

      <DialogActions
        sx={{
          p: { xs: 2, sm: 3 },
          pt: 1,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1
        }}
      >
        <Button
          onClick={onClose}
          variant='outlined'
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
          variant='contained'
          color='error'
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

const OrderDetail = () => {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { order, items, loading, error } = useOrderDetail(orderId)
  const { cancelOrder } = useOrder()
  const { addToCart, refresh: refreshCart, cart } = useCart()
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  })
  const [openReviewModal, setOpenReviewModal] = useState(false)
  const [openViewReviewModal, setOpenViewReviewModal] = useState(false)
  const [reviewedProducts, setReviewedProducts] = useState(new Set())
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [openCancelModal, setOpenCancelModal] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [reorderLoading, setReorderLoading] = useState(false)
  const [reviewsLoading, setReviewsLoading] = useState(true)

  const checkProductReview = async (productId) => {
    if (!currentUser?._id || !orderId || !productId) {
      return false
    }

    try {
      const reviews = await getUserReviewForProduct(
        currentUser._id,
        productId,
        orderId
      )
      const hasReviewForThisOrder =
        reviews &&
        reviews.some((review) => {
          const reviewOrderId = review.orderId?.toString() || review.orderId
          const reviewProductId =
            review.productId?._id || review.productId?.id || review.productId
          const currentOrderId = orderId?.toString() || orderId
          const currentProductId = productId?.toString() || productId
          return (
            reviewOrderId === currentOrderId &&
            (reviewProductId?.toString() || reviewProductId) ===
            currentProductId
          )
        })
      return hasReviewForThisOrder
    } catch (error) {
      console.error('Error checking product review:', error)
      return false
    }
  }

  useEffect(() => {
    const fetchUserReviews = async () => {
      if (!currentUser?._id || !orderId || !order) {
        setReviewsLoading(false)
        return
      }

      setReviewsLoading(true)
      try {
        const reviews = await getUserReviews(currentUser._id)
        const reviewedProductsInOrder = reviews
          .filter((review) => {
            const reviewOrderId = review.orderId?.toString() || review.orderId
            const currentOrderId = orderId?.toString() || orderId
            return reviewOrderId === currentOrderId
          })
          .map((review) => {
            const productId =
              review.productId?._id || review.productId?.id || review.productId
            return productId?.toString() || productId
          })
        setReviewedProducts(new Set(reviewedProductsInOrder))
      } catch (err) {
        console.error('Lỗi khi lấy đánh giá người dùng:', err)
        setReviewedProducts(new Set())
      } finally {
        setReviewsLoading(false)
      }
    }
    fetchUserReviews()
  }, [currentUser, orderId, order])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  if (loading) return <OrderDetailSkeleton />
  if (error)
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'error.light',
            backgroundColor: 'error.50'
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Warning sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
          </Box>
          <Typography variant="h6" color='error.main' sx={{ mb: 1, fontWeight: 600 }}>
            Có lỗi xảy ra
          </Typography>
          <Typography color='error.dark'>
            {error.message || 'Không thể tải thông tin đơn hàng'}
          </Typography>
          <Button
            variant="contained"
            color="error"
            sx={{ mt: 3, borderRadius: 2 }}
            onClick={() => window.location.reload()}
          >
            Thử lại
          </Button>
        </Paper>
      </Container>
    )
  if (!order)
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'warning.light',
            backgroundColor: 'warning.50'
          }}
        >
          <Box sx={{ mb: 2 }}>
            <Warning sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
          </Box>
          <Typography variant="h6" color='warning.main' sx={{ mb: 1, fontWeight: 600 }}>
            Không tìm thấy đơn hàng
          </Typography>
          <Typography color='warning.dark'>
            Đơn hàng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa
          </Typography>
          <Button
            variant="contained"
            color="warning"
            sx={{ mt: 3, borderRadius: 2 }}
            onClick={() => navigate('/orders')}
          >
            Quay lại danh sách đơn hàng
          </Button>
        </Paper>
      </Container>
    )

  const [label, color] = statusLabels[order.status] || [
    'Không xác định',
    'default'
  ]
  const totalProductsPrice =
    order.total - (order.shippingFee || 0) + (order.discountAmount || 0)
  const formatPrice = (val) =>
    typeof val === 'number' ? val.toLocaleString('vi-VN') + '₫' : '0₫'

  const capitalizeFirstLetter = (str) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  const formatSize = (str) => {
    if (!str) return ''
    return str.toUpperCase()
  }

  const getActualVariantPrice = (variant) => {
    const totalOriginalSubtotal = items.reduce(
      (sum, item) => sum + (item.subtotal || 0),
      0
    )
    if (totalOriginalSubtotal === 0) return 0
    const actualPrice =
      ((variant.subtotal || 0) / totalOriginalSubtotal) * totalProductsPrice
    return Math.round(actualPrice)
  }

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
    const actualVariantPrice = getActualVariantPrice(item)
    groups[productId].totalPrice += actualVariantPrice
    return groups
  }, {})

  const uniqueProducts = Object.values(productGroups)
  const isOrderCompleted = order.status === 'Delivered'
  const isOrderCancellable =
    ['Pending', 'Processing'].includes(order.status) &&
    order.paymentStatus !== 'paid'

  const handleCancelOrder = async () => {
    setCancelling(true)
    try {
      await cancelOrder(orderId)
      setOpenCancelModal(false)
      navigate('/orders')
    } catch (error) {
      console.error('Lỗi khi hủy đơn hàng:', error)
      setNotification({
        open: true,
        message: 'Đã xảy ra lỗi khi hủy đơn hàng.',
        severity: 'error'
      })
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
      const productId =
        selectedProduct?.productId?.toString() || selectedProduct?.productId
      if (!productId || !orderId || !currentUser?._id) {
        console.error('Thiếu thông tin cần thiết để đánh giá.')
        setNotification({
          open: true,
          message: 'Thiếu thông tin để gửi đánh giá.',
          severity: 'error'
        })
        handleCloseModal()
        return
      }

      const hasExistingReview = await checkProductReview(productId)
      if (hasExistingReview) {
        console.error(
          `Sản phẩm ${productId} đã được đánh giá trong đơn hàng ${orderId}.`
        )
        setReviewedProducts((prev) => new Set([...prev, productId]))
        setNotification({
          open: true,
          message: 'Sản phẩm này đã được đánh giá.',
          severity: 'warning'
        })
        handleCloseModal()
        return
      }

      if (reviewedProducts.has(productId)) {
        console.error('Sản phẩm này đã được đánh giá.')
        setNotification({
          open: true,
          message: 'Sản phẩm này đã được đánh giá.',
          severity: 'warning'
        })
        handleCloseModal()
        return
      }

      const result = await createReview(reviewData)
      if (result) {
        setReviewedProducts((prev) => {
          const newSet = new Set([...prev, productId])
          console.log('handleSubmitReview: Updated reviewedProducts:', newSet)
          return newSet
        })
        setNotification({
          open: true,
          message: 'Cảm ơn bạn đã đánh giá!',
          severity: 'success'
        })
        handleCloseModal()
      }
    } catch (error) {
      console.error('Lỗi gửi đánh giá:', error)
      if (
        error?.message?.includes('đã được đánh giá') ||
        error?.message?.includes('already reviewed')
      ) {
        const productId = selectedProduct?.productId
        if (productId) {
          setReviewedProducts((prev) => new Set([...prev, productId]))
        }
        setNotification({
          open: true,
          message: 'Sản phẩm này đã được đánh giá.',
          severity: 'warning'
        })
      } else {
        setNotification({
          open: true,
          message: 'Đã xảy ra lỗi khi gửi đánh giá.',
          severity: 'error'
        })
      }
      handleCloseModal()
    }
  }

  const handleReorder = async () => {
    try {
      setReorderLoading(true)
      const skippedItems = []
      const validVariantIds = []

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const variantId = typeof item.variantId === 'object' ? item.variantId._id : item.variantId
        const productName = item.productId?.name || item.name || 'Sản phẩm không xác định'

        if (!variantId) {
          console.warn('Variant ID not found for item:', item)
          skippedItems.push({ name: productName, reason: 'Mã sản phẩm hết hàng hoặc ngừng bán' })
          continue
        }

        try {
          const variantInfo = await getVariantById(variantId)
          if (!variantInfo) {
            console.warn('Variant not found for ID:', variantId)
            skippedItems.push({ name: productName, reason: 'Sản phẩm không tồn tại' })
            continue
          }

          const availableQuantity = variantInfo.quantity || 0
          const isActive = variantInfo.status !== 'inactive' && variantInfo.productId?.status !== 'inactive'

          if (availableQuantity <= 0 || !isActive) {
            console.log(`Item ${productName} is ${availableQuantity <= 0 ? 'out of stock' : 'inactive'}`)
            skippedItems.push({
              name: productName,
              reason: availableQuantity <= 0 ? 'Hết hàng' : 'Ngừng bán'
            })
            continue
          }

          const currentCartItem = cart?.cartItems?.find((cartItem) => {
            const cartVariantId = typeof cartItem.variantId === 'object' ? cartItem.variantId._id : cartItem.variantId
            return cartVariantId === variantId
          })
          const currentQuantityInCart = currentCartItem?.quantity || 0

          if (currentQuantityInCart >= availableQuantity) {
            console.log(
              `Item ${productName} reached max quantity in cart (${currentQuantityInCart}/${availableQuantity}), skipping`
            )
            skippedItems.push({
              name: productName,
              reason: `Đã đạt số lượng tối đa trong giỏ (${availableQuantity})`
            })
            continue
          }

          await addToCart({
            variantId: variantId,
            quantity: 1
          })

          validVariantIds.push(variantId)
        } catch (error) {
          console.error(`Error adding item ${productName} to cart:`, error)
          skippedItems.push({ name: productName, reason: 'Lỗi khi thêm vào giỏ hàng' })
        }

        if (i < items.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 200))
        }
      }

      dispatch(setReorderVariantIds(validVariantIds))
      await refreshCart({ silent: true })

      if (skippedItems.length > 0) {
        const message = skippedItems
          .map((item) => `Sản phẩm "${item.name}": ${item.reason}`)
          .join('; ')
        setNotification({
          open: true,
          message,
          severity: 'warning'
        })
      }

      if (validVariantIds.length > 0) {
        setNotification({
          open: true,
          message: 'Đã thêm sản phẩm hợp lệ vào giỏ hàng.',
          severity: 'success'
        })
        setTimeout(() => {
          navigate('/cart')
        }, 300)
      } else {
        setNotification({
          open: true,
          message: 'Sản phẩm ngưng bán hoặc hết hàng.',
          severity: 'error'
        })
      }
    } catch (err) {
      console.error('Lỗi khi mua lại:', err)
      setNotification({
        open: true,
        message: 'Đã xảy ra lỗi khi mua lại đơn hàng.',
        severity: 'error'
      })
    } finally {
      setReorderLoading(false)
    }
  }

  const handleProductClick = (productId) => {
    navigate(`/productdetail/${productId}`)
  }

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: { xs: '100vw', sm: '96vw', md: '96vw' },
        margin: '0 auto',
        p: { xs: 1, sm: 2, md: 3 },
        minHeight: '70vh'
      }}
    >
      {/* Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ zIndex: 1500, mt: { xs: 8, sm: 10, md: 12 } }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{
            width: '100%',
            borderRadius: 2,
            fontWeight: 600,
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Breadcrumb */}
      <Box
        sx={{
          px: 1,
          mb: 2
        }}
      >
        <Breadcrumbs
          separator={<NavigateNext fontSize='small' />}
          aria-label='breadcrumb'
        >
          <Link
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
          >
            Trang chủ
          </Link>
          <Link
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
            onClick={() => navigate('/orders')}
          >
            Đơn hàng
          </Link>
          <Typography
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'text.primary',
              fontWeight: 500
            }}
          >
            Chi tiết đơn hàng
          </Typography>
        </Breadcrumbs>
      </Box>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.05)'
        }}
      >
        <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
          {/* Header */}
          <Box
            display='flex'
            alignItems='center'
            mb={2}
            flexWrap='wrap'
            gap={1}
          >
            <IconButton
              onClick={() => navigate(-1)}
              aria-label='Quay lại'
              size='small'
            >
              <ArrowBackIcon fontSize='small' />
            </IconButton>
            <Typography
              variant='h6'
              fontWeight='600'
              sx={{
                color: 'var(--primary-color)',
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}
            >
              #{order.code}
            </Typography>
            <Typography
              variant='body2'
              color='text.secondary'
              sx={{ ml: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
            >
              {new Date(order.createdAt).toLocaleDateString('vi-VN')}
            </Typography>
            <Chip
              label={label}
              color={color === 'default' ? undefined : color}
              sx={{
                ml: 'auto',
                fontWeight: 600,
                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                height: { xs: 28, sm: 32 }
              }}
            />
          </Box>

          {/* Shipping Address Section */}
          <Box
            sx={{
              p: { xs: 1, sm: 1.5, md: 2 },
              borderRadius: 2,
              backgroundColor: 'grey.50',
              border: '1px solid',
              borderColor: 'grey.200',
              mb: 2
            }}
          >
            <Typography
              variant='h6'
              fontWeight='600'
              color='var(--primary-color)'
              gutterBottom
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              Địa Chỉ Nhận Hàng
            </Typography>
            <Stack spacing={0.5}>
              <Typography
                fontWeight='600'
                sx={{ fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' } }}
              >
                {order.shippingAddress?.fullName}
              </Typography>
              <Typography
                color='text.secondary'
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                (+84) {order.shippingAddress?.phone}
              </Typography>
              <Typography
                color='text.secondary'
                sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
              >
                {order.shippingAddress?.address}, {order.shippingAddress?.ward},{' '}
                {order.shippingAddress?.district}, {order.shippingAddress?.city}
              </Typography>
              {order.note && (
                <Typography
                  color='text.secondary'
                  fontStyle='italic'
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: 1.5
                  }}
                >
                  Ghi chú: {order.note}
                </Typography>
              )}
            </Stack>
          </Box>

          {/* Products Section */}
          <Stack spacing={1.5}>
            {uniqueProducts.map((product, index) => (
              <Box key={product.productId}>
                {product.variants.map((variant, variantIndex) => (
                  <Box key={variant._id}>
                    <Box
                      sx={{
                        p: { xs: 1, sm: 1.5, md: 2 },
                        borderRadius: 2,
                        backgroundColor: 'grey.50',
                        border: '1px solid',
                        borderColor: 'grey.200',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: 'grey.50',
                          borderColor: 'var(--primary-color)',
                          transform: 'translateX(4px)'
                        }
                      }}
                      onClick={() => handleProductClick(product.productId)}
                    >
                      <Box
                        display='flex'
                        justifyContent='space-between'
                        alignItems='center'
                        flexDirection={{ xs: 'column', sm: 'row' }}
                        gap={1}
                      >
                        <Box
                          display='flex'
                          alignItems='center'
                          gap={1.5}
                          width='100%'
                        >
                          <Avatar
                            src={
                              optimizeCloudinaryUrl(variant?.color?.image) ||
                              '/images/default.jpg'
                            }
                            alt={variant.name}
                            sx={{
                              width: { xs: 60, sm: 70, md: 80 },
                              height: { xs: 60, sm: 70, md: 80 },
                              borderRadius: 2,
                              border: '2px solid white',
                              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                              objectFit: 'cover'
                            }}
                            variant='rounded'
                          />
                          <Box flexGrow={1}>
                            <Typography
                              fontWeight={600}
                              sx={{
                                fontSize: {
                                  xs: '0.9rem',
                                  sm: '1rem',
                                  md: '1.1rem'
                                },
                                mb: 0.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: {
                                  xs: '300px',
                                  sm: '250px',
                                  md: '400px',
                                  lg: '500px'
                                }
                              }}
                              title={product.productName}
                            >
                              {product.productName}
                            </Typography>
                            <Typography
                              variant='body2'
                              color='text.secondary'
                              sx={{
                                mb: 0.5,
                                fontSize: { xs: '0.75rem', sm: '0.8rem' }
                              }}
                            >
                              Phân loại hàng:{' '}
                              {capitalizeFirstLetter(variant.color?.name)},{' '}
                              {formatSize(variant.size)}
                            </Typography>
                            <Chip
                              label={`Số lượng: ${variant.quantity}`}
                              size='small'
                              variant='outlined'
                              sx={{
                                fontSize: { xs: '0.65rem', sm: '0.7rem' },
                                height: { xs: 18, sm: 20 }
                              }}
                            />
                          </Box>
                        </Box>
                        <Box
                          textAlign={{ xs: 'right', sm: 'right' }}
                          sx={{
                            alignSelf: { xs: 'flex-end', sm: 'center' },
                            ml: { xs: 0, sm: 1 }
                          }}
                        >
                          <Typography
                            fontWeight={700}
                            sx={{
                              fontSize: {
                                xs: '1rem',
                                sm: '1.1rem',
                                md: '1.2rem'
                              },
                              color: 'var(--primary-color)'
                            }}
                          >
                            {formatPrice(getActualVariantPrice(variant))}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    {variantIndex < product.variants.length - 1 && (
                      <Divider sx={{ my: 1 }} />
                    )}
                  </Box>
                ))}
                <Box
                  display='flex'
                  justifyContent='flex-end'
                  gap={1}
                  mt={1}
                  flexDirection={{ xs: 'column', sm: 'row' }}
                >
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
                {index < uniqueProducts.length - 1 && (
                  <Divider sx={{ my: 2 }} />
                )}
              </Box>
            ))}
          </Stack>

          {/* Order Summary */}
          <Divider sx={{ my: 2 }} />
          <Box
            sx={{
              p: { xs: 1, sm: 1.5, md: 2 },
              borderRadius: 2,
              backgroundColor: 'primary.50'
            }}
          >
            <Typography
              variant='h6'
              fontWeight='600'
              mb={1.5}
              sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
            >
              Tóm tắt đơn hàng
            </Typography>
            <Stack spacing={1}>
              <Box display='flex' justifyContent='space-between'>
                <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                  Tổng tiền hàng:
                </Typography>
                <Typography
                  fontWeight={600}
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
                >
                  {formatPrice(totalProductsPrice)}
                </Typography>
              </Box>
              <Box display='flex' justifyContent='space-between'>
                <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                  Phí vận chuyển:
                </Typography>
                <Typography
                  fontWeight={600}
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
                >
                  {formatPrice(order.shippingFee || 0)}
                </Typography>
              </Box>
              <Box display='flex' justifyContent='space-between'>
                <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                  Giảm giá:
                </Typography>
                <Typography
                  fontWeight={600}
                  color={order.couponId ? 'error' : 'inherit'}
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
                >
                  {formatPrice(order.discountAmount || 0)}
                </Typography>
              </Box>
              <Divider />
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
              >
                <Typography
                  variant='h6'
                  fontWeight='600'
                  sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                >
                  Tổng cộng:
                </Typography>
                <Typography
                  variant='h5'
                  fontWeight='700'
                  sx={{
                    color: 'var(--primary-color)',
                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                  }}
                >
                  {formatPrice(order.total)}
                </Typography>
              </Box>
              <Box display='flex' justifyContent='space-between' mt={1}>
                <Typography
                  fontWeight='600'
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
                >
                  Phương thức thanh toán:
                </Typography>
                <Typography
                  fontWeight='600'
                  sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}
                >
                  {order.paymentMethod?.toLowerCase() === 'cod'
                    ? 'Thanh toán khi nhận hàng (COD)'
                    : 'VNPay'}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* Cancel Order Button */}
      {isOrderCancellable && (
        <Card
          sx={{
            mt: 2,
            px: { xs: 1.5, sm: 2, md: 3 },
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid rgba(255, 152, 0, 0.2)'
          }}
        >
          <CardContent>
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              flexDirection={{ xs: 'column', sm: 'row' }}
              gap={1}
            >
              <Box textAlign={{ xs: 'center', sm: 'left' }}>
                <Typography
                  variant='h6'
                  fontWeight='600'
                  color='var(--primary-color)'
                  sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                >
                  Hủy đơn hàng
                </Typography>
                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  Bạn có thể hủy đơn hàng này vì chưa thanh toán
                </Typography>
              </Box>
              <Button
                variant='outlined'
                color='error'
                startIcon={<Cancel />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  px: { xs: 1.5, sm: 2 },
                  width: { xs: '100%', sm: 'auto' }
                }}
                onClick={() => setOpenCancelModal(true)}
              >
                Hủy đơn
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Reorder Button */}
      {(order?.status === 'Delivered' ||
        order?.status === 'Failed' ||
        order?.status === 'Cancelled') && (
          <Card
            sx={{
              mt: 2,
              px: { xs: 1.5, sm: 2, md: 3 },
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid rgba(26, 60, 123, 0.2)'
            }}
          >
            <CardContent>
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                flexDirection={{ xs: 'column', sm: 'row' }}
                gap={1}
              >
                <Box textAlign={{ xs: 'center', sm: 'left' }}>
                  <Typography
                    variant='h6'
                    fontWeight='600'
                    color='var(--primary-color)'
                    sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                  >
                    Mua lại đơn hàng
                  </Typography>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Thêm tất cả sản phẩm từ đơn hàng này vào giỏ hàng
                  </Typography>
                </Box>
                <Button
                  startIcon={
                    reorderLoading ? (
                      <CircularProgress
                        size={16}
                        sx={{
                          color: 'inherit',
                          '& .MuiCircularProgress-circle': {
                            strokeLinecap: 'round'
                          }
                        }}
                      />
                    ) : <Replay />
                  }
                  disabled={reorderLoading}
                  onClick={handleReorder}
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
              </Box>
            </CardContent>
          </Card>
        )}

      <ReviewModal
        open={openReviewModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitReview}
        orderItems={selectedProduct ? selectedProduct.variants : items}
        productId={selectedProduct?.productId || uniqueProducts[0]?.productId}
        userId={currentUser?._id}
        orderId={orderId}
      />

      <ViewReviewModal
        open={openViewReviewModal}
        onClose={handleCloseViewReviewModal}
        userId={currentUser?._id}
        productId={selectedProduct?.productId}
        orderId={orderId}
        productName={selectedProduct?.productName}
      />

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