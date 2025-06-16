import React from 'react'
import IconButton from '@mui/material/IconButton'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'

export default function TablePaginationActions(props) {
  const { count, page, rowsPerPage, onPageChange } = props

  const totalPages = Math.ceil(count / rowsPerPage)

  const handleBackButtonClick = (event) => {
    if (page > 0) {
      onPageChange(event, page - 1)
    }
  }

  const handleNextButtonClick = (event) => {
    if (page < totalPages - 1) {
      onPageChange(event, page + 1)
    }
  }

  return (
    <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        sx={{ color: page === 0 ? '#ccc' : '#001f5d' }}
      >
        <KeyboardArrowLeft />
      </IconButton>
      <Typography
        variant='body2'
        sx={{
          width: 25,
          height: 25,
          justifyContent: 'center',
          alignItems: 'center',
          border: '2px solid #001f5d',
          color: '#001f5d',
          fontWeight: '900',
          borderRadius: '8px',
          display: 'inline-flex'
        }}
      >
        {page + 1}
      </Typography>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= totalPages - 1}
        sx={{ color: page >= totalPages - 1 ? '#ccc' : '#001f5d' }}
      >
        <KeyboardArrowRight />
      </IconButton>
    </Box>
  )
}
