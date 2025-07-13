import React from 'react'
import { Box, Stack, Typography, Select, MenuItem } from '@mui/material'
import { Line } from 'react-chartjs-2'

export default function ProfitChartByMonth({ chartData, year, setYear }) {
  const monthlyLabels = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`)
  const monthlyStats = chartData?.monthlyStats || []

  // Lấy dữ liệu lợi nhuận từ chartData
  const revenueData = monthlyLabels.map((_, i) => {
    const stat = monthlyStats.find((m) => Number(m.month) === i + 1)
    return stat?.revenue || 0
  })

  // Tạo cấu trúc dữ liệu cho biểu đồ
  const lineProfitChart = {
    labels: monthlyLabels,
    datasets: [
      {
        label: `Lợi nhuận (${year})`,
        data: revenueData,
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  return (
    <div className='line-chart'>
      <Box
        sx={{
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          p: 2,
          boxShadow: 1,
          mt: 3,
          overflowX: 'auto'
        }}
      >
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          mb={2}
        >
          <Typography variant='h5' fontWeight='bold'>
            Lợi nhuận theo tháng
          </Typography>
          <Select
            size='small'
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            {Array.from({ length: 5 }).map((_, i) => {
              const yearOption = new Date().getFullYear() - (4 - i)
              return (
                <MenuItem key={yearOption} value={yearOption.toString()}>
                  {yearOption}
                </MenuItem>
              )
            })}
          </Select>
        </Stack>

        <Box sx={{ height: 500, width: '100%', position: 'relative' }}>
          <Line
            data={lineProfitChart}
            options={{
              responsive: true,
              maintainAspectRatio: false
            }}
          />
        </Box>
      </Box>
    </div>
  )
}
