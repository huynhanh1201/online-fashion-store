import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { useForm } from 'react-hook-form'
import StyleAdmin from '~/assets/StyleAdmin.jsx'

const AddColorModal = ({ open, onClose, onAdded, onSave }) => {
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
      if (onSave) {
        await onSave(payload)
      } else {
        await onAdded(payload, 'add')
      }
      console.log('Thêm màu thành công:', payload)
      onClose()
      reset()
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
      <DialogTitle>Thêm màu sắc mới</DialogTitle>
      <Divider sx={{ my: 0 }} />
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit(onSubmit)(e)
        }}
      >
        <DialogContent>
          <TextField
            label={
              <>
                Tên màu <span style={{ color: 'red' }}>*</span>
              </>
            }
            fullWidth
            margin='normal'
            {...register('name', {
              required: 'Tên màu là bắt buộc',
              minLength: {
                value: 1,
                message: 'Tên màu phải có ít nhất 1 ký tự'
              },
              maxLength: {
                value: 50,
                message: 'Tên màu không vượt quá 50 ký tự'
              },
              validate: (value) =>
                value.trim() === value ||
                'Tên màu không được có khoảng trắng đầu/cuối'
            })}
            error={!!errors.name}
            helperText={errors.name?.message}
            sx={StyleAdmin.InputCustom}
          />
        </DialogContent>
        <Divider sx={{ my: 0 }} />
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button
            color='error'
            variant='outlined'
            onClick={handleClose}
            disabled={isSubmitting}
            sx={{ textTransform: 'none' }}
          >
            Hủy
          </Button>
          <Button
            type='button'
            onClick={handleSubmit(onSubmit)}
            variant='contained'
            sx={{
              backgroundColor: 'var(--primary-color)',
              color: '#fff',
              textTransform: 'none'
            }}
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
