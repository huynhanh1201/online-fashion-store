/* eslint-disable no-console */
import React, { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
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
  DialogTitle
} from '@mui/material'
import { Delete, Add, Remove, DeleteForever } from '@mui/icons-material'
import { useCart } from '~/hooks/useCarts'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setSelectedItems as setSelectedItemsAction } from '~/redux/cart/cartSlice'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary'
import { getDiscounts } from '~/services/discountService'

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
  const [isFetchingInventories, setIsFetchingInventories] = useState(false)
  const [deleteMode, setDeleteMode] = useState('')
  const [itemToDelete, setItemToDelete] = useState(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  useEffect(() => {
    if (cart?.cartItems) setCartItems(cart.cartItems)
  }, [cart])

  useEffect(() => {
    const fetchInventories = async () => {
      if (cartItems.length === 0) return

      const newVariantsToFetch = cartItems
        .filter(item => !inventoryQuantities[item.variant._id] && !fetchingVariants.has(item.variant._id))
        .map(item => item.variant._id)

      if (newVariantsToFetch.length === 0) return

      setIsFetchingInventories(true)
      setFetchingVariants(prev => new Set([...prev, ...newVariantsToFetch]))

      try {
        const fetchPromises = newVariantsToFetch.map(async variantId => {
          try {
            const res = await fetch(`http://localhost:8017/v1/inventories?variantId=${variantId}`)
            const result = await res.json()
            const inventoryList = result.data
            const inventory = Array.isArray(inventoryList) ? inventoryList[0] : inventoryList
            return { variantId, quantity: inventory?.quantity ?? 0 }
          } catch (error) {
            console.error(`Lỗi lấy tồn kho cho variant ${variantId}:`, error)
            return { variantId, quantity: 0 }
          }
        })

        const results = await Promise.all(fetchPromises)
        const newInventoryQuantities = { ...inventoryQuantities }
        results.forEach(({ variantId, quantity }) => {
          newInventoryQuantities[variantId] = quantity
        })

        setInventoryQuantities(newInventoryQuantities)
      } finally {
        setFetchingVariants(prev => {
          const newSet = new Set(prev)
          newVariantsToFetch.forEach(id => newSet.delete(id))
          return newSet
        })
        setIsFetchingInventories(false)
      }
    }

    fetchInventories()
  }, [cartItems, inventoryQuantities, fetchingVariants])

  useEffect(() => {
    if (hasFetchedCoupons) return

    const fetchCoupons = async () => {
      try {
        const res = await getDiscounts()
        console.log('Dữ liệu mã giảm giá:', res) // Debug
        if (Array.isArray(res.discounts) && res.discounts.length > 0) {
          setCoupons(res.discounts.sort((a, b) => a.minOrderValue - b.minOrderValue))
        }
      } catch (error) {
        console.error('Lỗi lấy danh sách mã giảm giá:', error)
      } finally {
        setHasFetchedCoupons(true)
      }
    }

    fetchCoupons()
  }, [hasFetchedCoupons])


  const allSelected = cartItems.length > 0 && selectedItems.length === cartItems.length
  const someSelected = selectedItems.length > 0 && selectedItems.length < cartItems.length

  const handleSelectAll = () => {
    const newSelected = allSelected
      ? []
      : cartItems.map(item => ({
        variantId: item.variant._id,
        quantity: item.quantity
      }))

    setSelectedItems(newSelected)
    dispatch(setSelectedItemsAction(newSelected))
  }

  const handleSelect = (item) => {
    const variantId = item.variant._id
    const exists = selectedItems.some(i => i.variantId === variantId)

    const newSelected = exists
      ? selectedItems.filter(i => i.variantId !== variantId)
      : [...selectedItems, { variantId, quantity: item.quantity }]

    setSelectedItems(newSelected)
    dispatch(setSelectedItemsAction(newSelected))
  }

  const formatPrice = (val) =>
    typeof val === 'number'
      ? val.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
      : '0₫'

  const handleQuantityChange = async (variantId, delta) => {
    if (isFetchingInventories) return

    const item = cartItems.find(i => i.variant._id === variantId)
    if (!item) return

    const currentQty = item.quantity
    const maxQty = inventoryQuantities[variantId] || 1
    const newQty = currentQty + delta

    if (newQty < 1) return
    if (newQty > maxQty) {
      setShowMaxQuantityAlert(true)
      return
    }

    try {
      await updateItem(variantId, { quantity: delta })

      setCartItems(prevItems =>
        prevItems.map(i =>
          i.variant._id === variantId
            ? { ...i, quantity: newQty }
            : i
        )
      )

      setSelectedItems(prev =>
        prev.map(i =>
          i.variantId === variantId ? { ...i, quantity: newQty } : i
        )
      )
    } catch (error) {
      console.error('Lỗi cập nhật số lượng:', error)
    }
  }

  const handleRemove = async ({ variantId }) => {
    try {
      const res = await deleteItem({ variantId })
      if (res) {
        setCartItems(prev => prev.filter(item => item.variant._id !== variantId))
        setSelectedItems(prev => prev.filter(i => i.variantId !== variantId))
        setInventoryQuantities(prev => {
          const { [variantId]: _, ...rest } = prev
          return rest
        })
      }
    } catch (error) {
      console.error('Lỗi xoá sản phẩm:', error)
    }
  }

  const selectedCartItems = cartItems.filter(item =>
    selectedItems.some(selected => selected.variantId === item.variant._id)
  )

  const totalPrice = selectedCartItems.reduce(
    (sum, item) => sum + (item.variant.exportPrice || 0) * item.quantity,
    0
  )

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
    const validCoupons = coupons.filter(c => totalPrice >= c.minOrderValue)
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
      return sorted.find(c => totalPrice < c.minOrderValue) || null
    }

    const next = sorted.find(c => c.minOrderValue > applicable.minOrderValue)
    return next || null
  }

  const applicableCoupon = getApplicableCoupon()
  const nextCoupon = getNextCoupon()
  const discountAmount = applicableCoupon ? calculateDiscount(applicableCoupon, totalPrice) : 0



  if (loading) {
    return (
      <Typography sx={{ height: '70vh', mt: 10, textAlign: 'center' }}>
        Đang tải giỏ hàng...
      </Typography>
    )
  }

  return (
    <Container
      maxWidth='xl'
      sx={{ minHeight: '70vh', mt: 16, mb: 5, overflowX: 'auto' }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Giỏ hàng:
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {cartItems.length} Sản phẩm
        </Typography>
      </Box>
      {coupons.length > 0 && selectedItems.length > 0 && (
        <Typography
          variant="body1"
          sx={{
            color: '#1A3C7B',
            backgroundColor: '#E3F2FD',
            p: 1,
            borderRadius: 1,
            mb: 2
          }}
        >
          {(() => {
            if (applicableCoupon) {
              if (nextCoupon && totalPrice < nextCoupon.minOrderValue) {
                const nextDiscountText = nextCoupon.type === 'percent'
                  ? `${nextCoupon.amount}%`
                  : formatPrice(nextCoupon.amount)
                return `Bạn đang được Giảm ${formatPrice(discountAmount)}, chỉ cần mua thêm ${formatPrice(nextCoupon.minOrderValue - totalPrice)} để nhận mã giảm ${nextDiscountText} 🎉!`
              }
              return `Đơn hàng của bạn đã đạt mức giảm cao nhất: ${formatPrice(discountAmount)} 🎉`
            }
            const first = coupons[0]
            if (first) {
              const discountText = first.type === 'percent'
                ? `${first.amount}%`
                : formatPrice(first.amount)
              return `Chỉ cần mua thêm ${formatPrice(first.minOrderValue - totalPrice)} để nhận mã giảm ${discountText} 🎉!`
            }
            return null
          })()}
        </Typography>
      )}

      <Table size='medium' sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell padding='checkbox' sx={{ width: 50 }}>
              <Checkbox
                indeterminate={someSelected}
                checked={allSelected}
                onChange={handleSelectAll}
                color='primary'
              />
            </TableCell>
            <TableCell align='left' sx={{ fontWeight: 'bold' }}>
              Sản phẩm
            </TableCell>
            <TableCell align='center' sx={{ fontWeight: 'bold', width: 120 }}>
              Giá
            </TableCell>
            <TableCell align='center' sx={{ fontWeight: 'bold', width: 130 }}>
              Số lượng
            </TableCell>
            <TableCell align='center' sx={{ fontWeight: 'bold', width: 90 }}>
              Thao tác
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cartItems.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                align='center'
                sx={{ py: 8, fontSize: '1.2rem', color: 'text.secondary' }}
              >
                Giỏ hàng của bạn đang trống
              </TableCell>
            </TableRow>
          ) : (
            cartItems.map((item) => {
              const variant = item.variant
              if (!variant) return null

              return (
                <TableRow key={item._id} hover>
                  <TableCell padding='checkbox'>
                    <Checkbox
                      checked={selectedItems.some(i => i.variantId === variant._id)}
                      onChange={() => handleSelect(item)}
                      color='primary'
                    />
                  </TableCell>
                  <TableCell>
                    <Box display='flex' alignItems='start' gap={2}>
                      <Box
                        sx={{ cursor: 'pointer' }}
                        onClick={() => {
                          dispatch(setSelectedItemsAction([{ variantId: variant._id, quantity: item.quantity }]))
                          navigate(`/productdetail/${variant.productId}`)
                        }}
                      >
                        <Avatar
                          src={optimizeCloudinaryUrl(variant.color?.image) || '/default.jpg'}
                          variant='square'
                          sx={{
                            width: 64,
                            height: 64,
                            borderRadius: 1,
                            objectFit: 'cover'
                          }}
                        />
                      </Box>
                      <Box>
                        <Typography
                          fontWeight={600}
                          sx={{
                            lineHeight: 1.2,
                            maxWidth: 350,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                          title={variant.name}
                        >
                          {variant.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Phân loại hàng: {variant.color?.name || 'Không rõ'}, {variant.size?.name || 'Không rõ'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align='center' sx={{ fontWeight: '600', color: '#007B00' }}>
                    {formatPrice(variant.exportPrice)}
                  </TableCell>
                  <TableCell align='center'>
                    <Box display='flex' alignItems='center' justifyContent='center'>
                      <IconButton
                        size='small'
                        onClick={() => handleQuantityChange(variant._id, -1)}
                        disabled={isFetchingInventories || item.quantity <= 1}
                        aria-label='Giảm số lượng'
                      >
                        <Remove />
                      </IconButton>
                      <TextField
                        value={item.quantity}
                        size='small'
                        sx={{ width: 50, mx: 1 }}
                        inputProps={{
                          style: { textAlign: 'center' },
                          readOnly: true
                        }}
                      />
                      <IconButton
                        size='small'
                        onClick={() => handleQuantityChange(variant._id, 1)}
                        disabled={isFetchingInventories || item.quantity >= (inventoryQuantities[variant._id] || 99)}
                        aria-label='Tăng số lượng'
                      >
                        <Add />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell align='center'>
                    <IconButton
                      color='error'
                      onClick={() => {
                        setDeleteMode('single')
                        setItemToDelete(variant)
                        setConfirmClearOpen(true)
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>

      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mt={4}
        px={1}
        flexWrap='wrap'
        gap={2}
      >
        <Box>
          <Typography variant='h6' sx={{ flexGrow: 1, color: '#222', fontWeight: 700 }}>
            Tổng tiền: {formatPrice(totalPrice)}
          </Typography>
        </Box>
        <Box display='flex' gap={2}>
          <Button
            color='primary'
            sx={{
              backgroundColor: '#1A3C7B',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#3f51b5'
              },
              '&:disabled': {
                backgroundColor: '#ccc',
                color: '#666',
                boxShadow: 'none'
              }
            }}
            disabled={selectedItems.length === 0}
            onClick={() => {
              navigate('/payment')
            }}
          >
            Thanh toán
          </Button>
          <Button
            color='error'
            onClick={() => {
              setDeleteMode('all')
              setConfirmClearOpen(true)
            }}
          >
            Xoá toàn bộ
          </Button>
        </Box>
      </Box>

      <Dialog
        open={confirmClearOpen}
        onClose={() => setConfirmClearOpen(false)}
      >
        <DialogTitle>Xác nhận</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {deleteMode === 'single'
              ? 'Bạn có chắc chắn muốn xoá sản phẩm này không?'
              : 'Bạn có chắc chắn muốn xoá toàn bộ sản phẩm trong giỏ hàng không?'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmClearOpen(false)}>Hủy</Button>
          <Button
            sx={{ color: 'black' }}
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
        <Alert severity='warning' sx={{ width: '100%' }}>
          Đã đạt số lượng tối đa của sản phẩm!
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default Cart