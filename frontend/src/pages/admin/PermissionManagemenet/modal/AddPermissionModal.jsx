import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem
} from '@mui/material'
import { useForm } from 'react-hook-form'

export default function AddPermissionModal({ open, onClose, onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  const groups = [
    'Tài khoản',
    'Danh mục',
    'Sản phẩm',
    'Biến thể sản phẩm',
    'Thuộc tính sản phẩm',
    'Đơn hàng',
    'Thanh toán',
    'Khuyến mãi',
    'Thống kê',
    'Kho hàng',
    'Lô hàng',
    'Đối tác',
    'Địa chỉ giao hàng'
  ]

  const onSubmit = (data) => {
    onSuccess(data)
    reset()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Thêm quyền mới</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            select
            label='Nhóm quyền'
            fullWidth
            margin='normal'
            {...register('group', { required: 'Vui lòng chọn nhóm quyền' })}
            error={!!errors.group}
            helperText={errors.group?.message}
          >
            {groups.map((group) => (
              <MenuItem key={group} value={group}>
                {group}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label='Key'
            fullWidth
            margin='normal'
            {...register('key', {
              required: 'Vui lòng nhập key',
              pattern: {
                value: /^[a-z]+:[a-z]+$/,
                message:
                  'Key phải có định dạng "tên:chức năng" (ví dụ: user:read)'
              }
            })}
            error={!!errors.key}
            helperText={errors.key?.message}
          />
          <TextField
            label='Tên quyền'
            fullWidth
            margin='normal'
            {...register('label', { required: 'Vui lòng nhập tên quyền' })}
            error={!!errors.label}
            helperText={errors.label?.message}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit(onSubmit)} variant='contained'>
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  )
}
