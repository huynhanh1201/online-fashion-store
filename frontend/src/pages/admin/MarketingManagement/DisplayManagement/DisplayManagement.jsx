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
  Avatar,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Skeleton
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Link as LinkIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Dashboard as DashboardIcon,
  Refresh as RefreshIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material'
import AddBanner from './Modal/AddBanner.jsx'
import {
  getBanners,
  deleteBanner,
  updateBanner
} from '~/services/admin/webConfig/bannerService.js'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'

const DisplayManagement = () => {
  const theme = useTheme()

  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [bannerToEdit, setBannerToEdit] = useState(null)
  const [bannerIndexToEdit, setBannerIndexToEdit] = useState(null)

  // Fetch banners data
  const fetchBanners = async () => {
    try {
      setError('')
      const data = await getBanners()
      setBanners(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching banners:', err)
    } finally {
      setLoading(false)
    }
  }

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchBanners()
    setRefreshing(false)
  }

  // Handle success from modal
  const handleModalSuccess = (result) => {
    console.log('Banner updated successfully:', result)
    fetchBanners()
  }

  // Handle edit banner
  const handleEditBanner = (banner, index) => {
    setBannerToEdit(banner)
    setBannerIndexToEdit(index)
    setOpenModal(true)
  }

  // Handle delete banner
  const handleDeleteBanner = async (index) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa banner này?')) {
      try {
        await deleteBanner(index)
        fetchBanners()
      } catch (error) {
        setError(error.message)
      }
    }
  }

  // Handle toggle visibility
  const handleToggleVisibility = async (index, currentVisible) => {
    try {
      await updateBanner(index, { visible: !currentVisible })
      fetchBanners()
    } catch (error) {
      setError(error.message)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const getPositionColor = (position) => {
    switch (position) {
      case 'hero':
        return { bg: '#e3f2fd', color: '#1976d2' }
      case 'sidebar':
        return { bg: '#f3e5f5', color: '#7b1fa2' }
      case 'popup':
        return { bg: '#fff3e0', color: '#f57c00' }
      case 'top':
        return { bg: '#e1f5fe', color: '#0277bd' }
      case 'bottom':
        return { bg: '#e8f5e8', color: '#2e7d32' }
      default:
        return { bg: '#f5f5f5', color: '#757575' }
    }
  }

  const getPositionText = (position) => {
    switch (position) {
      case 'hero':
        return 'Hero (Chính)'
      case 'sidebar':
        return 'Sidebar (Bên)'
      case 'popup':
        return 'Popup (Bật lên)'
      case 'top':
        return 'Top (Đầu)'
      case 'bottom':
        return 'Bottom (Cuối)'
      default:
        return position
    }
  }

  const isBannerActive = (banner) => {
    if (!banner.visible) return false

    const now = new Date()
    const startDate = banner.startDate ? new Date(banner.startDate) : null
    const endDate = banner.endDate ? new Date(banner.endDate) : null

    if (startDate && now < startDate) return false
    if (endDate && now > endDate) return false

    return true
  }

  // Calculate summary data
  const summaryData = [
    {
      title: 'Tổng Banner',
      value: banners.length,
      icon: <ImageIcon />,
      color: '#1976d2'
    },
    {
      title: 'Đang hiển thị',
      value: banners.filter((banner) => banner.visible).length,
      icon: <VisibilityIcon />,
      color: '#2e7d32'
    },
    {
      title: 'Đang hoạt động',
      value: banners.filter((b) => isBannerActive(b)).length,
      icon: <CalendarIcon />,
      color: '#ed6c02'
    },
    {
      title: 'Tổng lượt xem',
      value: banners.length > 0 ? 'N/A' : '0',
      icon: <VisibilityIcon />,
      color: '#9c27b0'
    }
  ]

  // Loading skeleton
  const LoadingSkeleton = () => (
    <TableRow>
      <TableCell>
        <Skeleton variant='rectangular' width={60} height={40} />
      </TableCell>
      <TableCell>
        <Skeleton variant='text' width='60%' />
        <Skeleton variant='text' width='40%' />
      </TableCell>
      <TableCell>
        <Skeleton variant='rectangular' width={80} height={24} />
      </TableCell>
      <TableCell>
        <Skeleton variant='text' width='60%' />
        <Skeleton variant='text' width='40%' />
      </TableCell>
      <TableCell>
        <Skeleton variant='rectangular' width={60} height={24} />
      </TableCell>
      <TableCell>
        <Skeleton variant='circular' width={32} height={32} />
      </TableCell>
    </TableRow>
  )

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: '#f8fafc',
        borderRadius: 3,
        minHeight: '100vh'
      }}
    >
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
          <DashboardIcon sx={{ fontSize: 40, color: '#3b82f6' }} />
          Quản lý băng rôn & Hiển thị
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Quản lý và theo dõi hiệu suất các băng rôn quảng cáo trên website
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
          onClick={() => {
            setBannerToEdit(null)
            setBannerIndexToEdit(null)
            setOpenModal(true)
          }}
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            background:
              'linear-gradient(135deg,rgb(17, 58, 122) 0%,rgb(11, 49, 156) 100%)',
            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
              transform: 'translateY(-1px)'
            }
          }}
        >
          Thêm băng rôn mới
        </Button>

        <Button
          variant='outlined'
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
                {[
                  'Băng rôn',
                  'Vị trí',
                  'Thời gian',
                  'Hiệu suất',
                  'Trạng thái',
                  'Thao tác'
                ].map((text, idx) => (
                  <TableCell
                    key={idx}
                    sx={{ fontWeight: 700, color: '#334155', py: 2 }}
                  >
                    {text}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, index) => (
                  <LoadingSkeleton key={index} />
                ))
              ) : banners.length > 0 ? (
                // Actual data
                banners.map((banner, index) => {
                  const positionStyle = getPositionColor(banner.position)

                  return (
                    <TableRow key={index}>
                      <TableCell sx={{ py: 2 }}>
                        <Stack direction='row' spacing={2} alignItems='center'>
                          <Avatar
                            src={
                              banner.imageUrl
                                ? optimizeCloudinaryUrl(banner.imageUrl, {
                                    width: 60,
                                    height: 40
                                  })
                                : undefined
                            }
                            sx={{
                              width: 60,
                              height: 40,
                              borderRadius: 2,
                              backgroundColor: '#f1f5f9'
                            }}
                            variant='rounded'
                          >
                            <ImageIcon sx={{ color: '#64748b' }} />
                          </Avatar>
                          <Box>
                            <Typography
                              variant='body1'
                              sx={{ fontWeight: 600, color: '#1e293b' }}
                            >
                              {banner.title}
                            </Typography>
                            {banner.subtitle && (
                              <Typography
                                variant='caption'
                                color='text.secondary'
                              >
                                {banner.subtitle}
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={getPositionText(banner.position)}
                          icon={<LocationIcon sx={{ fontSize: 16 }} />}
                          size='small'
                          sx={{
                            backgroundColor: positionStyle.bg,
                            color: positionStyle.color,
                            fontWeight: 600,
                            borderRadius: 2,
                            '& .MuiChip-icon': { color: positionStyle.color }
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Stack spacing={0.5}>
                          <Stack
                            direction='row'
                            spacing={1}
                            alignItems='center'
                          >
                            <CalendarIcon
                              sx={{ fontSize: 14, color: '#059669' }}
                            />
                            <Typography
                              variant='caption'
                              sx={{ color: '#059669', fontWeight: 600 }}
                            >
                              Bắt đầu: {formatDate(banner.startDate)}
                            </Typography>
                          </Stack>
                          <Stack
                            direction='row'
                            spacing={1}
                            alignItems='center'
                          >
                            <CalendarIcon
                              sx={{ fontSize: 14, color: '#dc2626' }}
                            />
                            <Typography
                              variant='caption'
                              sx={{ color: '#dc2626', fontWeight: 600 }}
                            >
                              Kết thúc: {formatDate(banner.endDate)}
                            </Typography>
                          </Stack>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Stack spacing={1}>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Typography
                              variant='caption'
                              color='text.secondary'
                            >
                              Click:
                            </Typography>
                            <Typography
                              variant='body2'
                              sx={{ fontWeight: 600, color: '#3b82f6' }}
                            >
                              N/A
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Typography
                              variant='caption'
                              color='text.secondary'
                            >
                              CTR:
                            </Typography>
                            <Typography
                              variant='body2'
                              sx={{ fontWeight: 600, color: '#059669' }}
                            >
                              N/A
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={banner.visible}
                              onChange={() =>
                                handleToggleVisibility(index, banner.visible)
                              }
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: '#10b981'
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                                  { backgroundColor: '#10b981' }
                              }}
                            />
                          }
                          label={
                            <Typography
                              variant='body2'
                              sx={{ fontWeight: 600 }}
                            >
                              {banner.visible ? 'Hiển thị' : 'Ẩn'}
                            </Typography>
                          }
                          sx={{ margin: 0 }}
                        />
                      </TableCell>

                      <TableCell>
                        <Stack direction='row' spacing={1}>
                          <Tooltip title='Chỉnh sửa'>
                            <IconButton
                              size='small'
                              onClick={() => handleEditBanner(banner, index)}
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
                              onClick={() => handleDeleteBanner(index)}
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
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant='body1' color='text.secondary'>
                      Chưa có banner nào
                    </Typography>
                    <Button
                      variant='outlined'
                      startIcon={<AddIcon />}
                      onClick={() => setOpenModal(true)}
                      sx={{ mt: 2 }}
                    >
                      Thêm banner đầu tiên
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <AddBanner
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={handleModalSuccess}
        initialData={bannerToEdit}
        bannerIndex={bannerIndexToEdit}
      />
    </Box>
  )
}

export default DisplayManagement
