import React, { useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Grid
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'

const partnerTypes = [
  { value: 'supplier', label: 'Nhà cung cấp' },
  { value: 'customer', label: 'Khách hàng' },
  { value: 'both', label: 'Khách hàng & NCC' }
]

export default function EditPartnerModal({
  open,
  onClose,
  partner,
  updatePartner
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors }
  } = useForm()

  useEffect(() => {
    if (partner) {
      setValue('name', partner.name || '')
      setValue('type', partner.type || '')
      setValue('phone', partner.contact?.phone || '')
      setValue('email', partner.contact?.email || '')
    }
  }, [partner, setValue])

  const onSubmit = (data) => {
    const { type, phone, email } = data

    const formattedData = {
      name: data.name.trim(),
      type,
      contact: {
        phone: phone || null,
        email: email || null
      }
    }

    updatePartner(formattedData, 'edit', partner._id)
    reset()
    onClose()
  }

  const handleCancel = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth='sm'>
      <DialogTitle>Sửa thông tin đối tác</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item size={12} xs={12}>
              <TextField
                label='Tên đối tác'
                fullWidth
                {...register('name', {
                  required: 'Tên không được bỏ trống',
                  minLength: {
                    value: 2,
                    message: 'Tên phải có ít nhất 2 ký tự'
                  },
                  maxLength: {
                    value: 100,
                    message: 'Tên không được vượt quá 100 ký tự'
                  },
                  validate: (value) =>
                    value.trim() === value ||
                    'Tên không được có khoảng trắng ở đầu hoặc cuối'
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item size={12} xs={12}>
              <Controller
                name='type'
                control={control}
                rules={{ required: 'Vui lòng chọn loại đối tác' }}
                render={({ field }) => (
                  <TextField
                    select
                    label='Kiểu đối tác'
                    fullWidth
                    {...field}
                    error={!!errors.type}
                    helperText={errors.type?.message}
                  >
                    {partnerTypes.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item size={12} xs={12} sm={6}>
              <TextField
                label='Số điện thoại'
                fullWidth
                {...register('phone', {
                  required: 'Số điện thoại là bắt buộc',
                  pattern: {
                    value:
                      /^(?:\+84|0)(?:3[2-9]|5[2689]|7[06-9]|8[1-689]|9[0-9])\d{7}$/,
                    message: 'Số điện thoại không hợp lệ'
                  },
                  validate: (value) =>
                    value.trim() === value ||
                    'Số điện thoại không được có khoảng trắng ở đầu hoặc cuối'
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
                  required: 'Email là bắt buộc',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Email không đúng định dạng'
                  },
                  validate: (value) =>
                    value.trim() === value ||
                    'Email không được có khoảng trắng ở đầu hoặc cuối'
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
            Hủy
          </Button>
          <Button
            type='submit'
            sx={{
              backgroundColor: 'var(--primary-color)',
              color: '#fff',
              textTransform: 'none'
            }}
          >
            Lưu
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
