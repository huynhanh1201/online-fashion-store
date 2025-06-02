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

const Cart = () => {
  const { cart, loading, deleteItem, clearCart, updateItem } = useCart()
  const [selectedItems, setSelectedItems] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [showMaxQuantityAlert, setShowMaxQuantityAlert] = useState(false)
  const [confirmClearOpen, setConfirmClearOpen] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  useEffect(() => {
    if (cart?.cartItems) setCartItems(cart.cartItems)
  }, [cart])

  const allSelected =
    cartItems.length > 0 && selectedItems.length === cartItems.length
  const someSelected =
    selectedItems.length > 0 && selectedItems.length < cartItems.length

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

  const handleQuantityChange = (variantId, delta) => {
    setCartItems(prevItems => {
      return prevItems.map(i => {
        if (i.variant._id !== variantId) return i

        const currentQty = i.quantity
        const maxQty = i.variant.quantity || 1
        const newQty = Math.max(1, currentQty + delta)

        if (newQty > maxQty) {
          setShowMaxQuantityAlert(true)
          return i
        }

        updateItem({
          variantId,
          quantity: newQty
        })

        return { ...i, quantity: newQty }
      })
    })
  }

  const handleRemove = async ({ variantId }) => {
    try {
      const res = await deleteItem({ variantId })
      if (res) {
        setCartItems(prev => prev.filter(item => item.variant._id !== variantId))
        setSelectedItems(prev => prev.filter(i => i.variantId !== variantId))
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
    setConfirmClearOpen(false)
  }

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
      sx={{ minHeight: '70vh', mt: 10, mb: 5, overflowX: 'auto' }}
    >
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
                    <Box display='flex' alignItems='center' gap={2}>
                      <Box
                        sx={{ cursor: 'pointer' }}
                        onClick={() => {
                          dispatch(setSelectedItemsAction([{ variantId: variant._id, quantity: item.quantity }]))
                          navigate(`/productdetail/${variant._id}`)
                        }}
                      >
                        <Avatar
                          src={variant.image?.[0] || '/default.jpg'}
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

                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 350 }}>
                          Phân loại hàng: {item.color || 'Không rõ'}
                          {item.color && item.size ? ', ' : ''}
                          {item.size || ''}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell
                    align='center'
                    sx={{ fontWeight: '600', color: '#007B00' }}
                  >
                    {formatPrice(variant.exportPrice)}
                  </TableCell>
                  <TableCell align='center'>
                    <Box
                      display='flex'
                      alignItems='center'
                      justifyContent='center'
                    >
                      <IconButton
                        size='small'
                        onClick={() => handleQuantityChange(variant._id, -1)}
                        disabled={item.quantity <= 1}
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
                        aria-label='Tăng số lượng'
                        disabled={item.quantity >= variant.quantity}
                      >
                        <Add />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell align='center'>
                    <IconButton
                      color='error'
                      onClick={() => handleRemove({ variantId: variant._id })}
                      aria-label='Xoá sản phẩm'
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
        <Typography variant='h6' sx={{ flexGrow: 1, color: '#222' }}>
          Tổng tiền: {formatPrice(totalPrice)}
        </Typography>
        <Box display='flex' gap={2}>
          <Button
            variant='outlined'
            color='error'
            startIcon={<DeleteForever />}
            onClick={() => setConfirmClearOpen(true)}
            disabled={cartItems.length === 0}
          >
            Xoá toàn bộ
          </Button>
          <Button
            variant='contained'
            color='primary'
            disabled={selectedItems.length === 0}
            onClick={() => {
              navigate('/checkout')
            }}
          >
            Thanh toán
          </Button>
        </Box>
      </Box>

      {/* Xác nhận xoá toàn bộ */}
      <Dialog
        open={confirmClearOpen}
        onClose={() => setConfirmClearOpen(false)}
        aria-labelledby='confirm-clear-title'
      >
        <DialogTitle id='confirm-clear-title'>Xác nhận</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xoá toàn bộ sản phẩm trong giỏ hàng không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmClearOpen(false)}>Hủy</Button>
          <Button color='error' onClick={handleClearCart}>
            Xoá
          </Button>
        </DialogActions>
      </Dialog>

      {/* Thông báo khi đạt số lượng tối đa */}
      <Snackbar
        open={showMaxQuantityAlert}
        autoHideDuration={2000}
        onClose={() => setShowMaxQuantityAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity='warning' sx={{ width: '100%' }}>
          Đã đạt số lượng tối đa của sản phẩm!
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default Cart
