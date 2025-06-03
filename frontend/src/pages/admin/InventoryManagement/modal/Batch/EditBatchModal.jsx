import React, { useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid
} from '@mui/material'
import { useForm } from 'react-hook-form'

const EditBatchModal = ({ open, onClose, onSave, batch }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  useEffect(() => {
    if (batch) {
      reset({
        manufactureDate: batch.manufactureDate?.slice(0, 10) || '',
        expiry: batch.expiry?.slice(0, 10) || '',
        importPrice: batch.importPrice || 0
      })
    }
  }, [batch, reset])

  const onSubmit = (data) => {
    const payload = {
      manufactureDate: data.manufactureDate
        ? new Date(data.manufactureDate).toISOString()
        : null,
      expiry: data.expiry ? new Date(data.expiry).toISOString() : null,
      importPrice: Number(data.importPrice)
    }

    onSave(batch._id, payload)
    onClose()
  }

  if (!batch) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Sửa Lô Hàng</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item size={12}>
              <TextField
                label='Ngày sản xuất'
                type='date'
                fullWidth
                InputLabelProps={{ shrink: true }}
                {...register('manufactureDate')}
                defaultValue=''
              />
            </Grid>

            <Grid item size={12}>
              <TextField
                label='Hạn sử dụng'
                type='date'
                fullWidth
                InputLabelProps={{ shrink: true }}
                {...register('expiry')}
                defaultValue=''
              />
            </Grid>

            <Grid item size={12}>
              <TextField
                label='Giá nhập'
                type='number'
                fullWidth
                {...register('importPrice', {
                  required: 'Vui lòng nhập giá nhập',
                  valueAsNumber: true,
                  min: { value: 0, message: 'Giá nhập không hợp lệ' }
                })}
                error={!!errors.importPrice}
                helperText={errors.importPrice?.message}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Huỷ</Button>
          <Button type='submit' variant='contained' color='primary'>
            Lưu
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditBatchModal
