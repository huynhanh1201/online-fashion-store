import React, { useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Stack from '@mui/material/Stack'
import { useForm, Controller } from 'react-hook-form'
import StyleAdmin from '~/assets/StyleAdmin.jsx'

const statusOptions = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled'
]

const translateStatus = (status) => {
  switch (status) {
    case 'Pending':
      return 'Đang chờ'
    case 'Processing':
      return 'Đang xử lý'
    case 'Shipped':
      return 'Đã gửi hàng'
    case 'Delivered':
      return 'Đã giao hàng'
    case 'Cancelled':
      return 'Đã hủy'
    default:
      return status
  }
}

const translatePaymentStatus = (status) => {
  switch (status) {
    case 'Pending':
      return 'Đang chờ'
    case 'Completed':
      return 'Hoàn tất'
    case 'Failed':
      return 'Thất bại'
    default:
      return status
  }
}

const translatePaymentMethod = (method) => {
  switch (method) {
    case 'COD':
      return 'Thanh toán khi nhận hàng'
    case 'vnpay':
      return 'VNPay'
    case 'momo':
      return 'Momo'
    case 'paypal':
      return 'PayPal'
    case 'credit_card':
      return 'Thẻ tín dụng'
    default:
      return method
  }
}

const paymentStatusOptions = ['Pending', 'Completed', 'Failed']

const paymentMethodOptions = ['COD', 'vnpay', 'momo', 'paypal', 'credit_card']

const EditOrderModal = ({ open, onClose, order, onUpdate, loading }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      status: '',
      paymentStatus: '',
      paymentMethod: '',
      note: ''
    }
  })

  // Reset form khi order thay đổi hoặc modal mở
  useEffect(() => {
    if (order) {
      reset({
        status: order.status || ''
      })
    }
  }, [order, reset])

  const onSubmit = (data) => {
    if (order?._id) {
      onUpdate(order._id, data)
    }
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
      {/* Header */}
      <DialogTitle>Sửa thông tin đơn hàng</DialogTitle>

      {/* Content */}
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {/* Status */}
          <FormControl fullWidth sx={StyleAdmin.FormSelect}>
            <InputLabel id='status-label'>Trạng thái đơn hàng</InputLabel>
            <Controller
              name='status'
              control={control}
              rules={{ required: 'Vui lòng chọn trạng thái đơn hàng' }}
              render={({ field }) => (
                <Select
                  labelId='status-label'
                  label='Trạng thái đơn hàng'
                  {...field}
                  error={!!errors.status}
                  MenuProps={{
                    PaperProps: {
                      sx: StyleAdmin.FormSelect.SelectMenu
                    }
                  }}
                >
                  {statusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      {translateStatus(status)}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
          {/* Payment Status */}
          {/*<FormControl fullWidth sx={StyleAdmin.FormSelect}>*/}
          {/*  <InputLabel id='payment-status-label'>*/}
          {/*    Trạng thái thanh toán*/}
          {/*  </InputLabel>*/}
          {/*  <Controller*/}
          {/*    name='paymentStatus'*/}
          {/*    control={control}*/}
          {/*    rules={{ required: 'Vui lòng chọn trạng thái thanh toán' }}*/}
          {/*    render={({ field }) => (*/}
          {/*      <Select*/}
          {/*        labelId='payment-status-label'*/}
          {/*        label='Trạng thái thanh toán'*/}
          {/*        {...field}*/}
          {/*        error={!!errors.paymentStatus}*/}
          {/*        MenuProps={{*/}
          {/*          PaperProps: {*/}
          {/*            sx: StyleAdmin.FormSelect.SelectMenu*/}
          {/*          }*/}
          {/*        }}*/}
          {/*      >*/}
          {/*        {paymentStatusOptions.map((status) => (*/}
          {/*          <MenuItem key={status} value={status}>*/}
          {/*            {translatePaymentStatus(status)}*/}
          {/*          </MenuItem>*/}
          {/*        ))}*/}
          {/*      </Select>*/}
          {/*    )}*/}
          {/*  />*/}
          {/*</FormControl>*/}

          {/*/!* Payment Method *!/*/}
          {/*<FormControl fullWidth sx={StyleAdmin.FormSelect}>*/}
          {/*  <InputLabel id='payment-method-label'>*/}
          {/*    Phương thức thanh toán*/}
          {/*  </InputLabel>*/}
          {/*  <Controller*/}
          {/*    name='paymentMethod'*/}
          {/*    control={control}*/}
          {/*    rules={{ required: 'Vui lòng chọn phương thức thanh toán' }}*/}
          {/*    render={({ field }) => (*/}
          {/*      <Select*/}
          {/*        labelId='payment-method-label'*/}
          {/*        label='Phương thức thanh toán'*/}
          {/*        {...field}*/}
          {/*        error={!!errors.paymentMethod}*/}
          {/*        MenuProps={{*/}
          {/*          PaperProps: {*/}
          {/*            sx: StyleAdmin.FormSelect.SelectMenu*/}
          {/*          }*/}
          {/*        }}*/}
          {/*      >*/}
          {/*        {paymentMethodOptions.map((method) => (*/}
          {/*          <MenuItem key={method} value={method}>*/}
          {/*            {translatePaymentMethod(method)}*/}
          {/*          </MenuItem>*/}
          {/*        ))}*/}
          {/*      </Select>*/}
          {/*    )}*/}
          {/*  />*/}
          {/*</FormControl>*/}

          {/*/!* Note *!/*/}
          {/*<Controller*/}
          {/*  name='note'*/}
          {/*  control={control}*/}
          {/*  render={({ field }) => (*/}
          {/*    <TextField*/}
          {/*      label='Ghi chú'*/}
          {/*      multiline*/}
          {/*      rows={3}*/}
          {/*      fullWidth*/}
          {/*      {...field}*/}
          {/*    />*/}
          {/*  )}*/}
          {/*/>*/}
        </Stack>
      </DialogContent>

      {/* Footer */}
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={onClose} color='inherit'>
          Hủy
        </Button>
        <Button
          variant='contained'
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
          sx={{ backgroundColor: '#001f5d', color: '#fff' }}
        >
          {loading ? 'Đang cập nhật...' : 'Cập nhật'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditOrderModal
