// components/admin/roles/modal/AddRoleModal.jsx
import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'

const AddRoleModal = ({ open, onClose, onSubmit }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      label: ''
    }
  })

  const handleSave = (data) => {
    onSubmit(data, 'add')
    onClose()
    reset()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Thêm vai trò</DialogTitle>
      <DialogContent>
        <Controller
          name='name'
          control={control}
          rules={{ required: 'Không được bỏ trống tên vai trò' }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              margin='normal'
              label='Tên vai trò'
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          )}
        />
        <Controller
          name='label'
          control={control}
          rules={{ required: 'Không được bỏ trống tên hiển thị' }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              margin='normal'
              label='Tên hiển thị'
              error={!!errors.label}
              helperText={errors.label?.message}
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Huỷ</Button>
        <Button onClick={handleSubmit(handleSave)} variant='contained'>
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddRoleModal
