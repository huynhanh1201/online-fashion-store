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
  FormLabel,
  Chip
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import useCategories from '~/hooks/admin/useCategories.js'
import AddCategoryModal from '~/pages/admin/CategorieManagement/modal/AddCategoryModal.jsx'
import StyleAdmin from '~/assets/StyleAdmin.jsx'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { EditorState } from 'draft-js'
import ProductImages from '../component/ProductImageUploader'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import 'draft-js/dist/Draft.css'
import { CloudinaryColor, CloudinaryProduct, URI } from '~/utils/constants'
import { toast } from 'react-toastify'
import DescriptionEditor from '~/components/EditContent/DescriptionEditor.jsx'
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

const AddProductModal = ({ open, onClose, onSuccess }) => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      categoryId: '',
      categoryName: '',
      price: '',
      importPrice: '',
      exportPrice: '',
      packageSize: {
        length: '',
        width: '',
        height: '',
        weight: ''
      },
      status: 'draft'
    }
  })
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [productImages, setProductImages] = useState([])
  const [productImagePreview, setProductImagePreview] = useState([])
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const { categories, fetchCategories, loading, add } = useCategories()
  useEffect(() => {
    if (open) {
      fetchCategories(1, 100000)
      reset()
      setProductImages([])
      setProductImagePreview([])
      setEditorState(EditorState.createEmpty())
    }
  }, [open, reset])

  const handAddCategory = async (category) => {
    const newCategory = await add(category) // category trả về từ add()

    // Gọi lại danh sách nếu cần thiết
    fetchCategories(1, 100000)

    // ✅ Đặt category mới làm giá trị cho select
    setValue('categoryId', {
      id: newCategory._id,
      name: newCategory.name
    })

    setCategoryOpen(false) // Đóng Chart
  }
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
  const handleImageInsertFromEditor = (url) => {
    // Chỉ thêm nếu ảnh chưa có trong imageUrls
    setProductImagePreview((prev) => {
      const trimmed = prev.map((u) => u.trim())
      if (!trimmed.includes(url)) return [...trimmed.filter((u) => u), url, '']
      return [...trimmed, '']
    })
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
        categoryId: data.categoryId.id, // ✅ lấy id
        image: productImages,
        packageSize: {
          length: Number(data.packageSize?.length || 0),
          width: Number(data.packageSize?.width || 0),
          height: Number(data.packageSize?.height || 0),
          weight: Number(data.packageSize?.weight || 0)
        },
        status: data.status || 'draft'
      }

      await onSuccess(finalProduct, 'add')

      onClose()
      reset()
      setProductImages([])
      setProductImagePreview([])
      setEditorState(EditorState.createEmpty())
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error)
      alert('Có lỗi xảy ra, vui lòng thử lại')
    }
  }

  const formatNumber = (value) => {
    const number = value.replace(/\D/g, '') // Xóa ký tự không phải số
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.') // Thêm dấu chấm ngăn cách
  }

  const parseNumber = (formatted) => formatted.replace(/\./g, '')
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
          Thêm sản phẩm mới
        </DialogTitle>
        <DialogActions sx={{ paddingLeft: '24px' }}>
          <Button
            onClick={onClose}
            color='error'
            variant='outlined'
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
            Thêm sản phẩm
          </Button>
        </DialogActions>
      </Box>
      <DialogContent
        sx={{
          overflowY: 'auto',
          padding: 3,
          flex: 1
        }}
      >
        <Grid container spacing={2}>
          {/*tên sản phẩm*/}
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
                      Tên sản phẩm <span style={{ color: 'red' }}>*</span>
                    </>
                  }
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  {...field}
                />
              )}
            />
          </Grid>
          {/* ảnh sản phẩm */}
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
                Danh mục <span style={{ color: 'red' }}>*</span>
              </InputLabel>
              <Controller
                name='categoryId'
                control={control}
                rules={{ required: 'Danh mục không được bỏ trống' }}
                render={({ field }) => (
                  <Select
                    label='Danh mục'
                    value={field.value || ''}
                    onChange={(e) => {
                      field.onChange(e.target.value)
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          ...StyleAdmin.FormSelect.SelectMenu,
                          maxHeight: 300, // ✅ Chiều cao tối đa của danh sách dropdown
                          overflowY: 'auto' // ✅ Hiển thị thanh cuộn dọc
                        }
                      }
                    }}
                    renderValue={(selected) => selected?.name || ''}
                    disabled={loading}
                  >
                    {selectableCategories
                      .filter((c) => !c.destroy)
                      .map((cat) => (
                        <MenuItem
                          key={cat._id}
                          value={{ id: cat._id, name: cat.name }}
                        >
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
              rules={{
                required: 'Giá nhập là bắt buộc',
                min: { value: 0, message: 'Giá nhập không được âm' }
              }}
              control={control}
              render={({ field }) => (
                <TextField
                  label={
                    <>
                      Giá nhập (đ) <span style={{ color: 'red' }}>*</span>
                    </>
                  }
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
                  label={
                    <>
                      Giá bán (đ) <span style={{ color: 'red' }}>*</span>
                    </>
                  }
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
          {/*kích thước đóng gói*/}
          <Typography variant='h6'>Kích thước đóng gói</Typography>
          <Grid item size={12}>
            <Grid container spacing={2}>
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
                      label={
                        <>
                          Chiều dài gói hàng (cm){' '}
                          <span style={{ color: 'red' }}>*</span>
                        </>
                      }
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
                      label={
                        <>
                          Chiều rộng gói hàng (cm){' '}
                          <span style={{ color: 'red' }}>*</span>
                        </>
                      }
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
                      label={
                        <>
                          Chiều cao gói hàng (cm){' '}
                          <span style={{ color: 'red' }}>*</span>
                        </>
                      }
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
                      label={
                        <>
                          Trọng lượng gói hàng (cm){' '}
                          <span style={{ color: 'red' }}>*</span>
                        </>
                      }
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

          {/*Mô tả*/}
          <Typography variant='h6'>
            Mô tả sản phẩm <span style={{ color: 'red' }}>*</span>
          </Typography>
          <Grid item size={12}>
            <DescriptionEditor
              control={control}
              name='description'
              setValue={setValue}
              initialHtml={''}
              onImageInsert={handleImageInsertFromEditor}
              rules={{
                validate: (value) =>
                  !value ||
                  value.trim() === value ||
                  'Mô tả không được có khoảng trắng đầu/cuối'
              }}
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
        onAdded={handAddCategory}
      />
    </Dialog>
  )
}

export default AddProductModal
