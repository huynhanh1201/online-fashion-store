import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'

const EditRoleModal = ({ open, onClose, role, onSubmit, p }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    defaultValues: {
      name: '',
      label: '',
      permissions: []
    }
  })

  // Khi mở modal và có role -> reset form
  React.useEffect(() => {
    if (role) {
      reset({
        name: role.name || '',
        label: role.label || '',
        permissions: role.permissions || []
      })
    }
  }, [role, reset])

  const permissions = watch('permissions') || []

  const handleCheckboxChange = (value) => {
    const updated = permissions.includes(value)
      ? permissions.filter((v) => v !== value)
      : [...permissions, value]
    setValue('permissions', updated)
  }

  const handleSave = (data) => {
    if (role?._id) {
      onSubmit(data, 'edit', role._id)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Chỉnh sửa vai trò</DialogTitle>
      <DialogContent>
        <Controller
          name='name'
          control={control}
          rules={{ required: 'Tên vai trò là bắt buộc' }}
          render={({ field }) => (
            <TextField
              {...field}
              label='Tên vai trò (ví dụ: marketing_staff)'
              fullWidth
              margin='normal'
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          )}
        />
        <Controller
          name='label'
          control={control}
          rules={{ required: 'Tên hiển thị là bắt buộc' }}
          render={({ field }) => (
            <TextField
              {...field}
              label='Tên hiển thị (ví dụ: Nhân viên Marketing)'
              fullWidth
              margin='normal'
              error={!!errors.label}
              helperText={errors.label?.message}
            />
          )}
        />

        <Typography variant='subtitle1' sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
          Quyền được cấp
        </Typography>
        <FormGroup>
          {p.map((perm) => (
            <FormControlLabel
              key={perm.value}
              control={
                <Checkbox
                  checked={permissions.includes(perm.value)}
                  onChange={() => handleCheckboxChange(perm.value)}
                />
              }
              label={perm.label}
            />
          ))}
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Huỷ</Button>
        <Button onClick={handleSubmit(handleSave)} variant='contained'>
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditRoleModal
