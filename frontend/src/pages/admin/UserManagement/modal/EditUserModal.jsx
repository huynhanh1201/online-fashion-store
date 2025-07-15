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

import { useForm, Controller } from 'react-hook-form'
import StyleAdmin from '~/assets/StyleAdmin.jsx'

const EditUserModal = ({ open, onClose, user, onSave, roles }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm({
    defaultValues: {
      role: ''
    }
  })

  useEffect(() => {
    if (open && user) {
      const selectedRole = roles.find((r) => r.name === user.role)
      reset({
        role: selectedRole || null
      })
    }
  }, [open, user, roles, reset])

  const onSubmit = async (data) => {
    await onSave({ role: data.role?.name }, 'edit', user._id)
    onClose()
  }

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
      <DialogTitle>Cập nhật vai trò khách hàng</DialogTitle>
      <Divider sx={{ my: 0 }} />
      <DialogContent>
        <form id='edit-user-form' onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name='role'
            control={control}
            rules={{ required: 'Vai trò là bắt buộc' }}
            render={({ field, fieldState }) => (
              <Autocomplete
                options={roles}
                getOptionLabel={(option) => option?.label || ''}
                isOptionEqualToValue={(option, value) =>
                  option.name === value?.name
                }
                value={field.value || null}
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
            backgroundColor: 'var(--primary-color)',
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

export default EditUserModal
