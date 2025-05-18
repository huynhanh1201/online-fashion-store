import React, { useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Stack
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import styleAdmin from '~/components/StyleAdmin.jsx'
import StyleAdmin from '~/components/StyleAdmin.jsx'

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
      isPaid: false,
      paymentStatus: '',
      paymentMethod: '',
      isDelivered: false,
      note: ''
    }
  })

  // Reset form khi order thay đổi hoặc modal mở
  useEffect(() => {
    if (order) {
      reset({
        status: order.status || '',
        isPaid: order.isPaid || false,
        paymentStatus: order.paymentStatus || '',
        paymentMethod: order.paymentMethod || '',
        isDelivered: order.isDelivered || false,
        note: order.note || ''
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
        sx: styleAdmin.OverlayModal
      }}
    >
      {/* Header */}
      <DialogTitle>Sửa thông tin đơn hàng</DialogTitle>

      {/* Content */}
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {/* Status */}
          <FormControl fullWidth sx={StyleAdmin.FormSelect}>
            <InputLabel id='status-label'>Trạng thái</InputLabel>
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

          {/* isPaid */}
          <FormControlLabel
            control={
              <Controller
                name='isPaid'
                control={control}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
            }
            label='Đã thanh toán'
          />

          {/* Payment Status */}
          <FormControl fullWidth sx={StyleAdmin.FormSelect}>
            <InputLabel id='payment-status-label'>
              Trạng thái thanh toán
            </InputLabel>
            <Controller
              name='paymentStatus'
              control={control}
              rules={{ required: 'Vui lòng chọn trạng thái thanh toán' }}
              render={({ field }) => (
                <Select
                  labelId='payment-status-label'
                  label='Trạng thái thanh toán'
                  {...field}
                  error={!!errors.paymentStatus}
                  MenuProps={{
                    PaperProps: {
                      sx: StyleAdmin.FormSelect.SelectMenu
                    }
                  }}
                >
                  {paymentStatusOptions.map((status) => (
                    <MenuItem key={status} value={status}>
                      {translatePaymentStatus(status)}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>

          {/* Payment Method */}
          <FormControl fullWidth sx={StyleAdmin.FormSelect}>
            <InputLabel id='payment-method-label'>
              Phương thức thanh toán
            </InputLabel>
            <Controller
              name='paymentMethod'
              control={control}
              rules={{ required: 'Vui lòng chọn phương thức thanh toán' }}
              render={({ field }) => (
                <Select
                  labelId='payment-method-label'
                  label='Phương thức thanh toán'
                  {...field}
                  error={!!errors.paymentMethod}
                  MenuProps={{
                    PaperProps: {
                      sx: StyleAdmin.FormSelect.SelectMenu
                    }
                  }}
                >
                  {paymentMethodOptions.map((method) => (
                    <MenuItem key={method} value={method}>
                      {translatePaymentMethod(method)}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>

          {/* isDelivered */}
          <FormControlLabel
            control={
              <Controller
                name='isDelivered'
                control={control}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
            }
            label='Đã giao hàng'
          />

          {/* Note */}
          <Controller
            name='note'
            control={control}
            render={({ field }) => (
              <TextField
                label='Ghi chú'
                multiline
                rows={3}
                fullWidth
                {...field}
              />
            )}
          />
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
