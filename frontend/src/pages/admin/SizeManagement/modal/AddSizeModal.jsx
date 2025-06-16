import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { useForm } from 'react-hook-form'
import { addSize } from '~/services/admin/sizeService'
import StyleAdmin from '~/assets/StyleAdmin.jsx'

const AddSizeModal = ({ open, onClose, onAdded }) => {
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
      const result = await addSize(payload)
      if (onAdded) onAdded()
      if (result) {
        onClose(result)
        reset()
      } else {
        alert('Thêm kích thước thất bại. Vui lòng thử lại!')
      }
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
            label='Tên kích thước'
            fullWidth
            margin='normal'
            {...register('name', {
              required: 'Tên kích thước là bắt buộc',
              minLength: {
                value: 1,
                message: 'Tên kích thước phải có ít nhất 1 ký tự'
              }
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
              backgroundColor: '#001f5d',
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
