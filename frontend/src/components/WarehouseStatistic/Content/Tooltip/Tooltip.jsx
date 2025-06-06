import React from 'react'
import { Typography } from '@mui/material'

const Tooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{ background: '#fff', border: '1px solid #ccc', padding: 10 }}
      >
        <Typography fontWeight='bold'>{`Tháng ${label}`}</Typography>
        {payload.map((entry, index) => (
          <Typography key={index} sx={{ color: entry.fill }}>
            {`${entry.name}: ${entry.value.toLocaleString('vi-VN')}`}
          </Typography>
        ))}
      </div>
    )
  }
  return null
}

export default Tooltip
