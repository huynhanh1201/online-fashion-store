import React from 'react'
import { Pagination, Stack } from '@mui/material'

const InventoryLogPagination = ({ page, totalPages, onPageChange }) => {
  return (
    <Stack spacing={2} alignItems='center' sx={{ mt: 2 }}>
      <Pagination
        count={totalPages}
        page={page}
        onChange={onPageChange}
        sx={{
          '& .Mui-selected': {
            backgroundColor: '#001f5d !important',
            color: '#fff',
            fontWeight: 'bold'
          }
        }}
      />
    </Stack>
  )
}

export default InventoryLogPagination
