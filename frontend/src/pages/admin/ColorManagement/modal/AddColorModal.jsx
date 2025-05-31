import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { useForm } from 'react-hook-form'
import { addColor } from '~/services/admin/ColorService'
import StyleAdmin from '~/assets/StyleAdmin.jsx'

const AddColorModal = ({ open, onClose, onAdded }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm()

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name.trim()
      }
      const result = await addColor(payload)
      if (onAdded) onAdded()
      if (result) {
        onClose()
        reset()
      } else {
        alert('Thêm màu thất bại. Vui lòng thử lại!')
      }
    } catch (error) {
      console.error('Lỗi khi thêm màu:', error)
      alert('Thêm màu thất bại. Vui lòng thử lại!')
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth='sm'
      BackdropProps={{
        sx: StyleAdmin.OverlayModal
      }}
    >
      <DialogTitle>Thêm màu mới</DialogTitle>
      <Divider sx={{ my: 0 }} />
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit(onSubmit)(e)
        }}
      >
        <DialogContent>
          <TextField
            label='Tên màu'
            fullWidth
            margin='normal'
            {...register('name', {
              required: 'Tên màu là bắt buộc',
              minLength: {
                value: 2,
                message: 'Tên màu phải có ít nhất 2 ký tự'
              }
            })}
            error={!!errors.name}
            helperText={errors.name?.message}
            sx={StyleAdmin.InputCustom}
          />
        </DialogContent>
        <Divider sx={{ my: 0 }} />
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button color='inherit' onClick={handleClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button
            type='button'
            onClick={handleSubmit(onSubmit)}
            variant='contained'
            sx={{ backgroundColor: '#001f5d', color: '#fff' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang thêm...' : 'Thêm'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddColorModal
