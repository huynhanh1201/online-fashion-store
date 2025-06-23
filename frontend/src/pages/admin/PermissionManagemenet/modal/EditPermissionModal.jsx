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

export default function EditPermissionModal({
  open,
  onClose,
  onSuccess,
  defaultValues
}) {
  const { control, handleSubmit } = useForm({ defaultValues })

  const onSubmit = async (values) => {
    try {
      // await updatePermission(values)
      onSuccess()
      onClose()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Chỉnh sửa quyền</DialogTitle>
      <DialogContent dividers>
        <Controller
          name='key'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label='Key'
              fullWidth
              margin='normal'
              disabled
            />
          )}
        />
        <Controller
          name='label'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label='Tên hiển thị'
              fullWidth
              margin='normal'
            />
          )}
        />
        <Controller
          name='group'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label='Nhóm quyền'
              fullWidth
              margin='normal'
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit(onSubmit)} variant='contained'>
          Cập nhật
        </Button>
      </DialogActions>
    </Dialog>
  )
}
