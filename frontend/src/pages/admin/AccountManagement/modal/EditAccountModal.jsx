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
      <DialogTitle>Cập nhật thông tin Tài khoàn</DialogTitle>
      <Divider sx={{ my: 0 }} />
      <DialogContent>
        <form id='edit-user-form' onSubmit={handleSubmit(onSubmit)}>
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
                    Tên tài khoản <span style={{ color: 'red' }}>*</span>
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
              validate: (value) => {
                if (!value?.trim()) return true
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
                    onFocus={(event) => {
                      // Hủy hành vi select toàn bộ khi focus
                      const input = event.target
                      requestAnimationFrame(() => {
                        input.setSelectionRange?.(
                          input.value.length,
                          input.value.length
                        )
                      })
                    }}
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
