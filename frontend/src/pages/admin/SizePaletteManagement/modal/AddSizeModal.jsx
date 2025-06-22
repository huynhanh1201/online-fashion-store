import React, { useState, useRef } from 'react'
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
  Tooltip
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { useForm } from 'react-hook-form'
import Chip from '@mui/material/Chip'

const AddSizeModal = ({ open, onClose, onAdded }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    defaultValues: {
      name: '',
      isActive: true
    }
  })

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name.trim(),
        isActive: watch('status') === 'active'
      }

      await onAdded(payload, 'add')
      handleClose()
    } catch (error) {
      console.error('Lỗi khi upload hoặc thêm kích thước:', error)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
      <DialogTitle>Thêm kích thước</DialogTitle>
      <DialogContent dividers>
        <Stack direction='row' spacing={3}>
          {/* Cột phải: Tên + Trạng thái */}
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
                          backgroundColor: '#001f5d',
                          color: '#fff',
                          '&:hover': {
                            backgroundColor: '#001f5d'
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
            backgroundColor: '#001f5d',
            color: '#fff',
            textTransform: 'none'
          }}
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddSizeModal
