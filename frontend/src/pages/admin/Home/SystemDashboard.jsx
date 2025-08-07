import React, { useState } from 'react'
import {
  Typography,
  Grid,
  Box,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material'
import InventoryIcon from '@mui/icons-material/Inventory'
import CategoryIcon from '@mui/icons-material/Category'
import LayersIcon from '@mui/icons-material/Layers'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import GroupIcon from '@mui/icons-material/Group'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
)

export default function SystemDashboard({
  financeStatistics,
  accountStatistics,
  productStatistics,
  loading,
  orderStatistics,
  year,
  setYear
}) {
  const summaryItems = [
    {
      label: 'Tổng sản phẩm',
      value: productStatistics?.productsTotal || 0,
      icon: <InventoryIcon color='primary' fontSize='large' />,
      color: '#4FC3F7'
    },
    {
      label: 'Tổng danh mục',
      value: productStatistics?.categoriesTotal || 0,
      icon: <CategoryIcon color='success' fontSize='large' />,
      color: '#81C784'
    },
    {
      label: 'Tổng biến thể',
      value: productStatistics?.variantsTotal || 0,
      icon: <LayersIcon color='warning' fontSize='large' />,
      color: '#FFB74D'
    },
    {
      label: 'Tổng đơn hàng',
      value: orderStatistics?.orderStats?.totalOrders || 0,
      icon: <LocalShippingIcon color='warning' fontSize='large' />,
      color: '#FFB74D'
    },
    {
      label: 'Tổng số lượt dùng mã giảm giá',
      value: orderStatistics?.couponStats?.totalCouponsUsage || 0,
      icon: <ShowChartIcon color='success' fontSize='large' />,
      color: '#34D399'
    },
    {
      label: 'Tổng người dùng',
      value: accountStatistics?.reduce((acc, curr) => acc + curr.count, 0) || 0,
      icon: <GroupIcon color='primary' fontSize='large' />,
      color: '#64B5F6'
    },
    {
      label: 'Số tiền thu được từ đơn hàng',
      value:
        financeStatistics?.totalRevenue?.toLocaleString('vi-VN') + '₫' || '0₫',
      icon: <AttachMoneyIcon color='success' fontSize='large' />,
      color: '#4CAF50'
    },
    {
      label: 'Tổng tiền vốn của các đơn hàng',
      value:
        financeStatistics?.totalCost?.toLocaleString('vi-VN') + '₫' || '0₫',
      icon: <AccountBalanceWalletIcon color='warning' fontSize='large' />,
      color: '#FF9800'
    },
    {
      label: 'Lợi nhuận tổng các đơn hàng',
      value:
        financeStatistics?.totalProfit?.toLocaleString('vi-VN') + '₫' || '0₫',
      icon: <TrendingUpIcon color='error' fontSize='large' />,
      color: '#F44336'
    }
  ]
  const monthlyLabels = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`)
  const monthlyStats = financeStatistics?.revenueChart?.monthlyStats || []

  const revenueData = monthlyLabels.map((_, i) => {
    const stat = monthlyStats.find((m) => Number(m.month) === i + 1)
    return stat?.revenue || 0
  })

  const lineProfitChart = {
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
    <Box
      sx={{
        p: 2,
        border: '1px solid #ccc',
        borderRadius: 2,
        backgroundColor: '#fafafa'
      }}
    >
      <Typography variant='h5' mb={2} fontWeight='bold'>
        Thống kê tổng quan
      </Typography>

      {/* Thống kê sản phẩm - đơn hàng - người dùng */}
      <Grid container spacing={2}>
        {summaryItems.map((item, index) => (
          <Grid item size={4} xs={12} sm={6} md={4} lg={3} key={index}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                height: '100px',
                borderLeft: `10px solid ${item.color}`,
                backgroundColor: '#f5f5f5',
                borderRadius: 2
              }}
            >
              <Stack>
                <Typography variant='h6' color='text.secondary'>
                  {item.label}
                </Typography>
                <Typography
                  variant='h5'
                  fontWeight='bold'
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  {item.icon}
                  {item.value}
                </Typography>
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>
      {/* Biểu đồ lợi nhuận theo tháng */}
      <Box
        sx={{
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          p: 2,
          boxShadow: 1,
          mt: 4
        }}
      >
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          mb={2}
        >
          <Typography variant='h5' fontWeight='bold'>
            Biểu đồ lợi nhuận theo tháng
          </Typography>
          <Select
            size='small'
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            {Array.from({ length: new Date().getFullYear() - 2020 + 1 }).map(
              (_, i) => {
                const yearOption = 2020 + i
                return (
                  <MenuItem key={yearOption} value={yearOption.toString()}>
                    {yearOption}
                  </MenuItem>
                )
              }
            )}
          </Select>
        </Stack>
        <Box sx={{ height: 500 }}>
          <Line
            data={lineProfitChart}
            options={{
              responsive: true,
              maintainAspectRatio: false
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}
