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
import Divider from '@mui/material/Divider'
import { useForm, Controller } from 'react-hook-form'
import useCategories from '~/hooks/admin/useCategories.js'
import AddCategoryModal from '~/pages/admin/CategorieManagement/modal/AddCategoryModal.jsx'
import StyleAdmin from '~/assets/StyleAdmin.jsx'
import { updateProduct } from '~/services/admin/productService.js' // hàm cập nhật sản phẩm (bạn cần tạo)
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'

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

const uploadImageFunction = async (file) => {
  try {
    const secureUrl = await uploadToCloudinary(file, CloudinaryProduct)
    return { data: { link: secureUrl } }
  } catch (error) {
    console.error('Lỗi khi upload ảnh:', error)
    return Promise.reject(error)
  }
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
      importPrice: '',
      exportPrice: ''
    }
  })
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [productImages, setProductImages] = useState([])
  const [productImagePreview, setProductImagePreview] = useState([])
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const productImageInputRef = useRef()

  const { categories, fetchCategories, loading } = useCategories()

  // Khi modal mở, load dữ liệu sản phẩm vào form và editor
  useEffect(() => {
    if (open && product) {
      fetchCategories()

      reset({
        name: product.name || '',
        description: product.description || '',
        categoryId: product.categoryId?._id || product.categoryId || '',
        price: product.exportPrice || '',
        importPrice: product.importPrice || ''
      })

      setProductImages(product.image || [])
      setProductImagePreview(product.image || [])

      // Chuyển html description thành editorState
      if (product.description) {
        const contentBlock = htmlToDraft(product.description)
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(
            contentBlock.contentBlocks
          )
          setEditorState(EditorState.createWithContent(contentState))
        } else {
          setEditorState(EditorState.createEmpty())
        }
      } else {
        setEditorState(EditorState.createEmpty())
      }
    }
  }, [open, reset])

  const handleProductImageFileChange = async (e) => {
    const files = Array.from(e.target.files || [])
    const remainingSlots = 9 - productImages.length

    if (files.length > remainingSlots) {
      alert(`Bạn chỉ có thể thêm tối đa ${remainingSlots} ảnh nữa.`)
      return
    }
    try {
      const uploadedUrls = await Promise.all(
        files.map((file) => uploadToCloudinary(file, CloudinaryProduct))
      )

      setProductImages((prev) => [...prev, ...uploadedUrls])
      setProductImagePreview((prev) => [...prev, ...uploadedUrls])
    } catch (error) {
      alert('Có lỗi khi upload ảnh. Vui lòng thử lại.')
      console.error(error)
    }
    if (productImageInputRef.current) {
      productImageInputRef.current.value = ''
    }
  }

  const handleRemoveProductImage = (index) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index))
    setProductImagePreview((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data) => {
    try {
      if (productImages.length === 0) {
        alert('Vui lòng thêm ít nhất một ảnh sản phẩm')
        return
      }

      const finalProduct = {
        name: data.name,
        description: data.description,
        exportPrice: Number(data.price),
        importPrice: data.importPrice ? Number(data.importPrice) : undefined,
        categoryId: data.categoryId,
        image: productImages
      }

      const result = await onSave(product._id, finalProduct) // gọi api cập nhật

      if (result) {
        onClose()
        reset()
        setProductImages([])
        setProductImagePreview([])
        setEditorState(EditorState.createEmpty())
      } else {
        alert('Cập nhật sản phẩm không thành công')
      }
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
          marginTop: '50px',
          height: '85vh',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column'
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
          >
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Box>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item size={12}></Grid>
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
          <Grid item size={12}>
            <Typography variant='h6' style={{ marginBottom: '16px' }}>
              Ảnh sản phẩm
            </Typography>
            <Grid container spacing={1} alignItems='center' sx={{ mb: 2 }}>
              <Grid
                item
                size={2}
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
                        previewImage: false,
                        alt: { present: false },
                        urlEnabled: false,
                        inputAccept: 'image/*',
                        defaultSize: {
                          height: 'auto',
                          width: '100%'
                        }
                      }
                    }}
                    editorStyle={{
                      minHeight: '200px',
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

export default EditProductModal
