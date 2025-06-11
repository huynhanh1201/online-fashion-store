import React from 'react'
import { Box, Button, Menu, TextField } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

export default function FilterByPrice({
  priceMin,
  priceMax,
  setPriceMin,
  setPriceMax,
  onApply
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
        Giá từ - đến
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
          <TextField
            label='Giá từ'
            type='number'
            size='small'
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
          />
          <TextField
            label='Giá đến'
            type='number'
            size='small'
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
          />
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
