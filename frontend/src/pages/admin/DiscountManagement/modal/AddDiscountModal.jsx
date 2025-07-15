import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import customVi from '~/components/DateInput/CustomVi.jsx'
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
import StyleAdmin from '~/assets/StyleAdmin.jsx'

const AddDiscountModal = ({ open, onClose, onAdded }) => {
  const {
    register,
    watch,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { isSubmitting, errors }
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

      await onAdded(payload, 'add')
      if (!data.code) {
        toast.error('Vui lòng nhập mã giảm giá!')
        return
      }

      if (!data.amount) {
        toast.error('Vui lòng nhập giá trị giảm!')
        return
      }
      reset()
      onClose()
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
                label={
                  <>
                    Mã giảm giá <span style={{ color: 'red' }}>*</span>
                  </>
                }
                fullWidth
                margin='normal'
                {...register('code', {
                  required: 'Mã giảm giá là bắt buộc',
                  minLength: { value: 3, message: 'Ít nhất 3 ký tự' },
                  maxLength: { value: 20, message: 'Không quá 20 ký tự' },
                  pattern: {
                    value: /^[a-zA-Z0-9]+$/,
                    message: 'Chỉ được chứa chữ và số'
                  },
                  validate: (value) =>
                    value.trim() === value ||
                    'Không được có khoảng trắng đầu/cuối'
                })}
                error={!!errors.code}
                helperText={errors.code?.message}
                sx={StyleAdmin.InputCustom}
              />

              <FormControl fullWidth margin='normal' sx={StyleAdmin.FormSelect}>
                <InputLabel id='type-label'>Loại giảm giá</InputLabel>
                <Select
                  labelId='type-label'
                  label='Loại giảm giá'
                  value={type}
                  {...register('type', {
                    required: 'Vui lòng chọn loại giảm giá',
                    validate: (value) =>
                      ['fixed', 'percent'].includes(value) ||
                      'Loại giảm giá không hợp lệ'
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
                      <>
                        {type === 'fixed'
                          ? 'Giá trị giảm (đ)'
                          : 'Giá trị giảm (%)'}{' '}
                        <span style={{ color: 'red' }}>*</span>
                      </>
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
                label='Hoạt động'
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
                    label={
                      <>
                        Giá trị đơn hàng tối thiểu (đ){' '}
                        <span style={{ color: 'red' }}>*</span>
                      </>
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
                    label={
                      <>
                        Số lượt sử dụng tối đa{' '}
                        <span style={{ color: 'red' }}>*</span>
                      </>
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

              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={customVi}
              >
                <Controller
                  name='validFrom'
                  control={control}
                  rules={{
                    required: 'Vui lòng chọn ngày bắt đầu'
                  }}
                  render={({ field, fieldState }) => (
                    <DatePicker
                      label={
                        <>
                          Ngày bắt đầu <span style={{ color: 'red' }}>*</span>
                        </>
                      }
                      value={field.value || null}
                      onChange={field.onChange}
                      format='dd/MM/yyyy'
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          margin: 'normal',
                          error: !!fieldState.error,
                          helperText: fieldState.error?.message,
                          sx: StyleAdmin.InputCustom
                        }
                      }}
                    />
                  )}
                />

                <Controller
                  name='validUntil'
                  control={control}
                  rules={{
                    required: 'Vui lòng chọn ngày kết thúc',
                    validate: (value) => {
                      const from = new Date(watch('validFrom'))
                      const to = new Date(value)
                      if (!value) return 'Vui lòng chọn ngày kết thúc'
                      if (isNaN(from.getTime()) || isNaN(to.getTime()))
                        return true
                      return to > from || 'Ngày kết thúc phải sau ngày bắt đầu'
                    }
                  }}
                  render={({ field, fieldState }) => (
                    <DatePicker
                      label={
                        <>
                          Ngày kết thúc <span style={{ color: 'red' }}>*</span>
                        </>
                      }
                      value={field.value || null}
                      onChange={field.onChange}
                      format='dd/MM/yyyy'
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          margin: 'normal',
                          error: !!fieldState.error,
                          helperText: fieldState.error?.message,
                          sx: StyleAdmin.InputCustom
                        }
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
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
