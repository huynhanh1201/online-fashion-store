import { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getProductById } from '~/services/productService'
import { getDiscounts } from '~/services/discountService'
import { addToCart, getCart } from '~/services/cartService'
import { getProductVariants } from '~/services/variantService'
import { setCartItems, setTempCart } from '~/redux/cart/cartSlice'

const useProductDetail = (productId) => {
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [fadeIn, setFadeIn] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [coupons, setCoupons] = useState([])
  const [openVoucherDrawer, setOpenVoucherDrawer] = useState(false)
  const [copiedCode, setCopiedCode] = useState('')
  const [snackbar, setSnackbar] = useState(null)
  const [isAdding, setIsAdding] = useState(false)

  // Variants related states
  const [variants, setVariants] = useState([])
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [availableColors, setAvailableColors] = useState([])
  const [availableSizes, setAvailableSizes] = useState([])
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)

  const [inventory, setInventory] = useState(null)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Format currency
  const formatCurrencyShort = (value) => {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}Tr`
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`
    return `${value.toLocaleString()}đ`
  }

  // Fetch product details
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

  // Fetch product variants
  const fetchVariants = useCallback(async () => {
    if (!productId) return
    try {
      const data = await getProductVariants(productId)
      setVariants(data || [])

      // Extract unique colors and sizes
      const colors = []
      const sizes = []
      const colorMap = new Map()
      const sizeMap = new Map()

      data?.forEach((variant) => {
        // Extract colors
        if (variant.color && !colorMap.has(variant.color.name)) {
          colorMap.set(variant.color.name, variant.color)
          colors.push(variant.color)
        }

        // Extract sizes
        if (variant.size && !sizeMap.has(variant.size.name)) {
          sizeMap.set(variant.size.name, variant.size)
          sizes.push(variant.size)
        }
      })

      setAvailableColors(colors)
      setAvailableSizes(sizes)

      // Không tự động chọn màu và kích thước
    } catch (err) {
      console.error('Lỗi khi lấy variants:', err.response || err)
      setVariants([])
      setAvailableColors([])
      setAvailableSizes([])
    }
  }, [productId])

  // Fetch coupons
  const fetchCoupons = useCallback(async () => {
    try {
      const { discounts } = await getDiscounts()
      const sortedCoupons = discounts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
      setCoupons(sortedCoupons)
    } catch (err) {
      console.error('Lỗi khi lấy coupon:', err)
      setCoupons([])
    }
  }, [])

  // Fetch data on mount
  useEffect(() => {
    fetchProduct()
    fetchVariants()
    fetchCoupons()
  }, [fetchProduct, fetchVariants, fetchCoupons])

  // Update selected variant when color and size are selected
  useEffect(() => {
    if (selectedColor && selectedSize && variants.length > 0) {
      const variant = variants.find(
        (v) => v.color.name === selectedColor && v.size.name === selectedSize
      )
      setSelectedVariant(variant || null)
      console.log('Updated selectedVariant:', variant) // Debug
    } else {
      setSelectedVariant(null) // Reset if either color or size is missing
    }
  }, [selectedColor, selectedSize, variants])

  // Reset selectedImageIndex when selectedVariant changes
  useEffect(() => {
    setSelectedImageIndex(0)
  }, [selectedVariant])

  // Handle copy coupon code
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setSnackbar({
      type: 'success',
      message: `Đã sao chép mã ${code}`
    })
    setTimeout(() => setCopiedCode(''), 2000)
  }

  // Handle color change
  const handleColorChange = (color) => {
    setSelectedColor(color)
    if (selectedSize) {
      const variant = variants.find(
        (v) => v.color.name === color && v.size.name === selectedSize
      )
      setSelectedVariant(variant || null)
      console.log('Selected variant (color change):', variant) // Debug
    } else {
      setSelectedVariant(null) // Reset if size is not selected
    }
  }

  // Handle size change
  const handleSizeChange = (size) => {
    setSelectedSize(size)
    if (selectedColor) {
      const variant = variants.find(
        (v) => v.color.name === selectedColor && v.size.name === size
      )
      setSelectedVariant(variant || null)
    } else {
      setSelectedVariant(null) // Reset if color is not selected
    }
  }

  // Get current price
  const getCurrentPrice = () => {
    if (selectedVariant) {
      return {
        price: selectedVariant.exportPrice,
        discountPrice: selectedVariant.discountPrice
      }
    }
    return {
      price: product?.exportPrice,
      discountPrice: product?.discountPrice
    }
  }

  // Get current images
  const getCurrentImages = () => {
    if (selectedVariant && selectedVariant.color?.image) {
      return [selectedVariant.color.image]
    }
    return product?.images?.length > 0 ? product.images : ['/default.jpg']
  }

  const fetchInventory = async (variantId) => {
    try {
      const response = await fetch(`http://localhost:8017/v1/inventories?variantId=${variantId}`)
      if (!response.ok) throw new Error(`Lỗi HTTP ${response.status}`)
      const result = await response.json()
      const inventoryList = result.data
      const inventory = Array.isArray(inventoryList) ? inventoryList[0] : inventoryList
      setInventory(inventory)
      console.log('Thông tin kho:', inventory)
    } catch (error) {
      console.error('Lỗi lấy kho:', error)
    }
  }
  useEffect(() => {
    if (selectedVariant && selectedVariant._id) {
      fetchInventory(selectedVariant._id)
    } else {
      setInventory(null)
    }
  }, [selectedVariant])
  // Handle add to cart
  const handleAddToCart = async (productId) => {
    if (isAdding[productId] || !product) return;

    if (!selectedVariant) {
      setSnackbar({ open: true, severity: 'warning', message: 'Vui lòng chọn màu sắc và kích thước!' })
      return
    }

    const variantId = selectedVariant._id
    const availableQuantity = inventory?.quantity ?? selectedVariant?.quantity ?? 0

    if (availableQuantity === 0) {
      setSnackbar({ open: true, severity: 'warning', message: 'Sản phẩm này hiện đang hết hàng!' })
      return
    }

    const updatedCart = await getCart();
    const existingItem = updatedCart?.cartItems?.find(
      item => {
        const itemVariantId = typeof item.variantId === 'object' ? item.variantId._id : item.variantId;
        return itemVariantId === variantId
      }
    );

    const currentQty = existingItem?.quantity || 0


    if (currentQty + quantity > availableQuantity) {
      const remainingQty = availableQuantity - currentQty
      setSnackbar({
        open: true,
        severity: 'warning',
        message:
          remainingQty > 0
            ? `Bạn chỉ có thể thêm tối đa ${remainingQty} sản phẩm nữa cho biến thể này!`
            : 'Bạn đã thêm số lượng tối đa cho mẫu này trong giỏ hàng!'
      })
      return
    }

    try {
      setIsAdding(prev => ({ ...prev, [productId]: true }));

      const res = await addToCart({ variant: selectedVariant, quantity });

      if (!res) throw new Error('Thêm giỏ hàng thất bại')

      const latestCart = res.cartItems ? res : await getCart()
      dispatch(setCartItems(latestCart.cartItems || []))

      setSnackbar({
        open: true,
        severity: 'success',
        message: 'Thêm sản phẩm vào giỏ hàng thành công!',
        variantImage: selectedVariant?.color?.image || product?.images?.[0],
        productName: product?.name
      })

      setQuantity(1)
    } catch (error) {
      console.error('Thêm vào giỏ hàng lỗi:', error)
      const messageFromServer = error.response?.data?.message || ''
      if (messageFromServer.includes('ValidationError')) {
        setSnackbar({ open: true, severity: 'warning', message: 'Số lượng thêm vượt quá tồn kho!' })
      } else {
        setSnackbar({ open: true, severity: 'error', message: 'Thêm sản phẩm thất bại!' })
      }
    } finally {
      setTimeout(() => {
        setIsAdding(prev => ({ ...prev, [productId]: false }))
      }, 500)
    }
  }


  // Handle buy now
  const handleBuyNow = () => {
    if (!product) return

    if (variants.length > 0 && !selectedVariant) {
      setSnackbar({
        open: true,
        severity: 'warning',
        message: 'Vui lòng chọn màu sắc và kích thước!'
      })
      return
    }

    const maxQuantity = inventory?.quantity ?? selectedVariant?.quantity ?? product?.quantity ?? 0
    if (maxQuantity === 0) {
      setSnackbar({
        open: true,
        severity: 'warning',
        message: 'Vui lòng chọn màu sắc và kích thước!'
      })
      return
    }

    const itemToBuy = {
      variantId: selectedVariant,
      quantity
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
    variants,
    selectedVariant,
    availableColors,
    availableSizes,
    selectedColor,
    selectedSize,
    handleColorChange,
    handleSizeChange,
    getCurrentPrice,
    getCurrentImages,
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
    inventory
  }
}

export default useProductDetail
