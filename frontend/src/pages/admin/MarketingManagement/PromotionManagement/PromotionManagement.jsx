import React, { useState, useEffect } from 'react'
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
  Divider,
  Alert,
  CircularProgress,
  Skeleton
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
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'
import {
  getDiscounts,
  deleteDiscount
} from '~/services/admin/discountService.js'
import AddDiscountModal from './Modal/AddDiscount.jsx'
import ViewDiscountModal from './Modal/ViewDiscount.jsx'
import EditDiscountModal from './Modal/EditDiscount.jsx'
import { RouteGuard } from '~/components/PermissionGuard'

const PromotionManagement = () => {
  const theme = useTheme()
  const [vouchers, setVouchers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  // Modal states
  const [openAddModal, setOpenAddModal] = useState(false)
  const [openViewModal, setOpenViewModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [selectedDiscount, setSelectedDiscount] = useState(null)

  // Fetch vouchers data
  const fetchVouchers = async () => {
    try {
      setError('')
      const { discounts } = await getDiscounts()
      setVouchers(discounts)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching vouchers:', err)
    } finally {
      setLoading(false)
    }
  }

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchVouchers()
    setRefreshing(false)
  }

  // Handle delete voucher
  const handleDeleteVoucher = async (voucherId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa voucher này?')) {
      try {
        await deleteDiscount(voucherId)
        fetchVouchers()
      } catch (error) {
        setError(error.message)
      }
    }
  }

  // Handle view voucher
  const handleViewVoucher = (voucher) => {
    setSelectedDiscount(voucher)
    setOpenViewModal(true)
  }

  // Handle edit voucher
  const handleEditVoucher = (voucher) => {
    setSelectedDiscount(voucher)
    setOpenEditModal(true)
  }

  // Handle Chart success
  const handleModalSuccess = (result) => {
    console.log('Voucher operation successful:', result)
    fetchVouchers()
    setOpenAddModal(false)
    setOpenEditModal(false)
  }

  // Handle Chart close
  const handleCloseModal = () => {
    setOpenAddModal(false)
    setOpenViewModal(false)
    setOpenEditModal(false)
    setSelectedDiscount(null)
  }

  useEffect(() => {
    fetchVouchers()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success'
      case 'inactive':
        return 'default'
      case 'expired':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Đang hoạt động'
      case 'inactive':
        return 'Đã hủy'
      case 'expired':
        return 'Đã kết thúc'
      default:
        return status
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
      value: vouchers.filter((v) => v.isActive === true).length,
      icon: <TrendingUpIcon />,
      color: '#2e7d32'
    },
    {
      title: 'Tổng lượt sử dụng',
      value: vouchers
        .reduce((sum, v) => sum + (v.usageCount || 0), 0)
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
                ? (v.discountAmount || 0) * (v.usageCount || 0)
                : (v.minOrderValue || 0) *
                  ((v.discountAmount || 0) / 100) *
                  (v.usageCount || 0)
            return sum + savings
          }, 0)
          .toLocaleString() + 'đ',
      icon: <MoneyIcon />,
      color: '#9c27b0'
    }
  ]

  // Loading skeleton
  const LoadingSkeleton = () => (
    <TableRow>
      <TableCell>
        <Skeleton variant='text' width='60%' />
        <Skeleton variant='text' width='40%' />
      </TableCell>
      <TableCell>
        <Skeleton variant='rectangular' width={80} height={24} />
      </TableCell>
      <TableCell>
        <Skeleton variant='text' width='60%' />
      </TableCell>
      <TableCell>
        <Skeleton variant='text' width='60%' />
        <Skeleton variant='text' width='40%' />
      </TableCell>
      <TableCell>
        <Skeleton variant='text' width='60%' />
        <Skeleton variant='rectangular' width='100%' height={6} />
      </TableCell>
      <TableCell>
        <Skeleton variant='rectangular' width={80} height={24} />
      </TableCell>
      <TableCell>
        <Skeleton variant='circular' width={32} height={32} />
      </TableCell>
    </TableRow>
  )

  return (
    <RouteGuard requiredPermissions={['admin:access', 'promotion:use']}>
      <Box
        sx={{
        p: 3,
        backgroundColor: '#f8fafc',
        borderRadius: 3,
        minHeight: '100vh'
      }}
    >
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
          <OfferIcon sx={{ fontSize: 40, color: 'var(--primary-color)' }} />
          Quản lý Khuyến mãi & Mã giảm giá
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Tạo và quản lý các chương trình khuyến mãi, mã giảm giá cho khách hàng
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert
          severity='error'
          sx={{ mb: 3 }}
          action={
            <Button color='inherit' size='small' onClick={handleRefresh}>
              Thử lại
            </Button>
          }
        >
          {error}
        </Alert>
      )}

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
                      {loading ? <Skeleton width={40} /> : item.value}
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
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
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
            backgroundColor: 'var(--primary-color)',
            color: '#fff',
            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
            '&:hover': {
              backgroundColor: 'var(--accent-color)',
              boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
              transform: 'translateY(-1px)'
            }
          }}
        >
          Tạo mã giảm giá mới
        </Button>

        <Button
          variant='outlined'
          startIcon={<RefreshIcon />}
          onClick={handleRefresh}
          disabled={refreshing}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            color: 'var(--primary-color)',
            borderColor: 'var(--primary-color)'
          }}
        >
          {refreshing ? 'Đang tải...' : 'Làm mới'}
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
              {loading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, index) => (
                  <LoadingSkeleton key={index} />
                ))
              ) : vouchers.length > 0 ? (
                // Actual data
                vouchers.map((voucher, index) => {
                  const usagePercentage = calculateUsagePercentage(
                    voucher.usageCount || 0,
                    voucher.maxUsage || 0
                  )
                  const discountColor = getDiscountTypeColor(
                    voucher.discountType
                  )

                  return (
                    <TableRow
                      key={voucher._id || voucher.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.04
                          )
                        },
                        '&:last-child td, &:last-child th': { border: 0 }
                      }}
                    >
                      <TableCell sx={{ py: 2 }}>
                        <Stack spacing={1}>
                          <Stack
                            direction='row'
                            spacing={1}
                            alignItems='center'
                          >
                            <Typography
                              variant='body1'
                              sx={{
                                fontWeight: 700,
                                color: '#1e293b',
                                fontFamily: 'monospace',
                                fontSize: '1rem'
                              }}
                            >
                              {voucher.code}
                            </Typography>
                            <Tooltip title='Sao chép mã'>
                              <IconButton
                                size='small'
                                onClick={() => copyToClipboard(voucher.code)}
                                sx={{ color: '#6b7280' }}
                              >
                                <CopyIcon fontSize='small' />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                          <Typography variant='caption' color='text.secondary'>
                            {voucher.description || 'Không có mô tả'}
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
                                ? `${(voucher.discountAmount || 0).toLocaleString()}đ`
                                : `${voucher.discountAmount || 0}%`}
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
                            <Typography
                              variant='body1'
                              sx={{ fontWeight: 600 }}
                            >
                              {(voucher.minOrderValue || 0).toLocaleString()}đ
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      <TableCell sx={{ py: 2 }}>
                        <Stack spacing={0.5}>
                          <Stack
                            direction='row'
                            spacing={1}
                            alignItems='center'
                          >
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
                          <Stack
                            direction='row'
                            spacing={1}
                            alignItems='center'
                          >
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
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            }}
                          >
                            <Typography
                              variant='body2'
                              sx={{ fontWeight: 600 }}
                            >
                              {(voucher.usageCount || 0).toLocaleString()}
                            </Typography>
                            <Typography
                              variant='caption'
                              color='text.secondary'
                            >
                              / {(voucher.maxUsage || 0).toLocaleString()}
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
                          label={getStatusText(
                            voucher.isActive ? 'active' : 'inactive'
                          )}
                          color={getStatusColor(
                            voucher.isActive ? 'active' : 'inactive'
                          )}
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
                              onClick={() => handleViewVoucher(voucher)}
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
                              onClick={() => handleEditVoucher(voucher)}
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
                              onClick={() => handleDeleteVoucher(voucher._id)}
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
                })
              ) : (
                // No data
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant='body1' color='text.secondary'>
                      Chưa có voucher nào
                    </Typography>
                    <Button
                      variant='outlined'
                      startIcon={<AddIcon />}
                      onClick={() => setOpenAddModal(true)}
                      sx={{ mt: 2 }}
                    >
                      Tạo voucher đầu tiên
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Modals */}
      <AddDiscountModal
        open={openAddModal}
        onClose={handleCloseModal}
        onAdded={handleModalSuccess}
      />

      <ViewDiscountModal
        open={openViewModal}
        onClose={handleCloseModal}
        discount={selectedDiscount}
      />

      <EditDiscountModal
        open={openEditModal}
        onClose={handleCloseModal}
        onSave={handleModalSuccess}
        discount={selectedDiscount}
      />
      </Box>
    </RouteGuard>
  )
}

export default PromotionManagement
