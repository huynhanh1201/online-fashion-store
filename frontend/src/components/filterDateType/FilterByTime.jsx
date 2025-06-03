import React, { useState } from 'react'
import { Box, Button, Chip, Menu, MenuItem, Typography } from '@mui/material'

const FilterByTime = ({
  onApply,
  filterDate,
  selectedFilter,
  setSelectedFilter
}) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleChipClick = (value) => {
    setSelectedFilter(value)
  }

  const handleApply = () => {
    onApply(selectedFilter)
    handleCloseMenu()
  }

  return (
    <>
      <Button variant='outlined' onClick={handleOpenMenu}>
        Lọc thời gian
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        MenuListProps={{ sx: { padding: 2 } }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <Typography variant='subtitle2' sx={{ mb: 1 }}>
          Chọn thời gian
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            maxWidth: 300
          }}
        >
          {filterDate.map((item) => (
            <Box key={item.value} sx={{ width: 'calc(50% - 4px)' }}>
              <Chip
                label={item.label}
                variant={selectedFilter === item.value ? 'filled' : 'outlined'}
                color={selectedFilter === item.value ? 'primary' : 'default'}
                onClick={() => handleChipClick(item.value)}
                clickable
                sx={{ width: '100%' }}
              />
            </Box>
          ))}
        </Box>

        <Box mt={2} display='flex' justifyContent='flex-end'>
          <Button variant='contained' size='small' onClick={handleApply}>
            Áp dụng
          </Button>
        </Box>
      </Menu>
    </>
  )
}

export default FilterByTime
