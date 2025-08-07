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
  Collapse,
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
  ExpandMore,
} from '@mui/icons-material'
import { useCart } from '~/hooks/useCarts'
import { Navigate, useNavigate } from 'react-router-dom'
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
  const [updateTimers, setUpdateTimers] = useState({})
  const [expandedProducts, setExpandedProducts] = useState({})

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    setHasAutoSelected(false)

    return () => {
      Object.values(updateTimers).forEach((timer) => {
        if (timer) clearTimeout(timer)
      })
    }
  }, [])

  useEffect(() => {
    if (cartItems.length > 0) {
      const newExpandedProducts = {}
      Object.keys(groupedCartItems).forEach((productId) => {
        newExpandedProducts[productId] = true
      })
      setExpandedProducts(newExpandedProducts)
    }
  }, [cartItems.length])

  useEffect(() => {
    if (selectedItems.length > 0 && cartItems.length > 0) {
      const validSelectedItems = selectedItems.filter((selected) => {
        const item = cartItems.find(
          (cartItem) =>
            (cartItem.variantId?._id || cartItem.variantId) === selected.variantId
        )
        return (
          item &&
          item.quantity > 0 &&
          (item.variantId?.quantity === undefined || item.variantId.quantity > 0) &&
          item.variantId?.status !== 'inactive'
        )
      })

      if (validSelectedItems.length < selectedItems.length) {
        setSelectedItems(validSelectedItems)
        dispatch(setSelectedItemsAction(validSelectedItems))
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

      const outOfStockItems = sortedItems.filter((item) => item.quantity === 0)
      if (outOfStockItems.length > 0) {
        setOutOfStockMessage(
          'Một số sản phẩm trong giỏ hàng đã hết hàng và không thể chọn để thanh toán'
        )
        setOutOfStockAlert(true)
        setSelectedItems((prev) => {
          const filteredItems = prev.filter(
            (selected) =>
              !outOfStockItems.some(
                (outOfStock) =>
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
        .filter((item) => {
          const variantId = item.variantId?._id || item.variantId
          const isMatch = reorderVariantIds.includes(variantId)
          const hasStock = item.quantity > 0
          return isMatch && hasStock
        })
        .map((item) => ({
          variantId: item.variantId?._id || item.variantId,
          quantity: item.quantity,
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
          setCoupons(res.discounts.sort((a, b) => a.minOrderValue - b.minOrderValue))
        }
      } catch (error) {
      } finally {
        setHasFetchedCoupons(true)
      }
    }

    fetchCoupons()
  }, [hasFetchedCoupons])

  const selectableItems = cartItems.filter(
    (item) => item.quantity > 0 && item.variantId?.status !== 'inactive'
  )

  const selectedSelectableItems = selectedItems.filter((selected) =>
    selectableItems.some(
      (item) => (item.variantId?._id || item.variantId) === selected.variantId
    )
  )

  const allSelected =
    selectableItems.length > 0 &&
    selectedSelectableItems.length === selectableItems.length
  const someSelected =
    selectedSelectableItems.length > 0 &&
    selectedSelectableItems.length < selectableItems.length

  const handleSelectAll = () => {
    const newSelected = allSelected
      ? []
      : selectableItems.map((item) => ({
        variantId: item.variantId?._id || item.variantId,
        quantity: item.quantity,
      }))

    setSelectedItems(newSelected)
    dispatch(setSelectedItemsAction(newSelected))
  }

  const handleSelect = (item) => {
    const variantId = item.variantId?._id || item.variantId
    const variant = item.variantId
    const exists = selectedItems.some((i) => i.variantId === variantId)

    const isOutOfStock =
      item.quantity === 0 ||
      (variant?.quantity !== undefined && variant.quantity === 0)
    const isInactive = variant?.status === 'inactive' || variant?.productId?.status === 'inactive'

    if (!exists && (isOutOfStock || isInactive)) {
      setOutOfStockMessage(
        isInactive
          ? 'Sản phẩm này đã ngừng bán và không thể chọn'
          : 'Sản phẩm này đã hết hàng và không thể chọn'
      )
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
    typeof val === 'number' ? val.toLocaleString('vi-VN') + '₫' : '0₫'

  const handleQuantityChange = (variantId, delta) => {
    if (processingVariantId === variantId) return

    const item = cartItems.find((i) => i.variantId._id === variantId)
    if (!item) return

    if (item.quantity === 0 || item.variantId?.status === 'inactive' || item.variantId?.productId?.status === 'inactive') return

    const current = tempQuantities[variantId] ?? item.quantity
    const max = item.variantId.quantity || 99

    // Kiểm tra giới hạn trước khi tính toán
    if (delta > 0 && current >= max) {
      setShowMaxQuantityAlert(true)
      return
    }

    if (delta < 0 && current <= 1) {
      return // Không cho phép giảm xuống dưới 1
    }

    // Tính toán số lượng mới với kiểm tra nghiêm ngặt
    let newQty = current + delta

    // Đảm bảo newQty trong khoảng hợp lệ
    if (newQty < 1) newQty = 1
    if (newQty > max) newQty = max

    // Kiểm tra lần cuối để đảm bảo không có số âm
    if (newQty < 1) return

    dispatch(setTempQuantity({ variantId, quantity: newQty }))

    setSelectedItems((prev) => {
      const existingItem = prev.find((i) => i.variantId === variantId)
      let newSelectedItems
      if (existingItem) {
        newSelectedItems = prev.map((i) =>
          i.variantId === variantId ? { ...i, quantity: newQty } : i
        )
      } else {
        newSelectedItems = [...prev, { variantId, quantity: newQty }]
      }
      dispatch(setSelectedItemsAction(newSelectedItems))
      return newSelectedItems
    })
  }

  const handleMouseLeave = async (variantId) => {
    const item = cartItems.find((i) => i.variantId._id === variantId)
    const tempQty = tempQuantities[variantId]

    if (!item || tempQty === undefined || tempQty === item.quantity) return

    // Đảm bảo tempQty không âm
    if (tempQty < 1) {
      dispatch(removeTempQuantity(variantId))
      return
    }

    try {
      setProcessingVariantId(variantId)
      const delta = tempQty - item.quantity
      const result = await updateItem(variantId, { quantity: delta })

      if (result.success) {
        // Cập nhật cartItems cục bộ
        setCartItems((prev) =>
          prev.map((i) =>
            i.variantId._id === variantId ? { ...i, quantity: tempQty } : i
          )
        )

        // Cập nhật selectedItems
        setSelectedItems((prev) => {
          const newSelectedItems = prev.map((i) =>
            i.variantId === variantId ? { ...i, quantity: tempQty } : i
          )
          dispatch(setSelectedItemsAction(newSelectedItems))
          return newSelectedItems
        })

        // Làm mới dữ liệu từ server để cập nhật badge
        // result.cartItems đã được cập nhật trong useCart hook
      } else {
        throw new Error(result.message || 'Failed to update item')
      }

      dispatch(removeTempQuantity(variantId))
    } catch (err) {
      console.error('Error updating quantity:', err)
      setOutOfStockMessage(err.message || 'Không thể cập nhật số lượng sản phẩm')
      setOutOfStockAlert(true)
      // Reset về số lượng ban đầu khi có lỗi
      dispatch(removeTempQuantity(variantId))
      setSelectedItems((prev) => {
        const newSelectedItems = prev.map((i) =>
          i.variantId === variantId ? { ...i, quantity: item.quantity } : i
        )
        dispatch(setSelectedItemsAction(newSelectedItems))
        return newSelectedItems
      })
    } finally {
      setProcessingVariantId(null)
    }
  }

  const handleRemove = async ({ variantId }) => {
    try {
      const res = await deleteItem({ variantId })
      if (res) {
        setCartItems((prev) =>
          prev.filter((item) => item.variantId._id !== variantId)
        )
        setSelectedItems((prev) =>
          prev.filter((i) => i.variantId !== variantId)
        )
      }
    } catch (error) {
    }
  }

  const selectedCartItems = cartItems.filter((item) =>
    selectedItems.some((selected) => selected.variantId === item.variantId._id)
  )

  const getFinalPrice = (variant) => {
    const basePrice = variant.exportPrice || 0
    const discount = variant.discountPrice || 0
    return Math.max(basePrice - discount, 0)
  }

  const totalPrice = selectedCartItems.reduce((sum, item) => {
    const selected = selectedItems.find((i) => i.variantId === item.variantId._id)
    const qty = selected?.quantity || item.quantity
    return sum + getFinalPrice(item.variantId) * qty
  }, 0)

  const totalSavings = selectedCartItems.reduce((sum, item) => {
    const selected = selectedItems.find((i) => i.variantId === item.variantId._id)
    const qty = selected?.quantity || item.quantity
    const variant = item.variantId

    if (variant.discountPrice && variant.discountPrice > 0) {
      return sum + variant.discountPrice * qty
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

  const groupedCartItems = cartItems.reduce((groups, item) => {
    const productId = item.variantId?.productId?._id
    if (!productId) return groups

    if (!groups[productId]) {
      groups[productId] = {
        productId,
        productName: item.variantId?.name || 'Sản phẩm không rõ',
        variants: [],
      }
    }

    groups[productId].variants.push(item)
    return groups
  }, {})

  const handleAccordionToggle = (productId) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }))
  }

  const isProductFullySelected = (productId) => {
    const productGroup = groupedCartItems[productId]
    if (!productGroup) return false

    const selectableVariants = productGroup.variants.filter(
      (item) => item.quantity > 0 && item.variantId?.status !== 'inactive' && item.variantId?.productId?.status !== 'inactive'
    )
    const selectedVariants = selectableVariants.filter((item) =>
      selectedItems.some((selected) => selected.variantId === item.variantId?._id)
    )

    return selectableVariants.length > 0 && selectedVariants.length === selectableVariants.length
  }

  const isProductPartiallySelected = (productId) => {
    const productGroup = groupedCartItems[productId]
    if (!productGroup) return false

    const selectableVariants = productGroup.variants.filter(
      (item) => item.quantity > 0 && item.variantId?.status !== 'inactive' && item.variantId?.productId?.status !== 'inactive'
    )
    const selectedVariants = selectableVariants.filter((item) =>
      selectedItems.some((selected) => selected.variantId === item.variantId?._id)
    )

    return selectedVariants.length > 0 && selectedVariants.length < selectableVariants.length
  }

  const handleProductGroupSelect = (productId) => {
    const productGroup = groupedCartItems[productId]
    if (!productGroup) return

    const selectableVariants = productGroup.variants.filter(
      (item) => item.quantity > 0 && item.variantId?.status !== 'inactive' && item.variantId?.productId?.status !== 'inactive'
    )
    const isFullySelected = selectableVariants.every((item) =>
      selectedItems.some((selected) => selected.variantId === item.variantId?._id)
    )

    let newSelected = [...selectedItems]
    if (isFullySelected) {
      newSelected = selectedItems.filter(
        (selected) =>
          !selectableVariants.some((item) => selected.variantId === item.variantId?._id)
      )
    } else {
      const variantsToAdd = selectableVariants
        .filter((item) => !selectedItems.some((selected) => selected.variantId === item.variantId?._id))
        .map((item) => ({
          variantId: item.variantId?._id,
          quantity: item.quantity,
        }))
      newSelected = [...selectedItems, ...variantsToAdd]
    }

    setSelectedItems(newSelected)
    dispatch(setSelectedItemsAction(newSelected))
  }

  const handleClearCart = async () => {
    await clearCart()
    setCartItems([])
    setSelectedItems([])
    setConfirmClearOpen(false)
  }

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      setOutOfStockMessage('Vui lòng chọn ít nhất một sản phẩm để thanh toán')
      setOutOfStockAlert(true)
      return
    }

    const selectedCartItems = cartItems.filter((item) =>
      selectedItems.some((selected) => item.variantId?._id === selected.variantId)
    )

    if (selectedCartItems.length === 0) {
      setOutOfStockMessage('Không tìm thấy sản phẩm đã chọn trong giỏ hàng')
      setOutOfStockAlert(true)
      return
    }

    const hasOutOfStockSelected = selectedCartItems.some(
      (item) =>
        item.quantity === 0 ||
        (item.variantId?.quantity !== undefined && item.variantId.quantity === 0)
    )

    if (hasOutOfStockSelected) {
      const validSelectedItems = selectedItems.filter((selected) => {
        const item = cartItems.find(
          (cartItem) => cartItem.variantId?._id === selected.variantId
        )
        return (
          item &&
          item.quantity > 0 &&
          (item.variantId?.quantity === undefined || item.variantId.quantity > 0) &&
          item.variantId?.status !== 'inactive' &&
          item.variantId?.productId?.status !== 'inactive'
        )
      })

      setSelectedItems(validSelectedItems)
      dispatch(setSelectedItemsAction(validSelectedItems))
      setOutOfStockMessage('Đã loại bỏ các sản phẩm hết hàng khỏi danh sách thanh toán')
      setOutOfStockAlert(true)

      if (validSelectedItems.length === 0) {
        setOutOfStockMessage('Tất cả sản phẩm đã chọn đều hết hàng')
        setOutOfStockAlert(true)
        return
      }
    }

    if (totalPrice <= 0) {
      setOutOfStockMessage('Tổng tiền phải lớn hơn 0')
      setOutOfStockAlert(true)
      return
    }

    const applicableCoupon = getApplicableCoupon()
    if (applicableCoupon) {
      const discountAmount = calculateDiscount(applicableCoupon, totalPrice)
      dispatch(
        setAppliedCoupon({
          coupon: applicableCoupon,
          discount: discountAmount,
        })
      )
    } else {
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
          width: '100%',
          maxWidth: '96vw',
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
          <ShoppingCart
            sx={{
              fontSize: 60,
              color: 'var(--primary-color)',
              mb: 2,
              opacity: 0.7,
            }}
          />
          <Typography
            variant='h5'
            sx={{ fontWeight: 600, color: 'var(--primary-color)' }}
          >
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
        width: '100%',
        maxWidth: '97vw',
        margin: '0 auto',
        minHeight: '70vh',
        mt: { xs: 10, md: 16 },
        mb: { xs: 3, md: 5 },
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Box
        sx={{
          bottom: { xs: '20px', sm: '30px', md: '40px' },
          left: { xs: '20px', sm: '30px', md: '40px' },
          right: { xs: '20px', sm: '30px', md: '40px' },
          maxWidth: '1800px',
          margin: '0 auto',
          mb: 2,
        }}
      >
        <Breadcrumbs
          separator={<NavigateNext fontSize='small' />}
          aria-label='breadcrumb'
          sx={{ py: { xs: 2, md: 0 } }}
        >
          <Link
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: '#007bff',
              textDecoration: 'none',
              minWidth: 0,
              p: 0,
              '&:hover': { color: 'primary.main' },
              cursor: 'pointer',
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
              '&:hover': { color: 'primary.main' },
              cursor: 'pointer',
            }}
            onClick={() => navigate('/product')}
          >
            Sản phẩm
          </Link>
          <Typography
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: 'text.primary',
              fontWeight: 500,
            }}
          >
            Giỏ hàng
          </Typography>
        </Breadcrumbs>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        }}
      >
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          flexWrap='wrap'
          gap={2}
        >
          <Box display='flex' alignItems='center' gap={1.5}>
            <ShoppingCart sx={{ fontSize: 28, color: 'var(--primary-color)' }} />
            <Typography
              variant='h5'
              sx={{
                fontWeight: 700,
                color: 'var(--primary-color)',
                letterSpacing: 0.5,
                fontSize: { xs: '1.25rem', md: '1.5rem' },
              }}
            >
              Giỏ hàng
            </Typography>
          </Box>
          <Chip
            label={`${Object.keys(groupedCartItems).length} Sản phẩm (${cartItems.length} phân loại)`}
            color='primary'
            variant='outlined'
            sx={{ fontWeight: 600, borderRadius: 6, px: 1.5 }}
          />
        </Box>
      </Paper>

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
          }}
        >
          <Box display='flex' alignItems='center' gap={1.5} flexWrap='wrap'>
            <LocalOffer sx={{ color: 'var(--primary-color)', fontSize: 24 }} />
            <Typography
              variant='body2'
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
                        <Box component='span' sx={{ fontWeight: 600, mx: 0.5 }}>
                          {formatPrice(discountAmount)}
                        </Box>
                        , chỉ cần mua thêm
                        <Box component='span' sx={{ fontWeight: 600, mx: 0.5 }}>
                          {formatPrice(nextCoupon.minOrderValue - totalPrice)}
                        </Box>
                        để nhận mã giảm
                        <Box component='span' sx={{ fontWeight: 600, mx: 0.5 }}>
                          {nextDiscountText}
                        </Box>
                        🎉!
                      </>
                    )
                  }
                  return (
                    <>
                      Đơn hàng của bạn đã đạt mức giảm cao nhất:{' '}
                      <Box component='span' sx={{ fontWeight: 600, mx: 0.5 }}>
                        {formatPrice(discountAmount)}
                      </Box>
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
                      <Box component='span' sx={{ fontWeight: 600, mx: 0.5 }}>
                        {formatPrice(first.minOrderValue - totalPrice)}
                      </Box>
                      để nhận mã giảm
                      <Box component='span' sx={{ fontWeight: 600, mx: 0.5 }}>
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

      <Box
        display='flex'
        flexDirection={{ xs: 'column', md: 'row' }}
        alignItems='flex-start'
        gap={3}
        sx={{ position: 'relative' }}
      >
        <Box flex={{ xs: '1 1 100%', md: 2 }} width={{ xs: '100%', md: 'auto' }}>
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
                  variant='h5'
                  sx={{ color: 'text.secondary', fontWeight: 500 }}
                >
                  Giỏ hàng của bạn đang trống
                </Typography>
                <Button
                  variant='contained'
                  onClick={() => navigate('/')}
                  startIcon={<ArrowForward />}
                  sx={{
                    mt: 2,
                    borderRadius: 6,
                    px: 4,
                    color: '#fff',
                    backgroundColor: 'var(--primary-color)',
                  }}
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
                    color='primary'
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
                  <Tooltip title='Xóa tất cả'>
                    <IconButton
                      color='error'
                      onClick={() => {
                        setDeleteMode('all')
                        setConfirmClearOpen(true)
                      }}
                      size='small'
                    >
                      <DeleteForever />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Divider />

                {Object.values(groupedCartItems).map((productGroup) => {
                  const { productId, productName, variants } = productGroup
                  const isExpanded = expandedProducts[productId] || false
                  const isFullySelected = isProductFullySelected(productId)
                  const isPartiallySelected = isProductPartiallySelected(productId)
                  const firstVariant = variants[0]?.variantId
                  if (!firstVariant) return null

                  const isProductInactive = firstVariant.productId?.status === 'inactive'
                  const selectableVariants = variants.filter(
                    (item) =>
                      item.quantity > 0 &&
                      item.variantId?.status !== 'inactive' &&
                      !isProductInactive
                  )
                  const outOfStockVariants = variants.filter((item) => item.quantity === 0)

                  return (
                    <React.Fragment key={productId}>
                      <Box
                        sx={{
                          p: { xs: 2, sm: 2 },
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          backgroundColor: isProductInactive ? '#f5f5f5' : '#f8f9fa',
                          borderLeft: '4px solid var(--primary-color)',
                          opacity: isProductInactive ? 0.6 : 1,
                        }}
                      >
                        <Checkbox
                          checked={isFullySelected}
                          indeterminate={isPartiallySelected}
                          onChange={() => handleProductGroupSelect(productId)}
                          color='primary'
                          disabled={selectableVariants.length === 0 || isProductInactive}
                          sx={{ p: 1 }}
                        />
                        <Box
                          sx={{ cursor: isProductInactive ? 'not-allowed' : 'pointer' }}
                          onClick={() => {
                            if (!isProductInactive) {
                              navigate(`/productdetail/${productId}`)
                            }
                          }}
                        >
                          <Avatar
                            src={optimizeCloudinaryUrl(firstVariant.color?.image) || '/default.jpg'}
                            variant='square'
                            sx={{
                              width: { xs: 50, sm: 60, md: 70 },
                              height: { xs: 50, sm: 60, md: 70 },
                              borderRadius: 2,
                              objectFit: 'cover',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            }}
                          />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            fontWeight={700}
                            sx={{
                              fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                              color: 'var(--primary-color)',
                              mb: 0.5,
                            }}
                          >
                            {capitalizeFirstLetter(productName)}
                          </Typography>
                          <Box display='flex' gap={1} flexWrap='wrap' alignItems='center'>
                            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                              {variants.length} phân loại hàng
                              {selectableVariants.length < variants.length}
                            </Typography>
                            {isProductInactive && (
                              <Chip
                                size='small'
                                label='Ngừng bán'
                                sx={{
                                  fontSize: '0.75rem',
                                  backgroundColor: '#9e9e9e',
                                  color: 'white',
                                  fontWeight: 600,
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                        <IconButton
                          onClick={() => handleAccordionToggle(productId)}
                          sx={{
                            color: 'var(--primary-color)',
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease',
                          }}
                        >
                          <ExpandMore />
                        </IconButton>
                      </Box>
                      <Collapse in={isExpanded} timeout='auto' unmountOnExit>
                        {variants.map((item) => {
                          const variant = item.variantId
                          if (!variant) return null

                          const isOutOfStock =
                            item.quantity === 0 ||
                            (variant.quantity !== undefined && variant.quantity === 0)
                          const isVariantInactive = variant.status === 'inactive'
                          const isDisabled = isOutOfStock || isVariantInactive || isProductInactive

                          return (
                            <React.Fragment key={item._id}>
                              <Box
                                sx={{
                                  p: { xs: 2, sm: 2 },
                                  pl: { xs: 4, sm: 6 },
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 2,
                                  flexWrap: { xs: 'wrap', sm: 'nowrap' },
                                  opacity: isDisabled ? 0.6 : 1,
                                  backgroundColor: isDisabled ? '#f5f5f5' : 'transparent',
                                }}
                              >
                                <Checkbox
                                  checked={selectedItems.some((i) => i.variantId === variant._id)}
                                  onChange={() => handleSelect(item)}
                                  color='primary'
                                  disabled={isDisabled}
                                  sx={{ p: 1, alignSelf: 'center' }}
                                />
                                <Box
                                  sx={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                                  onClick={() => {
                                    if (!isDisabled) {
                                      dispatch(
                                        setSelectedItemsAction([
                                          {
                                            variantId: variant._id,
                                            quantity: item.quantity,
                                          },
                                        ])
                                      )
                                      navigate(`/productdetail/${variant.productId._id}`)
                                    }
                                  }}
                                >
                                  <Avatar
                                    src={optimizeCloudinaryUrl(variant.color?.image) || '/default.jpg'}
                                    variant='square'
                                    sx={{
                                      width: { xs: 50, sm: 60, md: 80 },
                                      height: { xs: 50, sm: 60, md: 80 },
                                      borderRadius: 2,
                                      objectFit: 'cover',
                                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    }}
                                  />
                                </Box>
                                <Box
                                  sx={{
                                    flex: 1,
                                    minWidth: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1,
                                  }}
                                >
                                  <Box display='flex' alignItems='center' gap={1} flexWrap='wrap'>
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
                                          size='small'
                                          label={`-${Math.round(
                                            (variant.discountPrice / variant.exportPrice) * 100
                                          )}%`}
                                          sx={{
                                            display: { xs: 'none', sm: 'inline-block' },
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
                                  <Box display='flex' gap={1} flexWrap='wrap' alignItems='center'>
                                    <Chip
                                      size='small'
                                      label={capitalizeFirstLetter(variant.color?.name) || 'Không rõ'}
                                      sx={{ fontSize: '0.75rem' }}
                                    />
                                    <Chip
                                      size='small'
                                      label={formatSize(variant.size?.name) || 'Không rõ'}
                                      sx={{ fontSize: '0.75rem' }}
                                    />
                                    {isOutOfStock && (
                                      <Chip
                                        size='small'
                                        label='Hết hàng'
                                        sx={{
                                          fontSize: '0.75rem',
                                          backgroundColor: '#ff5722',
                                          color: 'white',
                                          fontWeight: 600,
                                        }}
                                      />
                                    )}
                                    {isVariantInactive && isProductInactive && (
                                      <Chip
                                        size='small'
                                        label='Ngừng bán'
                                        sx={{
                                          fontSize: '0.75rem',
                                          backgroundColor: '#9e9e9e',
                                          color: 'white',
                                          fontWeight: 600,
                                        }}
                                      />
                                    )}
                                    {isVariantInactive && !isProductInactive && (
                                      <Chip
                                        size='small'
                                        label='Ngừng bán'
                                        sx={{
                                          fontSize: '0.75rem',
                                          backgroundColor: '#9e9e9e',
                                          color: 'white',
                                          fontWeight: 600,
                                        }}
                                      />
                                    )}
                                  </Box>
                                </Box>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-end',
                                    gap: 1.5,
                                  }}
                                >
                                  <Box
                                    display='flex'
                                    alignItems='center'
                                    onMouseLeave={() => handleMouseLeave(variant._id)}
                                    sx={{
                                      border: '1px solid #e0e0e0',
                                      borderRadius: 1,
                                      overflow: 'hidden',
                                    }}
                                  >
                                    <IconButton
                                      size='small'
                                      onMouseDown={() => handleQuantityChange(variant._id, -1)}
                                      disabled={
                                        processingVariantId === variant._id ||
                                        isDisabled ||
                                        (tempQuantities[variant._id] ?? item.quantity) <= 1
                                      }
                                      sx={{ borderRadius: 0, p: 0.5 }}
                                    >
                                      <Remove fontSize='small' />
                                    </IconButton>
                                    <TextField
                                      value={tempQuantities[variant._id] ?? item.quantity}
                                      size='small'
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
                                      size='small'
                                      onMouseDown={() => handleQuantityChange(variant._id, 1)}
                                      disabled={
                                        processingVariantId === variant._id ||
                                        isDisabled ||
                                        (tempQuantities[variant._id] ?? item.quantity) >=
                                        (variant.quantity || 99)
                                      }
                                      sx={{ borderRadius: 0, p: 0.5 }}
                                    >
                                      <Add fontSize='small' />
                                    </IconButton>
                                  </Box>
                                  <IconButton
                                    color='error'
                                    onClick={() => {
                                      setDeleteMode('single')
                                      setItemToDelete(variant)
                                      setConfirmClearOpen(true)
                                    }}
                                    size='small'
                                  >
                                    <Delete fontSize='small' />
                                  </IconButton>
                                </Box>
                              </Box>
                              <Divider />
                            </React.Fragment>
                          )
                        })}
                      </Collapse>
                      <Divider sx={{ borderWidth: 2, borderColor: '#e0e0e0' }} />
                    </React.Fragment>
                  )
                })}
              </>
            )}
          </Paper>
        </Box>
        <Box
          flex={{ xs: '1 1 100%', md: 1 }}
          width={{ xs: '100%', md: 'auto' }}
          sx={{
            position: { md: 'sticky' },
            top: { md: '120px' },
            alignSelf: { md: 'flex-start' },
            height: { md: 'fit-content' },
            maxHeight: { xs: 'auto', md: 'calc(100vh - 48px)' },
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
              '&:hover': { boxShadow: '0 8px 30px rgba(0,0,0,0.1)' },
            }}
          >
            <CardContent sx={{ bgcolor: '#fff', p: { xs: 3, sm: 4 } }}>
              <Typography
                variant='h6'
                sx={{ fontWeight: 700, mb: 3, color: 'var(--primary-color)' }}
              >
                Tóm tắt đơn hàng
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box display='flex' justifyContent='space-between' mb={1}>
                  <Typography color='text.secondary'>
                    Tạm tính ({selectedItems.length} sản phẩm):
                  </Typography>
                  <Typography fontWeight={500}>{formatPrice(totalPrice)}</Typography>
                </Box>
                {totalSavings > 0 && (
                  <Box display='flex' justifyContent='space-between' mb={1}>
                    <Typography
                      variant='body2'
                      sx={{
                        color: 'var(--success-color)',
                        fontSize: '0.85rem',
                        fontStyle: 'italic',
                      }}
                    >
                      Tiết kiệm được:
                    </Typography>
                    <Typography
                      variant='body2'
                      sx={{
                        fontWeight: 600,
                        color: 'var(--success-color)',
                        fontSize: '0.85rem',
                      }}
                    >
                      {formatPrice(totalSavings)}
                    </Typography>
                  </Box>
                )}
                {applicableCoupon && (
                  <Box display='flex' justifyContent='space-between' mb={1}>
                    <Typography color='text.secondary'>Giảm giá:</Typography>
                    <Typography fontWeight={500} color='error'>
                      -{formatPrice(discountAmount)}
                    </Typography>
                  </Box>
                )}
                <Divider sx={{ my: 2 }} />
                <Box display='flex' justifyContent='space-between'>
                  <Typography fontWeight={700}>Tổng cộng:</Typography>
                  <Typography
                    fontWeight={700}
                    sx={{ color: 'var(--primary-color)' }}
                    fontSize='1.2rem'
                  >
                    {formatPrice(totalPrice - discountAmount)}
                  </Typography>
                </Box>
              </Box>
              <Button
                fullWidth
                variant='contained'
                size='large'
                startIcon={<Payment />}
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  backgroundColor: 'var(--primary-color)',
                  '&:hover': { backgroundColor: 'var(--accent-color)' },
                  '&:disabled': { backgroundColor: '#ccc', color: '#666' },
                }}
                disabled={selectedItems.length === 0}
                onClick={handleCheckout}
              >
                Thanh toán ngay
              </Button>
              <Button
                fullWidth
                variant='outlined'
                size='large'
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

      <Box sx={{ mt: 4 }}>
        <SuggestionProducts />
      </Box>
      <Dialog
        open={confirmClearOpen}
        onClose={() => setConfirmClearOpen(false)}
        PaperProps={{ sx: { borderRadius: 2 } }}
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
            variant='outlined'
            onClick={() => setConfirmClearOpen(false)}
            sx={{ borderRadius: 6 }}
          >
            Hủy
          </Button>
          <Button
            variant='contained'
            color='error'
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

      <Snackbar
        open={outOfStockAlert}
        autoHideDuration={6000}
        onClose={() => setOutOfStockAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity='warning'
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