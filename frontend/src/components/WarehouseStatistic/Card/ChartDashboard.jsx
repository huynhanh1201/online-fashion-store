// import React, { useMemo } from 'react'
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip as RechartsTooltip,
//   CartesianGrid,
//   ResponsiveContainer,
//   Legend
// } from 'recharts'
// import { Paper, Typography, Grid } from '@mui/material'
// import Tooltip from '../Content/Tooltip/Tooltip'
// export default function ChartDashboard({ data }) {
//   const year = new Date().getFullYear()
//   const monthlySummary = useMemo(() => {
//     if (!Array.isArray(data)) return []
//
//     const months = Array.from({ length: 12 }, (_, i) => {
//       const m = i + 1 // tháng từ 1 đến 12
//       const monthStr = m < 10 ? `0${m}` : `${m}`
//       return {
//         monthIndex: i, // ← giá trị duy nhất để XAxis nhận dạng
//         name: `T${m}/${year}`,
//         key: `${year}-${monthStr}`,
//         Nhập: 0,
//         Xuất: 0,
//         'Chênh lệch': 0
//       }
//     })
//
//     data.forEach((warehouse) => {
//       warehouse.data?.forEach(({ month, inAmount, outAmount }) => {
//         const index = months.findIndex((m) => m.key === month)
//         if (index !== -1) {
//           months[index].Nhập += inAmount || 0
//           months[index].Xuất += Math.abs(outAmount || 0)
//         }
//       })
//     })
//
//     return months.map((m) => ({
//       ...m,
//       'Chênh lệch': m.Nhập - m.Xuất
//     }))
//   }, [data, year])
//
//   return (
//     <Grid container spacing={2}>
//       <Grid item size={12}>
//         <Paper sx={{ p: 2 }}>
//           <Typography variant='h6' gutterBottom>
//             So Sánh Nhập Xuất Kho Theo Tháng (T1 - T12/2024)
//           </Typography>
//           <ResponsiveContainer width='100%' height={400}>
//             <BarChart data={monthlySummary}>
//               <CartesianGrid strokeDasharray='3 3' />
//               <XAxis
//                 dataKey='monthIndex'
//                 tickFormatter={(index) => monthlySummary[index]?.name}
//                 interval={0}
//               />
//
//               <YAxis
//                 tickFormatter={(value) => {
//                   if (value >= 100000) return `${Math.round(value / 1000)}N`
//                   return value
//                 }}
//               />
//               <RechartsTooltip content={<Tooltip />} />
//               <Legend />
//               <Bar dataKey='Xuất' fill='#F44336' barSize={25} />
//               <Bar dataKey='Nhập' fill='#4CAF50' barSize={25} />
//               <Bar dataKey='Chênh lệch' fill='#2196F3' barSize={20} />
//             </BarChart>
//           </ResponsiveContainer>
//         </Paper>
//       </Grid>
//     </Grid>
//   )
// }

// components/WarehouseStatistic/Card/ChartDashboard.jsx
import React, { useMemo, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from 'recharts'
import {
  Paper,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material'
import Tooltip from '../Content/Tooltip/Tooltip'

export default function ChartDashboard({ data, year, onYearChange }) {
  const [selectedYear, setSelectedYear] = useState(year)

  const handleChange = (event) => {
    const newYear = event.target.value
    setSelectedYear(newYear)
    onYearChange?.(newYear)
  }

  const yearOptions = []
  for (let y = new Date().getFullYear(); y >= 2020; y--) {
    yearOptions.push(y)
  }

  const monthlySummary = useMemo(() => {
    if (!Array.isArray(data)) return []

    const months = Array.from({ length: 12 }, (_, i) => {
      const m = i + 1
      const monthStr = m < 10 ? `0${m}` : `${m}`
      return {
        monthIndex: i,
        name: `T${m}/${selectedYear}`,
        key: `${selectedYear}-${monthStr}`,
        Nhập: 0,
        Xuất: 0,
        'Chênh lệch': 0
      }
    })

    data.forEach((warehouse) => {
      warehouse.data?.forEach(({ month, inAmount, outAmount }) => {
        const index = months.findIndex((m) => m.key === month)
        if (index !== -1) {
          months[index].Nhập += inAmount || 0
          months[index].Xuất += Math.abs(outAmount || 0)
        }
      })
    })

    return months.map((m) => ({
      ...m,
      'Chênh lệch': m.Nhập - m.Xuất
    }))
  }, [data, selectedYear])

  return (
    <Grid container spacing={2}>
      <Grid item size={12}>
        <Paper sx={{ p: 2 }}>
          <Grid container justifyContent='space-between' alignItems='center'>
            <Typography variant='h6'>
              So Sánh Nhập Xuất Kho Theo Tháng (T1 - T12/{selectedYear})
            </Typography>
            <FormControl size='small' sx={{ minWidth: 120 }}>
              <InputLabel>Năm</InputLabel>
              <Select value={selectedYear} label='Năm' onChange={handleChange}>
                {Array.from(
                  { length: new Date().getFullYear() - 2020 + 1 },
                  (_, i) => {
                    const yearOption = 2025 - i
                    return (
                      <MenuItem key={yearOption} value={yearOption}>
                        {yearOption}
                      </MenuItem>
                    )
                  }
                )}
              </Select>
            </FormControl>
          </Grid>

          <ResponsiveContainer width='100%' height={400}>
            <BarChart data={monthlySummary}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='monthIndex'
                tickFormatter={(index) => monthlySummary[index]?.name}
                interval={0}
              />
              <YAxis
                tickFormatter={(value) =>
                  value >= 100000 ? `${Math.round(value / 1000)}N` : value
                }
              />
              <RechartsTooltip content={<Tooltip />} />
              <Legend />
              <Bar dataKey='Xuất' fill='#F44336' barSize={25} />
              <Bar dataKey='Nhập' fill='#4CAF50' barSize={25} />
              <Bar dataKey='Chênh lệch' fill='#2196F3' barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  )
}
