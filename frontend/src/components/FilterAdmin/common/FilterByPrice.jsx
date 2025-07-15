import React from 'react'
import { Box, Button, Menu, TextField } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

export default function FilterByPrice({
  priceMin,
  priceMax,
  setPriceMin,
  setPriceMax,
  onApply,
  label = 'Giá từ - đến'
}) {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleApply = () => {
    onApply?.()
    handleClose()
  }
  return (
    <>
      <Button
        variant='outlined'
        onClick={handleOpen}
        endIcon={<ArrowDropDownIcon />} // mũi tên giống select
        sx={{
          textTransform: 'none',
          justifyContent: 'space-between',
          minWidth: 100,
          color: 'text.primary',
          borderColor: 'rgba(0, 0, 0, 0.23)', // giống border Select mặc định
          padding: '6.5px 14px', // giống TextField size="small"
          '&:hover': {
            borderColor: 'black'
          }
        }}
      >
        {label || 'Giá từ - đến'}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{ sx: { p: 2 } }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <Box display='flex' flexDirection='column' gap={2}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 2,
              maxWidth: 300
            }}
          >
            <TextField
              label='Từ'
              type='number'
              size='small'
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
            />
            <TextField
              label='Đến'
              type='number'
              size='small'
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
            />
          </Box>
          <Button
            variant='contained'
            size='small'
            onClick={handleApply}
            sx={{ alignSelf: 'flex-end' }}
          >
            Xong
          </Button>
        </Box>
      </Menu>
    </>
  )
}
