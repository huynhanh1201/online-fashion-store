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
import StyleAdmin from '~/components/StyleAdmin'

const EditCategoryModal = ({ open, onClose, category, onSave }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      description: ''
    }
  })

  useEffect(() => {
    if (open && category) {
      reset({
        name: category.name || '',
        description: category.description || ''
      })
    }
  }, [open, category, reset])

  const onSubmit = async (data) => {
    await onSave(category._id, data)
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
      <DialogTitle>Sửa danh mục</DialogTitle>
      <Divider sx={{ my: 0 }} />
      <DialogContent>
        <form id='edit-category-form' onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label='Tên danh mục'
            fullWidth
            margin='normal'
            {...register('name', { required: 'Tên danh mục là bắt buộc' })}
            error={!!errors.name}
            helperText={errors.name?.message}
            sx={StyleAdmin.InputCustom}
          />
          <TextField
            label='Mô tả'
            fullWidth
            margin='normal'
            multiline
            minRows={3}
            {...register('description', { required: 'Mô tả là bắt buộc' })}
            error={!!errors.description}
            helperText={errors.description?.message}
            sx={StyleAdmin.InputCustom}
          />
        </form>
      </DialogContent>
      <Divider sx={{ my: 0 }} />
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={onClose} disabled={isSubmitting} color='inherit'>
          Hủy
        </Button>
        <Button
          type='submit'
          form='edit-category-form'
          variant='contained'
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          sx={{ backgroundColor: '#001f5d', color: '#fff' }}
        >
          {isSubmitting ? 'Đang lưu' : 'Lưu'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditCategoryModal
