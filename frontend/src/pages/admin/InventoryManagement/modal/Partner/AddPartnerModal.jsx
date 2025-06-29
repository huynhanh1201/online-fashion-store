import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
const AddPartnerModal = ({ open, onClose, addPartner, onSave }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const onSubmit = async (data) => {
    // Thực hiện xử lý với data ở đây
    const { type, phone, email } = data

    if (type === 'customer' && !phone) {
      toast.error('Khách hàng cần có số điện thoại!')
      return
    }

    if (
      email &&
      /^(?:\+84|0)(?:3[2-9]|5[2689]|7[06-9]|8[1-689]|9[0-9])\d{7}$/.test(email)
    ) {
      toast.error('Email không đúng định dạng!')
      return
    }

    const formattedData = {
      name: data.name.trim(),
      type,
      contact: {
        phone: phone || null,
        email: email || null
      }
    }
    if (onSave) {
      await onSave(formattedData)
    } else {
      await addPartner(formattedData, 'add')
    }
    reset()
    onClose()
  }

  const handleCancel = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth='sm'>
      <DialogTitle>Thêm đối tác mới</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid size={12} item xs={12}>
              <TextField
                label='Tên đối tác'
                fullWidth
                {...register('name', {
                  required: 'Tên không được bỏ trống',
                  maxLength: {
                    value: 100,
                    message: 'Tên không được vượt quá 100 ký tự'
                  }
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid size={12} item xs={12}>
              <TextField
                select
                label='Kiểu đối tác'
                fullWidth
                defaultValue='supplier'
                {...register('type', {
                  required: 'Vui lòng chọn loại đối tác'
                })}
                error={!!errors.type}
                helperText={errors.type?.message}
              >
                <MenuItem value='supplier'>Nhà cung cấp</MenuItem>
                <MenuItem value='customer'>Khách hàng</MenuItem>
                <MenuItem value='both'>Khách hàng & NCC</MenuItem>
              </TextField>
            </Grid>
            <Grid item size={12} xs={12} sm={6}>
              <TextField
                label='Số điện thoại'
                fullWidth
                {...register('phone', {
                  pattern: {
                    value:
                      /^(?:\+84|0)(?:3[2-9]|5[2689]|7[06-9]|8[1-689]|9[0-9])\d{7}$/,
                    message: 'Số điện thoại không hợp lệ'
                  }
                })}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            </Grid>
            <Grid item size={12} xs={12} sm={6}>
              <TextField
                label='Email'
                type='email'
                fullWidth
                {...register('email', {
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Email không đúng định dạng'
                  }
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button
            onClick={handleCancel}
            sx={{ textTransform: 'none' }}
            color='error'
            variant='outlined'
          >
            Huỷ
          </Button>
          <Button
            type='submit'
            sx={{
              backgroundColor: 'var(--primary-color)',
              color: '#fff',
              textTransform: 'none'
            }}
          >
            Thêm
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddPartnerModal
