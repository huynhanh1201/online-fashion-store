import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { useForm } from 'react-hook-form'
import { createColorPalette } from '~/services/admin/colorPaletteService.js' // API thêm màu (có trường name, image)

const URI = 'https://api.cloudinary.com/v1_1/dkwsy9sph/image/upload'
const CloudinaryFolder = 'color_upload'

const uploadToCloudinary = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'demo_unsigned')
  formData.append('folder', CloudinaryFolder)

  const res = await fetch(URI, {
    method: 'POST',
    body: formData
  })
  const data = await res.json()
  return data.secure_url
}

const AddColorModal = ({ open, onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: { name: '' }
  })

  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState('')

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const onSubmit = async (data) => {
    try {
      let imageUrl = ''
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile)
      }

      const payload = {
        name: data.name,
        image: imageUrl // URL hình ảnh màu
      }

      const result = await createColorPalette(payload)
      if (result) {
        onSuccess()
        onClose()
        reset()
        setImageFile(null)
        setPreview('')
      } else {
        alert('Thêm màu không thành công')
      }
    } catch (error) {
      console.error('Lỗi khi thêm màu:', error)
      alert('Có lỗi xảy ra, vui lòng thử lại')
    }
  }

  const handleClose = () => {
    onClose()
    reset()
    setImageFile(null)
    setPreview('')
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>Thêm Màu Sắc</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            label='Tên màu'
            fullWidth
            {...register('name', { required: 'Tên màu không được bỏ trống' })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <Typography>Ảnh màu (chọn 1 ảnh)</Typography>
          <input
            type='file'
            accept='image/*'
            onChange={handleFileChange}
            style={{ marginTop: 8 }}
          />
          {preview && (
            <Box sx={{ mt: 2 }}>
              <img
                src={preview}
                alt='Preview'
                style={{
                  width: 100,
                  height: 100,
                  objectFit: 'cover',
                  borderRadius: 8
                }}
              />
              <Button
                variant='text'
                color='error'
                size='small'
                onClick={() => {
                  setImageFile(null)
                  setPreview('')
                }}
              >
                Xóa ảnh
              </Button>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          variant='contained'
        >
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddColorModal
