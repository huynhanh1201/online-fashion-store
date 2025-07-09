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

const AddSizeModal = ({ open, onClose, onAdded, onSave }) => {
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
      onClose()
      reset()
    } catch (error) {
      console.error('Lỗi khi thêm kích thước:', error)
      alert('Thêm kích thước thất bại. Vui lòng thử lại!')
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
      <DialogTitle>Thêm kích thước mới</DialogTitle>
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
                Tên kích thước <span style={{ color: 'red' }}>*</span>
              </>
            }
            fullWidth
            margin='normal'
            {...register('name', {
              required: 'Tên kích thước là bắt buộc',
              minLength: {
                value: 1,
                message: 'Tên kích thước phải có ít nhất 1 ký tự'
              },
              maxLength: {
                value: 50,
                message: 'Tên kích thước không vượt quá 50 ký tự'
              },
              validate: (value) =>
                value.trim() === value ||
                'Tên kích thước không được có khoảng trắng đầu/cuối'
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

export default AddSizeModal
