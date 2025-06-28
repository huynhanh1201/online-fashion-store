import React, { useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import { useForm, Controller } from 'react-hook-form'
import StyleAdmin from '~/assets/StyleAdmin.jsx'

const statusOptions = [
  'Processing',
  'Shipping',
  'Shipped',
  'Delivered',
  'Cancelled',
  'Failed'
]

const translateStatus = (status) => {
  switch (status) {
    case 'Processing':
      return 'Đang xử lý'
    case 'Shipping':
      return 'Đang giao hàng'
    case 'Shipped':
      return 'Đã gửi hàng'
    case 'Delivered':
      return 'Đã giao hàng'
    case 'Cancelled':
      return 'Đã hủy'
    case 'Failed':
      return 'Thất bại'
    default:
      return status
  }
}

const getNextStatus = (currentStatus) => {
  const flow = ['Processing', 'Shipping', 'Shipped', 'Delivered']
  const index = flow.indexOf(currentStatus)
  return index >= 0 && index < flow.length - 1 ? flow[index + 1] : null
}

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

  useEffect(() => {
    if (order) {
      reset({
        status: order.status || ''
      })
    }
  }, [order, reset])

  const onSubmit = (data) => {
    try {
      if (order?._id) {
        onUpdate(order._id, data)
      } else {
        console.error('Không có ID đơn hàng để cập nhật')
      }
    } catch (error) {
      console.error('Lỗi cập nhật đơn hàng:', error)
    }
  }

  const isFinalStatus = ['Delivered', 'Cancelled', 'Failed'].includes(
    order?.status
  )

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
      <DialogTitle>Sửa thông tin đơn hàng</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
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
                    PaperProps: { sx: StyleAdmin.FormSelect.SelectMenu }
                  }}
                >
                  {statusOptions.every((status) => {
                    const isDisabled =
                      isFinalStatus || status !== getNextStatus(order?.status)
                    return isDisabled
                  }) ? (
                    <MenuItem disabled value={order?.status}>
                      Không có lựa chọn
                    </MenuItem>
                  ) : (
                    statusOptions.map((status) => {
                      const isDisabled =
                        isFinalStatus || status !== getNextStatus(order?.status)
                      return (
                        <MenuItem
                          key={status}
                          value={status}
                          disabled={isDisabled}
                          style={{ display: isDisabled ? 'none' : 'block' }}
                        >
                          {translateStatus(status)}
                        </MenuItem>
                      )
                    })
                  )}
                </Select>
              )}
            />
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={onClose} color='error' variant='outlined'>
          Hủy
        </Button>
        <Button
          variant='contained'
          onClick={handleSubmit(onSubmit)}
          disabled={loading || isFinalStatus}
          sx={{ backgroundColor: '#001f5d', color: '#fff' }}
        >
          {loading ? 'Đang cập nhật...' : 'Cập nhật'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditOrderModal
