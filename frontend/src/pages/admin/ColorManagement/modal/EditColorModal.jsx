import React, { useEffect } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'

import { useForm } from 'react-hook-form'
import StyleAdmin from '~/assets/StyleAdmin.jsx'

const EditColorModal = ({ open, onClose, color, onSave }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: ''
    }
  })

  useEffect(() => {
    if (open && color) {
      reset({
        name: color.name || ''
      })
    }
  }, [open, color, reset])

  const onSubmit = async (data) => {
    await onSave(data, 'edit', color._id)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='sm'
      BackdropProps={{
        sx: StyleAdmin.OverlayModal
      }}
    >
      <DialogTitle>Sửa thông tin màu sắc</DialogTitle>
      <Divider sx={{ my: 0 }} />
      <DialogContent>
        <form id='edit-color-form' onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label='Tên màu'
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
        </form>
      </DialogContent>
      <Divider sx={{ my: 0 }} />
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button
          onClick={onClose}
          disabled={isSubmitting}
          color='error'
          variant='outlined'
          sx={{ textTransform: 'none' }}
        >
          Hủy
        </Button>
        <Button
          type='submit'
          form='edit-color-form'
          variant='contained'
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          sx={{
            backgroundColor: 'var(--primary-color)',
            color: '#fff',
            textTransform: 'none'
          }}
        >
          {isSubmitting ? 'Đang lưu' : 'Lưu'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditColorModal
