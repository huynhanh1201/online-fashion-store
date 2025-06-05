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
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import ProductImages from '../component/ProductImageUploader.jsx'
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
    reset,
    setValue
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
  const [productImages, setProductImages] = useState(product.imageUrls || [])
  const [productImagePreview, setProductImagePreview] = useState(
    product.imageUrls || []
  )
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [selectedImageUrl, setSelectedImageUrl] = useState(null)

  const replaceImageInputRef = useRef()
  const { categories, fetchCategories, loading } = useCategories()

  // Hàm thay thế URL ảnh trong mô tả
  const replaceImageInDescription = (editorState, oldImageUrl, newImageUrl) => {
    const contentState = editorState.getCurrentContent()
    const rawContent = convertToRaw(contentState)
    const htmlContent = draftToHtml(rawContent)

    // Thay thế URL ảnh cũ bằng URL mới
    const updatedHtmlContent = htmlContent.replace(oldImageUrl, newImageUrl)

    // Chuyển đổi HTML mới thành contentState
    const contentBlock = htmlToDraft(updatedHtmlContent)
    const newContentState = ContentState.createFromBlockArray(
      contentBlock.contentBlocks
    )
    const newEditorState = EditorState.createWithContent(newContentState)

    return newEditorState
  }

  // Hàm xử lý thay thế ảnh
  const handleReplaceImage = async (e) => {
    const file = e.target.files[0]
    if (file && selectedImageUrl) {
      try {
        const newImageUrl = await uploadToCloudinary(file, CloudinaryProduct)
        const newEditorState = replaceImageInDescription(
          editorState,
          selectedImageUrl,
          newImageUrl
        )
        setEditorState(newEditorState)

        // Cập nhật giá trị description trong form
        const content = draftToHtml(
          convertToRaw(newEditorState.getCurrentContent())
        )
        setValue('description', content)

        // Reset input và trạng thái
        setSelectedImageUrl(null)
        if (replaceImageInputRef.current) {
          replaceImageInputRef.current.value = ''
        }
      } catch (error) {
        alert('Có lỗi khi upload ảnh mới. Vui lòng thử lại.')
        console.error(error)
      }
    }
  }

  // Tùy chỉnh hiển thị nút "Sửa ảnh" cho khối hình ảnh
  const blockRendererFn = (contentBlock) => {
    if (contentBlock.getType() === 'atomic') {
      const entityKey = contentBlock.getEntityAt(0)
      if (entityKey) {
        const contentState = editorState.getCurrentContent()
        const entity = contentState.getEntity(entityKey)
        if (entity.getType() === 'IMAGE') {
          const { src } = entity.getData()
          return {
            component: () => (
              <Box
                sx={{
                  position: 'relative', // Container relative để icon absolute bên trong
                  display: 'inline-block'
                }}
              >
                <img
                  src={src}
                  alt='description-image'
                  style={{ maxWidth: '100%', display: 'block' }} // block tránh ảnh có khoảng trắng
                />
                <IconButton
                  sx={{
                    position: 'absolute', // Phải absolute mới can thiệp top,right được
                    top: 4, // có thể cách viền 4px cho đẹp
                    right: 4,
                    zIndex: 999,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    padding: '4px',
                    minWidth: 'unset',
                    borderRadius: '4px',
                    boxShadow: '0 0 5px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,1)',
                      boxShadow: 'none'
                    }
                  }}
                  // onClick={() => setSelectedImageUrl(src)}
                  // onMouseDown={() => setSelectedImageUrl(src)}
                  onMouseUp={() => setSelectedImageUrl(src)}
                >
                  <Typography variant='body2' sx={{ userSelect: 'none' }}>
                    Sửa ảnh
                  </Typography>
                </IconButton>
              </Box>
            ),
            editable: false // không cho sửa nội dung ảnh trong editor
          }
        }
      }
    }
    return null
  }

  // Kích hoạt input file khi chọn ảnh để thay thế
  useEffect(() => {
    if (selectedImageUrl && replaceImageInputRef.current) {
      const timeout = setTimeout(() => {
        replaceImageInputRef.current.click()
      }, 100) // delay 100ms để đảm bảo DOM đã mount

      return () => clearTimeout(timeout)
    }
  }, [selectedImageUrl])
  // Load dữ liệu sản phẩm khi modal mở
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
  }, [open, reset, product])

  const onSubmit = async (data) => {
    try {
      if (productImages.length === 0) {
        alert('Vui lòng thêm ít nhất một ảnh sản phẩm')
        return
      }

      const contentState = editorState.getCurrentContent()
      const rawContent = convertToRaw(contentState)
      const htmlContent = draftToHtml(rawContent)

      const finalProduct = {
        name: data.name,
        description: htmlContent,
        exportPrice: Number(data.price),
        importPrice: data.importPrice ? Number(data.importPrice) : undefined,
        categoryId: data.categoryId,
        image: productImages
      }

      const result = await onSave(product._id, finalProduct)

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
          {/*tên*/}
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
          {/*danh mục*/}
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
          {/*giá nhập*/}
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
          {/*giá bán*/}
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
          {/*mô tả*/}
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
                    blockRendererFn={blockRendererFn}
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
                  {selectedImageUrl && (
                    <input
                      type='file'
                      accept='image/*'
                      hidden
                      ref={replaceImageInputRef}
                      onChange={handleReplaceImage}
                    />
                  )}
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
