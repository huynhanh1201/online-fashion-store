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
  Box
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import useCategories from '~/hooks/admin/useCategories.js'
import AddCategoryModal from '~/pages/admin/CategorieManagement/modal/AddCategoryModal.jsx'
import StyleAdmin from '~/assets/StyleAdmin.jsx'
import { addProduct } from '~/services/admin/productService.js'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { EditorState, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import ProductImages from '../component/ProductImageUploader'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import 'draft-js/dist/Draft.css'
import { CloudinaryColor, CloudinaryProduct, URI } from '~/utils/constants'

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

const uploadImageFunction = async (file) => {
  try {
    const secureUrl = await uploadToCloudinary(file, CloudinaryProduct)
    return { data: { link: secureUrl } }
  } catch (error) {
    console.error('Lỗi khi upload ảnh:', error)
    return Promise.reject(error)
  }
}

const AddProductModal = ({ open, onClose, onSuccess }) => {
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
  const [productImages, setProductImages] = useState([])
  const [productImagePreview, setProductImagePreview] = useState([])
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const { categories, fetchCategories, loading } = useCategories()

  useEffect(() => {
    if (open) {
      fetchCategories()
      reset()
      setProductImages([])
      setProductImagePreview([])
      setEditorState(EditorState.createEmpty())
    }
  }, [open, reset])

  const onSubmit = async (data) => {
    try {
      if (productImages.length === 0) {
        console.log('Vui lòng thêm ít nhất một ảnh sản phẩm')
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
        }
      }

      console.log('Final Product:', typeof finalProduct.packageSize.weight)

      const result = await addProduct(finalProduct)

      if (result) {
        onSuccess()
        onClose()
        reset()
        setProductImages([])
        setProductImagePreview([])
        setEditorState(EditorState.createEmpty())
      } else {
        alert('Thêm sản phẩm không thành công')
      }
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
      maxWidth='xl'
      fullWidth
      PaperProps={{
        sx: {
          display: 'flex',
          flexDirection: 'column',
          marginTop: '50px',
          maxHeight: '85vh' // đảm bảo không vượt quá
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
              backgroundColor: '#001f5d',
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
          <Grid item size={3} style={{ marginTop: '16px' }}>
            <Controller
              name='importPrice'
              control={control}
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
                />
              )}
            />
          </Grid>
          {/* Giá bán */}
          <Grid item size={3} style={{ marginTop: '16px' }}>
            <Controller
              name='price'
              control={control}
              rules={{ required: 'Giá bán không được bỏ trống' }}
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
          {/*kích thước đóng gói*/}
          <Typography variant='h6'>Kích thước đóng gói</Typography>
          <Grid item size={12}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {/* Chiều dài */}
              <Grid item size={3} xs={6} sm={3}>
                <Controller
                  name='packageSize.length'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label='Dài (cm)'
                      type='number'
                      fullWidth
                      inputProps={{ min: 0 }}
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
                  render={({ field }) => (
                    <TextField
                      label='Rộng (cm)'
                      type='number'
                      fullWidth
                      inputProps={{ min: 0 }}
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
                  render={({ field }) => (
                    <TextField
                      label='Cao (cm)'
                      type='number'
                      fullWidth
                      inputProps={{ min: 0 }}
                      {...field}
                    />
                  )}
                />
              </Grid>
              {/* Khối lượng */}
              <Grid item size={3} xs={6} sm={3}>
                <Controller
                  name='packageSize.weight'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label='Khối lượng (kg)'
                      type='number'
                      fullWidth
                      inputProps={{ min: 0, step: '0.01' }}
                      {...field}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          {/*Mô tả*/}
          <Grid item size={12}>
            <Controller
              name='description'
              control={control}
              defaultValue=''
              render={({ field }) => (
                <>
                  <label
                    style={{
                      fontWeight: 500,
                      marginBottom: 8,
                      display: 'block'
                    }}
                  >
                    Mô tả sản phẩm
                  </label>
                  <Editor
                    editorState={editorState}
                    onEditorStateChange={(newState) => {
                      setEditorState(newState)
                      const content = draftToHtml(
                        convertToRaw(newState.getCurrentContent())
                      )
                      field.onChange(content)
                    }}
                    wrapperClassName='editor-wrapper'
                    editorClassName='editor-content'
                    toolbar={{
                      options: [
                        'inline',
                        'fontSize',
                        'fontFamily',
                        'list',
                        'link',
                        'image'
                      ],
                      inline: {
                        options: [
                          'bold',
                          'italic',
                          'underline',
                          'strikethrough'
                        ]
                      },
                      fontSize: {
                        options: [
                          8, 9, 10, 11, 12, 14, 16, 18, 24, 30, 36, 48, 60
                        ]
                      },
                      fontFamily: {
                        options: [
                          'Arial',
                          'Georgia',
                          'Impact',
                          'Tahoma',
                          'Times New Roman',
                          'Verdana'
                        ]
                      },
                      image: {
                        uploadCallback: uploadImageFunction,
                        previewImage: false, // Tắt preview
                        alt: { present: false }, // Không yêu cầu ALT
                        urlEnabled: false, // Ẩn URL input
                        inputAccept: 'image/*',
                        defaultSize: {
                          height: 'auto',
                          width: '100%'
                        }
                      }
                    }}
                    editorStyle={{
                      minHeight: '150px',
                      border: '1px solid #ccc',
                      padding: '10px',
                      borderRadius: '4px',
                      backgroundColor: '#fff'
                    }}
                  />
                </>
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>
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

export default AddProductModal
