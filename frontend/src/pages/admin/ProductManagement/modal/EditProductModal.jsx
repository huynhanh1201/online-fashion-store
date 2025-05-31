import React, { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Box
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { useForm, Controller } from 'react-hook-form'
import useCategories from '~/hooks/admin/useCategories.js'
import AddSizeModal from '~/pages/admin/SizeManagement/modal/AddSizeModal.jsx'
import AddColorModal from '~/pages/admin/ColorManagement/modal/AddColorModal.jsx'
import AddCategoryModal from '~/pages/admin/CategorieManagement/modal/AddCategoryModal.jsx'
import StyleAdmin from '~/assets/StyleAdmin.jsx'
import useColors from '~/hooks/admin/useColor.js'
import useSizes from '~/hooks/admin/useSize.js'

const URI = 'https://api.cloudinary.com/v1_1/dkwsy9sph/image/upload'
const CloudinaryColor = 'color_upload'
const CloudinaryProduct = 'product_upload'

const uploadToCloudinary = async (file, folder = CloudinaryColor) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'demo_unsigned')
  formData.append('folder', folder)

  const res = await fetch(URI, {
    method: 'POST',
    body: formData
  })

  if (!res.ok) throw new Error('Upload thất bại')

  const data = await res.json()
  return data.secure_url
}

const EditProductModal = ({ open, onClose, onSave, product }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      categoryId: '',
      price: '',
      importPrice: ''
    }
  })

  const [allColors, setAllColors] = useState([])
  const [allSizes, setAllSizes] = useState([])
  const [colorImageFile, setColorImageFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [colorsList, setColorsList] = useState([])
  const [sizesList, setSizesList] = useState([])
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [isSizeModalOpen, setSizeModalOpen] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [stockMatrix, setStockMatrix] = useState([])
  const [quantity, setQuantity] = useState('')
  const [isAddColorModalOpen, setAddColorModalOpen] = useState(false)
  const [productImages, setProductImages] = useState([])
  const [productImagePreview, setProductImagePreview] = useState([])

  const productImageInputRef = useRef()
  const colorImageInputRef = useRef()

  const { categories, fetchCategories } = useCategories()
  const { colors, fetchColors } = useColors()
  const { sizes, fetchSizes } = useSizes()

  // Pre-populate form with product data
  useEffect(() => {
    if (open && product) {
      reset({
        name: product.name || '',
        description: product.description || '',
        categoryId: product.categoryId || '',
        price: product.price?.toString() || '',
        importPrice: product.importPrice?.toString() || ''
      })
      setProductImages(product.image || [])
      setColorsList(product.colors || [])
      setSizesList(product.sizes || [])
      setStockMatrix(product.stockMatrix || [])
      setProductImagePreview(product.image || [])
      fetchCategories()
      fetchColors()
      fetchSizes()
    }
  }, [open, product, reset])

  useEffect(() => {
    if (colors) setAllColors(colors)
    if (sizes) setAllSizes(sizes)
  }, [colors, sizes])

  // Handle product image file change
  const handleProductImageFileChange = (e) => {
    const files = Array.from(e.target.files || [])
    const remainingSlots = 9 - productImages.length

    if (files.length > remainingSlots) {
      alert(`Bạn chỉ có thể thêm tối đa ${remainingSlots} ảnh nữa.`)
      return
    }

    const imageURLs = files.map((file) => URL.createObjectURL(file))
    setProductImages((prev) => [...prev, ...imageURLs])
    setProductImagePreview((prev) => [...prev, ...imageURLs])

    if (productImageInputRef.current) {
      productImageInputRef.current.value = ''
    }
  }

  // Remove product image
  const handleRemoveProductImage = (index) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index))
    setProductImagePreview((prev) => prev.filter((_, i) => i !== index))
  }

  // Add stock
  const handleAddStock = async (quantity) => {
    setLoading(true)

    const selectedColorData = allColors.find((c) => c.name === selectedColor)
    const selectedSizeData = allSizes.find((s) => s.name === selectedSize)

    if (!selectedColorData) {
      alert('Màu đã chọn không tồn tại trong danh sách')
      setLoading(false)
      return
    }

    if (!selectedSizeData) {
      alert('Kích thước đã chọn không tồn tại trong danh sách')
      setLoading(false)
      return
    }

    const existingColor = colorsList.find(
      (c) => c.name === selectedColorData.name
    )
    if (!existingColor) {
      let imageUrl = ''
      if (colorImageFile) {
        try {
          imageUrl = await uploadToCloudinary(colorImageFile, CloudinaryColor)
        } catch (error) {
          console.error('Lỗi khi upload ảnh màu:', error)
          alert('Upload ảnh màu thất bại')
          setLoading(false)
          return
        }
      } else {
        alert('Vui lòng chọn ảnh màu cho màu mới')
        setLoading(false)
        return
      }

      setColorsList((prevColors) => [
        ...prevColors,
        { name: selectedColorData.name, image: imageUrl }
      ])

      if (colorImageInputRef.current) {
        colorImageInputRef.current.value = ''
      }
    }

    setSizesList((prevSizes) => {
      const exists = prevSizes.some((s) => s.name === selectedSizeData.name)
      if (!exists) {
        return [...prevSizes, { name: selectedSizeData.name }]
      }
      return prevSizes
    })

    setStockMatrix((prev) => [
      ...prev,
      { color: selectedColorData.name, size: selectedSizeData.name, quantity }
    ])

    setSelectedColor('')
    setSelectedSize('')
    setQuantity('')
    setColorImageFile(null)
    setLoading(false)
  }

  // Remove stock
  const handleRemoveStock = (index) => {
    setStockMatrix((prev) => prev.filter((_, i) => i !== index))
  }

  // Update product
  const onSubmit = async (data) => {
    try {
      if (productImages.length === 0) {
        alert('Vui lòng thêm ít nhất một ảnh sản phẩm')
        return
      }

      if (colorsList.length === 0) {
        alert('Vui lòng thêm ít nhất một màu sắc')
        return
      }

      if (sizesList.length === 0) {
        alert('Vui lòng thêm ít nhất một kích thước')
        return
      }

      if (stockMatrix.length === 0) {
        alert('Vui lòng thêm ít nhất một mục kho')
        return
      }

      const finalProduct = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        importPrice: data.importPrice ? Number(data.importPrice) : undefined,
        categoryId: data.categoryId,
        image: productImages,
        colors: colorsList.map((c) => ({
          name: c.name,
          image: c.image || ''
        })),
        sizes: sizesList.map((s) => ({
          name: s.name
        })),
        stockMatrix
      }

      const result = await onSave(product._id, finalProduct)

      if (result) {
        onClose()
        reset()
        setColorsList([])
        setSizesList([])
        setStockMatrix([])
        setProductImages([])
        setProductImagePreview([])
      } else {
        alert('Cập nhật sản phẩm không thành công')
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật sản phẩm:', error)
      alert('Có lỗi xảy ra, vui lòng thử lại')
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='xl' fullWidth>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          justifyContent: 'start',
          paddingBottom: '8px',
          borderBottom: '1px solid #ccc'
        }}
      >
        <DialogTitle sx={{ paddingTop: '8px', paddingBottom: '8px' }}>
          Sửa sản phẩm
        </DialogTitle>
        <DialogActions sx={{ paddingLeft: '24px' }}>
          <Button onClick={onClose} variant='outlined' color='error'>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant='contained'
            sx={{ color: '#fff', backgroundColor: '#001f5d' }}
            disabled={loading}
          >
            {loading ? 'Đang cập nhật...' : 'Cập nhật sản phẩm'}
          </Button>
        </DialogActions>
      </Box>
      <DialogContent>
        <Grid container spacing={2}>
          {/* Tên */}
          <Grid item size={12}>
            <Controller
              name='name'
              control={control}
              rules={{ required: 'Tên sản phẩm không được bỏ trống' }}
              render={({ field }) => (
                <TextField
                  label='Tên sản phẩm'
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  {...field}
                />
              )}
            />
          </Grid>
          {/* Phần thêm ảnh sản phẩm */}
          <Grid item size={12}>
            <Typography variant='h6' style={{ marginBottom: '16px' }}>
              Ảnh sản phẩm
            </Typography>
            <Grid container spacing={1} alignItems='center' sx={{ mb: 2 }}>
              <Grid
                item
                xs={2}
                style={{
                  display: 'flex',
                  alignItems: 'start',
                  justifyContent: 'start',
                  flexDirection: 'column',
                  gap: '16px',
                  height: '56px'
                }}
              >
                <Grid item>
                  <Button
                    sx={{ height: '56px' }}
                    variant='outlined'
                    component='label'
                    disabled={productImages.length >= 9}
                  >
                    Chọn ảnh sản phẩm
                    <input
                      type='file'
                      accept='image/*'
                      multiple
                      hidden
                      ref={productImageInputRef}
                      onChange={handleProductImageFileChange}
                    />
                  </Button>
                </Grid>
                <Grid item>
                  <Typography variant='body2' color='text.secondary'>
                    {`Đã thêm ${productImages.length}/9 ảnh`}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item size={10}>
                <FormControl fullWidth>
                  <Select
                    value=''
                    displayEmpty
                    renderValue={() =>
                      productImages.length > 0
                        ? 'Chọn để xem và xoá ảnh'
                        : 'Không có ảnh'
                    }
                  >
                    {productImages.length > 0 ? (
                      productImages.map((image, idx) => (
                        <MenuItem key={idx} value={idx}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              width: '100%'
                            }}
                          >
                            <img
                              src={image}
                              alt={`product-image-${idx}`}
                              style={{
                                width: 40,
                                height: 40,
                                objectFit: 'cover',
                                borderRadius: 4,
                                marginRight: 12
                              }}
                            />
                            <Typography variant='body2' sx={{ flexGrow: 1 }}>
                              Ảnh {idx + 1}
                            </Typography>
                            <IconButton
                              edge='end'
                              color='error'
                              size='small'
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRemoveProductImage(idx)
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled value=''>
                        Không có ảnh
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          {/* Danh mục */}
          <Grid item size={4}>
            <FormControl fullWidth margin='normal' error={!!errors.categoryId}>
              <InputLabel>Danh mục</InputLabel>
              <Controller
                name='categoryId'
                control={control}
                rules={{ required: 'Danh mục không được bỏ trống' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    label='Danh mục'
                    value={field.value || ''}
                    disabled={loading}
                    MenuProps={{
                      PaperProps: { sx: StyleAdmin.FormSelect.SelectMenu }
                    }}
                  >
                    {categories
                      ?.filter((c) => !c.destroy)
                      .map((cat) => (
                        <MenuItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    <MenuItem onClick={() => setCategoryOpen(true)}>
                      Thêm danh mục mới
                    </MenuItem>
                  </Select>
                )}
              />
              <Typography variant='caption' color='error'>
                {errors.categoryId?.message}
              </Typography>
            </FormControl>
          </Grid>
          {/* Giá nhập */}
          <Grid item size={4} style={{ marginTop: '16px' }}>
            <Controller
              name='importPrice'
              control={control}
              render={({ field }) => (
                <TextField
                  label='Giá nhập'
                  fullWidth
                  type='number'
                  {...field}
                />
              )}
            />
          </Grid>
          {/* Giá bán */}
          <Grid item size={4} style={{ marginTop: '16px' }}>
            <Controller
              name='price'
              control={control}
              rules={{ required: 'Giá bán không được bỏ trống' }}
              render={({ field }) => (
                <TextField
                  label='Giá bán'
                  fullWidth
                  type='number'
                  error={!!errors.price}
                  helperText={errors.price?.message}
                  {...field}
                />
              )}
            />
          </Grid>
          {/* Chọn màu và kích thước để thêm kho */}
          <Grid item size={12}>
            <Grid
              container
              spacing={2}
              alignItems='center'
              justifyContent='center'
            >
              <Grid item size={4} style={{ height: '56px' }}>
                <Grid container spacing={1}>
                  <Grid item size={2}>
                    <label
                      htmlFor='color-image'
                      style={{
                        width: '56px',
                        height: '56px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        display: 'inline-block',
                        position: 'relative',
                        backgroundColor: '#f9f9f9'
                      }}
                    >
                      {colorImageFile ? (
                        <img
                          src={URL.createObjectURL(colorImageFile)}
                          alt='Preview'
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block'
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            color: '#999'
                          }}
                        >
                          <AddIcon />
                        </div>
                      )}
                      <input
                        id='color-image'
                        type='file'
                        accept='image/*'
                        style={{ display: 'none' }}
                        onChange={(e) => setColorImageFile(e.target.files[0])}
                        ref={colorImageInputRef}
                      />
                    </label>
                  </Grid>
                  <Grid item size={10}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Màu</InputLabel>
                      <Select
                        value={selectedColor}
                        label='Màu'
                        onChange={(e) => setSelectedColor(e.target.value)}
                      >
                        {colors.map((color, idx) => (
                          <MenuItem key={idx} value={color.name}>
                            {color.name}
                          </MenuItem>
                        ))}
                        <MenuItem
                          value='add_new'
                          onClick={() => {
                            setSelectedColor('')
                            setAddColorModalOpen(true)
                          }}
                        >
                          Thêm màu mới
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item size={4} style={{ height: '56px' }}>
                <FormControl fullWidth>
                  <InputLabel>Kích thước</InputLabel>
                  <Select
                    value={selectedSize}
                    label='Kích thước'
                    onChange={(e) => setSelectedSize(e.target.value)}
                    renderValue={(selected) => selected || 'Chọn kích thước'}
                  >
                    {sizes.map((size, idx) => (
                      <MenuItem key={idx} value={size.name}>
                        {size.name}
                      </MenuItem>
                    ))}
                    <MenuItem
                      onClick={() => {
                        setSelectedSize('')
                        setSizeModalOpen(true)
                      }}
                    >
                      Thêm kích thước mới
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item size={3} style={{ height: '56px' }}>
                <TextField
                  label='Số lượng'
                  type='number'
                  fullWidth
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item size={1}>
                <Button
                  disabled={loading}
                  variant='contained'
                  sx={{
                    height: '56px',
                    width: '100%',
                    color: '#fff',
                    backgroundColor: '#001f5d'
                  }}
                  onClick={() => {
                    const qty = Number(quantity)
                    if (!selectedColor || !selectedSize) {
                      alert('Vui lòng chọn màu và kích thước')
                      return
                    }
                    if (isNaN(qty) || qty <= 0) {
                      alert('Vui lòng nhập số lượng hợp lệ (> 0)')
                      return
                    }
                    handleAddStock(qty)
                    setQuantity('')
                  }}
                >
                  Thêm
                </Button>
              </Grid>
            </Grid>
          </Grid>
          {/* Hiển thị danh sách kho */}
          <Grid item size={12}>
            <FormControl fullWidth>
              <Select
                value=''
                displayEmpty
                renderValue={() =>
                  stockMatrix.length > 0
                    ? 'Chọn để xem và xoá mục kho'
                    : 'Không có sản phẩm trong kho'
                }
              >
                {stockMatrix.length > 0 ? (
                  stockMatrix.map((stock, idx) => (
                    <MenuItem key={idx} value={idx}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%'
                        }}
                      >
                        <Typography variant='body2' sx={{ flexGrow: 1 }}>
                          Màu: {stock.color} - Size: {stock.size} - SL:{' '}
                          {stock.quantity}
                        </Typography>
                        <IconButton
                          edge='end'
                          color='error'
                          size='small'
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveStock(idx)
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled value=''>
                    Không có sản phẩm trong kho
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          {/* Mô tả */}
          <Grid item size={12}>
            <Controller
              name='description'
              control={control}
              render={({ field }) => (
                <TextField
                  label='Mô tả'
                  fullWidth
                  multiline
                  rows={3}
                  {...field}
                />
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <AddColorModal
        open={isAddColorModalOpen}
        onClose={() => {
          setSelectedColor('')
          setAddColorModalOpen(false)
          fetchColors()
        }}
        onSave={(newColorId) => {
          fetchColors()
          const newColor = colors.find((color) => color._id === newColorId)
          if (newColor) {
            setSelectedColor(newColor.name)
          }
          setAddColorModalOpen(false)
        }}
      />
      <AddSizeModal
        open={isSizeModalOpen}
        onClose={() => {
          setSizeModalOpen(false)
          fetchSizes()
        }}
        onSave={(newSizeId) => {
          fetchSizes()
          const newSize = sizes.find((size) => size._id === newSizeId)
          if (newSize) {
            setSelectedSize(newSize.name)
          }
          setSizeModalOpen(false)
        }}
      />
      <AddCategoryModal
        open={categoryOpen}
        onClose={() => setCategoryOpen(false)}
        onSave={() => {
          setCategoryOpen(false)
          fetchCategories()
        }}
      />
    </Dialog>
  )
}

export default EditProductModal
