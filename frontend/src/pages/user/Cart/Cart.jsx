import React, { useState, useEffect } from 'react'
import {
  Box, Container, Table, TableHead, TableRow, TableCell, TableBody,
  Typography, IconButton, TextField, Avatar, Button, Checkbox, Snackbar, Alert
} from '@mui/material'
import { Delete, Add, Remove } from '@mui/icons-material'
import { useCart } from '~/hooks/useCarts'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setSelectedItems as setSelectedItemsAction } from '~/redux/cart/cartSlice'
const Cart = () => {
  const { cart, loading, deleteItem, clearCart, updateItem } = useCart()
  const [selectedItems, setSelectedItems] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [showMaxQuantityAlert, setShowMaxQuantityAlert] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  useEffect(() => {
    if (cart?.cartItems) setCartItems(cart.cartItems)
  }, [cart])

  // Kiểm tra đã chọn hết chưa
  const allSelected = cartItems.length > 0 && selectedItems.length === cartItems.length
  // Kiểm tra chọn một phần
  const someSelected = selectedItems.length > 0 && selectedItems.length < cartItems.length

  // Chọn / bỏ chọn tất cả
  const handleSelectAll = () => {
    let newSelected = []
    if (!allSelected) {
      newSelected = cartItems.map(item => item.productId._id)
    }
    setSelectedItems(newSelected);
    dispatch(setSelectedItemsAction(newSelected))
  }


  const handleSelect = (id) => {
    const newSelected = selectedItems.includes(id)
      ? selectedItems.filter(i => i !== id)
      : [...selectedItems, id]

    setSelectedItems(newSelected) // cập nhật local state
    dispatch(setSelectedItemsAction(newSelected)) // cập nhật redux luôn
  }


  const formatPrice = (val) =>
    typeof val === 'number'
      ? val.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
      : '0₫'

  const truncate = (str, maxLength) => {
    if (!str) return ''
    return str.length > maxLength ? str.slice(0, maxLength) + '...' : str
  }

  const handleQuantityChange = async (id, currentQty, delta) => {
    const item = cartItems.find(i => i.productId?._id === id)
    const maxQty = item?.productId?.quantity || 1
    const newQty = Math.max(1, currentQty + delta)

    if (newQty > maxQty) {
      setShowMaxQuantityAlert(true)
      return
    }

    try {
      const res = await updateItem(id, { quantity: newQty })
      if (res) {
        setCartItems(prev =>
          prev.map(item =>
            item.productId._id === id ? { ...item, quantity: newQty } : item
          )
        )
      }
    } catch (error) {
      console.error('Lỗi cập nhật số lượng:', error)
    }
  }
  console.log('selectedItems:', selectedItems)
  const handleRemove = async (id) => {
    try {
      const res = await deleteItem(id)
      if (res) {
        setCartItems(prev => prev.filter(item => item.productId?._id !== id))
        setSelectedItems(prev => prev.filter(i => i !== id))
      }
    } catch (error) {
      console.error('Lỗi xoá sản phẩm:', error)
    }
  }

  const selectedCartItems = cartItems.filter(item =>
    selectedItems.includes(item.productId?._id)
  )

  const totalPrice = selectedCartItems.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
    0
  )

  if (loading) {
    return (
      <Typography sx={{ height: '70vh', mt: 10, textAlign: 'center' }}>
        Đang tải giỏ hàng...
      </Typography>
    )
  }

  return (
    <Container maxWidth='lg' sx={{ minHeight: '70vh', mt: 10, mb: 5, overflowX: 'auto' }}>
      <Table size='medium' sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox" sx={{ width: 50 }}>
              <Checkbox
                indeterminate={someSelected}
                checked={allSelected}
                onChange={handleSelectAll}
                color="primary"
              />
            </TableCell>
            <TableCell align='left' sx={{ fontWeight: 'bold' }}>Sản phẩm</TableCell>
            <TableCell align='center' sx={{ fontWeight: 'bold', width: 120 }}>Giá</TableCell>
            <TableCell align='center' sx={{ fontWeight: 'bold', width: 130 }}>Số lượng</TableCell>
            <TableCell align='center' sx={{ fontWeight: 'bold', width: 90 }}>Thao tác</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {cartItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align='center' sx={{ py: 8, fontSize: '1.2rem', color: 'text.secondary' }}>
                Giỏ hàng của bạn đang trống
              </TableCell>
            </TableRow>
          ) : (
            cartItems.map(item => {
              const product = item.productId
              if (!product) return null

              return (
                <TableRow key={item._id} hover>
                  <TableCell padding='checkbox'>
                    <Checkbox
                      checked={selectedItems.includes(product._id)}
                      onChange={() => handleSelect(product._id)}
                      color='primary'
                    />
                  </TableCell>
                  <TableCell>
                    <Box display='flex' alignItems='center' gap={2}>
                      <Box
                        sx={{ cursor: 'pointer' }}
                        onClick={() => {
                          dispatch(setSelectedItemsAction([product._id]))
                          navigate(`/productdetail/${product._id}`)
                        }}
                      >
                        <Avatar
                          src={product.image?.[0] || '/default.jpg'}
                          variant='square'
                          sx={{ width: 64, height: 64, borderRadius: 1, objectFit: 'cover' }}
                        />
                      </Box>
                      <Box>
                        <Typography
                          fontWeight={600}
                          sx={{ lineHeight: 1.2, maxWidth: 350 }}
                          title={product.name}
                        >
                          {truncate(product.name, 20)}
                        </Typography>

                        <Typography
                          variant='body2'
                          color='text.secondary'
                          sx={{ maxWidth: 350 }}
                          title={product.description}
                        >
                          {truncate(product.description, 20)}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align='center' sx={{ fontWeight: '600', color: '#007B00' }}>
                    {formatPrice(product.price)}
                  </TableCell>
                  <TableCell align='center'>
                    <Box display='flex' alignItems='center' justifyContent='center'>
                      <IconButton
                        size='small'
                        onClick={() => handleQuantityChange(product._id, item.quantity, -1)}
                        disabled={item.quantity <= 1}
                        aria-label='Giảm số lượng'
                      >
                        <Remove />
                      </IconButton>
                      <TextField
                        value={item.quantity}
                        size='small'
                        sx={{ width: 50, mx: 1 }}
                        inputProps={{ style: { textAlign: 'center' }, readOnly: true }}
                      />
                      <IconButton
                        size='small'
                        onClick={() => handleQuantityChange(product._id, item.quantity, 1)}
                        aria-label='Tăng số lượng'
                        disabled={item.quantity >= product.quantity} // disable when max reached
                      >
                        <Add />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell align='center'>
                    <IconButton
                      color='error'
                      onClick={() => handleRemove(product._id)}
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
            variant='contained'
            color='primary'
            disabled={selectedItems.length === 0}
            onClick={() => {
              dispatch(setSelectedItemsAction(selectedItems))
              navigate('/payment')
            }}
            sx={{ minWidth: 120 }}
          >
            Thanh toán
          </Button>

          <Button
            variant='outlined'
            color='error'
            onClick={async () => {
              await clearCart()
              setCartItems([])
              setSelectedItems([])
            }}
            sx={{ minWidth: 120 }}
          >
            Xoá toàn bộ
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={showMaxQuantityAlert}
        autoHideDuration={3000}
        onClose={() => setShowMaxQuantityAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setShowMaxQuantityAlert(false)} severity='warning' sx={{ width: '100%' }}>
          Số lượng sản phẩm đã hết!
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default Cart
