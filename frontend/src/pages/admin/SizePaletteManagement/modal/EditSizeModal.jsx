import React, { useState, useRef, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material'
import { useForm } from 'react-hook-form'

const EditSizeModal = ({ open, onClose, size, onUpdated }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      status: 'draft'
    }
  })

  useEffect(() => {
    if (size) {
      reset({
        name: size.name || '',
        status: size.isActive ? 'active' : 'inactive'
      })
    }
  }, [size, reset])

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name.trim(),
        isActive: data.status === 'active'
      }

      await onUpdated(payload, 'edit')
      handleClose()
    } catch (error) {
      console.error('Lỗi khi cập nhật kích thước:', error)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
      <DialogTitle>Chỉnh sửa kích thước</DialogTitle>
      <DialogContent dividers>
        <Stack direction='row' spacing={3}>
          <Box sx={{ flex: 1 }}>
            <TextField
              label='Tên kích thước'
              {...register('name', {
                required: 'Vui lòng nhập tên kích thước'
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
            />

            <Box mt={2}>
              <Typography fontWeight='bold' mb={1}>
                Trạng thái
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {[
                  { label: 'Bản nháp', value: 'draft' },
                  { label: 'Hoạt động', value: 'active' },
                  { label: 'Không hoạt động', value: 'inactive' }
                ].map((item) => {
                  const isSelected = watch('status') === item.value
                  return (
                    <Chip
                      key={item.value}
                      label={item.label}
                      onClick={() => setValue('status', item.value)}
                      variant={isSelected ? 'filled' : 'outlined'}
                      clickable
                      sx={{
                        ...(isSelected && {
                          backgroundColor: 'var(--primary-color)',
                          color: '#fff',
                          '&:hover': {
                            backgroundColor: 'var(--primary-color)'
                          }
                        })
                      }}
                    />
                  )
                })}
              </Box>
            </Box>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button
          onClick={handleClose}
          sx={{ textTransform: 'none' }}
          color='error'
          variant='outlined'
        >
          Hủy
        </Button>
        <Button
          variant='contained'
          sx={{
            backgroundColor: 'var(--primary-color)',
            color: '#fff',
            textTransform: 'none'
          }}
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditSizeModal
