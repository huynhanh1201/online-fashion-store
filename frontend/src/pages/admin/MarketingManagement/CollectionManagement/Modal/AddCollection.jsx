import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  styled
} from '@mui/material'
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Close as CloseIcon
} from '@mui/icons-material'
import { addCollection, updateCollection } from '~/services/admin/webConfig/collectionService'
import { getCategoriesWithProducts, getCategories } from '~/services/admin/categoryService'
import { getProductsByCategory } from '~/services/productService'

// Styled components
const UploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.dark,
    backgroundColor: theme.palette.primary.light + '10'
  }
}))

const ProductCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(1),
  '& .MuiCardMedia-root': {
    width: 80,
    height: 80,
    objectFit: 'cover'
  }
}))

const AddCollection = ({ open, onClose, onSuccess, editingCollection }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    status: 'active',
    products: []
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedProducts, setSelectedProducts] = useState([])
  const [imagePreview, setImagePreview] = useState('')

  // Initialize form data when editing
  useEffect(() => {
    if (editingCollection) {
      setFormData({
        name: editingCollection.name || '',
        slug: editingCollection.slug || '',
        description: editingCollection.description || '',
        imageUrl: editingCollection.imageUrl || '',
        status: editingCollection.status || 'active',
        products: editingCollection.products || []
      })
      setImagePreview(editingCollection.imageUrl || '')
      setSelectedProducts(editingCollection.products || [])
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        imageUrl: '',
        status: 'active',
        products: []
      })
      setImagePreview('')
      setSelectedProducts([])
    }
  }, [editingCollection, open])

  // Fetch categories with products
  useEffect(() => {
    if (open) {
      fetchCategoriesWithProducts()
    }
  }, [open])

  const fetchCategoriesWithProducts = async () => {
    try {
      const response = await getCategoriesWithProducts()
      const categoriesWithCounts = response.map(category => ({
        ...category,
        productCount: category.productCount || 0
      }))
      setCategories(categoriesWithCounts)
    } catch (error) {
      // Fallback: try to get all categories if the first call fails
      try {
        const allCategories = await getCategories()
        setCategories(allCategories.map(cat => ({ ...cat, productCount: 0 })))
      } catch (fallbackError) {
        setCategories([])
      }
    }
  }

  // Fetch products when category changes
  useEffect(() => {
    if (selectedCategory) {
      fetchProductsByCategory(selectedCategory._id)
    } else {
      setProducts([])
    }
  }, [selectedCategory])

  const fetchProductsByCategory = async (categoryId) => {
    if (!categoryId) {
      setProducts([])
      return
    }

    try {
      // Check if categoryId is a valid ObjectId format
      const objectIdRegex = /^[0-9a-fA-F]{24}$/
      if (!objectIdRegex.test(categoryId)) {
        setProducts([])
        return
      }
      
      // Use getProductsByCategory instead of getProducts
      const response = await getProductsByCategory(categoryId, 1, 100)
      
      // Extract products from response
      const productsData = response.products || []
      
      // Filter out products that are already selected
      const availableProducts = productsData.filter(product => 
        !selectedProducts.find(selected => selected._id === product._id)
      )
      
      setProducts(availableProducts)
    } catch (error) {
      setProducts([])
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Auto-generate slug from name only when adding new collection
    if (field === 'name' && !editingCollection) {
      const slug = value
        .toLowerCase()
        .trim()
        .normalize('NFD') // Normalize unicode characters
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      
      setFormData(prev => ({
        ...prev,
        slug: slug
      }))
    }
    
    // Format slug when manually editing
    if (field === 'slug') {
      const formattedSlug = value
        .toLowerCase()
        .trim()
        .normalize('NFD') // Normalize unicode characters
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9-]/g, '') // Remove special characters except hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      
      setFormData(prev => ({
        ...prev,
        slug: formattedSlug
      }))
    }
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // In a real app, you would upload to cloudinary or similar service
      // For now, we'll use a placeholder
      const imageUrl = URL.createObjectURL(file)
      setImagePreview(imageUrl)
      setFormData(prev => ({
        ...prev,
        imageUrl: imageUrl
      }))
    }
  }

  const handleProductSelect = (event, newValue) => {
    if (newValue && !selectedProducts.find(p => p._id === newValue._id)) {
      const productToAdd = {
        _id: newValue._id,
        name: newValue.name,
        image: newValue.image?.[0] || newValue.image || '',
        price: newValue.exportPrice || newValue.price || 0,
        categoryId: newValue.categoryId
      }
      setSelectedProducts(prev => [...prev, productToAdd])
      setFormData(prev => ({
        ...prev,
        products: [...prev.products, productToAdd]
      }))
      
      // Clear the autocomplete input
      event.target.value = ''
    }
  }

  const handleRemoveProduct = (productId) => {
    setSelectedProducts(prev => prev.filter(p => p._id !== productId))
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter(p => p._id !== productId)
    }))
  }

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      setError('Vui lòng nhập tên collection')
      return
    }
    if (!formData.slug.trim()) {
      setError('Vui lòng nhập slug collection')
      return
    }
    
    // Validate slug format
    const slugRegex = /^[a-z0-9-]+$/
    if (!slugRegex.test(formData.slug)) {
      setError('Slug chỉ được chứa chữ thường, số và dấu gạch ngang')
      return
    }
    
    if (!formData.description.trim()) {
      setError('Vui lòng nhập mô tả collection')
      return
    }
    if (!formData.imageUrl.trim()) {
      setError('Vui lòng tải lên hình ảnh collection')
      return
    }
    if (formData.products.length === 0) {
      setError('Vui lòng chọn ít nhất một sản phẩm')
      return
    }

    try {
      setLoading(true)
      setError('')

      if (editingCollection) {
        await updateCollection(editingCollection.index, formData)
      } else {
        await addCollection(formData)
      }

      onSuccess()
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi lưu collection')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      status: 'active',
      products: []
    })
    setImagePreview('')
    setSelectedProducts([])
    setSelectedCategory(null)
    setError('')
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" fontWeight="bold">
          {editingCollection ? 'Chỉnh sửa Collection' : 'Thêm Collection mới'}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Thông tin cơ bản
            </Typography>
            
            <TextField
              fullWidth
              label="Tên Collection"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Slug Collection"
              value={formData.slug}
              onChange={(e) => handleInputChange('slug', e.target.value)}
              margin="normal"
              required
              helperText="URL-friendly version of the collection name (e.g., 'summer-collection-2024')"
              inputProps={{
                pattern: '^[a-z0-9-]+$',
                title: 'Only lowercase letters, numbers, and hyphens are allowed'
              }}
            />

            <TextField
              fullWidth
              label="Mô tả"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              margin="normal"
              multiline
              rows={3}
              required
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                label="Trạng thái"
              >
                <MenuItem value="active">Hoạt động</MenuItem>
                <MenuItem value="inactive">Không hoạt động</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Image Upload */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Hình ảnh Collection
            </Typography>

            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="image-upload"
              type="file"
              onChange={handleImageUpload}
            />
            <label htmlFor="image-upload">
              <UploadBox>
                {imagePreview ? (
                  <Box>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        width: '100%',
                        maxHeight: 200,
                        objectFit: 'cover',
                        borderRadius: 8
                      }}
                    />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Click để thay đổi hình ảnh
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      Tải lên hình ảnh
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Click để chọn file hoặc kéo thả vào đây
                    </Typography>
                  </Box>
                )}
              </UploadBox>
            </label>
          </Grid>

          {/* Product Selection */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Chọn sản phẩm
            </Typography>

            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Chọn danh mục</InputLabel>
                <Select
                  value={selectedCategory?._id || ''}
                  onChange={(e) => {
                    const category = categories.find(c => c._id === e.target.value)
                    setSelectedCategory(category)
                  }}
                  label="Chọn danh mục"
                >
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.name} {category.productCount > 0 ? `(${category.productCount} sản phẩm)` : '(Chưa có sản phẩm)'}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>
                      Không có danh mục nào
                    </MenuItem>
                  )}
                </Select>
              </FormControl>

              {categories.length === 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Không có danh mục nào. Vui lòng tạo danh mục trước khi tạo bộ sưu tập.
                </Alert>
              )}

              {selectedCategory && (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Đã chọn danh mục: <strong>{selectedCategory.name}</strong> ({products.length} sản phẩm có sẵn)
                    {selectedCategory._id && (
                      <span style={{ fontFamily: 'monospace', fontSize: '0.8em', color: '#666' }}>
                        <br/>ID: {selectedCategory._id}
                      </span>
                    )}
                  </Typography>
                  <Autocomplete
                    options={products}
                    getOptionLabel={(option) => option.name || 'Không có tên'}
                    onChange={handleProductSelect}
                    loading={products.length === 0 && selectedCategory}
                    noOptionsText={products.length === 0 ? "Không có sản phẩm nào trong danh mục này" : "Không tìm thấy sản phẩm"}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tìm và chọn sản phẩm"
                        placeholder="Nhập tên sản phẩm..."
                        helperText={products.length === 0 ? "Đang tải sản phẩm..." : `Có ${products.length} sản phẩm để chọn`}
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <img
                            src={option.image?.[0] || option.image || '/placeholder-image.jpg'}
                            alt={option.name}
                            style={{ 
                              width: 40, 
                              height: 40, 
                              objectFit: 'cover', 
                              borderRadius: 4 
                            }}
                            onError={(e) => {
                              e.target.src = '/placeholder-image.jpg'
                            }}
                          />
                          <Box>
                            <Typography variant="body2">{option.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {(option.exportPrice || option.price || 0).toLocaleString('vi-VN')} VNĐ
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    )}
                    filterOptions={(options, { inputValue }) => {
                      if (!inputValue) return options
                      return options.filter(option => 
                        option.name?.toLowerCase().includes(inputValue.toLowerCase())
                      )
                    }}
                  />
                  {products.length === 0 && selectedCategory && (
                    <Alert severity="info" sx={{ mt: 1 }}>
                      {selectedCategory.productCount > 0 
                        ? `Không có sản phẩm nào trong danh mục "${selectedCategory.name}". Vui lòng chọn danh mục khác.`
                        : `Danh mục "${selectedCategory.name}" chưa có sản phẩm nào. Vui lòng thêm sản phẩm vào danh mục này trước.`
                      }
                    </Alert>
                  )}
                </Box>
              )}
            </Box>

            {/* Selected Products */}
            {selectedProducts.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Sản phẩm đã chọn ({selectedProducts.length})
                </Typography>
                {selectedProducts.map((product) => (
                  <ProductCard key={product._id}>
                    <CardMedia
                      component="img"
                      image={product.image || '/placeholder-image.jpg'}
                      alt={product.name}
                    />
                    <CardContent sx={{ flex: 1, py: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {product.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {product.price?.toLocaleString('vi-VN')} VNĐ
                      </Typography>
                    </CardContent>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveProduct(product._id)}
                      sx={{ alignSelf: 'center', mr: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ProductCard>
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={handleClose} disabled={loading}>
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? 'Đang lưu...' : (editingCollection ? 'Cập nhật' : 'Thêm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddCollection
