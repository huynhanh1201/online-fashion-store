import React from 'react'
import { Typography } from '@mui/material'

const Tooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // Tìm giá trị Nhập và Xuất từ payload
    const nhap = payload.find((p) => p.name === 'Nhập')?.value || 0
    const xuat = payload.find((p) => p.name === 'Xuất')?.value || 0
    const chenhLech = nhap - xuat

    return (
      <div
        style={{ background: '#fff', border: '1px solid #ccc', padding: 10 }}
      >
        <Typography fontWeight='bold'>{`Tháng ${label + 1}`}</Typography>
        {payload.map((entry, index) => (
          <Typography key={index} sx={{ color: entry.fill }}>
            {`${entry.name}: ${entry.value.toLocaleString('vi-VN')}`}
          </Typography>
        ))}

        <Typography fontWeight='400' color='#FFB74D'>
          Tổng: {chenhLech.toLocaleString('vi-VN')}
        </Typography>
      </div>
    )
  }
  return null
}

export default Tooltip
