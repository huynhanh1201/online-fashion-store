import React from 'react'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'

const TransactionPagination = ({ page, totalPages, onChange }) => {
  return (
    <Stack spacing={2} alignItems='center' mt={2}>
      <Pagination
        count={totalPages}
        page={page}
        onChange={(e, value) => onChange(value)}
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

export default TransactionPagination
