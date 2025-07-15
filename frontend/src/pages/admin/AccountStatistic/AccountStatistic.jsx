import React from 'react'
import { Box, Grid, Typography, Stack } from '@mui/material'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js'
import PeopleIcon from '@mui/icons-material/People'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import PersonIcon from '@mui/icons-material/Person'

ChartJS.register(ArcElement, Tooltip, Legend, Title)

const styles = {
  header: {
    borderBottom: '1px solid #ccc',
    mb: 0.5,
    pb: 0.5
  },
  BoxCard: {
    border: '1px solid #ccc',
    p: 2,
    borderRadius: 2,
    gap: 1,
    display: 'flex',
    flexDirection: 'column'
  }
}
const AccountStatistics = ({ statistics = [] }) => {
  const { summary, chartData } = statistics

  const summaryItems = [
    {
      label: 'Tổng số tài khoản',
      value: summary.totalUsers,
      icon: <PeopleIcon color='primary' fontSize='large' />,
      color: '#4FC3F7'
    },
    {
      label: 'Tổng tài khoản hệ thống',
      value: summary.totalAdmins,
      icon: <AdminPanelSettingsIcon color='success' fontSize='large' />,
      color: '#81C784'
    },
    {
      label: 'Tổng tài khoản khách hàng',
      value: summary.totalCustomers,
      icon: <PersonIcon color='warning' fontSize='large' />,
      color: '#FFB74D'
    }
  ]

  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.raw} tài khoản`
        }
      },
      legend: {
        position: 'top'
      }
    }
  }

  return (
    <div
      className='tab-content'
      style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
    >
      <Box sx={styles.BoxCard}>
        <Typography
          variant='h5'
          gutterBottom
          fontWeight='700'
          sx={styles.header}
        >
          Thống kê tài khoản
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

      <Box sx={{ ...styles.BoxCard }}>
        <Typography
          variant='h5'
          gutterBottom
          fontWeight='700'
          sx={styles.header}
        >
          Phân bố tài khoản theo vai trò
        </Typography>
        <Box
          mt={5}
          sx={{
            maxHeight: 450
          }}
        >
          {chartData?.datasets?.[0]?.data?.some((val) => val > 0) ? (
            <Pie data={chartData} options={chartOptions} />
          ) : (
            <Typography variant='h6' color='text.secondary'>
              Không có dữ liệu
            </Typography>
          )}
        </Box>
      </Box>
    </div>
  )
}

export default AccountStatistics
