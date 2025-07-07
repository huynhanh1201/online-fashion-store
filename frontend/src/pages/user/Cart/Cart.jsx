import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  IconButton,
  TextField,
  Avatar,
  Button,
  Checkbox,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Divider,
  Chip,
  Card,
  CardContent,
  Grid,
  Tooltip,
  Breadcrumbs,
  Link,
} from '@mui/material'
import {
  Delete,
  Add,
  Remove,
  DeleteForever,
  ShoppingCart,
  LocalOffer,
  Payment,
  ArrowForward,
  NavigateNext,
} from '@mui/icons-material'
import { useCart } from '~/hooks/useCarts'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  setSelectedItems as setSelectedItemsAction,
  setTempQuantity,
  removeTempQuantity,
  clearReorderVariantIds,
  setAppliedCoupon,
  clearAppliedCoupon,
} from '~/redux/cart/cartSlice'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary'
import { getDiscounts } from '~/services/discountService'
import SuggestionProducts from './SuggestionProducts'

const Cart = () => {
  const { cart, loading, deleteItem, clearCart, updateItem } = useCart()

  const [selectedItems, setSelectedItems] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [showMaxQuantityAlert, setShowMaxQuantityAlert] = useState(false)
  const [confirmClearOpen, setConfirmClearOpen] = useState(false)
  const [coupons, setCoupons] = useState([])
  const [hasFetchedCoupons, setHasFetchedCoupons] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [deleteMode, setDeleteMode] = useState('')
  const [itemToDelete, setItemToDelete] = useState(null)
  const tempQuantities = useSelector((state) => state.cart.tempQuantities || {})
  const reorderVariantIds = useSelector((state) => state.cart.reorderVariantIds || [])
  const [processingVariantId, setProcessingVariantId] = useState(null)
  const [hasAutoSelected, setHasAutoSelected] = useState(false)
  const [outOfStockAlert, setOutOfStockAlert] = useState(false)
  const [outOfStockMessage, setOutOfStockMessage] = useState('')

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    setHasAutoSelected(false)
  }, [])

  // Revalidate selected items when cart data changes to handle race conditions
  useEffect(() => {
    if (selectedItems.length > 0 && cartItems.length > 0) {
      const validSelectedItems = selectedItems.filter(selected => {
        const item = cartItems.find(cartItem =>
          (cartItem.variant?._id || cartItem.variantId?._id || cartItem.variantId) === selected.variantId
        )
        return item && item.quantity > 0 && (item.variant?.quantity === undefined || item.variant.quantity > 0)
      })

      // If any selected items are now invalid, update the selection
      if (validSelectedItems.length < selectedItems.length) {
        setSelectedItems(validSelectedItems)
        dispatch(setSelectedItemsAction(validSelectedItems))

        if (validSelectedItems.length < selectedItems.length) {
          setOutOfStockMessage('Một số sản phẩm đã chọn hiện đã hết hàng và đã được bỏ chọn')
          setOutOfStockAlert(true)
        }
      }
    }
  }, [cartItems, selectedItems, dispatch])

  useEffect(() => {
    if (cart?.cartItems) {
      const sortedItems = [...cart.cartItems].sort((a, b) => {
        if (a.quantity > 0 && b.quantity === 0) return -1
        if (a.quantity === 0 && b.quantity > 0) return 1
        return 0
      })
      setCartItems(sortedItems)

      const outOfStockItems = sortedItems.filter(item => item.quantity === 0)
      if (outOfStockItems.length > 0) {
        setOutOfStockMessage('Một số sản phẩm trong giỏ hàng đã hết hàng và không thể chọn để thanh toán')
        setOutOfStockAlert(true)
        setSelectedItems(prev => {
          const filteredItems = prev.filter(selected =>
            !outOfStockItems.some(outOfStock =>
              outOfStock.variant?._id === selected.variantId ||
              outOfStock.variantId?._id === selected.variantId ||
              outOfStock.variantId === selected.variantId
            )
          )
          dispatch(setSelectedItemsAction(filteredItems))
          return filteredItems
        })
      }
    }
  }, [cart, dispatch])

  useEffect(() => {
    if (cartItems.length > 0 && reorderVariantIds.length > 0 && !hasAutoSelected) {
      const reorderSelectedItems = cartItems
        .filter(item => {
          const variantId = item.variant?._id || item.variantId?._id || item.variantId
          const isMatch = reorderVariantIds.includes(variantId)
          const hasStock = item.quantity > 0
          return isMatch && hasStock
        })
        .map(item => ({
          variantId: item.variant?._id || item.variantId?._id || item.variantId,
          quantity: item.quantity
        }))

      if (reorderSelectedItems.length > 0) {
        setSelectedItems(reorderSelectedItems)
        dispatch(setSelectedItemsAction(reorderSelectedItems))
        setHasAutoSelected(true)
        dispatch(clearReorderVariantIds())
      }
    }
  }, [cartItems, reorderVariantIds, hasAutoSelected, dispatch])

  useEffect(() => {
    if (hasFetchedCoupons) return

    const fetchCoupons = async () => {
      try {
        const res = await getDiscounts()
        if (Array.isArray(res.discounts) && res.discounts.length > 0) {
          setCoupons(
            res.discounts.sort((a, b) => a.minOrderValue - b.minOrderValue),
          )
        }
      } catch (error) {
        // Handle error silently
      } finally {
        setHasFetchedCoupons(true)
      }
    }

    fetchCoupons()
  }, [hasFetchedCoupons])

  // Lọc ra các sản phẩm có thể chọn (không hết hàng)
  const selectableItems = cartItems.filter(item => item.quantity > 0)

  // Tính toán các sản phẩm có thể chọn đã được chọn
  const selectedSelectableItems = selectedItems.filter(selected =>
    selectableItems.some(item =>
      (item.variant?._id || item.variantId?._id || item.variantId) === selected.variantId
    )
  )

  const allSelected =
    selectableItems.length > 0 && selectedSelectableItems.length === selectableItems.length
  const someSelected =
    selectedSelectableItems.length > 0 && selectedSelectableItems.length < selectableItems.length

  const handleSelectAll = () => {
    const newSelected = allSelected
      ? []
      : selectableItems.map((item) => ({
        variantId: item.variant?._id || item.variantId?._id || item.variantId,
        quantity: item.quantity,
      }))

    setSelectedItems(newSelected)
    dispatch(setSelectedItemsAction(newSelected))
  }

  const handleSelect = (item) => {
    const variantId = item.variant?._id || item.variantId?._id || item.variantId
    const variant = item.variant
    const exists = selectedItems.some((i) => i.variantId === variantId)

    // Kiểm tra tình trạng hết hàng trước khi cho phép select
    const isOutOfStock = item.quantity === 0 || (variant?.quantity !== undefined && variant.quantity === 0)

    // Nếu sản phẩm hết hàng và đang cố gắng select (không phải unselect), thì không cho phép
    if (!exists && isOutOfStock) {
      setOutOfStockMessage('Sản phẩm này đã hết hàng và không thể chọn')
      setOutOfStockAlert(true)
      return
    }

    const newSelected = exists
      ? selectedItems.filter((i) => i.variantId !== variantId)
      : [...selectedItems, { variantId, quantity: item.quantity }]

    setSelectedItems(newSelected)
    dispatch(setSelectedItemsAction(newSelected))
  }

  const formatPrice = (val) =>
    typeof val === 'number'
      ? val.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
      : '0₫'

  const handleMouseDown = (variantId, delta) => {
    const item = cartItems.find((i) => i.variant._id === variantId)
    if (!item) return

    // Kiểm tra xem sản phẩm có hết hàng không
    if (item.quantity === 0) return

    const current = tempQuantities[variantId] ?? item.quantity
    const max = item.variant.quantity || 99

    if (delta > 0 && current >= max) {
      setShowMaxQuantityAlert(true)
      return
    }

    const newQty = Math.min(Math.max(current + delta, 1), max)

    dispatch(setTempQuantity({ variantId, quantity: newQty }))

    // Tự động select sản phẩm khi tăng giảm số lượng
    setSelectedItems((prev) => {
      const existingItem = prev.find((i) => i.variantId === variantId)

      let newSelectedItems
      if (existingItem) {
        // Nếu đã được chọn, chỉ cập nhật số lượng
        newSelectedItems = prev.map((i) =>
          i.variantId === variantId ? { ...i, quantity: newQty } : i,
        )
      } else {
        // Nếu chưa được chọn, thêm vào danh sách đã chọn
        newSelectedItems = [...prev, { variantId, quantity: newQty }]
      }

      // Cập nhật Redux store
      dispatch(setSelectedItemsAction(newSelectedItems))
      return newSelectedItems
    })
  }

  const handleMouseLeave = async (variantId) => {
    const item = cartItems.find((i) => i.variant._id === variantId)
    const tempQty = tempQuantities[variantId]

    if (!item || tempQty === undefined || tempQty === item.quantity) return

    try {
      setProcessingVariantId(variantId)
      const delta = tempQty - item.quantity
      await updateItem(variantId, { quantity: delta })

      setCartItems((prev) =>
        prev.map((i) =>
          i.variant._id === variantId ? { ...i, quantity: tempQty } : i,
        ),
      )

      setSelectedItems((prev) => {
        const newSelectedItems = prev.map((i) =>
          i.variantId === variantId ? { ...i, quantity: tempQty } : i,
        )
        // Cập nhật Redux store
        dispatch(setSelectedItemsAction(newSelectedItems))
        return newSelectedItems
      })

      dispatch(removeTempQuantity(variantId))
    } catch (err) {
      // Handle error silently
    } finally {
      setProcessingVariantId(null)
    }
  }

  const handleRemove = async ({ variantId }) => {
    try {
      const res = await deleteItem({ variantId })
      if (res) {
        setCartItems((prev) =>
          prev.filter((item) => item.variant._id !== variantId),
        )
        setSelectedItems((prev) =>
          prev.filter((i) => i.variantId !== variantId),
        )
      }
    } catch (error) {
      // Handle error silently
    }
  }

  const selectedCartItems = cartItems.filter((item) =>
    selectedItems.some((selected) => selected.variantId === item.variant._id),
  )

  // Helper function to get final price (exportPrice minus discountPrice)
  const getFinalPrice = (variant) => {
    const basePrice = variant.exportPrice || 0
    const discount = variant.discountPrice || 0
    return Math.max(basePrice - discount, 0) // Đảm bảo giá không âm
  }

  const totalPrice = selectedCartItems.reduce((sum, item) => {
    const selected = selectedItems.find((i) => i.variantId === item.variant._id)
    const qty = selected?.quantity || item.quantity
    return sum + getFinalPrice(item.variant) * qty
  }, 0)

  // Tính tổng tiết kiệm từ các sản phẩm đã giảm giá
  const totalSavings = selectedCartItems.reduce((sum, item) => {
    const selected = selectedItems.find((i) => i.variantId === item.variant._id)
    const qty = selected?.quantity || item.quantity
    const variant = item.variant

    // Chỉ tính tiết kiệm nếu có discountPrice
    if (variant.discountPrice && variant.discountPrice > 0) {
      return sum + (variant.discountPrice * qty)
    }
    return sum
  }, 0)
  const capitalizeFirstLetter = (str) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  const formatSize = (str) => {
    if (!str) return ''
    return str.toUpperCase()
  }

  const handleClearCart = async () => {
    await clearCart()
    setCartItems([])
    setSelectedItems([])
    setConfirmClearOpen(false)
  }

  // Validation trước khi thanh toán để đảm bảo không có sản phẩm hết hàng
  const handleCheckout = () => {
    // Kiểm tra xem có sản phẩm đã chọn nào hết hàng không
    const selectedCartItems = cartItems.filter((item) =>
      selectedItems.some((selected) =>
        (item.variant?._id || item.variantId?._id || item.variantId) === selected.variantId
      )
    )

    const hasOutOfStockSelected = selectedCartItems.some(item =>
      item.quantity === 0 || (item.variant?.quantity !== undefined && item.variant.quantity === 0)
    )

    if (hasOutOfStockSelected) {
      // Tự động loại bỏ các sản phẩm hết hàng khỏi danh sách đã chọn
      const validSelectedItems = selectedItems.filter(selected => {
        const item = cartItems.find(cartItem =>
          (cartItem.variant?._id || cartItem.variantId?._id || cartItem.variantId) === selected.variantId
        )
        return item && item.quantity > 0 && (item.variant?.quantity === undefined || item.variant.quantity > 0)
      })

      setSelectedItems(validSelectedItems)
      dispatch(setSelectedItemsAction(validSelectedItems))
      setOutOfStockMessage('Đã loại bỏ các sản phẩm hết hàng khỏi danh sách thanh toán')
      setOutOfStockAlert(true)

      // Nếu sau khi loại bỏ không còn sản phẩm nào, không cho phép thanh toán
      if (validSelectedItems.length === 0) {
        return
      }
    }

    // Lưu thông tin mã giảm giá được áp dụng vào Redux store
    const applicableCoupon = getApplicableCoupon()
    if (applicableCoupon) {
      const discountAmount = calculateDiscount(applicableCoupon, totalPrice)
      dispatch(setAppliedCoupon({
        coupon: applicableCoupon,
        discount: discountAmount
      }))
    } else {
      // Xóa mã giảm giá cũ nếu không có mã nào áp dụng được
      dispatch(clearAppliedCoupon())
    }

    navigate('/payment')
  }


  const calculateDiscount = (coupon, total) => {
    if (!coupon || total < coupon.minOrderValue) return 0

    return coupon.type === 'percent'
      ? Math.floor((total * coupon.amount) / 100)
      : coupon.amount
  }

  const getApplicableCoupon = () => {
    const validCoupons = coupons.filter((c) => totalPrice >= c.minOrderValue)
    if (validCoupons.length === 0) return null

    return validCoupons.reduce((best, current) => {
      const bestDiscount = calculateDiscount(best, totalPrice)
      const currentDiscount = calculateDiscount(current, totalPrice)
      return currentDiscount > bestDiscount ? current : best
    })
  }

  const getNextCoupon = () => {
    if (!coupons.length) return null

    const sorted = [...coupons].sort((a, b) => a.minOrderValue - b.minOrderValue)
    const applicable = getApplicableCoupon()

    if (!applicable) {
      return sorted.find((c) => totalPrice < c.minOrderValue) || null
    }

    const next = sorted.find((c) => c.minOrderValue > applicable.minOrderValue)
    return next || null
  }

  const applicableCoupon = getApplicableCoupon()
  const nextCoupon = getNextCoupon()
  const discountAmount = applicableCoupon
    ? calculateDiscount(applicableCoupon, totalPrice)
    : 0

  if (loading) {
    return (
      <Container
        maxWidth={false}
        sx={{
          width: '96vw',
          maxWidth: '1800px',
          margin: '0 auto',
          height: '70vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mt: 10,
        }}
      >
        <Box
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 2,
            width: '100%',
            maxWidth: 500,
          }}
        >
          <ShoppingCart sx={{ fontSize: 60, color: 'var(--primary-color)', mb: 2, opacity: 0.7 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: 'var(--primary-color)' }}>
            Đang tải giỏ hàng...
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container
      maxWidth={false}
      sx={{
        width: '96vw',
        maxWidth: '1800px',
        margin: '0 auto',
        minHeight: '70vh',
        mt: { xs: 10, md: 16 },
        mb: { xs: 3, md: 5 },
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
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
            href={`/product`}
          >
            Sản phẩm
          </Link>
          <Typography
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'text.primary',
              fontWeight: 500
            }}
          >
            Giỏ hàng
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
        >
          <Box display="flex" alignItems="center" gap={1.5}>
            <ShoppingCart sx={{ fontSize: 28, color: 'var(--primary-color)' }} />
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: 'var(--primary-color)', letterSpacing: 0.5 }}
            >
              Giỏ hàng của bạn
            </Typography>
          </Box>
          <Chip
            label={`${cartItems.length} Sản phẩm`}
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 600, borderRadius: 6, px: 1.5 }}
          />
        </Box>
      </Paper>

      {/* Coupon notification */}
      <Box
        sx={{
          maxHeight: coupons.length > 0 && selectedItems.length > 0 ? '200px' : 0,
          overflow: 'hidden',
          transition: 'all 0.3s ease-in-out',
          opacity: coupons.length > 0 && selectedItems.length > 0 ? 1 : 0,
          mb: coupons.length > 0 && selectedItems.length > 0 ? 1 : 0,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 1,
            borderRadius: 2,
            border: '1px dashed var(--primary-color)',
            backgroundColor: 'white',
          }}
        >
          <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
            <LocalOffer sx={{ color: 'var(--primary-color)', fontSize: 24 }} />
            <Typography
              variant="body2"
              sx={{ color: 'var(--primary-color)', fontWeight: 500, flex: 1 }}
            >
              {(() => {
                if (applicableCoupon) {
                  if (nextCoupon && totalPrice < nextCoupon.minOrderValue) {
                    const nextDiscountText =
                      nextCoupon.type === 'percent'
                        ? `${nextCoupon.amount}%`
                        : formatPrice(nextCoupon.amount)
                    return (
                      <>
                        Bạn đang được giảm
                        <Box component="span" sx={{ fontWeight: 600, mx: 0.5 }}>
                          {formatPrice(discountAmount)}
                        </Box>
                        , chỉ cần mua thêm
                        <Box component="span" sx={{ fontWeight: 600, mx: 0.5 }}>
                          {formatPrice(nextCoupon.minOrderValue - totalPrice)}
                        </Box>
                        để nhận mã giảm
                        <Box component="span" sx={{ fontWeight: 600, mx: 0.5 }}>
                          {nextDiscountText}
                        </Box>{''}
                        🎉!
                      </>
                    )
                  }
                  return (
                    <>
                      Đơn hàng của bạn đã đạt mức giảm cao nhất:{''}
                      <Box component="span" sx={{ fontWeight: 600, mx: 0.5 }}>
                        {formatPrice(discountAmount)}
                      </Box>{''}
                      🎉
                    </>
                  )
                }
                const first = coupons[0]
                if (first) {
                  const discountText =
                    first.type === 'percent'
                      ? `${first.amount}%`
                      : formatPrice(first.amount)
                  return (
                    <>
                      Chỉ cần mua thêm
                      <Box component="span" sx={{ fontWeight: 600, mx: 0.5 }}>
                        {formatPrice(first.minOrderValue - totalPrice)}
                      </Box>
                      để nhận mã giảm
                      <Box component="span" sx={{ fontWeight: 600, mx: 0.5 }}>
                        {discountText}
                      </Box>
                      !
                    </>
                  )
                }
                return null
              })()}
            </Typography>
          </Box>
        </Paper>
      </Box>



      {/* Cart items */}
      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        alignItems="flex-start"
        gap={3}
        sx={{
          position: 'relative',

        }}
      >
        <Box
          flex={{ xs: '1 1 100%', md: 2 }}
          width={{ xs: '100%', md: 'auto' }}
        >
          <Paper
            elevation={2}
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            }}
          >
            {cartItems.length === 0 ? (
              <Box
                sx={{
                  p: { xs: 4, sm: 6, md: 12 },
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <ShoppingCart sx={{ fontSize: 80, color: '#ccc' }} />
                <Typography
                  variant="h5"
                  sx={{ color: 'text.secondary', fontWeight: 500 }}
                >
                  Giỏ hàng của bạn đang trống
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/')}
                  startIcon={<ArrowForward />}
                  sx={{ mt: 2, borderRadius: 6, px: 4, color: '#fff', backgroundColor: 'var(--primary-color)' }}
                >
                  Tiếp tục mua sắm
                </Button>
              </Box>
            ) : (
              <>
                <Box
                  sx={{
                    bgcolor: '#fff',
                    p: { xs: 2, sm: 2 },
                    backgroundColor: 'var(--primary-color)10',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Checkbox
                    indeterminate={someSelected}
                    checked={allSelected}
                    onChange={handleSelectAll}
                    color="primary"
                    sx={{ p: 1, alignSelf: 'center' }}
                  />
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                    }}
                  >
                    Chọn tất cả
                  </Typography>
                  <Box sx={{ flexGrow: 1 }} />
                  <Tooltip title="Xóa tất cả">
                    <IconButton
                      color="error"
                      onClick={() => {
                        setDeleteMode('all')
                        setConfirmClearOpen(true)
                      }}
                      size="small"
                    >
                      <DeleteForever />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Divider />

                {cartItems.map((item) => {
                  const variant = item.variant
                  if (!variant) return null

                  // Kiểm tra xem sản phẩm có hết hàng không (quantity = 0)
                  // Check cả item.quantity và variant.quantity để đảm bảo chính xác
                  const isOutOfStock = item.quantity === 0 || (variant.quantity !== undefined && variant.quantity === 0)

                  return (
                    <React.Fragment key={item._id}>
                      <Box
                        sx={{
                          p: { xs: 2, sm: 2 },
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          flexWrap: { xs: 'wrap', sm: 'nowrap' },
                          opacity: isOutOfStock ? 0.6 : 1, // Làm mờ sản phẩm hết hàng
                          backgroundColor: isOutOfStock ? '#f5f5f5' : 'transparent',
                        }}
                      >
                        {/* Checkbox */}
                        <Checkbox
                          checked={selectedItems.some((i) => i.variantId === variant._id)}
                          onChange={() => handleSelect(item)}
                          color="primary"
                          disabled={isOutOfStock} // Disable checkbox khi hết hàng
                          sx={{ p: 1, alignSelf: 'center' }}
                        />


                        {/* Product Image */}
                        <Box
                          sx={{ cursor: 'pointer' }}
                          onClick={() => {
                            dispatch(
                              setSelectedItemsAction([
                                {
                                  variantId: variant._id,
                                  quantity: item.quantity,
                                },
                              ]),
                            )
                            navigate(`/productdetail/${variant.productId}`)
                          }}
                        >
                          <Avatar
                            src={
                              optimizeCloudinaryUrl(variant.color?.image) ||
                              '/default.jpg'
                            }
                            variant="square"
                            sx={{
                              width: { xs: 60, sm: 80, md: 100 },
                              height: { xs: 60, sm: 80, md: 100 },
                              borderRadius: 2,
                              objectFit: 'cover',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            }}
                          />
                        </Box>

                        {/* Product Info */}
                        <Box
                          sx={{
                            flex: 1,
                            minWidth: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography
                              fontWeight={600}
                              sx={{
                                fontSize: {
                                  xs: '0.8rem',
                                  sm: '0.9rem',
                                  md: '1rem',
                                },
                                maxWidth: { xs: '150px', sm: '200px', md: '250px' },
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                              title={variant.name}
                            >
                              {capitalizeFirstLetter(variant.name)}
                            </Typography>
                            {isOutOfStock && (
                              <Chip
                                size="small"
                                label="Hết hàng"
                                sx={{
                                  fontSize: '0.75rem',
                                  backgroundColor: '#ff5722',
                                  color: 'white',
                                  fontWeight: 600,
                                  '& .MuiChip-label': {
                                    px: 1,
                                  },
                                }}
                              />
                            )}
                          </Box>

                          <Box display="flex" gap={1} flexWrap="wrap">
                            <Chip
                              size="small"
                              label={capitalizeFirstLetter(variant.color?.name) || 'Không rõ'}
                              sx={{ fontSize: '0.75rem' }}
                            />
                            <Chip
                              size="small"
                              label={formatSize(variant.size?.name) || 'Không rõ'}
                              sx={{ fontSize: '0.75rem' }}
                            />
                          </Box>
                          <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                            {variant.discountPrice && variant.discountPrice > 0 ? (
                              <>
                                <Typography
                                  sx={{
                                    fontWeight: 700,
                                    color: '#d32f2f',
                                    fontSize: { xs: '0.9rem', sm: '1rem' },
                                  }}
                                >
                                  {formatPrice(getFinalPrice(variant))}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontWeight: 500,
                                    color: 'text.secondary',
                                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                                    textDecoration: 'line-through',
                                  }}
                                >
                                  {formatPrice(variant.exportPrice)}
                                </Typography>
                                <Chip
                                  size="small"
                                  label={`-${Math.round((variant.discountPrice / variant.exportPrice) * 100)}%`}
                                  sx={{
                                    backgroundColor: '#ff5722',
                                    color: 'white',
                                    fontSize: '0.7rem',
                                    height: 18,
                                  }}
                                />
                              </>
                            ) : (
                              <Typography
                                sx={{
                                  fontWeight: 700,
                                  color: '#d32f2f',
                                  fontSize: { xs: '0.9rem', sm: '1rem' },
                                }}
                              >
                                {formatPrice(variant.exportPrice)}
                              </Typography>
                            )}
                          </Box>
                        </Box>

                        {/* Quantity and Delete */}
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            gap: 1.5
                          }}
                        >
                          {/* Quantity controls - chỉ hiện khi không hết hàng */}

                          <Box
                            display="flex"
                            alignItems="center"
                            onMouseLeave={() => handleMouseLeave(variant._id)}
                            sx={{
                              border: '1px solid #e0e0e0',
                              borderRadius: 1,
                              overflow: 'hidden',
                            }}
                          >
                            <IconButton
                              size="small"
                              onMouseDown={() =>
                                handleMouseDown(variant._id, -1)
                              }
                              disabled={
                                processingVariantId === variant._id ||
                                isOutOfStock ||
                                (tempQuantities[variant._id] ?? item.quantity) <=
                                1
                              }
                              sx={{ borderRadius: 0, p: 0.5 }}
                            >
                              <Remove fontSize="small" />
                            </IconButton>
                            <TextField
                              value={
                                tempQuantities[variant._id] ?? item.quantity
                              }
                              size="small"
                              sx={{
                                width: 40,
                                '& .MuiOutlinedInput-root': {
                                  '& fieldset': { border: 'none' },
                                },
                              }}
                              inputProps={{
                                style: {
                                  textAlign: 'center',
                                  padding: '4px',
                                  fontWeight: 600,
                                  fontSize: '0.9rem',
                                },
                                readOnly: true,
                              }}
                            />
                            <IconButton
                              size="small"
                              onMouseDown={() =>
                                handleMouseDown(variant._id, 1)
                              }
                              disabled={
                                processingVariantId === variant._id ||
                                isOutOfStock ||
                                (tempQuantities[variant._id] ?? item.quantity) >=
                                (variant.quantity || 99)
                              }
                              sx={{ borderRadius: 0, p: 0.5 }}
                            >
                              <Add fontSize="small" />
                            </IconButton>
                          </Box>

                          <IconButton
                            color="error"
                            onClick={() => {
                              setDeleteMode('single')
                              setItemToDelete(variant)
                              setConfirmClearOpen(true)
                            }}
                            size="small"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                      <Divider />
                    </React.Fragment>
                  )
                })}
              </>
            )}
          </Paper>
        </Box>

        {/* Order summary */}
        <Box
          flex={{ xs: '1 1 100%', md: 1 }}
          width={{ xs: '100%', md: 'auto' }}
          sx={{
            position: { md: 'sticky' },
            top: { md: '120px' },
            alignSelf: { md: 'flex-start' },
            height: { md: 'fit-content' },
            maxHeight: { md: 'calc(100vh - 48px)' },
          }}
        >
          <Card
            elevation={2}
            sx={{
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              height: 'fit-content',
              maxHeight: { xs: 'auto', md: '100%' },
              overflowY: { md: 'auto' },
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
              },
            }}
          >
            <CardContent sx={{ bgcolor: '#fff', p: { xs: 3, sm: 4 } }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mb: 3, color: 'var(--primary-color)' }}
              >
                Tóm tắt đơn hàng
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography color="text.secondary">
                    Tạm tính ({selectedItems.length} sản phẩm):
                  </Typography>
                  <Typography fontWeight={500}>
                    {formatPrice(totalPrice)}
                  </Typography>
                </Box>
                {totalSavings > 0 && (
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'var(--success-color)',
                        fontSize: '0.85rem',
                        fontStyle: 'italic'
                      }}
                    >
                      Tiết kiệm được:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                        color: 'var(--success-color)',
                        fontSize: '0.85rem'
                      }}
                    >
                      {formatPrice(totalSavings)}
                    </Typography>
                  </Box>
                )}
                {applicableCoupon && (
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography color="text.secondary">Giảm giá:</Typography>
                    <Typography fontWeight={500} color="error">
                      -{formatPrice(discountAmount)}
                    </Typography>
                  </Box>
                )}
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="space-between">
                  <Typography fontWeight={700}>Tổng cộng:</Typography>
                  <Typography
                    fontWeight={700}
                    sx={{ color: 'var(--primary-color)' }}
                    fontSize="1.2rem"
                  >
                    {formatPrice(totalPrice - discountAmount)}
                  </Typography>
                </Box>
              </Box>
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<Payment />}
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  backgroundColor: 'var(--primary-color)',
                  '&:hover': {
                    backgroundColor: 'var(--accent-color)',
                  },
                  '&:disabled': {
                    backgroundColor: '#ccc',
                    color: '#666',
                  },
                }}
                disabled={selectedItems.length === 0}
                onClick={handleCheckout}
              >
                Thanh toán ngay
              </Button>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                }}
                onClick={() => navigate('/')}
              >
                Tiếp tục mua sắm
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Dialogs and Alerts */}
      <Box sx={{ mt: 4 }}>
        <SuggestionProducts />
      </Box>
      <Dialog
        open={confirmClearOpen}
        onClose={() => setConfirmClearOpen(false)}
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {deleteMode === 'single' ? 'Xóa sản phẩm' : 'Xóa giỏ hàng'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {deleteMode === 'single'
              ? 'Bạn có chắc chắn muốn xoá sản phẩm này khỏi giỏ hàng?'
              : 'Bạn có chắc chắn muốn xoá toàn bộ sản phẩm trong giỏ hàng?'}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setConfirmClearOpen(false)}
            sx={{ borderRadius: 6 }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{ borderRadius: 6 }}
            onClick={() => {
              if (deleteMode === 'single') {
                handleRemove({ variantId: itemToDelete._id })
              } else {
                handleClearCart()
              }
              setConfirmClearOpen(false)
            }}
          >
            Xoá
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for out of stock alert */}
      <Snackbar
        open={outOfStockAlert}
        autoHideDuration={6000}
        onClose={() => setOutOfStockAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity="warning"
          onClose={() => setOutOfStockAlert(false)}
          sx={{ borderRadius: 2 }}
        >
          {outOfStockMessage}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default Cart   