import { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getProductById } from '~/services/productService'
import { getDiscounts } from '~/services/discountService'
import { addToCart, getCart } from '~/services/cartService'
import { getColorPalettes } from '~/services/colorService'
import { getSizePalettes } from '~/services/sizeService' // Import API mới
import { setCartItems, setTempCart } from '~/redux/cart/cartSlice'

const useProductDetail = (productId) => {
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [size, setSize] = useState('S')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [fadeIn, setFadeIn] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [coupons, setCoupons] = useState([])
  const [openVoucherDrawer, setOpenVoucherDrawer] = useState(false)
  const [copiedCode, setCopiedCode] = useState('')
  const [snackbar, setSnackbar] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [colors, setColors] = useState([])
  const [sizes, setSizes] = useState(['S', 'M', 'L', 'XL']) // Thêm state cho sizes

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const formatCurrencyShort = (value) => {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}Tr`
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`
    return `${value.toLocaleString()}đ`
  }

  const fetchProduct = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    if (!productId || !/^[0-9a-fA-F]{24}$/.test(productId)) {
      setError('ID sản phẩm không hợp lệ.')
      setIsLoading(false)
      return
    }
    try {
      const data = await getProductById(productId)
      console.log('API getProductById response:', data)
      console.log('Raw images:', data.image)
      if (data && Object.keys(data).length && data._id) {
        let images = []
        if (typeof data.image === 'string') {
          images = data.image
            .split(',')
            .map((url) => url.trim())
            .filter(
              (url) => url && typeof url === 'string' && url.startsWith('http')
            )
        } else if (Array.isArray(data.image)) {
          images = data.image.filter(
            (url) => url && typeof url === 'string' && url.startsWith('http')
          )
        }
        if (images.length === 0) {
          images = ['/default.jpg']
        }
        console.log('Processed images:', images)
        setProduct({
          ...data,
          images,
          name: data.name || 'Sản phẩm không tên',
          colors: []
        })
      } else {
        setError('Sản phẩm không tồn tại hoặc dữ liệu không hợp lệ.')
      }
    } catch (err) {
      console.error('Error fetching product:', err.response || err)
      setError(
        err?.response?.data?.message ||
          err.message ||
          'Không thể tải thông tin sản phẩm.'
      )
    } finally {
      setIsLoading(false)
    }
  }, [productId])

  const fetchColors = useCallback(async () => {
    try {
      const { colors } = await getColorPalettes(productId)
      console.log('Colors from getColorPalettes:', colors)
      setColors(colors)
    } catch (err) {
      console.error('Lỗi khi lấy màu:', err)
      setColors([])
    }
  }, [productId])

  const fetchSizes = useCallback(async () => {
    try {
      const { sizes } = await getSizePalettes(productId)
      console.log('Sizes from getSizePalettes:', sizes)
      setSizes(sizes.length > 0 ? sizes : ['S', 'M', 'L', 'XL'])
    } catch (err) {
      console.error('Lỗi khi lấy kích thước:', err)
      setSizes(['S', 'M', 'L', 'XL'])
    }
  }, [productId])

  useEffect(() => {
    fetchProduct()
    fetchColors()
    fetchSizes()
  }, [fetchProduct, fetchColors, fetchSizes])

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { discounts } = await getDiscounts()
        const sortedCoupons = discounts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
        setCoupons(sortedCoupons)
      } catch (err) {
        console.error('Lỗi khi lấy coupon:', err)
      }
    }
    fetchCoupons()
  }, [])

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(''), 2000)
  }

  const handleAddToCart = async () => {
    if (isAdding || !product) return
    setIsAdding(true)
    try {
      const updatedCart = await getCart()
      const existingItem = updatedCart?.cartItems?.find(
        (item) => item.productId._id === product._id
      )
      const currentQty = existingItem?.quantity || 0

      if (currentQty + quantity > product.quantity) {
        setSnackbar({
          type: 'warning',
          message: 'Không thể vượt quá số lượng tồn kho!'
        })
        setTimeout(() => setIsAdding(false), 500)
        return
      }

      const res = await addToCart({
        cartItems: [{ productId: product._id, quantity }]
      })
      dispatch(setCartItems(res?.cartItems || updatedCart?.cartItems || []))
      setSnackbar({
        type: 'success',
        message: 'Thêm sản phẩm vào giỏ hàng thành công!'
      })
      setQuantity(1)
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ:', error)
      setSnackbar({
        type: 'error',
        message: 'Không thể thêm sản phẩm vào giỏ hàng!'
      })
    } finally {
      setTimeout(() => setIsAdding(false), 1000)
    }
  }

  const handleBuyNow = () => {
    if (!product) return
    const itemToBuy = {
      productId: product._id,
      quantity,
      product: {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images && product.images[0] ? product.images[0] : ''
      }
    }
    dispatch(setTempCart({ cartItems: [itemToBuy] }))
    navigate('/payment')
  }

  const handleIncrease = () => {
    if (product && quantity < product.quantity) {
      setQuantity((prev) => prev + 1)
    }
  }

  return {
    product,
    isLoading,
    error,
    fetchProduct,
    selectedImageIndex,
    setSelectedImageIndex,
    fadeIn,
    setFadeIn,
    quantity,
    setQuantity,
    size,
    setSize,
    colors,
    sizes, // Trả về sizes
    coupons,
    openVoucherDrawer,
    setOpenVoucherDrawer,
    snackbar,
    setSnackbar,
    isAdding,
    handleAddToCart,
    handleBuyNow,
    handleCopy,
    copiedCode,
    handleIncrease,
    formatCurrencyShort
  }
}

export default useProductDetail
