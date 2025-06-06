import React, { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { Paper, Typography, Grid } from '@mui/material'

export default function ChartDashboard({ data }) {
  // Gộp tổng in/out của toàn bộ kho
  const summarizedData = useMemo(() => {
    if (!Array.isArray(data)) return []

    const totalIn = data.reduce((sum, w) => sum + (w.inAmount || 0), 0)
    const totalOut = data.reduce(
      (sum, w) => sum + Math.abs(w.outAmount || 0),
      0
    )

    return [
      {
        name: 'Tất cả kho',
        Nhập: totalIn,
        Xuất: totalOut
      }
    ]
  }, [data])

  return (
    <Grid container spacing={2}>
      <Grid item size={12} md={6}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant='h6' gutterBottom>
            Tổng Nhập / Xuất Tất Cả Kho
          </Typography>
          <ResponsiveContainer width='100%' height={300}>
            <BarChart data={summarizedData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey='Nhập' fill='#3f51b5' barSize={40} />
              <Bar dataKey='Xuất' fill='#fb8c00' barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  )
}
