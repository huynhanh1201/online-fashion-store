import React from 'react'
import { useForm } from 'react-hook-form'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import Box from '@mui/material/Box'

import { addDiscount } from '~/services/admin/discountService'
import StyleAdmin from '~/components/StyleAdmin'

const AddDiscountModal = ({ open, onClose, onAdded }) => {
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm({
    defaultValues: {
      type: 'fixed',
      isActive: true
    }
  })
  const type = watch('type', 'fixed')
  const onSubmit = async (data) => {
    const payload = {
      ...data,
      amount: Number(data.amount),
      minOrderValue: Number(data.minOrderValue),
      usageLimit: Number(data.usageLimit),
      validFrom: new Date(data.validFrom).toISOString(),
      validUntil: new Date(data.validUntil).toISOString()
    }

    const result = await addDiscount(payload)
    if (result) {
      onAdded()
      reset()
      onClose()
    } else {
      console.log('Thêm mã giảm giá thất bại. Vui lòng thử lại!')
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth='lg'
      BackdropProps={{
        sx: StyleAdmin.OverlayModal
      }}
    >
      <DialogTitle>Thêm mã giảm giá</DialogTitle>
      <Divider sx={{ my: 0 }} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box
            display='flex'
            gap={2}
            flexDirection={{ xs: 'column', md: 'row' }}
          >
            {/* Cột trái */}
            <Box flex={1}>
              <TextField
                label='Mã giảm giá'
                fullWidth
                margin='normal'
                {...register('code', { required: true })}
                sx={StyleAdmin.InputCustom}
              />
              <FormControl
                fullWidth
                margin='normal'
                sx={StyleAdmin.FormSelect} // style chuẩn bạn dùng cho select
              >
                <InputLabel id='type-label'>Loại giảm giá</InputLabel>
                <Select
                  labelId='type-label'
                  label='Loại giảm giá'
                  defaultValue='fixed'
                  {...register('type', {
                    required: 'Vui lòng chọn loại giảm giá'
                  })}
                  MenuProps={{
                    PaperProps: {
                      sx: StyleAdmin.FormSelect.SelectMenu
                    }
                  }}
                >
                  <MenuItem value='fixed'>Giảm theo số tiền</MenuItem>
                  <MenuItem value='percent'>Giảm theo phần trăm</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label={
                  type === 'fixed' ? 'Giá trị giảm (VNĐ)' : 'Giá trị giảm (%)'
                }
                type='number'
                fullWidth
                margin='normal'
                {...register('amount', { required: true })}
                sx={StyleAdmin.InputCustom}
              />
              <FormControlLabel
                control={<Checkbox defaultChecked {...register('isActive')} />}
                label='Kích hoạt'
                sx={{ mt: 1 }}
              />
            </Box>

            {/* Cột phải */}
            <Box flex={1}>
              <TextField
                label='Giá trị đơn hàng tối thiểu'
                type='number'
                fullWidth
                margin='normal'
                {...register('minOrderValue')}
                sx={StyleAdmin.InputCustom}
              />
              <TextField
                label='Số lượt sử dụng tối đa'
                type='number'
                fullWidth
                margin='normal'
                {...register('usageLimit')}
                sx={StyleAdmin.InputCustom}
              />
              <TextField
                label='Hiệu lực từ'
                type='datetime-local'
                fullWidth
                margin='normal'
                InputLabelProps={{ shrink: true }}
                {...register('validFrom')}
                sx={StyleAdmin.InputCustom}
              />
              <TextField
                label='Hiệu lực đến'
                type='datetime-local'
                fullWidth
                margin='normal'
                InputLabelProps={{ shrink: true }}
                {...register('validUntil')}
                sx={StyleAdmin.InputCustom}
              />
            </Box>
          </Box>
        </DialogContent>
        <Divider sx={{ my: 0 }} />
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button onClick={handleClose} color='inherit'>
            Hủy
          </Button>
          <Button
            type='submit'
            variant='contained'
            sx={{ backgroundColor: '#001f5d', color: '#fff' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang thêm...' : 'Thêm'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddDiscountModal
