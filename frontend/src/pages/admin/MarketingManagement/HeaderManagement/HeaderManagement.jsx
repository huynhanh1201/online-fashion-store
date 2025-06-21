import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Grid,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  useTheme,
  alpha,
  Alert,
  CircularProgress,
  Skeleton
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Announcement as BannerIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'
import AddHeader from './Modal/AddHeader.jsx'
import { getHeaderConfig } from '~/services/admin/webConfig/headerService.js'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'

const HeaderManagement = () => {
  const theme = useTheme()
  const [openModal, setOpenModal] = useState(false)
  const [headerData, setHeaderData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  // Fetch header data
  const fetchHeaderData = async () => {
    try {
      setError('')
      const data = await getHeaderConfig()
      setHeaderData(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching header data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchHeaderData()
    setRefreshing(false)
  }

  // Handle success from modal
  const handleModalSuccess = (result) => {
    console.log('Header updated successfully:', result)
    // Refresh data after successful update
    fetchHeaderData()
  }

  useEffect(() => {
    fetchHeaderData()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success'
      case 'inactive':
        return 'error'
      case 'draft':
        return 'warning'
      default:
        return 'default'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Đang sử dụng'
      case 'inactive':
        return 'Ngừng sử dụng'
      case 'draft':
        return 'Bản nháp'
      default:
        return status
    }
  }

  // Calculate summary data
  const summaryData = [
    {
      title: 'Tổng header',
      value: headerData ? 1 : 0,
      icon: <ImageIcon />,
      color: '#1976d2'
    },
    {
      title: 'Đang sử dụng',
      value: headerData?.status === 'active' ? 1 : 0,
      icon: <TrendingUpIcon />,
      color: '#2e7d32'
    },
    {
      title: 'Banner hiển thị',
      value:
        headerData?.content?.topBanner?.filter((b) => b.visible)?.length || 0,
      icon: <BannerIcon />,
      color: '#ed6c02'
    }
  ]

  // Loading skeleton
  const LoadingSkeleton = () => (
    <TableRow>
      <TableCell>
        <Skeleton variant='rectangular' width={80} height={60} />
      </TableCell>
      <TableCell>
        <Skeleton variant='text' width='60%' />
        <Skeleton variant='text' width='40%' />
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
          <ImageIcon sx={{ fontSize: 40, color: '#1A3C7B' }} />
          Quản lý đầu trang
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Cấu hình và quản lý nội dung đầu trang cho website
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
          <Grid item xs={12} sm={6} md={4} key={index}>
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
          onClick={() => setOpenModal(true)}
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
          {headerData ? 'Chỉnh sửa nội dung' : 'Tạo nội dung mới'}
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
                  Logo
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2 }}>
                  Top Banner
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
              ) : headerData ? (
                // Actual data
                <TableRow
                  sx={{
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.04)
                    },
                    '&:last-child td, &:last-child th': { border: 0 }
                  }}
                >
                  <TableCell sx={{ py: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      {headerData.content?.logo?.imageUrl ? (
                        <img
                          src={optimizeCloudinaryUrl(
                            headerData.content.logo.imageUrl,
                            {
                              width: 80,
                              height: 60
                            }
                          )}
                          alt={headerData.content.logo.alt || 'Logo'}
                          style={{
                            width: 80,
                            height: 'auto',
                            borderRadius: 4,
                            border: '1px solid #e2e8f0',
                            objectFit: 'contain'
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 80,
                            height: 60,
                            borderRadius: 4,
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f8fafc'
                          }}
                        >
                          <ImageIcon sx={{ color: '#cbd5e1', fontSize: 24 }} />
                        </Box>
                      )}
                      <Typography
                        variant='caption'
                        color='text.secondary'
                        sx={{ fontFamily: 'monospace' }}
                      >
                        {headerData._id}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    {headerData.content?.topBanner?.length > 0 ? (
                      <List dense>
                        {headerData.content.topBanner
                          .filter((banner) => banner.visible)
                          .map((banner, idx) => (
                            <ListItem key={idx} sx={{ py: 0.5 }}>
                              <ListItemText
                                primary={
                                  <Typography
                                    variant='body2'
                                    sx={{ fontWeight: 600, color: '#1e293b' }}
                                  >
                                    {banner.text}
                                  </Typography>
                                }
                              />
                            </ListItem>
                          ))}
                      </List>
                    ) : (
                      <Typography variant='body2' color='text.secondary'>
                        Không có banner nào
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Chip
                      label={getStatusText(headerData.status)}
                      color={getStatusColor(headerData.status)}
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
                          onClick={() => setOpenModal(true)}
                        >
                          <EditIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : (
                // No data
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant='body1' color='text.secondary'>
                      Chưa có cấu hình header nào
                    </Typography>
                    <Button
                      variant='outlined'
                      startIcon={<AddIcon />}
                      onClick={() => setOpenModal(true)}
                      sx={{ mt: 2 }}
                    >
                      Tạo cấu hình đầu tiên
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <AddHeader
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={handleModalSuccess}
      />
    </Box>
  )
}

export default HeaderManagement
