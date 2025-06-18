import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Divider,
  FormControl,
  InputLabel,
  Select,
  Box
} from '@mui/material'
import { toast } from 'react-toastify'
import { addDiscount } from '~/services/admin/discountService'
import StyleAdmin from '~/assets/StyleAdmin.jsx'

const AddDiscountModal = ({ open, onClose, onAdded }) => {
  const {
    register,
    watch,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { isSubmitting }
  } = useForm({
    defaultValues: {
      type: 'fixed',
      isActive: true
    }
  })

  const type = watch('type')

  // Reset amount khi thay đổi loại giảm giá
  useEffect(() => {
    setValue('amount', '') // reset giá trị giảm
  }, [type, setValue])

  const onSubmit = async (data) => {
    try {
      if (data.type === 'percent' && (data.amount < 0 || data.amount > 100)) {
        toast.error('Giá trị giảm (%) phải nằm trong khoảng từ 0 đến 100!')
        return
      }

      const payload = {
        ...data,
        amount: Number(data.amount),
        minOrderValue: Number(data.minOrderValue),
        usageLimit: Number(data.usageLimit),
        validFrom: new Date(data.validFrom).toISOString(),
        validUntil: new Date(data.validUntil).toISOString()
      }

      const result = await addDiscount(payload)
      if (!data.code) {
        toast.error('Vui lòng nhập mã giảm giá!')
        return
      }

      if (!data.amount) {
        toast.error('Vui lòng nhập giá trị giảm!')
        return
      }
      if (result) {
        toast.success('Thêm mã giảm giá thành công!')
        onAdded()
        reset()
        onClose()
      } else {
        toast.error('Thêm mã giảm giá thất bại. Vui lòng thử lại!')
      }
    } catch (error) {
      toast.error('Đã có lỗi xảy ra. Vui lòng thử lại sau!')
      console.error(error)
    }
  }
  const formatNumber = (value) => {
    const number = value?.toString().replace(/\D/g, '') || ''
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  const parseNumber = (formatted) => formatted.replace(/\./g, '')
  const minOrderValue = watch('minOrderValue')
  const usageLimit = watch('usageLimit')

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
      <DialogTitle>Thêm mã giảm giá mới</DialogTitle>
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

              <FormControl fullWidth margin='normal' sx={StyleAdmin.FormSelect}>
                <InputLabel id='type-label'>Loại giảm giá</InputLabel>
                <Select
                  labelId='type-label'
                  label='Loại giảm giá'
                  value={type}
                  {...register('type', { required: true })}
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

              <Controller
                name='amount'
                control={control}
                rules={{
                  required: 'Vui lòng nhập giá trị giảm',
                  validate: (value) => {
                    const number = parseInt(value)
                    if (isNaN(number)) return 'Giá trị không hợp lệ'
                    if (number < 1)
                      return 'Giá trị giảm phải lớn hơn hoặc bằng 1'
                    if (type === 'percent' && number > 100)
                      return 'Phần trăm giảm tối đa là 100%'
                    return true
                  }
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error }
                }) => (
                  <TextField
                    label={
                      type === 'fixed'
                        ? 'Giá trị giảm (VNĐ)'
                        : 'Giá trị giảm (%)'
                    }
                    type='text'
                    fullWidth
                    margin='normal'
                    value={formatNumber(value)}
                    onChange={(e) => {
                      const rawValue = parseNumber(e.target.value)
                      onChange(rawValue)
                    }}
                    error={!!error}
                    helperText={error?.message}
                    sx={StyleAdmin.InputCustom}
                  />
                )}
              />

              <FormControlLabel
                control={<Checkbox defaultChecked {...register('isActive')} />}
                label='Kích hoạt'
                sx={{ mt: 1 }}
              />
            </Box>

            {/* Cột phải */}
            <Box flex={1}>
              {/* Giá trị đơn hàng tối thiểu */}
              <Controller
                name='minOrderValue'
                control={control}
                rules={{
                  required: 'Vui lòng nhập giá trị đơn hàng tối thiểu',
                  validate: (value) =>
                    parseInt(value) >= 1 ||
                    'Giá trị tối thiểu phải lớn hơn hoặc bằng 1'
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error }
                }) => (
                  <TextField
                    label='Giá trị đơn hàng tối thiểu'
                    type='text'
                    fullWidth
                    margin='normal'
                    value={formatNumber(value)}
                    onChange={(e) => {
                      const rawValue = parseNumber(e.target.value)
                      onChange(rawValue)
                    }}
                    error={!!error}
                    helperText={error?.message}
                    sx={StyleAdmin.InputCustom}
                  />
                )}
              />

              {/* Số lượt sử dụng tối đa */}
              <Controller
                name='usageLimit'
                control={control}
                rules={{
                  required: 'Vui lòng nhập số lượt sử dụng',
                  validate: (value) =>
                    parseInt(value) >= 1 ||
                    'Số lượt sử dụng phải lớn hơn hoặc bằng 1'
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error }
                }) => (
                  <TextField
                    label='Số lượt sử dụng tối đa'
                    type='text'
                    fullWidth
                    margin='normal'
                    value={formatNumber(value)}
                    onChange={(e) => {
                      const rawValue = parseNumber(e.target.value)
                      onChange(rawValue)
                    }}
                    error={!!error}
                    helperText={error?.message}
                    sx={StyleAdmin.InputCustom}
                  />
                )}
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
          <Button
            onClick={handleClose}
            color='error'
            variant='outlined'
            sx={{ textTransform: 'none' }}
          >
            Hủy
          </Button>
          <Button
            type='submit'
            variant='contained'
            sx={{
              backgroundColor: '#001f5d',
              color: '#fff',
              textTransform: 'none'
            }}
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
