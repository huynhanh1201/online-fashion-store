import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  MenuItem,
  TextField,
  Stack
} from '@mui/material'
import { FormControl, InputLabel, Select } from '@mui/material'
import { useForm } from 'react-hook-form'
import StyleAdmin from '~/components/StyleAdmin'

const EditTransactionModal = ({
  open,
  onClose,
  onUpdate,
  transaction,
  loading
}) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      status: transaction?.status || 'Pending',
      note: transaction?.note || ''
    }
  })

  React.useEffect(() => {
    if (transaction) {
      reset({
        status: transaction.status || 'Pending',
        note: transaction.note || ''
      })
    }
  }, [transaction, reset])

  const handleFormSubmit = (data) => {
    onUpdate(transaction._id, data)
  }

  if (!transaction) return null
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle>Cập nhật giao dịch</DialogTitle>
      <Divider />
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label='Mã đơn hàng'
            value={transaction.orderId._id}
            fullWidth
            InputProps={{ readOnly: true }}
            sx={{
              ...StyleAdmin.InputCustom,
              ...StyleAdmin.InputCustom.CursorNone,
              ...StyleAdmin.InputCustom.InputViews
            }}
          />
          <TextField
            label='Phương thức thanh toán'
            value={transaction.method}
            fullWidth
            InputProps={{ readOnly: true }}
            sx={{
              ...StyleAdmin.InputCustom,
              ...StyleAdmin.InputCustom.CursorNone,
              ...StyleAdmin.InputCustom.InputViews
            }}
          />
          <TextField
            label='Mã giao dịch (transactionId)'
            value={transaction._id || ''}
            fullWidth
            InputProps={{ readOnly: true }}
            sx={{
              ...StyleAdmin.InputCustom,
              ...StyleAdmin.InputCustom.CursorNone,
              ...StyleAdmin.InputCustom.InputViews
            }}
          />
          <FormControl
            fullWidth
            margin='normal'
            sx={StyleAdmin.FormSelect} // style chuẩn bạn đang dùng
          >
            <InputLabel id='status-label'>Trạng thái</InputLabel>
            <Select
              labelId='status-label'
              label='Trạng thái'
              defaultValue={transaction.status || 'Pending'}
              {...register('status')}
              MenuProps={{
                PaperProps: {
                  sx: StyleAdmin.FormSelect.SelectMenu
                }
              }}
            >
              <MenuItem value='Pending'>Chờ xử lý</MenuItem>
              <MenuItem value='Completed'>Thành công</MenuItem>
              <MenuItem value='Failed'>Thất bại</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label='Ghi chú'
            multiline
            rows={4}
            {...register('note')}
            defaultValue={transaction.note || ''}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={onClose} color='inherit'>
          Huỷ
        </Button>
        <Button
          sx={{ backgroundColor: '#001f5d', color: '#fff' }}
          onClick={handleSubmit(handleFormSubmit)}
          disabled={loading}
        >
          {loading ? 'Đang Lưu...' : 'Lưu'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditTransactionModal
