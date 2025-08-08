import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Grid,
  Typography,
  Stack,
  Alert,
  CircularProgress,
  Tooltip,
  Card,
  Box,
  useTheme,
  alpha,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  InputAdornment,
  Portal,
  Chip
} from '@mui/material'
import {
  Delete as DeleteIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  Search as SearchIcon,
  Info as InfoIcon
} from '@mui/icons-material'
import { getProducts } from '~/services/productService'
import {
  createFlashSale,
  getFlashSaleCampaigns,
  updateFlashSaleCampaign
} from '~/services/admin/webConfig/flashsaleService'
import {
  getProductVariants,
  updateProductVariantsDiscountPrice
} from '~/services/admin/variantService'

const AddFlashSale = ({ open, onClose, onSave, initialData }) => {
  const theme = useTheme()
  const [form, setForm] = useState({
    id: '',
    enabled: true,
    title: '',
    startTime: '',
    endTime: '',
    products: []
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [warning, setWarning] = useState('')
  const [loading, setLoading] = useState(false)
  const [productSuggestions, setProductSuggestions] = useState([])
  const [suggestionLoading, setSuggestionLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState({})
  const [dropdownPosition, setDropdownPosition] = useState({})
  const [allProducts, setAllProducts] = useState([])
  const [existingCampaigns, setExistingCampaigns] = useState([])
  const [productVariants, setProductVariants] = useState({})
  const [usedProductIds, setUsedProductIds] = useState(new Set())
  const suggestionRefs = useRef({})
  const inputRefs = useRef({})

  // Xác định chế độ chỉnh sửa
  const isEditMode = !!initialData

  // Khởi tạo form khi dialog mở, tự động tạo ID nếu là mới
  useEffect(() => {
    if (open) {
      if (initialData) {
        setForm({
          id: initialData.id,
          enabled: initialData.enabled,
          title: initialData.title,
          startTime: initialData.startTime
            ? new Date(initialData.startTime).toISOString().slice(0, 16)
            : '',
          endTime: initialData.endTime
            ? new Date(initialData.endTime).toISOString().slice(0, 16)
            : '',
          products: initialData.products.map((p) => ({
            _id: p.productId,
            productName: p.name || '',
            originalPrice: p.originalPrice,
            flashPrice: p.flashPrice,
            image: p.image || [],
            isDisabled: true
          }))
        })

        // Load biến thể cho các sản phẩm đã có sẵn
        const loadExistingProductVariants = async () => {
          try {
            const variantPromises = initialData.products.map(async (p) => {
              try {
                const variants = await getProductVariants(p.productId)
                return { productId: p.productId, variants }
              } catch (err) {
                console.error(
                  `Lỗi khi lấy biến thể cho sản phẩm ${p.productId}:`,
                  err
                )
                return { productId: p.productId, variants: [] }
              }
            })

            const results = await Promise.all(variantPromises)
            const variantsMap = {}
            results.forEach(({ productId, variants }) => {
              variantsMap[productId] = variants
            })
            setProductVariants(variantsMap)
          } catch (err) {
            console.error('Lỗi khi load biến thể cho sản phẩm hiện có:', err)
          }
        }

        loadExistingProductVariants()
      } else {
        const newId = generateUniqueId()
        setForm({
          id: newId,
          enabled: true,
          title: '',
          startTime: '',
          endTime: '',
          products: []
        })
      }
      setError('')
      setSuccess('')
      setWarning('')
    } else {
      // Reset biến thể khi đóng modal
      setProductVariants({})
      setUsedProductIds(new Set())
    }
  }, [open, initialData])

  // Lấy danh sách sản phẩm và chiến dịch hiện tại khi component mount
  useEffect(() => {
    const fetchAllProductsAndCampaigns = async () => {
      try {
        const { products } = await getProducts({ page: 1, limit: 1000 })
        setAllProducts(products)
        const campaigns = await getFlashSaleCampaigns()
        setExistingCampaigns(campaigns.map((c) => c.id))

        // Collect all product IDs used in other campaigns
        const usedIds = new Set()
        campaigns.forEach((campaign) => {
          if (campaign.id !== initialData?.id) {
            campaign.products.forEach((product) => {
              usedIds.add(product.productId)
            })
          }
        })
        setUsedProductIds(usedIds)
      } catch (err) {
        console.error('Lỗi khi lấy danh sách sản phẩm hoặc chiến dịch:', err)
      }
    }
    fetchAllProductsAndCampaigns()
  }, [initialData])

  // Xử lý click ngoài để đóng danh sách gợi ý
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(showSuggestions).forEach((index) => {
        if (showSuggestions[index] && suggestionRefs.current[index]) {
          if (!suggestionRefs.current[index].contains(event.target)) {
            setShowSuggestions((prev) => ({ ...prev, [index]: false }))
            setProductSuggestions([])
          }
        }
      })
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showSuggestions])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value ?? '' }))
    clearMessages()
  }

  const handleProductChange = (index, field, value) => {
    const updated = [...form.products]
    updated[index][field] = value
    setForm((prev) => ({ ...prev, products: updated }))
    clearMessages()
  }

  // Format number with thousand separators
  const formatNumber = (value) => {
    if (!value) return ''
    // Remove all non-digit characters
    const numericValue = value.toString().replace(/\D/g, '')
    // Format with thousand separators
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  // Parse formatted number back to numeric value
  const parseFormattedNumber = (formattedValue) => {
    if (!formattedValue) return ''
    // Remove all non-digit characters and convert to number
    return formattedValue.toString().replace(/\D/g, '')
  }

  // Xử lý thay đổi giá Flash Sale với debounce và tối ưu API calls
  const handleFlashPriceChange = useCallback(
    async (index, field, value) => {
      const updated = [...form.products]
      // Store the raw numeric value for calculations
      const numericValue = parseFormattedNumber(value)
      updated[index][field] = numericValue
      setForm((prev) => ({ ...prev, products: updated }))
      clearMessages()

      const product = updated[index]

      // Validate input immediately
      if (
        product._id &&
        numericValue &&
        !isNaN(numericValue) &&
        Number(numericValue) > 0
      ) {
        const flashSalePrice = Number(numericValue)

        if (flashSalePrice >= product.originalPrice) {
          setWarning(
            `Giá Flash Sale phải thấp hơn giá gốc (${product.originalPrice.toLocaleString()} VND)`
          )
          return
        }
      }
    },
    [form.products]
  )

  const handleAddProduct = () => {
    setForm((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          _id: '',
          productName: '',
          originalPrice: '',
          flashPrice: '',
          image: [],
          isDisabled: false
        }
      ]
    }))
    clearMessages()
  }

  const handleRemoveProduct = (index) => {
    const updated = [...form.products]
    const removedProduct = updated[index]
    updated.splice(index, 1)
    setForm((prev) => ({ ...prev, products: updated }))

    // Xóa thông tin biến thể của sản phẩm bị xóa
    if (removedProduct._id) {
      setProductVariants((prev) => {
        const newVariants = { ...prev }
        delete newVariants[removedProduct._id]
        return newVariants
      })
      setUsedProductIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(removedProduct._id)
        return newSet
      })
    }

    clearMessages()
  }

  const clearMessages = () => {
    setError('')
    setSuccess('')
    setWarning('')
  }

  // Lấy gợi ý sản phẩm dựa trên tìm kiếm
  const fetchProductSuggestions = async (searchText, index) => {
    if (!searchText.trim()) {
      setProductSuggestions([])
      setShowSuggestions((prev) => ({ ...prev, [index]: false }))
      return
    }

    setSuggestionLoading(true)
    try {
      const filtered = allProducts
        .filter(
          (product) =>
            product.name.toLowerCase().includes(searchText.toLowerCase()) &&
            !usedProductIds.has(product._id)
        )
        .slice(0, 5)
      setProductSuggestions(filtered)
      setShowSuggestions((prev) => ({ ...prev, [index]: true }))
    } catch (error) {
      console.error('Lỗi khi tìm kiếm sản phẩm:', error)
      setProductSuggestions([])
    } finally {
      setSuggestionLoading(false)
    }
  }

  // Cập nhật vị trí dropdown gợi ý
  const updateDropdownPosition = (index) => {
    if (inputRefs.current[index]) {
      const rect = inputRefs.current[index].getBoundingClientRect()
      setDropdownPosition((prev) => ({
        ...prev,
        [index]: {
          top: rect.bottom,
          left: rect.left,
          width: rect.width
        }
      }))
    }
  }

  // Xử lý thay đổi tên sản phẩm với debounce
  const handleProductNameChange = (index, value) => {
    if (form.products[index].isDisabled) return
    handleProductChange(index, 'productName', value)
    handleProductChange(index, '_id', '')

    if (!value.trim()) {
      setShowSuggestions((prev) => ({ ...prev, [index]: false }))
      setProductSuggestions([])
      return
    }

    updateDropdownPosition(index)

    const timeoutId = setTimeout(() => {
      fetchProductSuggestions(value, index)
    }, 300)

    return () => clearTimeout(timeoutId)
  }

  // Xử lý chọn sản phẩm từ gợi ý
  const handleProductSelect = async (index, product) => {
    const prod = allProducts.find((p) => p._id === product._id)
    if (prod) {
      if (usedProductIds.has(prod._id)) {
        setWarning(
          `Sản phẩm "${prod.name}" đã được sử dụng trong một chiến dịch Flash Sale khác.`
        )
        return
      }

      const existingProductIndex = form.products.findIndex(
        (p, i) => p._id === prod._id && i !== index
      )

      if (existingProductIndex !== -1) {
        setWarning(`Sản phẩm "${prod.name}" đã được thêm vào chiến dịch này.`)
        return
      }

      const updatedProducts = [...form.products]
      updatedProducts[index] = {
        _id: prod._id,
        productName: prod.name,
        originalPrice: prod.exportPrice || prod.price || 0,
        flashPrice: form.products[index]?.flashPrice || '',
        image: prod.image || [],
        isDisabled: false
      }

      try {
        const variants = await getProductVariants(prod._id)
        setProductVariants((prev) => ({
          ...prev,
          [prod._id]: variants
        }))
      } catch (err) {
        console.error('Lỗi khi lấy biến thể sản phẩm:', err)
      }

      setForm((prev) => ({ ...prev, products: updatedProducts }))
      setUsedProductIds((prev) => new Set([...prev, prod._id]))
    }
    setShowSuggestions((prev) => ({ ...prev, [index]: false }))
    setProductSuggestions([])
  }

  // Tạo ID ngẫu nhiên không trùng lặp
  const generateUniqueId = () => {
    let newId
    do {
      newId = `FS_${Date.now()}_${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')}`
    } while (existingCampaigns.includes(newId))
    return newId
  }

  // Kiểm tra dữ liệu form
  const validateForm = () => {
    const errors = []

    if (!form.title?.trim()) {
      errors.push('Tiêu đề không được để trống')
    }

    if (!form.startTime) {
      errors.push('Thời gian bắt đầu không được để trống')
    }

    if (!form.endTime) {
      errors.push('Thời gian kết thúc không được để trống')
    }

    if (
      form.startTime &&
      form.endTime &&
      new Date(form.startTime) >= new Date(form.endTime)
    ) {
      errors.push('Thời gian bắt đầu phải trước thời gian kết thúc')
    }

    if (form.products.length === 0) {
      errors.push('Vui lòng thêm ít nhất một sản phẩm')
    }

    form.products.forEach((product, index) => {
      if (!product._id?.trim()) {
        errors.push(`Sản phẩm ${index + 1} chưa được chọn`)
      }
      if (
        !product.originalPrice ||
        isNaN(product.originalPrice) ||
        product.originalPrice <= 0
      ) {
        errors.push(`Giá gốc của sản phẩm ${index + 1} phải là số dương`)
      }
      if (
        !product.flashPrice ||
        isNaN(product.flashPrice) ||
        product.flashPrice <= 0
      ) {
        errors.push(`Giá Flash Sale của sản phẩm ${index + 1} phải là số dương`)
      }
      if (
        product.originalPrice &&
        product.flashPrice &&
        Number(product.flashPrice) >= Number(product.originalPrice)
      ) {
        errors.push(
          `Giá Flash Sale của sản phẩm ${index + 1} phải thấp hơn giá gốc`
        )
      }
    })

    return errors
  }

  // Xử lý lưu Flash Sale campaign
  const handleSave = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    setWarning('')

    try {
      let cleanedForm = {
        ...form,
        id: initialData?.id || generateUniqueId(),
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
        products: form.products
          .filter(
            (p) =>
              p._id &&
              p._id.trim() !== '' &&
              p.flashPrice &&
              !isNaN(p.flashPrice)
          )
          .map((p) => ({
            productId: p._id,
            originalPrice: Number(p.originalPrice),
            flashPrice: Number(p.flashPrice)
          }))
      }

      const errors = validateForm()
      if (errors.length > 0) {
        setError(errors.join(', '))
        setLoading(false)
        return
      }

      // Cập nhật discountPrice cho tất cả biến thể của sản phẩm trước khi lưu flash sale
      const updatePromises = cleanedForm.products.map(async (product) => {
        try {
          await updateProductVariantsDiscountPrice(
            product.productId,
            product.flashPrice
          )
          console.log(
            `Đã cập nhật discountPrice cho sản phẩm ${product.productId} thành ${product.flashPrice}`
          )
        } catch (err) {
          console.error(
            `Lỗi khi cập nhật discountPrice cho sản phẩm ${product.productId}:`,
            err
          )
          throw new Error(
            `Không thể cập nhật giá cho sản phẩm ${product.productId}: ${err.message}`
          )
        }
      })

      // Chờ tất cả cập nhật discountPrice hoàn thành
      await Promise.all(updatePromises)

      if (initialData) {
        await updateFlashSaleCampaign(cleanedForm.id, cleanedForm)
      } else {
        await createFlashSale(cleanedForm)
      }

      // Only set success and trigger onSave after successful save
      setSuccess('Tạo chiến dịch Flash Sale thành công!')
      onSave(cleanedForm)
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err) {
      console.error('Chi tiết lỗi:', err)
      setError(
        err.response?.data?.message ||
          err.message ||
          'Có lỗi xảy ra khi lưu chiến dịch Flash Sale.'
      )
    } finally {
      // Only enable the Save button if the operation was successful
      if (!success) {
        setLoading(false)
      }
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='md'
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0',
          maxHeight: '90vh',
          maxWidth: '70vw'
        }
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          py: 2,
          fontWeight: 700,
          fontSize: '1.5rem',
          color: '#1e293b'
        }}
      >
        {initialData
          ? 'Chỉnh sửa chiến dịch Flash Sale'
          : 'Thêm chiến dịch Flash Sale'}
      </DialogTitle>
      <DialogContent dividers sx={{ backgroundColor: '#f8fafc', py: 3 }}>
        {error && (
          <Alert
            severity='error'
            sx={{
              mb: 3,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.error.main, 0.08),
              border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`
            }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity='success'
            sx={{
              mb: 3,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.success.main, 0.08),
              border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`
            }}
          >
            {success}
          </Alert>
        )}

        {warning && (
          <Alert
            severity='warning'
            sx={{
              mb: 3,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.warning.main, 0.08),
              border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`
            }}
          >
            {warning}
          </Alert>
        )}

        <Stack spacing={3}>
          <TextField
            fullWidth
            label='ID chiến dịch (Tự động tạo)'
            value={form.id}
            InputProps={{
              readOnly: true
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#fff'
              }
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={form.enabled}
                onChange={(e) => handleChange('enabled', e.target.checked)}
                sx={{
                  color: '#3b82f6',
                  '&.Mui-checked': {
                    color: '#3b82f6'
                  }
                }}
              />
            }
            label={
              <Typography
                variant='body2'
                sx={{ color: '#1e293b', fontWeight: 500 }}
              >
                Kích hoạt chiến dịch Flash Sale
              </Typography>
            }
          />

          <TextField
            fullWidth
            label='Tiêu đề *'
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#fff'
              }
            }}
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Thời gian bắt đầu *'
                type='datetime-local'
                value={form.startTime}
                onChange={(e) => handleChange('startTime', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: isEditMode ? '#f8fafc' : '#fff'
                  }
                }}
                disabled={isEditMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type='datetime-local'
                label='Thời gian kết thúc *'
                value={form.endTime}
                onChange={(e) => handleChange('endTime', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#fff'
                  }
                }}
              />
            </Grid>
          </Grid>

          <Box>
            <Typography
              variant='h6'
              sx={{
                mb: 2,
                fontWeight: 600,
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <AddCircleOutlineIcon sx={{ color: '#3b82f6' }} />
              Sản phẩm Flash Sale
            </Typography>

            <Alert
              severity='info'
              icon={<InfoIcon />}
              sx={{
                mb: 2,
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.info.main, 0.08),
                border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`
              }}
            >
              <Typography variant='body2'>
                <strong>Lưu ý:</strong> Khi lưu chương trình sẽ cập nhật lại giá
                giảm cho sản phẩm. Hãy cân nhắc thêm đúng thời điểm.
              </Typography>
            </Alert>

            <Box
              sx={{
                maxHeight: 300,
                overflowY: 'auto',
                pr: 1,
                '&::-webkit-scrollbar': {
                  width: '8px'
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f5f9',
                  borderRadius: '4px'
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#cbd5e1',
                  borderRadius: '4px',
                  '&:hover': {
                    background: '#94a3b8'
                  }
                }
              }}
            >
              {form.products.map((product, index) => (
                <Card
                  key={index}
                  sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid #e2e8f0',
                    backgroundColor:
                      isEditMode && product.isDisabled ? '#f1f5f9' : '#fff',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.2)}`
                    }
                  }}
                >
                  <Grid container spacing={2} alignItems='center'>
                    <Grid item xs={12} sm={4}>
                      <Box
                        sx={{ position: 'relative' }}
                        ref={(el) => (suggestionRefs.current[index] = el)}
                      >
                        <TextField
                          ref={(el) => (inputRefs.current[index] = el)}
                          fullWidth
                          label='Tên sản phẩm *'
                          value={product.productName || ''}
                          onChange={(e) =>
                            handleProductNameChange(index, e.target.value)
                          }
                          onFocus={() => {
                            if (!product.isDisabled) {
                              updateDropdownPosition(index)
                              if (
                                product.productName &&
                                productSuggestions.length > 0
                              ) {
                                setShowSuggestions((prev) => ({
                                  ...prev,
                                  [index]: true
                                }))
                              }
                            }
                          }}
                          required
                          disabled={isEditMode && product.isDisabled}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                {suggestionLoading &&
                                  showSuggestions[index] &&
                                  !product.isDisabled && (
                                    <CircularProgress size={20} />
                                  )}
                                {!product.isDisabled && (
                                  <SearchIcon sx={{ color: '#64748b' }} />
                                )}
                              </InputAdornment>
                            )
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor:
                                isEditMode && product.isDisabled
                                  ? '#e2e8f0'
                                  : '#fff'
                            }
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label='Giá gốc *'
                        value={
                          product.originalPrice
                            ? formatNumber(product.originalPrice)
                            : ''
                        }
                        InputProps={{ readOnly: true }}
                        required
                        disabled={isEditMode && product.isDisabled}
                        inputProps={{
                          min: 0,
                          style: { textAlign: 'right' }
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            backgroundColor:
                              isEditMode && product.isDisabled
                                ? '#e2e8f0'
                                : '#fff'
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Box sx={{ position: 'relative' }}>
                        <TextField
                          fullWidth
                          label='Giá giảm *'
                          value={formatNumber(product.flashPrice)}
                          onChange={(e) =>
                            handleFlashPriceChange(
                              index,
                              'flashPrice',
                              e.target.value
                            )
                          }
                          required
                          disabled={isEditMode && product.isDisabled}
                          inputProps={{
                            min: 0,
                            style: { textAlign: 'right' }
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              backgroundColor:
                                isEditMode && product.isDisabled
                                  ? '#e2e8f0'
                                  : '#fff'
                            }
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      {product.image && product.image.length > 0 && (
                        <img
                          src={product.image[0] || '/fallback.jpg'}
                          alt={product.productName}
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = '/fallback.jpg'
                          }}
                          style={{
                            width: 50,
                            height: 50,
                            objectFit: 'cover',
                            borderRadius: 4
                          }}
                        />
                      )}
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={1}
                      sx={{ textAlign: { sm: 'right' } }}
                    >
                      <Tooltip title='Xóa sản phẩm'>
                        <IconButton
                          onClick={() => handleRemoveProduct(index)}
                          sx={{
                            color: '#ef4444',
                            '&:hover': { backgroundColor: '#fee2e2' },
                            display:
                              isEditMode && product.isDisabled
                                ? 'none'
                                : 'inline-flex'
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>

                  {/* Hiển thị thông tin biến thể */}
                  {productVariants[product._id] &&
                    productVariants[product._id].length > 0 && (
                      <div className='mt-2 p-3 bg-gray-50 rounded-lg'>
                        <div className='flex items-center justify-between mb-2'>
                          <span className='text-sm font-medium text-gray-700'>
                            Biến thể sẽ được cập nhật khi lưu (
                            {productVariants[product._id].length} biến thể):
                          </span>
                        </div>
                        <div className='space-y-1'>
                          {productVariants[product._id].map(
                            (variant, vIndex) => (
                              <div
                                key={vIndex}
                                className='text-xs text-gray-600 flex justify-between'
                              >
                                <span>
                                  {variant.color?.name || 'N/A'} -{' '}
                                  {variant.size?.name || 'N/A'} - {variant.sku}
                                </span>
                                <span className='font-medium'>
                                  {variant.originalPrice?.toLocaleString()} VND
                                  →{' '}
                                  {form.products[index].flashPrice
                                    ? Number(
                                        form.products[index].flashPrice
                                      ).toLocaleString()
                                    : '...'}{' '}
                                  VND
                                </span>
                              </div>
                            )
                          )}
                        </div>
                        <div className='mt-2 text-xs text-gray-500'>
                          <p>
                            • Giá ban đầu:{' '}
                            {product.originalPrice?.toLocaleString()} VND
                          </p>
                          <p>
                            • Giá Flash Sale sẽ thay thế hoàn toàn giá hiện tại
                          </p>
                          <p>
                            • Khi lưu chiến dịch, tất cả biến thể sẽ được cập
                            nhật giá Flash Sale
                          </p>
                          <p>• Khi hết thời gian, giá sẽ trở về giá ban đầu</p>
                        </div>
                      </div>
                    )}
                </Card>
              ))}
            </Box>
            <Button
              onClick={handleAddProduct}
              variant='outlined'
              startIcon={<AddCircleOutlineIcon />}
              sx={{
                mt: 2,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                color: '#3b82f6',
                borderColor: '#3b82f6',
                px: 3,
                py: 1,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  borderColor: '#2563eb'
                }
              }}
            >
              Thêm sản phẩm
            </Button>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          p: 2,
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #e2e8f0'
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            color: '#64748b',
            px: 3,
            py: 1,
            '&:hover': {
              backgroundColor: alpha(theme.palette.grey[500], 0.08)
            }
          }}
        >
          Hủy
        </Button>
        <Button
          variant='contained'
          onClick={handleSave}
          disabled={
            loading ||
            form.products.length === 0 ||
            form.products.some((p) => !p._id) ||
            success // Disable button if save was successful
          }
          startIcon={loading ? <CircularProgress size={20} /> : null}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            px: 3,
            py: 1,
            background: 'var(--primary-color)',
            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
            '&:hover': {
              background: 'var(--accent-color)',
              boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
              transform: 'translateY(-1px)'
            },
            '&:disabled': {
              background: 'linear-gradient(135deg, #93c5fd 0%, #a5b4fc 100%)',
              color: '#fff'
            }
          }}
        >
          {loading ? 'Đang lưu và cập nhật giá...' : 'Lưu'}
        </Button>
      </DialogActions>

      {/* Render dropdowns using Portal */}
      {Object.keys(showSuggestions).map((index) => {
        if (
          showSuggestions[index] &&
          productSuggestions.length > 0 &&
          dropdownPosition[index]
        ) {
          return (
            <Portal key={index}>
              <Paper
                sx={{
                  position: 'fixed',
                  top: dropdownPosition[index].top + 4,
                  left: dropdownPosition[index].left,
                  width: dropdownPosition[index].width,
                  zIndex: 99999,
                  maxHeight: 200,
                  overflowY: 'auto',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                  border: '1px solid #e2e8f0',
                  borderRadius: 2,
                  backgroundColor: '#fff'
                }}
              >
                <List sx={{ padding: 0 }}>
                  {productSuggestions.map((suggestion) => (
                    <ListItem
                      key={suggestion._id}
                      disablePadding
                      sx={{ borderBottom: '1px solid #f1f5f9' }}
                    >
                      <ListItemButton
                        onClick={() =>
                          handleProductSelect(parseInt(index), suggestion)
                        }
                        sx={{
                          '&:hover': {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.08
                            )
                          }
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            width: '100%'
                          }}
                        >
                          <img
                            src={suggestion.image?.[0] || '/fallback.jpg'}
                            alt={suggestion.name}
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = '/fallback.jpg'
                            }}
                            style={{
                              width: 40,
                              height: 40,
                              objectFit: 'cover',
                              borderRadius: 4,
                              flexShrink: 0
                            }}
                          />
                          <Box sx={{ flex: 1, overflow: 'hidden' }}>
                            <Typography
                              variant='subtitle2'
                              fontWeight={600}
                              noWrap
                              sx={{ maxWidth: '200px' }}
                            >
                              {suggestion.name}
                            </Typography>
                            <Typography
                              variant='body2'
                              color='primary'
                              fontWeight={500}
                            >
                              {(suggestion.exportPrice || 0).toLocaleString()}{' '}
                              VND
                            </Typography>
                          </Box>
                        </Box>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Portal>
          )
        }
        return null
      })}
    </Dialog>
  )
}

export default AddFlashSale
