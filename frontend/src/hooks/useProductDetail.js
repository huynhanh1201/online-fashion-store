import { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getProductById } from '~/services/productService'
import { getDiscounts } from '~/services/discountService'
import { addToCart, getCart } from '~/services/cartService'
import { getColorPalettes } from '~/services/colorService'
import { getSizePalettes } from '~/services/sizeService'
import { setCartItems, setTempCart } from '~/redux/cart/cartSlice'

const useProductDetail = (productId) => {
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [size, setSize] = useState('')
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
  const [sizes, setSizes] = useState([])
  const [selectedColor, setSelectedColor] = useState(null)

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
          price: data.price || 0,
          discountPrice: data.discountPrice || null,
          quantity: data.quantity || 0
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
      console.log(
        'Colors from getColorPalettes (raw):',
        JSON.stringify(colors, null, 2)
      )
      setColors(colors || [])
    } catch (err) {
      console.error('Lỗi khi lấy màu:', err.response || err)
      setColors([])
    }
  }, [productId])

  const fetchSizes = useCallback(async () => {
    try {
      const response = await getSizePalettes(productId)
      console.log(
        'Raw response from getSizePalettes:',
        JSON.stringify(response, null, 2)
      )
      const sizes = response?.sizes || []
      setSizes(sizes) // Không cần lọc nữa vì API đã trả đúng mảng chuỗi
    } catch (err) {
      console.error('Lỗi khi lấy kích thước:', err.response || err)
      setSizes([])
    }
  }, [productId])

  const fetchCoupons = useCallback(async () => {
    try {
      const { discounts } = await getDiscounts()
      console.log('Coupons from getDiscounts:', discounts)
      const sortedCoupons = discounts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
      setCoupons(sortedCoupons)
    } catch (err) {
      console.error('Lỗi khi lấy coupon:', err)
      setCoupons([])
    }
  }, [])

  useEffect(() => {
    fetchProduct()
    fetchColors()
    fetchSizes()
    fetchCoupons()
  }, [])

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(''), 2000)
  }
  const handleColorChange = (color) => {
    setSelectedColor(color)
    console.log('>>>Selected color:', color)
    if (color.images && color.images.length > 0) {
      setProduct((prev) => ({
        ...prev,
        images: color.images
      }))
      setSelectedImageIndex(0)
    }
  }

  const handleAddToCart = async (product, selectedColor, size, quantity) => {
    if (isAdding[product._id]) return
    setIsAdding((prev) => ({ ...prev, [product._id]: true }))

    try {
      if (!selectedColor) {
        setSnackbar({
          type: 'warning',
          message: 'Vui lòng chọn màu sắc!'
        })
        setIsAdding((prev) => ({ ...prev, [product._id]: false }))
        return
      }
      if (!size) {
        setSnackbar({
          type: 'warning',
          message: 'Vui lòng chọn kích cỡ!'
        })
        setIsAdding((prev) => ({ ...prev, [product._id]: false }))
        return
      }

      const updatedCart = await getCart()
      const existingItem = updatedCart?.cartItems?.find(
        (item) =>
          item.productId._id === product._id &&
          item.color === selectedColor &&
          item.size === size
      )
      const currentQty = existingItem?.quantity || 0
      const maxQty = product.quantity

      if (currentQty + quantity > maxQty) {
        setSnackbar({
          type: 'warning',
          message: `Bạn chỉ có thể thêm tối đa ${maxQty - currentQty} sản phẩm cho biến thể này!`
        })
        setIsAdding((prev) => ({ ...prev, [product._id]: false }))
        return
      }

      const res = await addToCart({
        productId: product._id,
        quantity: quantity,
        color: selectedColor,
        size: size
      })

      const latestCart = res?.cartItems ? res : await getCart()

      dispatch(setCartItems(latestCart?.cartItems || []))
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


  const handleBuyNow = () => {
    if (!product) return
    const itemToBuy = {
      productId: product._id,
      quantity,
      product: {
        _id: product._id,
        name: product.name,
        price: product.discountPrice || product.price,
        image: product.images && product.images[0] ? product.images[0] : ''
      }
    }
    dispatch(setTempCart({ cartItems: [itemToBuy] }))
    navigate('/payment')
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
    sizes,
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
    formatCurrencyShort,
    selectedColor,
    setSelectedColor,
    handleColorChange
  }
}

export default useProductDetail
