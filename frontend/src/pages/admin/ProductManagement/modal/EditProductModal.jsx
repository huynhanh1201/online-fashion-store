import React, { useEffect, useState, useRef } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useForm, Controller } from 'react-hook-form'
import useCategories from '~/hook/admin/useCategories'
import useColorPalettes from '~/hook/admin/useColorPalettes'
import StyleAdmin from '~/components/StyleAdmin'

const URI = 'https://api.cloudinary.com/v1_1/dkwsy9sph/image/upload'
const CloudinaryProduct = 'product_upload'
const CloudinaryColor = 'color_upload'

const uploadToCloudinary = async (file, folder = CloudinaryProduct) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'demo_unsigned')
  formData.append('folder', folder)

  const res = await fetch(URI, {
    method: 'POST',
    body: formData
  })

  const data = await res.json()
  return data.secure_url
}

const EditProductModal = ({ open, onClose, product, onSave }) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      quantity: '',
      categoryId: '',
      colors: []
    }
  })

  const [images, setImages] = useState([{ file: null, preview: '' }])
  const [colorInput, setColorInput] = useState('')
  const [colorImage, setColorImage] = useState(null)
  const [colorImagePreview, setColorImagePreview] = useState('')
  const [colorList, setColorList] = useState([])
  const [editingColor, setEditingColor] = useState(null) // Trạng thái màu đang sửa
  const fileInputRefs = useRef([])
  const colorFileInputRef = useRef(null)
  const {
    categories,
    loading: categoryLoading,
    fetchCategories
  } = useCategories()
  const {
    colorPalettes,
    loading: colorLoading,
    addColorPalette
  } = useColorPalettes()

  useEffect(() => {
    if (product && open) {
      reset({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        quantity: product.quantity || '',
        categoryId: product.categoryId?._id || '',
        colors: product.colors || []
      })

      // Load hình ảnh sản phẩm
      const previews =
        product.image?.map((url) => ({ file: null, preview: url })) || []
      setImages([...previews, { file: null, preview: '' }])

      // Load danh sách màu từ product.colors
      setColorList(
        Array.isArray(product.colors)
          ? product.colors.map((c) =>
              typeof c === 'string'
                ? { name: c, image: '' }
                : { name: c.name, image: c.image || '' }
            )
          : []
      )
    }
  }, [product, reset, open])

  useEffect(() => {
    if (open) fetchCategories()
  }, [open])

  const handleImageChange = (index, file) => {
    const updated = [...images]
    updated[index] = { file, preview: URL.createObjectURL(file) }

    if (index === images.length - 1 && file && images.length < 9) {
      updated.push({ file: null, preview: '' })
    }

    setImages(updated)
  }

  const handleImageDelete = (index) => {
    const updated = [...images]
    updated.splice(index, 1)
    if (updated.length === 0 || updated[updated.length - 1].file) {
      updated.push({ file: null, preview: '' })
    }
    setImages(updated)
  }

  const handleColorImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setColorImage(file)
      setColorImagePreview(URL.createObjectURL(file))
    }
  }

  const handleAddOrEditColor = async (e) => {
    e.preventDefault()
    if (
      colorInput.trim() &&
      (colorImage || (editingColor && editingColor.image))
    ) {
      try {
        let imageUrl = editingColor?.image || ''
        if (colorImage) {
          imageUrl = await uploadToCloudinary(colorImage, CloudinaryColor)
        }

        const colorData = { name: colorInput.trim(), image: imageUrl }

        if (editingColor) {
          // Cập nhật màu trong colorList
          setColorList(
            colorList.map((color) =>
              color.name === editingColor.name ? colorData : color
            )
          )
        } else {
          // Thêm màu mới vào API và colorList
          const newColor = await addColorPalette(colorData)
          setColorList([
            ...colorList,
            { name: newColor.name, image: newColor.image }
          ])
        }

        // Reset form
        setColorInput('')
        setColorImage(null)
        setColorImagePreview('')
        setEditingColor(null)
        if (colorFileInputRef.current) {
          colorFileInputRef.current.value = ''
        }
      } catch (error) {
        console.error('Lỗi khi thêm/cập nhật màu:', error)
        alert('Không thể thêm/cập nhật màu, vui lòng thử lại')
      }
    } else {
      alert('Vui lòng nhập tên màu và chọn ảnh (nếu thêm mới)')
    }
  }

  const handleEditColor = (color) => {
    setEditingColor(color)
    setColorInput(color.name)
    setColorImagePreview(color.image || '')
    setColorImage(null)
  }

  const handleRemoveColor = (colorToRemove) => {
    setColorList(colorList.filter((color) => color.name !== colorToRemove.name))
    if (editingColor?.name === colorToRemove.name) {
      // Reset form nếu màu đang sửa bị xóa
      setEditingColor(null)
      setColorInput('')
      setColorImage(null)
      setColorImagePreview('')
      if (colorFileInputRef.current) {
        colorFileInputRef.current.value = ''
      }
    }
  }

  const onSubmit = async (data) => {
    try {
      const imageUrls = []
      for (const img of images) {
        if (img.file && img.preview.startsWith('blob:')) {
          const url = await uploadToCloudinary(img.file)
          imageUrls.push(url)
        } else if (img.preview) {
          imageUrls.push(img.preview)
        }
      }

      const updatedProduct = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        quantity: Number(data.quantity),
        categoryId: data.categoryId,
        colors: colorList, // Gửi mảng colorList với cấu trúc [{ name, image }]
        image: imageUrls
      }

      await onSave(product._id, updatedProduct)
      onClose()
      reset()
      setImages([{ file: null, preview: '' }])
      setColorList([])
      setColorInput('')
      setColorImage(null)
      setColorImagePreview('')
      setEditingColor(null)
    } catch (error) {
      console.error('Lỗi khi chỉnh sửa sản phẩm:', error)
      alert('Có lỗi xảy ra, vui lòng thử lại')
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='xl'
      PaperProps={{ sx: { mt: 8, maxHeight: '90vh', width: '90vw' } }}
    >
      <DialogTitle sx={{ fontWeight: 600, fontSize: 20 }}>
        Sửa Sản Phẩm
      </DialogTitle>
      <Divider />

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ display: 'flex', gap: 3, py: 3 }}>
          <Box sx={{ flex: 2 }}>
            <TextField
              label='Tên sản phẩm'
              fullWidth
              margin='normal'
              {...register('name', {
                required: 'Tên sản phẩm không được bỏ trống'
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
              sx={StyleAdmin.InputCustom}
            />
            <TextField
              label='Mô tả'
              fullWidth
              multiline
              rows={3}
              margin='normal'
              {...register('description', {
                required: 'Mô tả không được bỏ trống'
              })}
              error={!!errors.description}
              helperText={errors.description?.message}
              sx={StyleAdmin.InputCustom}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label='Giá (VNĐ)'
                type='number'
                fullWidth
                margin='normal'
                {...register('price', {
                  required: 'Giá không được bỏ trống'
                })}
                error={!!errors.price}
                helperText={errors.price?.message}
                sx={StyleAdmin.InputCustom}
              />
              <TextField
                label='Số lượng'
                type='number'
                fullWidth
                margin='normal'
                {...register('quantity', {
                  required: 'Số lượng không được bỏ trống'
                })}
                error={!!errors.quantity}
                helperText={errors.quantity?.message}
                sx={StyleAdmin.InputCustom}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant='subtitle1' sx={{ mb: 1 }}>
                Màu sắc
              </Typography>
              <Box
                sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}
              >
                <FormControl fullWidth sx={StyleAdmin.FormSelect}>
                  <InputLabel>Chọn màu</InputLabel>
                  <Select
                    value=''
                    onChange={(e) => {
                      const selectedColor = colorPalettes.find(
                        (c) => c._id === e.target.value
                      )
                      if (
                        selectedColor &&
                        !colorList.some((c) => c.name === selectedColor.name)
                      ) {
                        setColorList([
                          ...colorList,
                          {
                            name: selectedColor.name,
                            image: selectedColor.image || ''
                          }
                        ])
                      } else if (selectedColor) {
                        alert('Màu này đã được chọn')
                      }
                    }}
                    disabled={colorLoading}
                  >
                    {colorPalettes.map((color) => (
                      <MenuItem key={color._id} value={color._id}>
                        {color.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Typography variant='subtitle2' sx={{ mx: 1 }}>
                  hoặc
                </Typography>
                <TextField
                  label={editingColor ? 'Sửa tên màu' : 'Tên màu mới'}
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  sx={StyleAdmin.InputCustom}
                  style={{ flex: 1 }}
                />
                <Button
                  variant='outlined'
                  component='label'
                  sx={{
                    height: '56px',
                    borderColor: '#000',
                    color: '#000'
                  }}
                >
                  Chọn ảnh
                  <input
                    type='file'
                    accept='image/*'
                    hidden
                    ref={colorFileInputRef}
                    onChange={handleColorImageChange}
                  />
                </Button>
                <Button
                  variant='contained'
                  onClick={handleAddOrEditColor}
                  disabled={
                    !colorInput.trim() || (!colorImage && !editingColor?.image)
                  }
                  sx={{ backgroundColor: '#001f5d', height: '56px' }}
                >
                  {editingColor ? 'Cập nhật' : 'Thêm'}
                </Button>
              </Box>
              {colorImagePreview && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant='caption'>Xem trước ảnh:</Typography>
                  <Box
                    component='img'
                    src={colorImagePreview}
                    alt='color-preview'
                    sx={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: 1
                    }}
                  />
                </Box>
              )}
              <List sx={{ maxHeight: '150px', overflowY: 'auto' }}>
                {colorList.map((color, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <Box>
                        <IconButton
                          edge='end'
                          onClick={() => handleEditColor(color)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon sx={{ color: '#2196f3' }} />
                        </IconButton>
                        <IconButton
                          edge='end'
                          onClick={() => handleRemoveColor(color)}
                        >
                          <DeleteIcon sx={{ color: '#f44336' }} />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={color.image}
                        alt={color.name}
                        sx={{ width: 40, height: 40 }}
                      />
                    </ListItemAvatar>
                    <ListItemText primary={color.name} />
                  </ListItem>
                ))}
              </List>
            </Box>
            <FormControl
              fullWidth
              margin='normal'
              error={!!errors.categoryId}
              sx={StyleAdmin.FormSelect}
            >
              <InputLabel>Danh mục</InputLabel>
              <Controller
                name='categoryId'
                control={control}
                rules={{ required: 'Danh mục không được bỏ trống' }}
                render={({ field }) => (
                  <Select
                    {...field}
                    label='Danh mục'
                    MenuProps={{
                      PaperProps: {
                        sx: StyleAdmin.FormSelect.SelectMenu
                      }
                    }}
                    disabled={categoryLoading}
                  >
                    {categories
                      ?.filter((cat) => !cat.destroy)
                      .map((cat) => (
                        <MenuItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                  </Select>
                )}
              />
              <Typography variant='caption' color='error'>
                {errors.categoryId?.message}
              </Typography>
            </FormControl>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant='subtitle1' sx={{ mb: 1 }}>
              Hình ảnh sản phẩm (tối đa 9 ảnh)
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: 2
              }}
            >
              {images.map((img, index) => (
                <Box key={index} sx={{ position: 'relative' }}>
                  <input
                    type='file'
                    accept='image/*'
                    hidden
                    ref={(el) => (fileInputRefs.current[index] = el)}
                    onChange={(e) =>
                      handleImageChange(index, e.target.files[0])
                    }
                  />
                  <Box
                    sx={{
                      width: '100%',
                      height: '150px',
                      borderRadius: 1,
                      border: '1px solid #000',
                      overflow: 'hidden',
                      position: 'relative',
                      '&:hover .overlay, &:hover .overlay-bg': { opacity: 1 }
                    }}
                  >
                    {img.preview ? (
                      <>
                        <Box
                          component='img'
                          src={img.preview}
                          alt={`preview-${index}`}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <Box
                          className='overlay-bg'
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            opacity: 0,
                            transition: 'opacity 0.3s',
                            zIndex: 1
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 5,
                            left: 5,
                            zIndex: 2,
                            opacity: 0,
                            transition: 'opacity 0.3s'
                          }}
                          className='overlay'
                        >
                          <IconButton
                            size='small'
                            onClick={() =>
                              fileInputRefs.current[index]?.click()
                            }
                          >
                            <EditIcon sx={{ fontSize: 18, color: '#2196f3' }} />
                          </IconButton>
                        </Box>
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 5,
                            right: 5,
                            zIndex: 2,
                            opacity: 0,
                            transition: 'opacity 0.3s'
                          }}
                          className='overlay'
                        >
                          <IconButton
                            size='small'
                            onClick={() => handleImageDelete(index)}
                          >
                            <DeleteIcon
                              sx={{ fontSize: 18, color: '#f44336' }}
                            />
                          </IconButton>
                        </Box>
                      </>
                    ) : (
                      <Button
                        variant='outlined'
                        component='label'
                        sx={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderColor: '#000',
                          color: '#000',
                          fontSize: '12px'
                        }}
                      >
                        Thêm ảnh
                        <input
                          type='file'
                          accept='image/*'
                          hidden
                          onChange={(e) =>
                            handleImageChange(index, e.target.files[0])
                          }
                        />
                      </Button>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </DialogContent>

        <Divider />
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button onClick={onClose} variant='inherit'>
            Hủy
          </Button>
          <Button
            type='submit'
            variant='contained'
            sx={{ backgroundColor: '#001f5d' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditProductModal
