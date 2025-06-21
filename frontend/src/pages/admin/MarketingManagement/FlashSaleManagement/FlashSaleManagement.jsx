import React, { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Card,
  CardContent,
  Grid,
  useTheme,
  alpha,
  Tooltip,
  Stack
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalOffer as OfferIcon,
  Schedule as ScheduleIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'
import AddFlashSale from './Modal/AddFlashSale.jsx'

const FlashSaleManagement = () => {
  const theme = useTheme()

  const [flashSales, setFlashSales] = useState([
    {
      id: 'fs001',
      productName: 'Áo thun nam trắng',
      originalPrice: 250000,
      flashPrice: 99000,
      stock: 100,
      startTime: '2025-06-25T09:00:00',
      endTime: '2025-06-25T11:00:00',
      status: 'Đã lên lịch'
    },
    {
      id: 'fs002',
      productName: 'Giày sneaker nữ',
      originalPrice: 450000,
      flashPrice: 199000,
      stock: 50,
      startTime: '2025-07-01T12:00:00',
      endTime: '2025-07-01T14:00:00',
      status: 'Sắp diễn ra'
    }
  ])

  const [openAddModal, setOpenAddModal] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const formatTime = (isoString) => new Date(isoString).toLocaleString('vi-VN')

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đã lên lịch':
        return 'info'
      case 'Sắp diễn ra':
        return 'warning'
      case 'Đang diễn ra':
        return 'success'
      case 'Đã kết thúc':
        return 'default'
      case 'Chưa thiết lập':
        return 'error'
      default:
        return 'default'
    }
  }

  const calculateDiscount = (originalPrice, flashPrice) => {
    return Math.round(((originalPrice - flashPrice) / originalPrice) * 100)
  }

  const handleAddFlashSale = (newItem) => {
    setFlashSales((prev) => [
      ...prev,
      {
        id: `fs${Date.now()}`,
        productName: `SP-${newItem.productId}`,
        originalPrice: newItem.originalPrice,
        flashPrice: newItem.flashPrice,
        stock: 0,
        startTime: '',
        endTime: '',
        status: 'Chưa thiết lập'
      }
    ])
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }

  const summaryData = [
    {
      title: 'Tổng Flash Sale',
      value: flashSales.length,
      icon: <OfferIcon />,
      color: '#1976d2'
    },
    {
      title: 'Đang hoạt động',
      value: flashSales.filter((item) => item.status === 'Đang diễn ra').length,
      icon: <TrendingUpIcon />,
      color: '#2e7d32'
    },
    {
      title: 'Sắp diễn ra',
      value: flashSales.filter((item) => item.status === 'Sắp diễn ra').length,
      icon: <ScheduleIcon />,
      color: '#ed6c02'
    },
    {
      title: 'Tổng sản phẩm',
      value: flashSales.reduce((sum, item) => sum + item.stock, 0),
      icon: <InventoryIcon />,
      color: '#9c27b0'
    }
  ]

  return (
    <Box sx={{ p: 3, backgroundColor: '#f8fafc',borderRadius: 3, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant='h4'
          sx={{
            fontWeight: 700,
            color: '#1e293b',
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <OfferIcon sx={{ fontSize: 40, color: '#1A3C7B' }} />
          Quản lý trương trình khuyến mãi
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Quản lý và theo dõi các chương trình khuyến mãi
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryData.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${item.color}15 0%, ${item.color}25 100%)`,
                border: `1px solid ${item.color}30`,
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 32px ${item.color}30`
                }
              }}
            >
              <CardContent>
                <Stack
                  direction='row'
                  alignItems='center'
                  justifyContent='space-between'
                >
                  <Box>
                    <Typography
                      variant='h4'
                      sx={{ fontWeight: 700, color: item.color }}
                    >
                      {item.value}
                    </Typography>
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      sx={{ mt: 0.5 }}
                    >
                      {item.title}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: `${item.color}20`,
                      color: item.color
                    }}
                  >
                    {item.icon}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={() => setOpenAddModal(true)}
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            background: 'linear-gradient(135deg,rgb(17, 58, 122) 0%,rgb(11, 49, 156) 100%)',
            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
              transform: 'translateY(-1px)'
            }
          }}
        >
          Thêm Flash Sale mới
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={refreshing}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          {refreshing ? 'Đang tải...' : 'Làm mới'}
        </Button>
      </Box>

      <AddFlashSale
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSubmit={handleAddFlashSale}
      />

      {/* Table */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0'
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2 }}>
                  Sản phẩm
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2 }}>
                  Giá gốc
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2 }}>
                  Giá Flash
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2 }}>
                  Giảm giá
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2 }}>
                  Số lượng
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2 }}>
                  Thời gian
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2 }}>
                  Trạng thái
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2 }}>
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {flashSales.map((item, index) => (
                <TableRow
                  key={item.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.04)
                    },
                    '&:last-child td, &:last-child th': { border: 0 }
                  }}
                >
                  <TableCell sx={{ py: 2 }}>
                    <Typography
                      variant='body1'
                      sx={{ fontWeight: 600, color: '#1e293b' }}
                    >
                      {item.productName}
                    </Typography>
                    <Typography variant='caption' color='text.secondary'>
                      ID: {item.id}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Typography
                      variant='body1'
                      sx={{ color: '#64748b', textDecoration: 'line-through' }}
                    >
                      {item.originalPrice.toLocaleString()}đ
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Typography
                      variant='body1'
                      sx={{
                        fontWeight: 700,
                        color: '#dc2626',
                        fontSize: '1.1rem'
                      }}
                    >
                      {item.flashPrice.toLocaleString()}đ
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Chip
                      label={`-${calculateDiscount(item.originalPrice, item.flashPrice)}%`}
                      size='small'
                      sx={{
                        backgroundColor: '#fef2f2',
                        color: '#dc2626',
                        fontWeight: 600,
                        border: '1px solid #fecaca'
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <InventoryIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                      <Typography variant='body2' sx={{ fontWeight: 600 }}>
                        {item.stock}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    {item.startTime && item.endTime ? (
                      <Box>
                        <Typography
                          variant='caption'
                          sx={{ display: 'block', color: '#059669' }}
                        >
                          Bắt đầu: {formatTime(item.startTime)}
                        </Typography>
                        <Typography
                          variant='caption'
                          sx={{ display: 'block', color: '#dc2626' }}
                        >
                          Kết thúc: {formatTime(item.endTime)}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant='body2' color='text.secondary'>
                        ---
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Chip
                      label={item.status}
                      color={getStatusColor(item.status)}
                      size='small'
                      sx={{
                        fontWeight: 600,
                        borderRadius: 2
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Stack direction='row' spacing={1}>
                      <Tooltip title='Chỉnh sửa'>
                        <IconButton
                          size='small'
                          sx={{
                            color: '#3b82f6',
                            '&:hover': { backgroundColor: '#dbeafe' }
                          }}
                        >
                          <EditIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Xóa'>
                        <IconButton
                          size='small'
                          sx={{
                            color: '#ef4444',
                            '&:hover': { backgroundColor: '#fee2e2' }
                          }}
                        >
                          <DeleteIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  )
}

export default FlashSaleManagement
