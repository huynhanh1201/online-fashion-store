/* eslint-disable no-console */
import React, { useState, useEffect, useRef } from 'react'
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
} from '@mui/icons-material'
import { useCart } from '~/hooks/useCarts'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  setSelectedItems as setSelectedItemsAction,
  setTempQuantity,
  removeTempQuantity,
} from '~/redux/cart/cartSlice'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary'
import { getDiscounts } from '~/services/discountService'
import SuggestionProducts from './SuggestionProducts'
import inventoryService from '~/services/inventoryService'

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
  const [inventoryQuantities, setInventoryQuantities] = useState({})
  const [fetchingVariants, setFetchingVariants] = useState(new Set())
  const [deleteMode, setDeleteMode] = useState('')
  const [itemToDelete, setItemToDelete] = useState(null)
  const tempQuantities = useSelector((state) => state.cart.tempQuantities || {})
  const [processingVariantId, setProcessingVariantId] = useState(null)

  // Refs để tránh stale closure
  const inventoryQuantitiesRef = useRef(inventoryQuantities)
  const fetchingVariantsRef = useRef(fetchingVariants)

  // Cập nhật refs khi state thay đổi
  useEffect(() => {
    inventoryQuantitiesRef.current = inventoryQuantities
  }, [inventoryQuantities])

  useEffect(() => {
    fetchingVariantsRef.current = fetchingVariants
  }, [fetchingVariants])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  useEffect(() => {
    if (cart?.cartItems) setCartItems(cart.cartItems)
  }, [cart])

  useEffect(() => {
    const fetchInventories = async () => {
      if (cartItems.length === 0) return

      const currentInventory = inventoryQuantitiesRef.current
      const currentFetching = fetchingVariantsRef.current

      const newVariantsToFetch = cartItems
        .filter(
          (item) =>
            !currentInventory[item.variant._id] &&
            !currentFetching.has(item.variant._id),
        )
        .map((item) => item.variant._id)

      if (newVariantsToFetch.length === 0) return

      setFetchingVariants((prev) => new Set([...prev, ...newVariantsToFetch]))

      try {
        const fetchPromises = newVariantsToFetch.map(async (variantId) => {
          const inventory = await inventoryService.fetchInventory(variantId)
          return { variantId, inventory }
        })

        const results = await Promise.all(fetchPromises)

        setInventoryQuantities((prev) => {
          const updated = { ...prev }
          results.forEach(({ variantId, inventory }) => {
            // Thử các trường hợp có thể có
            const quantity = inventory?.quantity || inventory?.availableQuantity || inventory?.stock || 0
            updated[variantId] = quantity
          })
          return updated
        })
      } catch (error) {
        console.error('Error fetching inventory:', error)
      } finally {
        setFetchingVariants((prev) => {
          const newSet = new Set(prev)
          newVariantsToFetch.forEach((id) => newSet.delete(id))
          return newSet
        })
      }
    }

    fetchInventories()
  }, [cartItems])

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
        console.error('Lỗi lấy danh sách mã giảm giá:', error)
      } finally {
        setHasFetchedCoupons(true)
      }
    }

    fetchCoupons()
  }, [hasFetchedCoupons])

  const allSelected =
    cartItems.length > 0 && selectedItems.length === cartItems.length
  const someSelected =
    selectedItems.length > 0 && selectedItems.length < cartItems.length

  const handleSelectAll = () => {
    const newSelected = allSelected
      ? []
      : cartItems.map((item) => ({
        variantId: item.variant._id,
        quantity: item.quantity,
      }))

    setSelectedItems(newSelected)
    dispatch(setSelectedItemsAction(newSelected))
  }

  const handleSelect = (item) => {
    const variantId = item.variant._id
    const exists = selectedItems.some((i) => i.variantId === variantId)

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

    const current = tempQuantities[variantId] ?? item.quantity
    const max = inventoryQuantities[variantId] || 99

    if (delta > 0 && current >= max) {
      setShowMaxQuantityAlert(true)
      return
    }

    const newQty = Math.min(Math.max(current + delta, 1), max)

    dispatch(setTempQuantity({ variantId, quantity: newQty }))

    setSelectedItems((prev) =>
      prev.map((i) =>
        i.variantId === variantId ? { ...i, quantity: newQty } : i,
      ),
    )
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

      setSelectedItems((prev) =>
        prev.map((i) =>
          i.variantId === variantId ? { ...i, quantity: tempQty } : i,
        ),
      )

      dispatch(removeTempQuantity(variantId))
    } catch (err) {
      console.error('Lỗi cập nhật số lượng:', err)
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
        setInventoryQuantities((prev) => {
          const { [variantId]: _, ...rest } = prev
          return rest
        })
      }
    } catch (error) {
      console.error('Lỗi xoá sản phẩm:', error)
    }
  }

  const selectedCartItems = cartItems.filter((item) =>
    selectedItems.some((selected) => selected.variantId === item.variant._id),
  )

  useEffect(() => {
    dispatch(setSelectedItemsAction(selectedItems))
  }, [selectedItems])

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
    setInventoryQuantities({})
    setConfirmClearOpen(false)
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
        maxWidth="xl"
        sx={{
          height: '70vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mt: 10,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 2,
            width: '100%',
            maxWidth: 500,
          }}
        >
          <ShoppingCart sx={{ fontSize: 60, color: '#1A3C7B', mb: 2, opacity: 0.7 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1A3C7B' }}>
            Đang tải giỏ hàng...
          </Typography>
        </Paper>
      </Container>
    )
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        minHeight: '70vh',
        mt: { xs: 10, md: 16 },
        mb: { xs: 3, md: 5 },
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
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
            <ShoppingCart sx={{ fontSize: 28, color: '#1A3C7B' }} />
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, color: '#1A3C7B', letterSpacing: 0.5 }}
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
      {coupons.length > 0 && selectedItems.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 1,
            mb: 1,
            borderRadius: 2,
            border: '1px dashed #1A3C7B',
            backgroundColor: '#E3F2FD',
          }}
        >
          <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
            <LocalOffer sx={{ color: '#1A3C7B', fontSize: 24 }} />
            <Typography
              variant="body1"
              sx={{ color: '#1A3C7B', fontWeight: 500, flex: 1 }}
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
                        </Box>{' '}
                        🎉!
                      </>
                    )
                  }
                  return (
                    <>
                      Đơn hàng của bạn đã đạt mức giảm cao nhất:{' '}
                      <Box component="span" sx={{ fontWeight: 600, mx: 0.5 }}>
                        {formatPrice(discountAmount)}
                      </Box>{' '}
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
                      </Box>{' '}
                      !
                    </>
                  )
                }
                return null
              })()}
            </Typography>

          </Box>
        </Paper>
      )}

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
                  sx={{ mt: 2, borderRadius: 6, px: 4, color: '#fff', backgroundColor: '#1A3C7B' }}
                >
                  Tiếp tục mua sắm
                </Button>
              </Box>
            ) : (
              <>
                <Box
                  sx={{
                    p: { xs: 2, sm: 3 },
                    backgroundColor: '#f5f7fa',
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
                    sx={{ p: 1 }}
                  />
                  <Typography
                    sx={{
                      ml: 1,
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

                  return (
                    <React.Fragment key={item._id}>
                      <Box
                        sx={{
                          p: { xs: 2, sm: 2 },
                          display: 'flex',
                          alignItems: 'center',
                          gap: { xs: 1.5, sm: 2 },
                          flexWrap: { xs: 'wrap', sm: 'nowrap' },
                        }}
                      >
                        {/* Checkbox */}
                        <Checkbox
                          checked={selectedItems.some((i) => i.variantId === variant._id)}
                          onChange={() => handleSelect(item)}
                          color="primary"
                          sx={{ alignSelf: 'center' }} // thay vì 'flex-start' hoặc bỏ hẳn nếu dùng Box bọc
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
                          <Typography
                            fontWeight={600}
                            sx={{
                              fontSize: {
                                xs: '0.9rem',
                                sm: '1rem',
                                md: '1.1rem',
                              },
                              maxWidth: '100%',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                            title={variant.name}
                          >
                            {capitalizeFirstLetter(variant.name)}
                          </Typography>
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
                                !inventoryQuantities[variant._id] ||
                                (tempQuantities[variant._id] ?? item.quantity) >=
                                inventoryQuantities[variant._id]
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
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mb: 3, color: '#1A3C7B' }}
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
                        color: '#4caf50',
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
                        color: '#4caf50',
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
                    sx={{ color: '#1A3C7B' }}
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
                  backgroundColor: '#1A3C7B',
                  '&:hover': {
                    backgroundColor: '#0F2A5C',
                  },
                  '&:disabled': {
                    backgroundColor: '#ccc',
                    color: '#666',
                  },
                }}
                disabled={selectedItems.length === 0}
                onClick={() => {
                  navigate('/payment')
                }}
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

      <Snackbar
        open={showMaxQuantityAlert}
        autoHideDuration={2000}
        onClose={() => setShowMaxQuantityAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity="warning"
          variant="filled"
          sx={{ width: '100%', boxShadow: 3 }}
        >
          Đã đạt số lượng tối đa của sản phẩm!
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default Cart   