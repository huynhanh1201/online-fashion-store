import React, { useState } from 'react'
import { Box, Button, Chip, Menu, MenuItem, Typography } from '@mui/material'
import { TextField } from '@mui/material'
import { toast } from 'react-toastify'
import { filterDate } from '~/utils/constants.js'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import dayjs from 'dayjs'
const FilterByTime = ({
  onApply,
  selectedFilter,
  setSelectedFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  label
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
    if (selectedFilter === 'custom' && (!startDate || !endDate)) {
      toast.error('Vui lòng chọn cả ngày bắt đầu và ngày kết thúc')
      return
    }
    onApply(selectedFilter)
    handleCloseMenu()
  }

  return (
    <>
      <Button
        variant='outlined'
        onClick={handleOpenMenu}
        endIcon={<ArrowDropDownIcon />}
        sx={{
          textTransform: 'none',
          justifyContent: 'space-between',
          minWidth: 150,
          height: 34, // Chiều cao tương đồng
          fontSize: '0.8rem', // Cỡ chữ nhỏ
          color: '#00000099',
          borderRadius: '4px', // Bo tròn giống Select
          borderColor: 'rgba(0, 0, 0, 0.23)',
          padding: '4px 12px', // Gọn nhẹ hơn
          '&:hover': {
            borderColor: 'black'
          }
        }}
      >
        {selectedFilter === 'custom' && startDate && endDate
          ? `${dayjs(startDate).format('DD/MM/YY')} - ${dayjs(endDate).format('DD/MM/YY')}`
          : filterDate.find((item) => item.value === selectedFilter)?.label ||
            label ||
            'Lọc theo thời gian'}
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

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, maxWidth: 300 }}>
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

        {selectedFilter === 'custom' && (
          <Box mt={2} display='flex' flexDirection='column' gap={2}>
            <TextField
              type='date'
              label='Từ ngày'
              InputLabelProps={{ shrink: true }}
              value={startDate || ''}
              onChange={(e) => setStartDate(e.target.value)}
              size='small'
            />
            <TextField
              type='date'
              label='Đến ngày'
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              size='small'
            />
          </Box>
        )}

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
