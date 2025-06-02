import React, { useState, useEffect } from 'react'
import { Box, Grid, Button, Snackbar, Alert } from '@mui/material'
import { addToCart, getCart } from '~/services/cartService'
import useProducts from '~/hooks/useProducts'
import { useDispatch } from 'react-redux'
import { setCartItems } from '~/redux/cart/cartSlice'
import ProductCard from '~/components/ProductCards/ProductCards'

const ProductBestSale = () => {
  const { products, fetchProducts } = useProducts()
  const [snackbar, setSnackbar] = useState(null)
  const [isAdding, setIsAdding] = useState({})
  const dispatch = useDispatch()

  useEffect(() => {
    fetchProducts()
  }, []) // Dependency rỗng để tránh vòng lặp vô hạn

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
      console.error(
        'Thêm vào giỏ hàng lỗi:',
        error.response?.data || error.message
      )
      setSnackbar({ type: 'error', message: 'Thêm sản phẩm thất bại!' })
    } finally {
      setTimeout(() => {
        setIsAdding((prev) => ({ ...prev, [product._id]: false }))
      }, 500)
    }
  }

  // Sắp xếp và lấy 5 sản phẩm bán chạy nhất
  const bestSaleProducts = Array.isArray(products)
    ? [...products]
      .sort((a, b) => (b.sold || 0) - (a.sold || 0)) // Sắp xếp theo sold giảm dần
      .slice(0, 5) // Lấy 5 sản phẩm đầu tiên
    : []

  return (
    <Box>
      <Grid
        container
        justifyContent='center'
        alignItems='center'
        spacing={2}
        sx={{ mt: 5 }}
      >
        {bestSaleProducts.map((product) => (
          <Grid item xs={12} sm={6} md={2.4} key={product._id}>
            <ProductCard
              product={product}
              handleAddToCart={handleAddToCart}
              isAdding={!!isAdding[product._id]}
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button
          href='/product'
          sx={{ color: 'white', backgroundColor: '#1A3C7B' }}
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

export default ProductBestSale
