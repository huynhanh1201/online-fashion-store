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
      origin: '',
      colors: []
    }
  })

  const [images, setImages] = useState([{ file: null, preview: '' }])
  const [colorInput, setColorInput] = useState('')
  const [colorImage, setColorImage] = useState(null)
  const [colorImagePreview, setColorImagePreview] = useState('')
  const [colorList, setColorList] = useState([])
  const fileInputRefs = useRef([])
  const colorFileInputRef = useRef(null)
  const { categories, loading, fetchCategories } = useCategories()
  const didFetchRef = useRef(false)
  // useColorPalettes: lấy, tạo, cập nhật, xoá màu theo productId
  const {
    colorPalettes,
    fetchColorPalettes,
    addColorPalette,
    editColorPalette,
    removeColorPalette
  } = useColorPalettes(product?._id)

  // State quản lý chỉnh sửa màu sắc
  const [editingColorIndex, setEditingColorIndex] = useState(null)
  const [editColorName, setEditColorName] = useState('')
  const [editColorImage, setEditColorImage] = useState(null)
  const [editColorPreview, setEditColorPreview] = useState('')

  useEffect(() => {
    if (product) {
      reset({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        quantity: product.quantity || '',
        categoryId: product.categoryId?._id || '',
        colors: product.colors || []
      })

      const previews =
        product.image?.map((url) => ({ file: null, preview: url })) || []
      setImages([...previews, { file: null, preview: '' }])

      // Lấy màu ban đầu từ product.colors hoặc colorPalettes
      if (product.colors && product.colors.length > 0) {
        setColorList(
          product.colors.map((c) =>
            typeof c === 'string' ? { name: c, image: '' } : c
          )
        )
      } else if (colorPalettes.length) {
        setColorList(colorPalettes)
      } else {
        setColorList([])
      }
    }
  }, [product, reset, colorPalettes])

  useEffect(() => {
    if (open && product?._id && !didFetchRef.current) {
      fetchCategories()
      fetchColorPalettes(product._id)
      didFetchRef.current = true
    }
    if (!open) {
      didFetchRef.current = false
    }
  }, [open, product, fetchCategories, fetchColorPalettes])

  // Xử lý thay đổi ảnh sản phẩm
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

  // Xử lý thay đổi ảnh màu mới
  const handleColorImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setColorImage(file)
      setColorImagePreview(URL.createObjectURL(file))
    }
  }

  // Xử lý thay đổi ảnh màu đang chỉnh sửa
  const handleEditColorImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setEditColorImage(file)
      setEditColorPreview(URL.createObjectURL(file))
    }
  }

  // Bắt đầu chỉnh sửa 1 màu trong list
  const handleEditColor = (index) => {
    setEditingColorIndex(index)
    setEditColorName(colorList[index].name)
    setEditColorPreview(colorList[index].image)
    setEditColorImage(null)
  }

  // Lưu chỉnh sửa màu sắc (cập nhật lên API)
  const handleSaveEditColor = async () => {
    try {
      let newImageUrl = editColorPreview

      if (editColorImage) {
        newImageUrl = await uploadToCloudinary(editColorImage, CloudinaryColor)
      }

      const oldColor = colorList[editingColorIndex]

      const updatedColor = {
        ...oldColor,
        name: editColorName.trim(),
        image: newImageUrl,
        isNew: false // đã lưu thành công
      }

      if (oldColor.isNew) {
        // Nếu là màu mới thì gọi API tạo màu
        const created = await addColorPalette({
          name: updatedColor.name,
          image: updatedColor.image
        })
        // Thay thế color trong list bằng màu mới từ DB (có _id thật)
        const updatedColors = [...colorList]
        updatedColors[editingColorIndex] = created
        setColorList(updatedColors)
      } else {
        // Nếu là màu có sẵn thì gọi API cập nhật
        await editColorPalette(oldColor._id, {
          name: updatedColor.name,
          image: updatedColor.image,
          isActive: oldColor.isActive ?? true
        })

        const updatedColors = [...colorList]
        updatedColors[editingColorIndex] = updatedColor
        setColorList(updatedColors)
      }

      setEditingColorIndex(null)
      setEditColorName('')
      setEditColorImage(null)
      setEditColorPreview('')
    } catch (error) {
      console.error('Lỗi khi cập nhật màu:', error)
      alert('Lỗi khi cập nhật màu, vui lòng thử lại')
    }
  }

  // Thêm màu mới (upload ảnh rồi gọi API tạo màu mới)
  // Thêm màu mới (chỉ thêm vào mảng colorList local, không gọi API)
  // Thêm màu mới (upload ảnh rồi gọi API tạo màu mới)
  const handleAddColor = async (e) => {
    e.preventDefault()

    if (!colorInput.trim()) {
      alert('Tên màu không được để trống')
      return
    }

    let imageUrl = ''
    if (colorImage) {
      try {
        imageUrl = await uploadToCloudinary(colorImage, CloudinaryColor)
      } catch {
        alert('Lỗi khi upload ảnh màu, vui lòng thử lại')
        return
      }
    }

    try {
      // Gọi addColorPalette truyền đúng productId
      const createdColor = await addColorPalette({
        name: colorInput.trim(),
        image: imageUrl
      })

      setColorList((prev) => [...prev, createdColor])

      setColorInput('')
      setColorImage(null)
      setColorImagePreview('')
    } catch (error) {
      console.error('Lỗi khi tạo màu:', error)
      alert('Lỗi khi tạo màu, vui lòng thử lại')
    }
  }

  // Xóa màu sắc (gọi API xóa và cập nhật local state)
  const handleRemoveColor = async (colorToRemove) => {
    setColorList(colorList.filter((color) => color !== colorToRemove))
    // Gọi API xóa màu
    if (colorToRemove._id) {
      try {
        await removeColorPalette(colorToRemove._id)
      } catch (error) {
        console.error('Lỗi khi xóa màu:', error)
        alert('Lỗi khi xóa màu, vui lòng thử lại')
      }
    }
  }

  // Submit form chỉnh sửa sản phẩm
  const onSubmit = async (data) => {
    try {
      // 1. Upload ảnh sản phẩm mới (ảnh có file và preview là blob)
      const imageUrls = []
      for (const img of images) {
        if (img.file && img.preview.startsWith('blob:')) {
          const url = await uploadToCloudinary(img.file)
          imageUrls.push(url)
        } else if (img.preview) {
          // Ảnh cũ giữ nguyên url
          imageUrls.push(img.preview)
        }
      }

      // 2. Đảm bảo màu sắc trong colorList đã được đồng bộ với API
      //    Mỗi màu đã được thêm/xóa/cập nhật khi thao tác tương ứng,
      //    nên chỉ cần lấy colorList hiện tại.

      // 3. Chuẩn bị dữ liệu cập nhật sản phẩm
      const updatedProduct = {
        name: data.name.trim(),
        description: data.description.trim(),
        origin: data.origin || '',
        price: Number(data.price),
        quantity: Number(data.quantity),
        categoryId: data.categoryId,
        colors: colorList.map((color) => ({
          name: color.name.trim(),
          image: color.image
        })),
        image: imageUrls
      }

      // 4. Gọi hàm onSave (do props truyền vào) để cập nhật backend
      await onSave(product._id, updatedProduct)

      // 5. Reset form, đóng modal và xóa dữ liệu tạm
      onClose()
      reset()
      setImages([{ file: null, preview: '' }])
      setColorList([])
      setColorInput('')
      setColorImage(null)
      setColorImagePreview('')
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
            <TextField
              label='Xuất xứ'
              fullWidth
              margin='normal'
              {...register('origin')}
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
            <FormControl fullWidth margin='normal' sx={StyleAdmin.InputCustom}>
              <InputLabel id='category-select-label'>Danh mục</InputLabel>
              <Controller
                name='categoryId'
                control={control}
                rules={{ required: 'Chọn danh mục' }}
                render={({ field }) => (
                  <Select
                    labelId='category-select-label'
                    label='Danh mục'
                    {...field}
                    disabled={loading}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.categoryId && (
                <Typography color='error' variant='caption'>
                  {errors.categoryId.message}
                </Typography>
              )}
            </FormControl>
            <Box sx={{ mt: 3 }}>
              <Typography variant='h6' gutterBottom>
                Ảnh sản phẩm (tối đa 9 ảnh)
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  maxHeight: 200,
                  overflowY: 'auto'
                }}
              >
                {images.map((img, i) => (
                  <Box
                    key={i}
                    sx={{
                      position: 'relative',
                      width: 100,
                      height: 100,
                      border: '1px solid #ccc',
                      borderRadius: 1,
                      overflow: 'hidden'
                    }}
                  >
                    {img.preview ? (
                      <>
                        <img
                          src={img.preview}
                          alt={`Ảnh ${i + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <IconButton
                          size='small'
                          onClick={() => handleImageDelete(i)}
                          sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            backgroundColor: 'rgba(255,255,255,0.7)'
                          }}
                        >
                          <DeleteIcon fontSize='small' />
                        </IconButton>
                      </>
                    ) : (
                      <Button
                        variant='outlined'
                        component='label'
                        sx={{ height: '100%', width: '100%' }}
                      >
                        Thêm
                        <input
                          type='file'
                          hidden
                          accept='image/*'
                          onChange={(e) =>
                            handleImageChange(i, e.target.files[0])
                          }
                          ref={(el) => (fileInputRefs.current[i] = el)}
                        />
                      </Button>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Bên phải: màu sắc */}
          <Box sx={{ flex: 1 }}>
            <Typography variant='h6' mb={1}>
              Màu sắc sản phẩm
            </Typography>

            {/* Danh sách màu */}
            <List
              dense
              sx={{
                maxHeight: 300,
                overflowY: 'auto',
                bgcolor: 'background.paper',
                border: '1px solid #ccc',
                borderRadius: 1
              }}
            >
              {colorList.length === 0 && (
                <Typography
                  variant='body2'
                  sx={{ textAlign: 'center', mt: 2, mb: 2 }}
                >
                  Chưa có màu nào
                </Typography>
              )}

              {colorList.map((color, index) => (
                <ListItem
                  key={color._id || index}
                  secondaryAction={
                    <>
                      <IconButton
                        edge='end'
                        aria-label='edit'
                        onClick={() => handleEditColor(index)}
                        size='small'
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge='end'
                        aria-label='delete'
                        onClick={() => handleRemoveColor(color)}
                        size='small'
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      src={color.image || ''}
                      sx={{ bgcolor: '#eee', color: '#000' }}
                      variant='rounded'
                    >
                      {color.name?.[0]?.toUpperCase() || '?'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={color.name} />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Box component='form' onSubmit={handleAddColor}>
              <TextField
                label='Tên màu mới'
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                size='small'
                fullWidth
                sx={{ mb: 1 }}
              />
              <Button
                variant='outlined'
                component='label'
                fullWidth
                sx={{ mb: 1 }}
              >
                Chọn ảnh màu
                <input
                  type='file'
                  hidden
                  accept='image/*'
                  onChange={handleColorImageChange}
                  ref={colorFileInputRef}
                />
              </Button>
              {colorImagePreview && (
                <Box
                  component='img'
                  src={colorImagePreview}
                  alt='Ảnh màu mới'
                  sx={{
                    width: '100%',
                    height: 80,
                    objectFit: 'cover',
                    borderRadius: 1,
                    mb: 1
                  }}
                />
              )}
              <Button
                type='button' // đổi từ submit thành button
                variant='contained'
                fullWidth
                disabled={!colorInput.trim() || !colorImage}
                onClick={handleAddColor} // gọi hàm thêm màu
              >
                Thêm màu
              </Button>
            </Box>

            {/* Chỉnh sửa màu */}
            {editingColorIndex !== null && (
              <Box sx={{ mt: 3 }}>
                <Typography variant='subtitle1' mb={1}>
                  Chỉnh sửa màu
                </Typography>
                <TextField
                  label='Tên màu'
                  value={editColorName}
                  onChange={(e) => setEditColorName(e.target.value)}
                  size='small'
                  fullWidth
                  sx={{ mb: 1 }}
                />
                <Button
                  variant='outlined'
                  component='label'
                  fullWidth
                  sx={{ mb: 1 }}
                >
                  Chọn ảnh mới
                  <input
                    type='file'
                    hidden
                    accept='image/*'
                    onChange={handleEditColorImageChange}
                  />
                </Button>
                {editColorPreview && (
                  <Box
                    component='img'
                    src={editColorPreview}
                    alt='Ảnh màu chỉnh sửa'
                    sx={{
                      width: '100%',
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 1,
                      mb: 1
                    }}
                  />
                )}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant='contained'
                    onClick={handleSaveEditColor}
                    disabled={!editColorName.trim()}
                    fullWidth
                  >
                    Lưu
                  </Button>
                  <Button
                    variant='outlined'
                    onClick={() => setEditingColorIndex(null)}
                    fullWidth
                  >
                    Hủy
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button type='submit' variant='contained' disabled={isSubmitting}>
            Lưu thay đổi
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditProductModal
