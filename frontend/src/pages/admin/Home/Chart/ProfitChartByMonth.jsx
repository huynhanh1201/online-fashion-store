import React from 'react'
import {
  Box,
  Stack,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material'
import { Line } from 'react-chartjs-2'

export default function ProfitChartByMonth({ chartData, year, setYear }) {
  const monthlyLabels = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`)
  const monthlyStats = chartData?.monthlyStats || []

  const revenueData = monthlyLabels.map((_, i) => {
    const stat = monthlyStats.find((m) => Number(m.month) === i + 1)
    return stat?.revenue || 0
  })
  console.log(revenueData)
  const lineChartData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: `Tổng lợi nhuận theo tháng (${year})`,
        data: revenueData,
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  return (
    <Box mt={4}>
      <Stack
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        mb={2}
      >
        <Typography variant='h6'>Biểu đồ lợi nhuận theo tháng</Typography>
        <FormControl size='small'>
          <InputLabel>Năm</InputLabel>
          <Select
            value={year}
            label='Năm'
            onChange={(e) => setYear(e.target.value)}
          >
            {Array.from({ length: 5 }).map((_, i) => {
              const currentYear = new Date().getFullYear()
              const yearOption = currentYear - i
              return (
                <MenuItem key={yearOption} value={yearOption.toString()}>
                  {yearOption}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>
      </Stack>
      <Box sx={{ height: 500 }}>
        <Line
          data={lineChartData}
          options={{
            responsive: true,
            maintainAspectRatio: false
          }}
        />
      </Box>
    </Box>
  )
}
