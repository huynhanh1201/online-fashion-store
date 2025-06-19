import React from 'react'
import {
  Box,
  Typography,
  Button,
  Chip,
  Stack
} from '@mui/material'

function AddressList({ addresses, onEdit, onDelete }) {
  if (addresses.length === 0) {
    return (
      <Typography textAlign='center' color='text.secondary'>
        Chưa có địa chỉ giao hàng
      </Typography>
    )
  }

  return (
    <Stack spacing={2}>
      {addresses.map((addr) => (
        <Box
          key={addr._id}
          sx={{
            border: '1px solid #ddd',
            borderRadius: 2,
            p: 2,
            position: 'relative'
          }}
        >
          <Box display='flex' justifyContent='space-between' alignItems='center'>
            <Box>
              <Typography fontWeight={600}>
                {addr.fullName}{' '}
                <Typography
                  component='span'
                  variant='body2'
                  color='text.secondary'
                  sx={{ ml: 1 }}
                >
                  (+84) {addr.phone.replace(/^0/, '')}
                </Typography>
              </Typography>
            </Box>
            <Box>
              <Button
                size='small'
                onClick={() => onEdit(addr)}
                sx={{ textTransform: 'none', color: 'primary.main', fontWeight: 500 }}
              >
                Cập nhật
              </Button>
              <Button
                size='small'
                onClick={() => onDelete(addr._id)}
                sx={{ textTransform: 'none', color: 'primary.main', fontWeight: 500 }}
              >
                Xoá
              </Button>
            </Box>
          </Box>

          <Typography color='text.secondary' mt={0.5}>
            {addr.address}
          </Typography>
          <Typography color='text.secondary'>
            {addr.ward}, {addr.district}, {addr.city}
          </Typography>

          {addr.isDefault && (
            <Chip
              label='Mặc định'
              color='error'
              variant='outlined'
              size='small'
              sx={{ mt: 1 }}
            />
          )}
        </Box>
      ))}
    </Stack>
  )
}

export default AddressList
