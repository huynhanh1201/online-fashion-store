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

const AddPartnerModal = ({ open, onClose, addPartner }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const onSubmit = (data) => {
    const formattedData = {
      name: data.name,
      type: data.type,
      contact: {
        phone: data.phone,
        email: data.email
      }
    }
    addPartner(formattedData)
    reset()
    onClose()
  }

  const handleCancel = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth='sm'>
      <DialogTitle>Thêm đối tác</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item size={12}>
              <TextField
                label='Tên đối tác'
                fullWidth
                {...register('name', { required: 'Tên không được bỏ trống' })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item size={12}>
              <TextField
                select
                label='Loại đối tác'
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
            <Grid item size={12} sm={6}>
              <TextField
                label='Số điện thoại'
                fullWidth
                {...register('phone')}
              />
            </Grid>
            <Grid item size={12} sm={6}>
              <TextField
                label='Email'
                fullWidth
                type='email'
                {...register('email')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Huỷ</Button>
          <Button type='submit' variant='contained'>
            Thêm
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddPartnerModal
