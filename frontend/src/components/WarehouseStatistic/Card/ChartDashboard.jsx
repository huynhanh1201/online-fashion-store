import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { Box, Grid, Typography, Paper } from '@mui/material'

// Dữ liệu mẫu cho biểu đồ Line
const inventoryTrendData = [
  { date: '1/6', in: 420, out: 190 },
  { date: '2/6', in: 300, out: 470 }
]

// Dữ liệu mẫu cho biểu đồ Pie
const variantStatusData = [
  { name: 'Đang bán', value: 60, color: '#4caf50' },
  { name: 'Tạm dừng', value: 25, color: '#fbc02d' },
  { name: 'Ngừng bán', value: 15, color: '#e57373' }
]

export default function ChartDashboard() {
  return (
    <Grid container spacing={2}>
      {/* Biểu đồ biến động tồn kho */}
      <Grid item size={6} xs={12} md={6}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant='h6' gutterBottom>
            Biến động tồn kho
          </Typography>
          <ResponsiveContainer width='100%' height={250}>
            <LineChart data={inventoryTrendData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='date' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type='monotone'
                dataKey='in'
                stroke='#81c784'
                name='in'
                dot={{ r: 5 }}
              />
              <Line
                type='monotone'
                dataKey='out'
                stroke='#ef5350'
                name='out'
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      {/* Biểu đồ trạng thái biến thể */}
      <Grid item size={6} xs={12} md={6}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant='h6' gutterBottom>
            Trạng thái biến thể
          </Typography>
          <ResponsiveContainer width='100%' height={250}>
            <PieChart>
              <Pie
                data={variantStatusData}
                dataKey='value'
                nameKey='name'
                outerRadius={80}
                label
              >
                {variantStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  )
}
