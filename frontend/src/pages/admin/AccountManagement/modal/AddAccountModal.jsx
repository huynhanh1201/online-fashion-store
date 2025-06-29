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

  const roleOptions = roles.map((role) => role.name)

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
            rules={{ required: 'Tên là bắt buộc' }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label='Họ và tên'
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
                value: /^\S+@\S+$/i,
                message: 'Email không hợp lệ'
              }
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label='Email'
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
            rules={{ required: 'Mật khẩu là bắt buộc' }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type={showPassword ? 'text' : 'password'}
                label='Mật khẩu'
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
              validate: (value) => value === password || 'Mật khẩu không khớp'
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type={showConfirmPassword ? 'text' : 'password'}
                label='Xác nhận mật khẩu'
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
            rules={{ required: 'Vai trò là bắt buộc' }}
            render={({ field, fieldState }) => (
              <Autocomplete
                options={roleOptions}
                getOptionLabel={(option) => option}
                value={field.value}
                onChange={(_, value) => field.onChange(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label='Vai trò'
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
