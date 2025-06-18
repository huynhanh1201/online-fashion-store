import React, { useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Divider
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import StyleAdmin from '~/assets/StyleAdmin.jsx'
const EditBatchModal = ({
  open,
  onClose,
  onSave,
  batch,
  formatCurrency,
  parseCurrency
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm()

  useEffect(() => {
    if (batch) {
      reset({
        manufactureDate: batch.manufactureDate?.slice(0, 10) || '',
        // expiry: batch.expiry?.slice(0, 10) || '',
        importPrice: batch.importPrice || 0
      })
    }
  }, [batch, reset])

  const onSubmit = (data) => {
    const payload = {
      manufactureDate: data.manufactureDate
        ? new Date(data.manufactureDate).toISOString()
        : null,
      // expiry: data.expiry ? new Date(data.expiry).toISOString() : null,
      importPrice: Number(data.importPrice)
    }

    onSave(payload, 'edit', batch._id)
    onClose()
  }

  if (!batch) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      BackdropProps={{
        sx: StyleAdmin.OverlayModal
      }}
    >
      <DialogTitle>Sửa thông tin Lô Hàng</DialogTitle>
      <Divider />
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

            {/*<Grid item size={12}>*/}
            {/*  <TextField*/}
            {/*    label='Hạn sử dụng'*/}
            {/*    type='date'*/}
            {/*    fullWidth*/}
            {/*    InputLabelProps={{ shrink: true }}*/}
            {/*    {...register('expiry')}*/}
            {/*    defaultValue=''*/}
            {/*  />*/}
            {/*</Grid>*/}

            <Grid item size={12}>
              <Controller
                name='importPrice'
                control={control}
                rules={{
                  required: 'Vui lòng nhập giá nhập',
                  validate: (val) =>
                    Number(val) < 0 ? 'Giá nhập không hợp lệ' : true
                }}
                render={({ field }) => (
                  <TextField
                    label='Giá nhập (đ)'
                    type='text'
                    fullWidth
                    value={formatCurrency(field.value)}
                    onChange={(e) =>
                      field.onChange(parseCurrency(e.target.value))
                    }
                    error={!!errors.importPrice}
                    helperText={errors.importPrice?.message}
                    InputProps={{
                      endAdornment: <span style={{ marginLeft: 4 }}>₫</span>,
                      inputMode: 'numeric'
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button
            onClick={onClose}
            sx={{ textTransform: 'none' }}
            color='error'
            variant='outlined'
          >
            Huỷ
          </Button>
          <Button
            type='submit'
            sx={{
              backgroundColor: '#001f5d',
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

export default EditBatchModal
