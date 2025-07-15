import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Divider,
  CircularProgress,
  Autocomplete,
  TextField
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import StyleAdmin from '~/assets/StyleAdmin.jsx'
import { IconButton, InputAdornment } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

const AddAccountModal = ({ open, onClose, onSave, roles }) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: ''
    }
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const toggleShowPassword = () => setShowPassword((prev) => !prev)
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev)

  const password = watch('password')

  useEffect(() => {
    if (open) {
      reset({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: ''
      })
    }
  }, [open, reset])

  const onSubmit = async (data) => {
    await onSave(data, 'add')
    onClose()
  }

  const roleOptions = roles
    .filter((role) => role.name !== 'customer')
    .map((role) => ({
      name: role.name,
      label: role.label || role.name
    }))

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
      <DialogTitle>Thêm tài khoản hệ thống</DialogTitle>
      <Divider sx={{ my: 0 }} />
      <DialogContent>
        <form id='add-user-form' onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name='name'
            control={control}
            rules={{
              required: 'Họ và tên là bắt buộc',
              minLength: {
                value: 3,
                message: 'Họ và tên phải có ít nhất 3 ký tự'
              },
              maxLength: {
                value: 50,
                message: 'Họ và tên không vượt quá 50 ký tự'
              },
              validate: (value) =>
                value.trim() === value ||
                'Họ và tên không được có khoảng trắng ở đầu hoặc cuối'
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label={
                  <>
                    Tên <span style={{ color: 'red' }}>*</span>
                  </>
                }
                fullWidth
                margin='normal'
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                sx={StyleAdmin.InputCustom}
              />
            )}
          />

          <Controller
            name='email'
            control={control}
            rules={{
              required: 'Email là bắt buộc',
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'Email không đúng định dạng (ví dụ: ten@domain.com)'
              },
              maxLength: {
                value: 100,
                message: 'Email không vượt quá 100 ký tự'
              },
              validate: (value) =>
                value.trim() === value ||
                'Email không được có khoảng trắng ở đầu hoặc cuối'
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label={
                  <>
                    Email <span style={{ color: 'red' }}>*</span>
                  </>
                }
                fullWidth
                margin='normal'
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                sx={StyleAdmin.InputCustom}
              />
            )}
          />

          <Controller
            name='password'
            control={control}
            rules={{
              required: 'Mật khẩu là bắt buộc',
              validate: (value) => {
                const regex =
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$/
                return (
                  regex.test(value) ||
                  'Mật khẩu phải từ 8–128 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt'
                )
              }
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type={showPassword ? 'text' : 'password'}
                label={
                  <>
                    Mật khẩu <span style={{ color: 'red' }}>*</span>
                  </>
                }
                fullWidth
                margin='normal'
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                sx={StyleAdmin.InputCustom}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end' sx={{ pr: 1 }}>
                      <IconButton onClick={toggleShowPassword} edge='end'>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            )}
          />

          <Controller
            name='confirmPassword'
            control={control}
            rules={{
              required: 'Xác nhận mật khẩu là bắt buộc',
              validate: (value) =>
                value === password ||
                'Xác nhận mật khẩu không khớp với mật khẩu đã nhập'
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type={showConfirmPassword ? 'text' : 'password'}
                label={
                  <>
                    Xác nhận mật khẩu <span style={{ color: 'red' }}>*</span>
                  </>
                }
                fullWidth
                margin='normal'
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                sx={StyleAdmin.InputCustom}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end' sx={{ pr: 1 }}>
                      <IconButton
                        onClick={toggleShowConfirmPassword}
                        edge='end'
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            )}
          />

          <Controller
            name='role'
            control={control}
            rules={{
              required: 'Vai trò là bắt buộc, vui lòng chọn 1 vai trò phù hợp'
            }}
            render={({ field, fieldState }) => (
              <Autocomplete
                options={roleOptions}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) =>
                  option.name === value?.name
                }
                value={roleOptions.find((r) => r.name === field.value) || null}
                onChange={(_, selected) => field.onChange(selected?.name || '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={
                      <>
                        Vai trò <span style={{ color: 'red' }}>*</span>
                      </>
                    }
                    margin='normal'
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    sx={StyleAdmin.InputCustom}
                  />
                )}
              />
            )}
          />
        </form>
      </DialogContent>
      <Divider sx={{ my: 0 }} />
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button
          onClick={onClose}
          disabled={isSubmitting}
          color='error'
          variant='outlined'
          sx={{ textTransform: 'none' }}
        >
          Hủy
        </Button>
        <Button
          type='submit'
          form='add-user-form'
          variant='contained'
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          sx={{
            backgroundColor: '#001f5d',
            color: '#fff',
            textTransform: 'none'
          }}
        >
          {isSubmitting ? 'Đang lưu' : 'Lưu'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddAccountModal
