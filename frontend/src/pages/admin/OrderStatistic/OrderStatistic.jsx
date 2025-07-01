import React from 'react'
import { Box, Grid, Typography, Stack } from '@mui/material'
import { Pie } from 'react-chartjs-2'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import DiscountIcon from '@mui/icons-material/Discount'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import TaskIcon from '@mui/icons-material/Task'
import EventBusyIcon from '@mui/icons-material/EventBusy'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
)
import { MenuItem, Select } from '@mui/material'
const OrderStatistic = ({ stats = {}, financeStatistics, year, setYear }) => {
  const {
    orderStats: {
      totalOrders = 0,
      totalRevenue = 0,
      totalShipping = 0,
      totalDiscountAmount = 0
    } = {},
    couponStats: {
      totalCoupons = 0,
      totalCouponsUsage = 0,
      totalUsedUpCoupons = 0
    } = {},
    paymentMethodStats = [],
    statusOrdersStats = []
  } = stats

  const monthlyStats = financeStatistics?.revenueChart?.monthlyStats || []
  const monthlyLabels = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`)
  const monthlyProfitData = Array(12).fill(0)
  monthlyStats.forEach((stat) => {
    monthlyProfitData[stat.month - 1] = stat.revenue || 0
  })

  const selectedYear = year || '2025'

  const lineProfitChart = {
    labels: monthlyLabels,
    datasets: [
      {
        label: `Doanh thu tháng (${selectedYear})`,
        data: monthlyProfitData,
        borderColor: '#42A5F5',
        backgroundColor: 'rgba(66, 165, 245, 0.2)',
        tension: 0.3
      }
    ]
  }

  const statusOrderMap = {
    Pending: 'Đang chờ',
    Processing: 'Đang xử lý',
    Shipping: 'Đang vận chuyển',
    Shipped: 'Đã gửi hàng',
    Delivered: 'Đã giao',
    Cancelled: 'Đã hủy',
    Failed: 'Thất bại'
  }
  const colorOrder = [
    { value: 'Pending', color: '#FBBF24' },
    { value: 'Processing', color: '#60A5FA' },
    { value: 'Shipping', color: '#3B82F6' },
    { value: 'Shipped', color: '#10B981' },
    { value: 'Delivered', color: '#22C55E' },
    { value: 'Cancelled', color: '#EF4444' },
    { value: 'Failed', color: '#B91C1C' }
  ]

  const summaryItems = [
    {
      label: 'Tổng đơn hàng',
      value: totalOrders,
      icon: <ShoppingCartIcon color='primary' fontSize='large' />,
      color: '#4FC3F7'
    },
    {
      label: 'Tổng tiền giảm giá',
      value: totalDiscountAmount.toLocaleString('vi-VN') + '₫',
      icon: <DiscountIcon color='secondary' fontSize='large' />,
      color: '#BA68C8'
    },
    {
      label: 'Tổng phí vận chuyển',
      value: totalShipping.toLocaleString('vi-VN') + '₫',
      icon: <LocalShippingIcon color='warning' fontSize='large' />,
      color: '#FFB74D'
    }
  ]

  const couponItems = [
    {
      label: 'Tổng số lượt dùng mã giảm giá',
      value: totalCoupons,
      icon: <ShowChartIcon color='success' fontSize='large' />,
      color: '#34D399'
    },
    {
      label: 'Số mã đã được sử dụng',
      value: totalCouponsUsage,
      icon: <TaskIcon color='info' fontSize='large' />,
      color: '#60A5FA'
    },
    {
      label: 'Số mã đã sử dụng hết',
      value: totalUsedUpCoupons,
      icon: <EventBusyIcon color='error' fontSize='large' />,
      color: '#EF4444'
    }
  ]

  const profitItems = [
    {
      label: 'Số tiền thu được từ đơn hàng',
      value:
        financeStatistics?.totalRevenue?.toLocaleString('vi-VN') + '₫' || '0₫',
      color: '#4CAF50',
      icon: <MonetizationOnIcon color='success' fontSize='large' />
    },
    {
      label: 'Tổng tiền vốn của các đơn hàng',
      value:
        financeStatistics?.totalCost?.toLocaleString('vi-VN') + '₫' || '0₫',
      color: '#FF9800',
      icon: <AccountBalanceWalletIcon color='warning' fontSize='large' />
    },
    {
      label: 'Lợi nhuận tổng các đơn hàng',
      value:
        financeStatistics?.totalProfit?.toLocaleString('vi-VN') + '₫' || '0₫',
      color: '#F44336',
      icon: <TrendingUpIcon color='error' fontSize='large' />
    }
  ]

  const statusColorMap = Object.fromEntries(
    colorOrder.map(({ value, color }) => [value, color])
  )

  const piePaymentChart = {
    labels: paymentMethodStats.map((item) =>
      item.paymentMethod === 'vnpay' ? 'VNPay' : item.paymentMethod
    ),
    datasets: [
      {
        data: paymentMethodStats.map((item) => item.count),
        backgroundColor: ['#34D399', '#60A5FA']
      }
    ],
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => {
              // const label = context.label || ''
              const value = context.raw || 0
              return `Số lượng ${value}`
              // return `${label}: Số lượng ${value}`
            }
          }
        }
      }
    }
  }

  const pieStatusChart = {
    labels: statusOrdersStats.map(
      (item) => statusOrderMap[item.statusOrder] || item.statusOrder
    ),
    datasets: [
      {
        data: statusOrdersStats.map((item) => item.count),
        backgroundColor: statusOrdersStats.map(
          (item) => statusColorMap[item.statusOrder] || '#9CA3AF'
        )
      }
    ],
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => {
              // const label = context.label || ''
              const value = context.raw || 0
              return `Số lượng ${value}`
              // return `${label}: Số lượng ${value}`
            }
          }
        }
      }
    }
  }
  return (
    <div className='order-statistic-wrapper'>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Tổng quan đơn hàng */}
        <div className='order-summary'>
          <Box
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              p: 2,
              boxShadow: 1
            }}
          >
            <Typography variant='h5' fontWeight='bold' mb={2}>
              Thống kê đơn hàng
            </Typography>
            <Grid container spacing={2}>
              {summaryItems.map((item, index) => (
                <Grid item size={4} xs={12} sm={6} md={4} key={index}>
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
                      <Typography
                        variant='h5'
                        color='text.secondary'
                        sx={{ mb: 1 }}
                      >
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
          </Box>
        </div>

        {/* Mã giảm giá */}
        <div className='coupon-summary'>
          <Box
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              p: 2,
              boxShadow: 1
            }}
          >
            <Typography variant='h5' fontWeight='bold' mb={1}>
              Thống kê mã giảm giá
            </Typography>
            <Grid container spacing={2}>
              {couponItems.map((item, index) => (
                <Grid item size={4} xs={12} sm={6} md={4} key={index}>
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
                      <Typography
                        variant='h5'
                        color='text.secondary'
                        sx={{ mb: 1 }}
                      >
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
          </Box>
        </div>

        {/* Tổng quan tài chính */}
        <div className='finance-summary'>
          <Box
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              p: 2,
              boxShadow: 1
            }}
          >
            <Typography variant='h5' fontWeight='bold' mb={2}>
              Thống kê tài chính
            </Typography>
            <Grid container spacing={2}>
              {profitItems.map((item, index) => (
                <Grid item size={4} xs={12} sm={6} md={4} key={index}>
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
                      <Typography
                        variant='h5'
                        color='text.secondary'
                        sx={{ mb: 1 }}
                      >
                        {item.label}
                      </Typography>
                      <Typography
                        variant='h5'
                        fontWeight='bold'
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        {item.icon} {item.value}
                      </Typography>
                    </Stack>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </div>

        {/* Biểu đồ lợi nhuận theo tháng */}
        <div className='line-chart'>
          <Box
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              p: 2,
              boxShadow: 1,
              mt: 3
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
        </div>

        {/* Biểu đồ thanh toán và trạng thái */}
        <div className='charts'>
          <Box>
            <Grid container spacing={2}>
              <Grid item size={6} xs={12} md={6}>
                <Box
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    p: 2,
                    boxShadow: 1
                  }}
                >
                  <Typography variant='h5' fontWeight='bold' mb={1}>
                    Phương thức thanh toán
                  </Typography>
                  <Box sx={{ maxWidth: 500, margin: '0 auto' }}>
                    <Pie
                      data={piePaymentChart}
                      options={piePaymentChart.options}
                    />
                  </Box>
                </Box>
              </Grid>

              <Grid item size={6} xs={12} md={6}>
                <Box
                  sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    p: 2,
                    boxShadow: 1
                  }}
                >
                  <Typography variant='h5' fontWeight='bold' mb={1}>
                    Trạng thái đơn hàng
                  </Typography>
                  <Box sx={{ maxWidth: 500, margin: '0 auto' }}>
                    <Pie
                      data={pieStatusChart}
                      options={pieStatusChart.options}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </div>
      </Box>
    </div>
  )
}

export default OrderStatistic
