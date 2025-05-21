import React, { useEffect } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'

import { useForm } from 'react-hook-form'

import AuthorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'
import StyleAdmin from '~/assets/StyleAdmin.jsx'

const EditUserModal = React.memo(({ open, onClose, user, onSave }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      role: 'customer',
      createdAt: '',
      updatedAt: ''
    }
  })

  useEffect(() => {
    if (open && user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'customer',
        createdAt: user.createdAt || '',
        updatedAt: user.updatedAt || ''
      })
    }
  }, [open, user, reset])

  const onSubmit = async (data) => {
    try {
      await AuthorizedAxiosInstance.patch(`${API_ROOT}/v1/users/${user._id}`, {
        role: data.role
      })
      onSave()
      onClose()
    } catch (error) {
      console.error('Lỗi khi cập nhật người dùng:', error)
    }
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
      <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
      <Divider sx={{ my: 1 }} />
      <DialogContent>
        <form id='edit-user-form' onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label='Tên người dùng'
            fullWidth
            margin='normal'
            value={user?.name || ''}
            InputProps={{ readOnly: true }}
            sx={{
              ...StyleAdmin.InputCustom,
              ...StyleAdmin.InputCustom.CursorNone,
              ...StyleAdmin.InputCustom.InputViews
            }}
          />
          <TextField
            label='Email'
            fullWidth
            margin='normal'
            value={user?.email || ''}
            InputProps={{ readOnly: true }}
            sx={{
              ...StyleAdmin.InputCustom,
              ...StyleAdmin.InputCustom.CursorNone,
              ...StyleAdmin.InputCustom.InputViews
            }}
          />
          <FormControl
            fullWidth
            margin='normal'
            error={!!errors.role}
            sx={StyleAdmin.FormSelect}
          >
            <InputLabel id='role-label'>Quyền</InputLabel>
            <Select
              labelId='role-label'
              label='Quyền'
              {...register('role', { required: 'Vai trò là bắt buộc' })}
              defaultValue={user?.role || 'customer'}
              disabled={isSubmitting}
              MenuProps={{
                PaperProps: {
                  sx: StyleAdmin.FormSelect.SelectMenu
                }
              }}
            >
              <MenuItem value='customer'>KHÁCH HÀNG</MenuItem>
              <Divider sx={{ margin: '0 !important' }} />
              <MenuItem value='admin'>QUẢN TRỊ</MenuItem>
            </Select>
            {errors.role && (
              <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                {errors.role.message}
              </p>
            )}
          </FormControl>

          <TextField
            label='Ngày tạo'
            fullWidth
            margin='normal'
            value={
              user?.createdAt ? new Date(user.createdAt).toLocaleString() : ''
            }
            InputProps={{ readOnly: true }}
            sx={{
              ...StyleAdmin.InputCustom,
              ...StyleAdmin.InputCustom.CursorNone,
              ...StyleAdmin.InputCustom.InputViews
            }}
          />
          <TextField
            label='Ngày cập nhật'
            fullWidth
            margin='normal'
            value={
              user?.updatedAt ? new Date(user.updatedAt).toLocaleString() : ''
            }
            InputProps={{ readOnly: true }}
            sx={{
              ...StyleAdmin.InputCustom,
              ...StyleAdmin.InputCustom.CursorNone,
              ...StyleAdmin.InputCustom.InputViews
            }}
          />
        </form>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={onClose} disabled={isSubmitting} color='inherit'>
          Hủy
        </Button>
        <Button
          type='submit'
          form='edit-user-form'
          variant='contained'
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          sx={{ backgroundColor: '#001f5d', color: '#fff' }}
        >
          {isSubmitting ? 'Đang lưu' : 'Lưu'}
        </Button>
      </DialogActions>
    </Dialog>
  )
})

export default EditUserModal
