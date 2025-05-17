import React, { useEffect, useState, useRef } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Divider,
  IconButton
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { useForm, Controller } from 'react-hook-form'
import useCategories from '~/hook/admin/useCategories.js'
import StyleAdmin from '~/components/StyleAdmin.jsx'

const EditProductModal = ({ open, onClose, product, onSave }) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm()

  const [images, setImages] = useState([{ file: null, preview: '' }])
  const fileInputRefs = useRef([])
  const { categories, loading, fetchCategories } = useCategories()

  useEffect(() => {
    if (product) {
      reset({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        quantity: product.quantity || '',
        categoryId: product.categoryId?._id || '',
        origin: product.origin || '',
        sizes: product.sizes || [],
        colors: Array.isArray(product.colors)
          ? product.colors.map((c) => (typeof c === 'string' ? c : c.color))
          : []
      })

      const previews =
        product.image?.map((url) => ({ file: null, preview: url })) || []
      setImages([...previews, { file: null, preview: '' }])
    }
  }, [product, reset])

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
    setImages(updated)
  }

  const onSubmit = (data) => {
    const imageUrls = images
      .filter((img) => img.preview)
      .map((img) => img.preview)

    const updatedProduct = {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      quantity: Number(data.quantity),
      categoryId: data.categoryId,
      origin: data.origin,
      sizes: data.sizes || [],
      colors: data.colors || [],
      image: imageUrls
    }

    onSave(product._id, updatedProduct)
    onClose()
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
          {/* Bên trái: thông tin sản phẩm */}
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
            <TextField
              label='Xuất xứ'
              fullWidth
              margin='normal'
              {...register('origin')}
              sx={StyleAdmin.InputCustom}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth margin='normal' sx={StyleAdmin.FormSelect}>
                <InputLabel>Kích thước</InputLabel>
                <Controller
                  name='sizes'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label='Kích thước'
                      multiple
                      MenuProps={{
                        PaperProps: { sx: StyleAdmin.FormSelect.SelectMenu }
                      }}
                    >
                      {['S', 'M', 'L', 'XL'].map((size) => (
                        <MenuItem key={size} value={size}>
                          {size}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
              <FormControl fullWidth margin='normal' sx={StyleAdmin.FormSelect}>
                <InputLabel>Màu sắc</InputLabel>
                <Controller
                  name='colors'
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label='Màu sắc'
                      multiple
                      MenuProps={{
                        PaperProps: { sx: StyleAdmin.FormSelect.SelectMenu }
                      }}
                    >
                      {['Đỏ', 'Xanh dương', 'Đen', 'Trắng', 'Vàng'].map(
                        (color) => (
                          <MenuItem key={color} value={color}>
                            {color}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  )}
                />
              </FormControl>
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
                    disabled={loading}
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

          {/* Bên phải: hình ảnh */}
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

                        {/* Icon xoá ở góc trên bên phải */}
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
