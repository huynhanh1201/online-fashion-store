import React, { useEffect } from 'react'

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
import { IconButton, InputAdornment } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import StyleAdmin from '~/assets/StyleAdmin.jsx'

const EditAccountModal = ({ open, onClose, user, onSave, roles }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      password: '',
      role: ''
    }
  })
  const [showPassword, setShowPassword] = useState(false)
  const toggleShowPassword = () => setShowPassword((prev) => !prev)

  useEffect(() => {
    if (open && user) {
      reset({
        name: user.name || '',
        password: '',
        role: user.role || ''
      })
    }
  }, [open, user, reset])

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      role: data.role
    }

    // Chỉ gửi mật khẩu nếu được nhập
    if (data.password?.trim()) {
      payload.password = data.password
    }

    await onSave(payload, 'edit', user._id)
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
      <DialogTitle>Cập nhật thông tin Tài khoàn</DialogTitle>
      <Divider sx={{ my: 0 }} />
      <DialogContent>
        <form id='edit-user-form' onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name='name'
            control={control}
            rules={{ required: 'Tên là bắt buộc' }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label='Tên tài khoản'
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
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label='Mật khẩu mới'
                type={showPassword ? 'text' : 'password'}
                fullWidth
                margin='normal'
                error={!!fieldState.error}
                helperText={
                  fieldState.error?.message || 'Để trống nếu không đổi'
                }
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
          form='edit-user-form'
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

export default EditAccountModal
