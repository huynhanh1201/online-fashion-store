import React from 'react'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'

const SizePagination = ({ page, totalPages, onPageChange }) => {
  return (
    <Stack spacing={2} alignItems='center' sx={{ mt: 2 }}>
      <Pagination
        count={totalPages}
        page={page}
        onChange={onPageChange}
        color='primary'
        sx={{
          '& .Mui-selected': {
            backgroundColor: 'var(--primary-color) !important',
            color: '#fff',
            fontWeight: 'bold'
          }
        }}
      />
    </Stack>
  )
}

export default SizePagination
