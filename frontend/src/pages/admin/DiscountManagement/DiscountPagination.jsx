import React from 'react'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'

const DiscountPagination = ({ page, totalPages, onPageChange }) => {
  return (
    <Stack
      spacing={2}
      sx={{ mt: 2, mb: 4, display: 'flex', alignItems: 'center' }}
    >
      <Pagination
        count={totalPages}
        page={page > 1 ? page : 1}
        onChange={onPageChange}
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

export default DiscountPagination
