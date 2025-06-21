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
  Stack,
  LinearProgress,
  Divider
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalOffer as OfferIcon,
  Percent as PercentIcon,
  MonetizationOn as MoneyIcon,
  Schedule as ScheduleIcon,
  ShoppingCart as CartIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  ContentCopy as CopyIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material'

const mockVouchers = [
  {
    id: 'SUMMER20K',
    discountType: 'fixed',
    amount: 20000,
    minOrderValue: 199000,
    startDate: '2025-06-01',
    endDate: '2025-06-10',
    status: 'Đang hoạt động',
    usageCount: 145,
    usageLimit: 1000,
    description: 'Giảm giá mùa hè'
  },
  {
    id: 'BACK2SCHOOL10',
    discountType: 'percent',
    amount: 10,
    minOrderValue: 100000,
    startDate: '2025-07-15',
    endDate: '2025-07-31',
    status: 'Sắp diễn ra',
    usageCount: 0,
    usageLimit: 500,
    description: 'Khuyến mãi tựu trường'
  },
  {
    id: 'NEWUSER50',
    discountType: 'percent',
    amount: 50,
    minOrderValue: 50000,
    startDate: '2025-06-01',
    endDate: '2025-12-31',
    status: 'Đang hoạt động',
    usageCount: 320,
    usageLimit: 2000,
    description: 'Ưu đãi khách hàng mới'
  },
  {
    id: 'FLASH100K',
    discountType: 'fixed',
    amount: 100000,
    minOrderValue: 500000,
    startDate: '2025-05-01',
    endDate: '2025-05-31',
    status: 'Đã kết thúc',
    usageCount: 89,
    usageLimit: 100,
    description: 'Flash sale tháng 5'
  }
]

const PromotionManagement = () => {
  const theme = useTheme()
  const [vouchers, setVouchers] = useState(mockVouchers)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đang hoạt động':
        return 'success'
      case 'Sắp diễn ra':
        return 'warning'
      case 'Đã kết thúc':
        return 'default'
      case 'Đã hủy':
        return 'error'
      default:
        return 'default'
    }
  }

  const getDiscountTypeIcon = (type) => {
    return type === 'fixed' ? <MoneyIcon /> : <PercentIcon />
  }

  const getDiscountTypeColor = (type) => {
    return type === 'fixed' ? '#2e7d32' : '#ed6c02'
  }

  const calculateUsagePercentage = (used, limit) => {
    return limit > 0 ? (used / limit) * 100 : 0
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const summaryData = [
    {
      title: 'Tổng mã giảm giá',
      value: vouchers.length,
      icon: <OfferIcon />,
      color: '#1976d2'
    },
    {
      title: 'Đang hoạt động',
      value: vouchers.filter((v) => v.status === 'Đang hoạt động').length,
      icon: <TrendingUpIcon />,
      color: '#2e7d32'
    },
    {
      title: 'Tổng lượt sử dụng',
      value: vouchers
        .reduce((sum, v) => sum + v.usageCount, 0)
        .toLocaleString(),
      icon: <PeopleIcon />,
      color: '#ed6c02'
    },
    {
      title: 'Tiết kiệm cho KH',
      value:
        vouchers
          .reduce((sum, v) => {
            const savings =
              v.discountType === 'fixed'
                ? v.amount * v.usageCount
                : v.minOrderValue * (v.amount / 100) * v.usageCount
            return sum + savings
          }, 0)
          .toLocaleString() + 'đ',
      icon: <MoneyIcon />,
      color: '#9c27b0'
    }
  ]

  return (
    <Box sx={{ p: 3, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
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
          <OfferIcon sx={{ fontSize: 40, color: '#3b82f6' }} />
          Quản lý Khuyến mãi & Voucher
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Tạo và quản lý các chương trình khuyến mãi, mã giảm giá cho khách hàng
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

      {/* Action Button */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
              transform: 'translateY(-1px)'
            }
          }}
        >
          Tạo mã giảm giá mới
        </Button>
      </Box>

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
                  Mã voucher
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2 }}>
                  Loại & Giá trị
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2 }}>
                  Điều kiện
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2 }}>
                  Thời gian
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2 }}>
                  Sử dụng
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
              {vouchers.map((voucher, index) => {
                const usagePercentage = calculateUsagePercentage(
                  voucher.usageCount,
                  voucher.usageLimit
                )
                const discountColor = getDiscountTypeColor(voucher.discountType)

                return (
                  <TableRow
                    key={voucher.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.04)
                      },
                      '&:last-child td, &:last-child th': { border: 0 }
                    }}
                  >
                    <TableCell sx={{ py: 2 }}>
                      <Stack spacing={1}>
                        <Stack direction='row' spacing={1} alignItems='center'>
                          <Typography
                            variant='body1'
                            sx={{
                              fontWeight: 700,
                              color: '#1e293b',
                              fontFamily: 'monospace',
                              fontSize: '1rem'
                            }}
                          >
                            {voucher.id}
                          </Typography>
                          <Tooltip title='Sao chép mã'>
                            <IconButton
                              size='small'
                              onClick={() => copyToClipboard(voucher.id)}
                              sx={{ color: '#6b7280' }}
                            >
                              <CopyIcon fontSize='small' />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                        <Typography variant='caption' color='text.secondary'>
                          {voucher.description}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell sx={{ py: 2 }}>
                      <Stack direction='row' spacing={1} alignItems='center'>
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: 1,
                            backgroundColor: `${discountColor}20`,
                            color: discountColor
                          }}
                        >
                          {getDiscountTypeIcon(voucher.discountType)}
                        </Box>
                        <Box>
                          <Typography variant='body2' color='text.secondary'>
                            {voucher.discountType === 'fixed'
                              ? 'Giảm tiền'
                              : 'Giảm %'}
                          </Typography>
                          <Typography
                            variant='h6'
                            sx={{ fontWeight: 700, color: discountColor }}
                          >
                            {voucher.discountType === 'fixed'
                              ? `${voucher.amount.toLocaleString()}đ`
                              : `${voucher.amount}%`}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell sx={{ py: 2 }}>
                      <Stack direction='row' spacing={1} alignItems='center'>
                        <CartIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                        <Box>
                          <Typography variant='body2' color='text.secondary'>
                            Đơn tối thiểu
                          </Typography>
                          <Typography variant='body1' sx={{ fontWeight: 600 }}>
                            {voucher.minOrderValue.toLocaleString()}đ
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell sx={{ py: 2 }}>
                      <Stack spacing={0.5}>
                        <Stack direction='row' spacing={1} alignItems='center'>
                          <ScheduleIcon
                            sx={{ fontSize: 14, color: '#059669' }}
                          />
                          <Typography
                            variant='caption'
                            sx={{ color: '#059669', fontWeight: 600 }}
                          >
                            Từ: {formatDate(voucher.startDate)}
                          </Typography>
                        </Stack>
                        <Stack direction='row' spacing={1} alignItems='center'>
                          <ScheduleIcon
                            sx={{ fontSize: 14, color: '#dc2626' }}
                          />
                          <Typography
                            variant='caption'
                            sx={{ color: '#dc2626', fontWeight: 600 }}
                          >
                            Đến: {formatDate(voucher.endDate)}
                          </Typography>
                        </Stack>
                      </Stack>
                    </TableCell>

                    <TableCell sx={{ py: 2 }}>
                      <Stack spacing={1}>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {voucher.usageCount.toLocaleString()}
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            / {voucher.usageLimit.toLocaleString()}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant='determinate'
                          value={Math.min(usagePercentage, 100)}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: '#f1f5f9',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 3,
                              backgroundColor:
                                usagePercentage > 80
                                  ? '#ef4444'
                                  : usagePercentage > 50
                                    ? '#f59e0b'
                                    : '#10b981'
                            }
                          }}
                        />
                        <Typography variant='caption' color='text.secondary'>
                          {usagePercentage.toFixed(1)}% đã sử dụng
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell sx={{ py: 2 }}>
                      <Chip
                        label={voucher.status}
                        color={getStatusColor(voucher.status)}
                        size='small'
                        sx={{
                          fontWeight: 600,
                          borderRadius: 2
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ py: 2 }}>
                      <Stack direction='row' spacing={1}>
                        <Tooltip title='Xem chi tiết'>
                          <IconButton
                            size='small'
                            sx={{
                              color: '#10b981',
                              '&:hover': { backgroundColor: '#d1fae5' }
                            }}
                          >
                            <VisibilityIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
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
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  )
}

export default PromotionManagement
