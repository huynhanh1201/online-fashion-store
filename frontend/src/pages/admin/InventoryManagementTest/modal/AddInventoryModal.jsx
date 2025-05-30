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
import { useForm, Controller } from 'react-hook-form'
import { createInventory } from '~/services/admin/Inventory/inventoryService.js'

const URI = 'https://api.cloudinary.com/v1_1/dkwsy9sph/image/upload'
const CloudinaryColor = 'color_upload'

// Hàm upload ảnh lên Cloudinary
const uploadToCloudinary = async (file, folder = CloudinaryColor) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'demo_unsigned')
  formData.append('folder', folder)

  const res = await fetch(URI, { method: 'POST', body: formData })
  if (!res.ok) throw new Error('Upload thất bại')
  const data = await res.json()
  return data.secure_url
}

// Hook quản lý color, size, stockMatrix
const useInventoryData = () => {
  const [colorsList, setColorsList] = useState([])
  const [sizesList, setSizesList] = useState([])
  const [stockMatrix, setStockMatrix] = useState([])

  const addColor = (color) => {
    setColorsList((prev) => [...prev, color])
  }

  const removeColor = (index) => {
    setColorsList((prev) => prev.filter((_, i) => i !== index))
  }

  const addSize = (size) => {
    if (!sizesList.some((s) => s.name === size.name)) {
      setSizesList((prev) => [...prev, size])
    } else {
      alert('Kích thước đã tồn tại')
    }
  }

  const removeSize = (index) => {
    setSizesList((prev) => prev.filter((_, i) => i !== index))
  }

  const addStock = (stock) => {
    setStockMatrix((prev) => [...prev, stock])
  }

  const removeStock = (index) => {
    setStockMatrix((prev) => prev.filter((_, i) => i !== index))
  }

  const resetAll = () => {
    setColorsList([])
    setSizesList([])
    setStockMatrix([])
  }

  return {
    colorsList,
    addColor,
    removeColor,
    sizesList,
    addSize,
    removeSize,
    stockMatrix,
    addStock,
    removeStock,
    resetAll
  }
}

const AddInventoryModal = ({ open, onClose, inventory }) => {
  const productId = inventory?.productId?._id || inventory?.productId || null
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      sku: '',
      importPrice: '',
      exportPrice: '',
      minQuantity: '',
      status: 'in-stock'
    }
  })

  const {
    colorsList,
    addColor,
    removeColor,
    sizesList,
    addSize,
    removeSize,
    stockMatrix,
    addStock,
    removeStock,
    resetAll
  } = useInventoryData()

  const [colorName, setColorName] = useState('')
  const [colorFile, setColorFile] = useState(null)
  const [colorPreview, setColorPreview] = useState('')
  const [isAddingColor, setIsAddingColor] = useState(false)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const fileInputRef = useRef()

  useEffect(() => {
    if (open) {
      reset()
      resetAll()
      setColorName('')
      setColorFile(null)
      setColorPreview('')
      setSelectedColor('')
      setSelectedSize('')
    }
  }, [open])

  const handleColorFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setColorFile(file)
      setColorPreview(URL.createObjectURL(file))
    }
  }

  const handleAddColor = async () => {
    if (!colorName.trim() || !colorFile) {
      alert('Vui lòng nhập tên màu và chọn ảnh')
      return
    }
    setIsAddingColor(true)
    try {
      const imageUrl = await uploadToCloudinary(colorFile, CloudinaryColor)
      addColor({ name: colorName.trim(), image: imageUrl })
      setColorName('')
      setColorFile(null)
      setColorPreview('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      alert('Upload ảnh màu thất bại, vui lòng thử lại')
      console.error(err)
    } finally {
      setIsAddingColor(false)
    }
  }

  const handleAddStock = (quantity) => {
    if (!selectedColor || !selectedSize) {
      alert('Vui lòng chọn màu và kích thước trước khi thêm kho')
      return
    }
    if (!quantity || quantity <= 0) {
      alert('Số lượng phải lớn hơn 0')
      return
    }
    addStock({
      color: selectedColor,
      size: selectedSize,
      quantity: Number(quantity)
    })
    setSelectedColor('')
    setSelectedSize('')
  }

  const onSubmit = async (data) => {
    if (!productId) {
      alert('Không tìm thấy productId')
      return
    }
    if (stockMatrix.length === 0) {
      alert('Vui lòng thêm ít nhất một biến thể kho')
      return
    }

    try {
      const promises = stockMatrix.map((item) => {
        const sku = `SKU-${item.color}-${item.size}-${Date.now()}` // Đảm bảo SKU là duy nhất
        const payload = {
          productId,
          variant: {
            color: {
              name: item.color,
              image: colorsList.find((c) => c.name === item.color)?.image || ''
            },
            size: { name: item.size },
            sku
          },
          quantity: item.quantity,
          importPrice: parseFloat(data.importPrice) || 0,
          exportPrice: parseFloat(data.exportPrice) || 0,
          minQuantity: parseInt(data.minQuantity) || 0,
          status: data.status
        }
        return createInventory(payload)
      })

      await Promise.all(promises)
      onClose()
    } catch (error) {
      console.log('Lỗi khi tạo biến thể kho: ' + error.message)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>Thêm biến thể kho</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {/* Các trường nhập */}
          <Grid item xs={6}>
            <Controller
              name='importPrice'
              control={control}
              rules={{ required: 'Giá nhập không được bỏ trống' }}
              render={({ field }) => (
                <TextField
                  label='Giá nhập'
                  fullWidth
                  type='number'
                  error={!!errors.importPrice}
                  helperText={errors.importPrice?.message}
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name='exportPrice'
              control={control}
              rules={{ required: 'Giá bán không được bỏ trống' }}
              render={({ field }) => (
                <TextField
                  label='Giá bán'
                  fullWidth
                  type='number'
                  error={!!errors.exportPrice}
                  helperText={errors.exportPrice?.message}
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name='minQuantity'
              control={control}
              render={({ field }) => (
                <TextField
                  label='Số lượng tối thiểu'
                  fullWidth
                  type='number'
                  {...field}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Controller
                name='status'
                control={control}
                render={({ field }) => (
                  <Select {...field} label='Trạng thái' value={field.value}>
                    <MenuItem value='in-stock'>Còn hàng</MenuItem>
                    <MenuItem value='out-of-stock'>Hết hàng</MenuItem>
                    <MenuItem value='discontinued'>Ngừng kinh doanh</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
          </Grid>

          {/* Phần thêm màu sắc */}
          <Grid item xs={12} mt={2}>
            <Typography variant='h6'>Thêm màu sắc</Typography>
            <Grid container spacing={1} alignItems='center'>
              <Grid item xs={4}>
                <TextField
                  label='Tên màu'
                  value={colorName}
                  onChange={(e) => setColorName(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleColorFileChange}
                  ref={fileInputRef}
                />
                {colorPreview && (
                  <Box mt={1}>
                    <img
                      src={colorPreview}
                      alt='Preview'
                      style={{ width: 50, height: 50, objectFit: 'cover' }}
                    />
                  </Box>
                )}
              </Grid>
              <Grid item xs={4}>
                <Button
                  variant='contained'
                  onClick={handleAddColor}
                  disabled={isAddingColor}
                >
                  {isAddingColor ? 'Đang thêm...' : 'Thêm màu'}
                </Button>
              </Grid>
            </Grid>

            {colorsList.length > 0 && (
              <Box mt={2}>
                <Typography variant='subtitle1'>Danh sách màu</Typography>
                <Grid container spacing={1}>
                  {colorsList.map((color, i) => (
                    <Grid
                      key={i}
                      item
                      xs={3}
                      style={{
                        border: '1px solid #ccc',
                        padding: 8,
                        position: 'relative'
                      }}
                    >
                      <img
                        src={color.image}
                        alt={color.name}
                        style={{
                          width: '100%',
                          height: 60,
                          objectFit: 'cover'
                        }}
                      />
                      <Typography align='center'>{color.name}</Typography>
                      <Button
                        size='small'
                        color='error'
                        onClick={() => removeColor(i)}
                        style={{ position: 'absolute', top: 0, right: 0 }}
                      >
                        X
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Grid>

          {/* Phần thêm kích thước */}
          <Grid item xs={12} mt={4}>
            <Typography variant='h6'>Thêm kích thước</Typography>
            <AddSizeForm addSize={addSize} />

            {sizesList.length > 0 && (
              <Box mt={2}>
                <Typography variant='subtitle1'>
                  Danh sách kích thước
                </Typography>
                <Grid container spacing={1}>
                  {sizesList.map((size, i) => (
                    <Grid
                      key={i}
                      item
                      xs={2}
                      style={{
                        border: '1px solid #ccc',
                        padding: 8,
                        position: 'relative',
                        textAlign: 'center'
                      }}
                    >
                      <Typography>{size.name}</Typography>
                      <Button
                        size='small'
                        color='error'
                        onClick={() => removeSize(i)}
                        style={{ position: 'absolute', top: 0, right: 0 }}
                      >
                        X
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Grid>

          {/* Tạo biến thể kho */}
          <Grid item xs={12} mt={4}>
            <Typography variant='h6'>Tạo biến thể kho</Typography>
            <Grid container spacing={2} alignItems='center'>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel>Màu sắc</InputLabel>
                  <Select
                    value={selectedColor}
                    label='Màu sắc'
                    onChange={(e) => setSelectedColor(e.target.value)}
                  >
                    {colorsList.map((color, i) => (
                      <MenuItem key={i} value={color.name}>
                        {color.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel>Kích thước</InputLabel>
                  <Select
                    value={selectedSize}
                    label='Kích thước'
                    onChange={(e) => setSelectedSize(e.target.value)}
                  >
                    {sizesList.map((size, i) => (
                      <MenuItem key={i} value={size.name}>
                        {size.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label='Số lượng'
                  type='number'
                  inputProps={{ min: 1 }}
                  id='stock-quantity-input'
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <Button
                  variant='outlined'
                  onClick={() => {
                    const input = document.getElementById(
                      'stock-quantity-input'
                    )
                    const quantity = input?.value
                    if (quantity) {
                      handleAddStock(quantity)
                      input.value = ''
                    } else {
                      alert('Vui lòng nhập số lượng')
                    }
                  }}
                >
                  Thêm biến thể
                </Button>
              </Grid>
            </Grid>

            {stockMatrix.length > 0 && (
              <Box mt={2}>
                <Typography variant='subtitle1'>
                  Danh sách biến thể kho
                </Typography>
                <Grid container spacing={1}>
                  {stockMatrix.map((stock, i) => (
                    <Grid
                      key={i}
                      item
                      xs={4}
                      style={{
                        border: '1px solid #ccc',
                        padding: 8,
                        position: 'relative'
                      }}
                    >
                      <Typography>
                        Màu: <b>{stock.color}</b> - Kích thước:{' '}
                        <b>{stock.size}</b> - Số lượng: <b>{stock.quantity}</b>
                      </Typography>
                      <Button
                        size='small'
                        color='error'
                        onClick={() => removeStock(i)}
                        style={{ position: 'absolute', top: 0, right: 0 }}
                      >
                        X
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant='contained' onClick={handleSubmit(onSubmit)}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// Component con để thêm kích thước mới
const AddSizeForm = ({ addSize }) => {
  const [sizeName, setSizeName] = useState('')

  const handleAddSize = () => {
    if (!sizeName.trim()) {
      alert('Vui lòng nhập tên kích thước')
      return
    }
    addSize({ name: sizeName.trim() })
    setSizeName('')
  }

  return (
    <Grid container spacing={1} alignItems='center'>
      <Grid item xs={4}>
        <TextField
          label='Tên kích thước'
          value={sizeName}
          onChange={(e) => setSizeName(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={4}>
        <Button variant='contained' onClick={handleAddSize}>
          Thêm kích thước
        </Button>
      </Grid>
    </Grid>
  )
}

export default AddInventoryModal
