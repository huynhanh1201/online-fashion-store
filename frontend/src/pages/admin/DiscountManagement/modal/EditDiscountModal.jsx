import React from 'react'
import { useForm, Controller } from 'react-hook-form'

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
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import { toast } from 'react-toastify'
import StyleAdmin from '~/assets/StyleAdmin.jsx'

// Hàm định dạng lại datetime cho input type="datetime-local"
const formatDateTimeLocal = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  const offset = date.getTimezoneOffset() * 60000
  return new Date(date - offset).toISOString().slice(0, 16)
}

const EditDiscountModal = ({ open, onClose, discount, onSave }) => {
  const {
    register,
    watch,
    handleSubmit,
    control,
    reset,
    // setValue,
    setError,
    formState: { isSubmitting }
  } = useForm({
    defaultValues: {
      code: '',
      type: 'fixed',
      amount: '',
      minOrderValue: '',
      usageLimit: '',
      validFrom: '',
      validUntil: '',
      isActive: false
    }
  })

  const type = watch('type', 'fixed')
  // const code = watch('code')

  React.useEffect(() => {
    if (discount) {
      reset({
        ...discount,
        validFrom: formatDateTimeLocal(discount.validFrom),
        validUntil: formatDateTimeLocal(discount.validUntil)
      })
    }
  }, [discount, reset])
  // React.useEffect(() => {
  //   setValue('amount', '') // reset về rỗng
  // }, [code, setValue])
  const onSubmit = async (data) => {
    if (!data.amount) {
      toast.error('Vui lòng nhập giá trị giảm!')
      return
    }

    if (data.type === 'percent' && (data.amount < 0 || data.amount > 100)) {
      toast.error('Giá trị giảm (%) phải nằm trong khoảng 0 đến 100!')
      setError('amount', {
        type: 'manual',
        message: 'Giá trị giảm (%) không hợp lệ'
      })
      return
    }

    const payload = {
      code: data.code,
      type: data.type,
      amount: Number(data.amount),
      minOrderValue: Number(data.minOrderValue),
      usageLimit: Number(data.usageLimit),
      validFrom: new Date(data.validFrom).toISOString(),
      validUntil: new Date(data.validUntil).toISOString(),
      isActive: data.isActive === true || data.isActive === 'true'
    }

    try {
      await onSave(payload, 'edit', discount._id)
      onClose()
    } catch (error) {
      console.error('Lỗi khi cập nhật mã giảm giá:', error)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }
  const formatNumber = (value) => {
    const number = value?.toString().replace(/\D/g, '') || ''
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  const parseNumber = (formatted) => formatted.replace(/\./g, '')
  const minOrderValue = watch('minOrderValue')
  const usageLimit = watch('usageLimit')
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
      <DialogTitle>Sửa thông tin mã giảm giá</DialogTitle>
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
              <Controller
                name='type'
                control={control}
                rules={{ required: 'Vui lòng chọn loại giảm giá' }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl
                    fullWidth
                    margin='normal'
                    error={!!error}
                    sx={StyleAdmin.FormSelect}
                  >
                    <InputLabel id='type-label'>Loại giảm giá</InputLabel>
                    <Select
                      disabled
                      labelId='type-label'
                      label='Loại giảm giá'
                      {...field}
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
                )}
              />

              <Controller
                name='amount'
                control={control}
                rules={{
                  required: 'Vui lòng nhập giá trị giảm',
                  validate: (value) => {
                    const number = parseInt(value)
                    if (isNaN(number)) return 'Giá trị không hợp lệ'
                    if (number < 0) return 'Giá trị không được âm'
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
                    disabled
                    label={
                      type === 'fixed' ? 'Giá trị giảm (đ)' : 'Giá trị giảm (%)'
                    }
                    fullWidth
                    margin='normal'
                    value={formatNumber(value)}
                    onChange={(e) => onChange(parseNumber(e.target.value))}
                    error={!!error}
                    helperText={error?.message}
                    InputProps={{ inputMode: 'numeric' }}
                    sx={StyleAdmin.InputCustom}
                  />
                )}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked={discount.isActive}
                    {...register('isActive')}
                    sx={StyleAdmin.InputCustom}
                  />
                }
                label='Kích hoạt'
                sx={{ mt: 1 }}
              />
            </Box>

            {/* Cột phải */}
            <Box flex={1}>
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
                    label='Giá trị đơn hàng tối thiểu (đ)'
                    fullWidth
                    margin='normal'
                    value={formatNumber(value)}
                    onChange={(e) => onChange(parseNumber(e.target.value))}
                    error={!!error}
                    helperText={error?.message}
                    InputProps={{ inputMode: 'numeric' }}
                    sx={StyleAdmin.InputCustom}
                  />
                )}
              />

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
                    fullWidth
                    margin='normal'
                    value={formatNumber(value)}
                    onChange={(e) => onChange(parseNumber(e.target.value))}
                    error={!!error}
                    helperText={error?.message}
                    InputProps={{ inputMode: 'numeric' }}
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
            {isSubmitting ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditDiscountModal
