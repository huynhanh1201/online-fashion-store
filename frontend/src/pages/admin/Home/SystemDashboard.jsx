import React from 'react'
import { Typography, Grid, Box, Stack } from '@mui/material'
import InventoryIcon from '@mui/icons-material/Inventory'
import CategoryIcon from '@mui/icons-material/Category'
import LayersIcon from '@mui/icons-material/Layers'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import GroupIcon from '@mui/icons-material/Group'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import { Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
)

export default function SystemDashboard({ stats, loading }) {
  const { accountStatistics, productStatistics, orderStatistics } = stats || {}

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
      value: accountStatistics?.summary?.totalUsers || 0,
      icon: <GroupIcon color='primary' fontSize='large' />,
      color: '#64B5F6'
    }
  ]

  const barChartData = {
    labels: summaryItems.map((item) => item.label),
    datasets: [
      {
        label: 'Số lượng',
        data: summaryItems.map((item) => item.value),
        backgroundColor: summaryItems.map((item) => item.color)
      }
    ]
  }

  // Use the chartData directly from accountStatistics
  const accountPieChartData = accountStatistics.chartData

  const productOrderPieChartData = {
    labels: [
      'Tổng sản phẩm',
      'Tổng danh mục',
      'Tổng biến thể',
      'Tổng đơn hàng',
      'Tổng số lượt dùng mã giảm giá'
    ],
    datasets: [
      {
        data: [
          productStatistics?.productsTotal || 0,
          productStatistics?.categoriesTotal || 0,
          productStatistics?.variantsTotal || 0,
          orderStatistics?.orderStats?.totalOrders || 0,
          orderStatistics?.couponStats?.totalCouponsUsage || 0
        ],
        backgroundColor: [
          '#4FC3F7', // Xanh dương nhạt
          '#81C784', // Xanh lá nhạt
          '#FFD54F', // Vàng nhạt
          '#BA68C8', // Tím nhạt
          '#FF8A65' // Cam nhạt
        ]
      }
    ]
  }

  if (loading) {
    return (
      <Grid container spacing={2}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                height: '150px',
                backgroundColor: '#f5f5f5',
                borderRadius: 2
              }}
            >
              <Typography variant='h6' color='text.secondary'>
                Đang tải dữ liệu...
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    )
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
      <Grid container spacing={2}>
        {summaryItems.map((item, index) => (
          <Grid item size={4} xs={12} sm={6} md={4} lg={3} key={index}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                height: '150px',
                borderLeft: `10px solid ${item.color}`,
                backgroundColor: '#f5f5f5',
                borderRadius: 2
              }}
            >
              <Stack>
                <Typography variant='subtitle1' color='text.secondary'>
                  {item.label}
                </Typography>
                <Typography
                  variant='h6'
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
      <Box mt={4}>
        <Typography variant='h6' mb={2}>
          Biểu đồ cột
        </Typography>
        <Bar data={barChartData} options={{ responsive: true }} />
      </Box>
      <Grid container spacing={2} mt={4}>
        <Grid item size={6} xs={12} md={6}>
          <Box sx={{ width: 500, height: 550 }}>
            <Typography variant='h6' mb={2}>
              Biểu đồ tròn - Tài khoản
            </Typography>
            <Pie data={accountPieChartData} options={{ responsive: true }} />
          </Box>
        </Grid>
        <Grid item size={6} xs={12} md={6}>
          <Box sx={{ width: 500, height: 550 }}>
            <Typography variant='h6' mb={2}>
              Biểu đồ tròn - Kho, Sản phẩm, Đơn hàng
            </Typography>
            <Pie
              data={productOrderPieChartData}
              options={{ responsive: true }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
