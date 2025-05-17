import React, { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Button,
  Snackbar,
  Alert
} from '@mui/material'
import { addToCart, getCart } from '~/services/cartService'
import useProducts from '~/hook/useProducts'
import { useDispatch } from 'react-redux'
import { setCartItems } from '~/redux/cart/cartSlice'
import ProductCard from '~/components/ProductCards/ProductCards'

const ProductList = () => {
  const { products, fetchProducts } = useProducts()
  const [snackbar, setSnackbar] = useState(null)
  const [isAdding, setIsAdding] = useState({})
  const [cartItems, setLocalCartItems] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    fetchProducts()
    // Lấy giỏ hàng 1 lần khi load
    const loadCart = async () => {
      try {
        const res = await getCart()
        const items = res?.cartItems || []
        setLocalCartItems(items)
        dispatch(setCartItems(items))
      } catch (error) {
        console.error('Lỗi lấy giỏ hàng:', error)
      }
    }
    loadCart()
  }, [])

  const handleAddToCart = async (product) => {
    if (isAdding[product._id]) return
    setIsAdding(prev => ({ ...prev, [product._id]: true }))

    try {
      const existingItem = cartItems.find(item => item.productId._id === product._id)
      const currentQty = existingItem?.quantity || 0
      const maxQty = product.quantity

      if (currentQty >= maxQty) {
        setSnackbar({ type: 'warning', message: 'Bạn đã thêm tối đa số lượng tồn kho!' })
        return
      }

      const res = await addToCart({
        cartItems: [{ productId: product._id, quantity: 1 }]
      })

      const updatedItems = res?.cartItems || []
      setLocalCartItems(updatedItems)
      dispatch(setCartItems(updatedItems))

      setSnackbar({ type: 'success', message: 'Thêm sản phẩm vào giỏ hàng thành công!' })
    } catch (error) {
      console.error('Thêm vào giỏ hàng lỗi:', error)
      setSnackbar({ type: 'error', message: 'Thêm sản phẩm thất bại!' })
    } finally {
      setTimeout(() => {
        setIsAdding(prev => ({ ...prev, [product._id]: false }))
      }, 500)
    }
  }

  const first4Products = products.slice(0, 4)
  const next4Products = products.slice(4, 8)

  return (
    <Box sx={{ backgroundColor: '#03235e', p: 2, borderRadius: 3, m: 2, boxShadow: 3 }}>
      <Grid container justifyContent="center" alignItems="center" spacing={2} sx={{ mt: 5 }}>
        {first4Products.map(product => (
          <Grid item xs={12} sm={6} md={3} key={product._id}>
            <ProductCard
              product={product}
              handleAddToCart={handleAddToCart}
              isAdding={!!isAdding[product._id]}
            />
          </Grid>
        ))}
      </Grid>

      <Grid container justifyContent="center" alignItems="center" spacing={2} sx={{ mt: 3 }}>
        {next4Products.map(product => (
          <Grid item xs={12} sm={6} md={3} key={product._id}>
            <ProductCard
              product={product}
              handleAddToCart={handleAddToCart}
              isAdding={!!isAdding[product._id]}
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button href='/product' sx={{ color: 'white' }}>
          Xem tất cả
        </Button>
      </Box>

      {snackbar && (
        <Snackbar
          open
          autoHideDuration={3000}
          onClose={() => setSnackbar(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={() => setSnackbar(null)} severity={snackbar.type} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  )
}

export default ProductList
