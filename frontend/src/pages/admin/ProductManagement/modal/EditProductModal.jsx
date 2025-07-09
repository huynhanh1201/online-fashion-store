import React, { useState, useEffect } from 'react'
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
  Box,
  Chip
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import useCategories from '~/hooks/admin/useCategories.js'
import AddCategoryModal from '~/pages/admin/CategorieManagement/modal/AddCategoryModal.jsx'
import StyleAdmin from '~/assets/StyleAdmin.jsx'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import ProductImages from '../component/ProductImageUploader.jsx'
import DescriptionEditor from '~/components/EditContent/DescriptionEditor.jsx'
import { CloudinaryColor, CloudinaryProduct, URI } from '~/utils/constants'
import { toast } from 'react-toastify'
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
    reset,
    watch,
    setValue
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      categoryId: '',
      price: '',
      importPrice: '',
      exportPrice: '',
      packageSize: {
        length: '',
        width: '',
        height: '',
        weight: ''
      }
    }
  })
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [productImages, setProductImages] = useState(product.imageUrls || [])
  const [productImagePreview, setProductImagePreview] = useState(
    product.imageUrls || []
  )
  const { categories, fetchCategories, loading, update } = useCategories()
  function getSelectableCategories(categories) {
    // const parentIds = categories
    //   .filter((cat) => cat.parent && typeof cat.parent === 'object')
    //   .map((cat) => cat.parent._id)

    return categories.filter((cat) => {
      const isChild = !!cat.parent
      const isNotParent = !categories.some(
        (other) => other.parent && other.parent._id === cat._id
      )
      return isChild || isNotParent
    })
  }
  const selectableCategories = getSelectableCategories(categories)
  // Hàm định dạng số và bỏ định dạng
  const formatNumber = (value) => {
    const number = value?.toString().replace(/\D/g, '') || ''
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  const parseNumber = (formatted) => formatted.replace(/\./g, '')
  const handleImageInsertFromEditor = (url) => {
    // Chỉ thêm nếu ảnh chưa có trong imageUrls
    setProductImagePreview((prev) => {
      const trimmed = prev.map((u) => u.trim())
      if (!trimmed.includes(url)) return [...trimmed.filter((u) => u), url, '']
      return [...trimmed, '']
    })
  }
  // Load dữ liệu sản phẩm khi Chart mở
  useEffect(() => {
    if (open && product) {
      fetchCategories(1, 100000)

      reset({
        name: product.name || '',
        description: product.description || '',
        categoryId: product.categoryId?._id || product.categoryId || '',
        price: product.exportPrice || '',
        importPrice: product.importPrice || '',
        status: product.status || 'draft',
        packageSize: {
          length: product.packageSize?.length || '',
          width: product.packageSize?.width || '',
          height: product.packageSize?.height || '',
          weight: product.packageSize?.weight || ''
        }
      })

      setProductImages(product.image || [])
      setProductImagePreview(product.image || [])
    }
  }, [open, reset, product])
  const handEditCategory = async (category) => {
    const newCategory = await update(category) // category trả về từ add()

    // Gọi lại danh sách nếu cần thiết
    fetchCategories(1, 100000)

    // ✅ Đặt category mới làm giá trị cho select
    setValue('categoryId', {
      id: newCategory._id,
      name: newCategory.name
    })

    setCategoryOpen(false) // Đóng Chart
  }
  const onSubmit = async (data) => {
    try {
      if (productImages.length === 0) {
        toast.error('Vui lòng tải lên ít nhất một ảnh sản phẩm')
        return
      }

      const finalProduct = {
        name: data.name,
        description: data.description,
        exportPrice: Number(data.price),
        importPrice: data.importPrice ? Number(data.importPrice) : undefined,
        categoryId: data.categoryId,
        image: productImages,
        packageSize: {
          length: Number(data.packageSize?.length || 0),
          width: Number(data.packageSize?.width || 0),
          height: Number(data.packageSize?.height || 0),
          weight: Number(data.packageSize?.weight || 0)
        },
        status: data.status || 'draft'
      }

      await onSave(finalProduct, 'edit', product._id)

      onClose()
      reset()
      setProductImages([])
      setProductImagePreview([])
    } catch (error) {
      console.error('Lỗi khi cập nhật sản phẩm:', error)
      alert('Có lỗi xảy ra, vui lòng thử lại')
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='xxl'
      fullWidth
      PaperProps={{
        sx: {
          display: 'flex',
          flexDirection: 'column',
          marginTop: '50px',
          maxHeight: '95vh' // đảm bảo không vượt quá
        }
      }}
    >
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
          Sửa thông tin sản phẩm
        </DialogTitle>
        <DialogActions sx={{ paddingLeft: '24px' }}>
          <Button
            onClick={onClose}
            variant='outlined'
            color='error'
            sx={{ textTransform: 'none' }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant='contained'
            sx={{
              color: '#fff',
              backgroundColor: 'var(--primary-color)',
              textTransform: 'none'
            }}
          >
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Box>
      <DialogContent>
        <Grid container spacing={2}>
          {/*tên*/}
          <Grid item size={12}>
            <Controller
              name='name'
              control={control}
              rules={{
                required: 'Tên sản phẩm không được bỏ trống',
                minLength: { value: 1, message: 'Tên quá ngắn' },
                maxLength: { value: 100, message: 'Tên không quá 100 ký tự' },
                validate: (value) =>
                  value.trim() === value ||
                  'Tên không được có khoảng trắng đầu/cuối'
              }}
              render={({ field }) => (
                <TextField
                  label={
                    <>
                      Tên sản phẩm <span style={{ color: 'red' }}>*</span> (bắt
                      buộc)
                    </>
                  }
                  fullWidth
                  error={!!errors?.name}
                  helperText={'Không thể sửa tên vì sản phẩm đã có liên kết'}
                  disabled
                  {...field}
                />
              )}
            />
          </Grid>
          {/*ảnh*/}
          <Grid item size={12}>
            <ProductImages
              productImages={productImages}
              setProductImages={setProductImages}
              productImagePreview={productImagePreview}
              setProductImagePreview={setProductImagePreview}
              onUpload={(file) => uploadToCloudinary(file, CloudinaryProduct)}
            />
          </Grid>
          {/*Danh mục*/}
          <Grid item size={6}>
            <FormControl fullWidth margin='normal' error={!!errors.categoryId}>
              <InputLabel>
                Danh mục <span style={{ color: 'red' }}>*</span> (bắt buộc)
              </InputLabel>
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
                    {selectableCategories
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
          <Grid item size={3} style={{ marginTop: '16px' }}>
            <Controller
              name='importPrice'
              control={control}
              rules={{
                required: 'Giá nhập là bắt buộc',
                min: { value: 0, message: 'Giá nhập không được âm' }
              }}
              render={({ field }) => (
                <TextField
                  label='Giá nhập (đ)'
                  fullWidth
                  type='text'
                  value={formatNumber(field.value || '')}
                  onChange={(e) => {
                    const rawValue = parseNumber(e.target.value)
                    field.onChange(rawValue)
                  }}
                  error={!!errors.price}
                  helperText={errors.price?.message}
                />
              )}
            />
          </Grid>
          {/* Giá bán */}
          <Grid item size={3} style={{ marginTop: '16px' }}>
            <Controller
              name='price'
              control={control}
              rules={{
                required: 'Giá bán là bắt buộc',
                min: { value: 0, message: 'Giá bán không được âm' }
              }}
              render={({ field }) => (
                <TextField
                  label='Giá bán (đ)'
                  fullWidth
                  type='text'
                  value={formatNumber(field.value || '')}
                  onChange={(e) => {
                    const rawValue = parseNumber(e.target.value)
                    field.onChange(rawValue)
                  }}
                  error={!!errors.price}
                  helperText={errors.price?.message}
                />
              )}
            />
          </Grid>
          {/* Kích thước gói hàng */}
          <Typography variant='h6'>Kích thước đóng gói</Typography>
          <Grid item size={12}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {/* Chiều dài */}
              <Grid item size={3} xs={6} sm={3}>
                <Controller
                  name='packageSize.length'
                  control={control}
                  rules={{
                    required: 'Chiều dài là bắt buộc',
                    min: { value: 0.01, message: 'Chiều dài phải lớn hơn 0' },
                    setValueAs: (v) => parseFloat(v) || 0
                  }}
                  render={({ field }) => (
                    <TextField
                      label='Chiều dài gói hàng (cm)'
                      type='number'
                      fullWidth
                      inputProps={{ min: 0, step: '0.01' }}
                      error={!!errors?.packageSize?.length}
                      helperText={errors?.packageSize?.length?.message}
                      {...field}
                    />
                  )}
                />
              </Grid>

              {/* Chiều rộng */}
              <Grid item size={3} xs={6} sm={3}>
                <Controller
                  name='packageSize.width'
                  control={control}
                  rules={{
                    required: 'Chiều rộng là bắt buộc',
                    min: { value: 0.01, message: 'Chiều rộng phải lớn hơn 0' },
                    setValueAs: (v) => parseFloat(v) || 0
                  }}
                  render={({ field }) => (
                    <TextField
                      label='Chiều rộng gói hàng (cm)'
                      type='number'
                      fullWidth
                      inputProps={{ min: 0, step: '0.01' }}
                      error={!!errors?.packageSize?.width}
                      helperText={errors?.packageSize?.width?.message}
                      {...field}
                    />
                  )}
                />
              </Grid>

              {/* Chiều cao */}
              <Grid item size={3} xs={6} sm={3}>
                <Controller
                  name='packageSize.height'
                  control={control}
                  rules={{
                    required: 'Chiều cao là bắt buộc',
                    min: { value: 0.01, message: 'Chiều cao phải lớn hơn 0' },
                    setValueAs: (v) => parseFloat(v) || 0
                  }}
                  render={({ field }) => (
                    <TextField
                      label='Chiều cao gói hàng (cm)'
                      type='number'
                      fullWidth
                      inputProps={{ min: 0, step: '0.01' }}
                      error={!!errors?.packageSize?.height}
                      helperText={errors?.packageSize?.height?.message}
                      {...field}
                    />
                  )}
                />
              </Grid>

              {/* Trọng lượng */}
              <Grid item size={3} xs={6} sm={3}>
                <Controller
                  name='packageSize.weight'
                  control={control}
                  rules={{
                    required: 'Trọng lượng là bắt buộc',
                    min: { value: 0.01, message: 'Trọng lượng phải lớn hơn 0' },
                    setValueAs: (v) => parseFloat(v) || 0
                  }}
                  render={({ field }) => (
                    <TextField
                      label='Trọng lượng gói hàng (gram)'
                      type='number'
                      fullWidth
                      inputProps={{ min: 0, step: '0.01' }}
                      error={!!errors?.packageSize?.weight}
                      helperText={errors?.packageSize?.weight?.message}
                      {...field}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          {/*mô tả*/}
          <Grid item size={12}>
            <DescriptionEditor
              control={control}
              name='description'
              setValue={setValue}
              initialHtml={product?.description || ''}
              onImageInsert={handleImageInsertFromEditor}
            />
          </Grid>
          {/*Trạng thái sản phẩm*/}
          <Grid item size={12}>
            <Box>
              <Typography variant='h6'>Trạng thái sản phẩm</Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                {[
                  { label: 'Bản nháp', value: 'draft' },
                  { label: 'Hoạt động', value: 'active' },
                  { label: 'Không hoạt động', value: 'inactive' }
                ].map((item) => {
                  const isSelected = watch('status') === item.value
                  return (
                    <Chip
                      key={item.value}
                      label={item.label}
                      onClick={() => setValue('status', item.value)}
                      variant={isSelected ? 'filled' : 'outlined'}
                      clickable
                      sx={{
                        ...(isSelected && {
                          backgroundColor: 'var(--primary-color)',
                          color: '#fff',
                          '&:hover': {
                            backgroundColor: 'var(--primary-color)'
                          }
                        })
                      }}
                    />
                  )
                })}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <AddCategoryModal
        open={categoryOpen}
        onClose={() => setCategoryOpen(false)}
        onSave={handEditCategory}
      />
    </Dialog>
  )
}

export default EditProductModal
