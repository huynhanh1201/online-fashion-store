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

const EditSizeModal = ({ open, onClose, size, onSave }) => {
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
    if (open && size) {
      reset({
        name: size.name || ''
      })
    }
  }, [open, size, reset])

  const onSubmit = async (data) => {
    await onSave(data, 'edit', size._id)
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
      <DialogTitle>Sửa thông tin kích thước</DialogTitle>
      <Divider sx={{ my: 0 }} />
      <DialogContent>
        <form id='edit-size-form' onSubmit={handleSubmit(onSubmit)}>
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
          form='edit-size-form'
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

export default EditSizeModal
