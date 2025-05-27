import React, { useState, useEffect } from 'react'
import {
  Box, Container, Table, TableHead, TableRow, TableCell, TableBody,
  Typography, IconButton, TextField, Avatar, Button, Checkbox,
  Snackbar, Alert, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle
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

  const allSelected = cartItems.length > 0 && selectedItems.length === cartItems.length
  const someSelected = selectedItems.length > 0 && selectedItems.length < cartItems.length

  const handleSelectAll = () => {
    let newSelected = []
    if (!allSelected) {
      // map cartItems thành mảng object chi tiết
      newSelected = cartItems.map(item => ({
        productId: item.productId._id,
        color: item.color,
        size: item.size,
        quantity: item.quantity
      }))
    }
    setSelectedItems(newSelected)
    dispatch(setSelectedItemsAction(newSelected))
  }


  const handleSelect = (item) => {
    // Kiểm tra xem item đã có trong selectedItems chưa dựa trên productId + color + size
    const exists = selectedItems.some(i =>
      i.productId === item.productId._id &&
      i.color === item.color &&
      i.size === item.size
    )

    let newSelected = []
    if (exists) {
      // Bỏ chọn: lọc ra item trùng
      newSelected = selectedItems.filter(i =>
        !(i.productId === item.productId._id &&
          i.color === item.color &&
          i.size === item.size)
      )
    } else {
      // Thêm item mới (lấy chi tiết cần thiết)
      newSelected = [
        ...selectedItems,
        {
          productId: item.productId._id,
          color: item.color,
          size: item.size,
          quantity: item.quantity
        }
      ]
    }

    setSelectedItems(newSelected)
    dispatch(setSelectedItemsAction(newSelected))
  }


  const formatPrice = (val) =>
    typeof val === 'number'
      ? val.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
      : '0₫'

  // const truncate = (str, maxLength) => {
  //   if (!str) return ''
  //   return str.length > maxLength ? str.slice(0, maxLength) + '...' : str
  // }

  const handleQuantityChange = async (productId, delta, color, size) => {
    const item = cartItems.find(
      i =>
        i.productId._id === productId &&
        i.color === color &&
        i.size === size
    )
    if (!item) return

    const currentQty = item.quantity
    const maxQty = item.productId?.quantity || 1
    const newQty = Math.max(1, currentQty + delta)

    if (newQty > maxQty) {
      setShowMaxQuantityAlert(true)
      return
    }

    const payload = {
      productId,
      color,
      size,
      quantity: newQty
    }
    console.log('Cập nhật giỏ hàng với:', payload)
    const res = await updateItem(payload)
    if (res) {
      setCartItems(prev =>
        prev.map(i =>
          i.productId._id === productId && i.color === color && i.size === size
            ? { ...i, quantity: newQty }
            : i
        )
      )
    }
  }

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
    selectedItems.some(selected =>
      selected.productId === item.productId._id &&
      selected.color === item.color &&
      selected.size === item.size
    )
  )


  const totalPrice = selectedCartItems.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
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
    <Container maxWidth='xl' sx={{ minHeight: '70vh', mt: 10, mb: 5, overflowX: 'auto' }}>
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
                      checked={selectedItems.some(i =>
                        i.productId === item.productId._id &&
                        i.color === item.color &&
                        i.size === item.size
                      )}
                      onChange={() => handleSelect(item)}
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
                          sx={{
                            lineHeight: 1.2,
                            maxWidth: 350,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                          title={product.name}
                        >
                          {product.name}
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 350 }}>
                          Phân loại hàng: {item.color || 'Không rõ'}{item.color && item.size ? ', ' : ''}{item.size || ''}
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
                        onClick={() => handleQuantityChange(product._id, -1, item.color, item.size)}

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
                        onClick={() => handleQuantityChange(product._id, 1, item.color, item.size)}


                        aria-label='Tăng số lượng'
                        disabled={item.quantity >= product.quantity}
                      >
                        <Add />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell align='center'>
                    <IconButton
                      color='error'
                      onClick={() =>
                        handleRemove({
                          productId: product._id,
                          color: item.color,
                          size: item.size,
                          quantity: item.quantity
                        })
                      }
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
              navigate('/payment', { state: { selectedItems } })
            }}
            sx={{ minWidth: 120 }}
          >
            Thanh toán
          </Button>

          <Button
            variant='outlined'
            color='error'
            endIcon={<DeleteForever />}
            onClick={() => setConfirmClearOpen(true)}
            disabled={cartItems.length === 0}
            sx={{
              minWidth: 140,
              borderWidth: 2,
              '&:hover': { borderWidth: 2 }
            }}
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

      <Dialog
        open={confirmClearOpen}
        onClose={() => setConfirmClearOpen(false)}
      >
        <DialogTitle>Xác nhận xoá</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xoá toàn bộ giỏ hàng không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmClearOpen(false)} color='primary'>
            Huỷ
          </Button>
          <Button onClick={handleClearCart} color='error' variant='contained'>
            Xoá
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Cart
