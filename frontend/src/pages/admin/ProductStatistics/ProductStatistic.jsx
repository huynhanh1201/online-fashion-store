import React, { useState } from 'react'
import { Box, Grid, Typography, IconButton, Stack } from '@mui/material'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title
} from 'chart.js'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import InventoryIcon from '@mui/icons-material/Inventory'
import CategoryIcon from '@mui/icons-material/Category'
import LayersIcon from '@mui/icons-material/Layers'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Title)

const ITEMS_PER_PAGE = 10

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

const ProductStatistics = ({ stats }) => {
  const [currentPage, setCurrentPage] = useState(0)

  const productCountByCategory = stats.productCountByCategory || []
  const totalPages = Math.ceil(productCountByCategory.length / ITEMS_PER_PAGE)

  const paginatedData = productCountByCategory.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  )

  const chartData = {
    labels: paginatedData.map((item) => item.categoryName),
    datasets: [
      {
        label: 'Số lượng sản phẩm',
        data: paginatedData.map((item) => item.count),
        backgroundColor: 'var(--primary-color)'
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y} sản phẩm`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Số lượng sản phẩm' }
      },
      x: {
        title: { display: true, text: 'Danh mục' }
      }
    }
  }

  const summaryItems = [
    {
      label: 'Tổng sản phẩm',
      value: stats.productsTotal,
      icon: <InventoryIcon color='primary' fontSize='large' />,
      color: '#4FC3F7'
    },
    {
      label: 'Tổng danh mục',
      value: stats.categoriesTotal,
      icon: <CategoryIcon color='success' fontSize='large' />,
      color: '#81C784'
    },
    {
      label: 'Tổng biến thể',
      value: stats.variantsTotal,
      icon: <LayersIcon color='warning' fontSize='large' />,
      color: '#FFB74D'
    }
  ]

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
          Thống kê sản phẩm
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
                  height: '150px',
                  borderLeft: `10px solid ${item.color}`,
                  backgroundColor: 'var(--surface-color)',
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
      </Box>

      <Box sx={styles.BoxCard}>
        <Typography
          variant='h5'
          gutterBottom
          fontWeight='700'
          sx={styles.header}
        >
          Phân bố sản phẩm theo danh mục
        </Typography>
        <Box mt={5} position='relative'>
          <Bar data={chartData} options={chartOptions} />
          {totalPages > 1 && (
            <Box
              display='flex'
              justifyContent='center'
              alignItems='center'
              mt={2}
            >
              <IconButton
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
              <Typography variant='body2' mx={2}>
                Trang {currentPage + 1} / {totalPages}
              </Typography>
              <IconButton
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
                }
                disabled={currentPage === totalPages - 1}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  )
}

export default ProductStatistics
