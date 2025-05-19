import React, { useState, useEffect } from 'react'
import { Box, Grid, Button, Snackbar, Alert } from '@mui/material'
import { addToCart, getCart } from '~/services/cartService'
import useProducts from '~/hook/useProducts'
import { useDispatch } from 'react-redux'
import { setCartItems } from '~/redux/cart/cartSlice'
import ProductCard from '~/components/ProductCards/ProductCards'

const ProductList = () => {
  const { products, fetchProducts } = useProducts()
  const [snackbar, setSnackbar] = useState(null)
  const [isAdding, setIsAdding] = useState({})
  const dispatch = useDispatch()

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleAddToCart = async (product) => {
    if (isAdding[product._id]) return
    setIsAdding((prev) => ({ ...prev, [product._id]: true }))

    try {
      const updatedCart = await getCart()
      const existingItem = updatedCart?.cartItems?.find(
        (item) => item.productId._id === product._id
      )
      const currentQty = existingItem?.quantity || 0
      const maxQty = product.quantity

      if (currentQty >= maxQty) {
        setSnackbar({
          type: 'warning',
          message: 'Bạn đã thêm tối đa số lượng tồn kho!'
        })
        return
      }

      const res = await addToCart({
        cartItems: [{ productId: product._id, quantity: 1 }]
      })

      dispatch(setCartItems(res?.cartItems || updatedCart?.cartItems || []))
      setSnackbar({
        type: 'success',
        message: 'Thêm sản phẩm vào giỏ hàng thành công!'
      })
    } catch (error) {
      console.error('Thêm vào giỏ hàng lỗi:', error)
      setSnackbar({ type: 'error', message: 'Thêm sản phẩm thất bại!' })
    } finally {
      setTimeout(() => {
        setIsAdding((prev) => ({ ...prev, [product._id]: false }))
      }, 500)
    }
  }

  const maxDisplayProducts = 10
  const displayedProducts = Array.isArray(products)
    ? products.slice(0, maxDisplayProducts)
    : []

  return (
    <Box
      sx={{
        justifyContent: 'center',
        p: 2,
        m: 2
      }}
    >
      <Grid
        container
        justifyContent='start'
        alignItems='stretch'
        spacing={1}
        sx={{ mt: 5 }}
      >
        {displayedProducts.map((product) => (
          <Grid item key={product._id}>
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 300,
                maxHeight: 450,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                },
                borderRadius: 2,
                overflow: 'hidden',
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0'
              }}
            >
              <ProductCard
                product={product}
                handleAddToCart={handleAddToCart}
                isAdding={!!isAdding[product._id]}
                showHoverActions
              />
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          href='/product'
          sx={{ color: '#fff', backgroundColor: '#1A3C7B' }}
        >
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
          <Alert
            onClose={() => setSnackbar(null)}
            severity={snackbar.type}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      )}
    </Box>
  )
}

export default ProductList
