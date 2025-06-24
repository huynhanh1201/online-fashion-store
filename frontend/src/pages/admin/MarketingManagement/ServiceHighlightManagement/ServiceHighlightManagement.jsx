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
  IconButton,
  Tooltip,
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
  Star as StarIcon,
  Image as ImageIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'
import AddServiceHighlight from './Modal/AddServiceHighlight.jsx'
import { 
  getServiceHighlights, 
  deleteServiceHighlight 
} from '~/services/admin/webConfig/highlightedService.js'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'

const ServiceHighlightManagement = () => {
  const theme = useTheme()
  const [openModal, setOpenModal] = useState(false)
  const [editIndex, setEditIndex] = useState(null)
  const [serviceHighlights, setServiceHighlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')

  // Fetch service highlights data
  const fetchServiceHighlights = async () => {
    try {
      setError('')
      const data = await getServiceHighlights()
      setServiceHighlights(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching service highlights:', err)
    } finally {
      setLoading(false)
    }
  }

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchServiceHighlights()
    setRefreshing(false)
  }

  // Handle success from modal
  const handleModalSuccess = (result) => {
    console.log('Service highlight updated successfully:', result)
    // Refresh data after successful update
    fetchServiceHighlights()
  }

  // Handle edit
  const handleEdit = (index) => {
    setEditIndex(index)
    setOpenModal(true)
  }

  // Handle delete
  const handleDelete = async (index) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
      try {
        await deleteServiceHighlight(index)
        // Refresh data after successful delete
        fetchServiceHighlights()
      } catch (error) {
        setError(error.message)
        console.error('Error deleting service highlight:', error)
      }
    }
  }

  // Handle add new
  const handleAddNew = () => {
    setEditIndex(null)
    setOpenModal(true)
  }

  useEffect(() => {
    fetchServiceHighlights()
  }, [])

  const summaryData = [
    {
      title: 'Tổng dịch vụ',
      value: loading ? <Skeleton width={40} /> : serviceHighlights.length,
      icon: <StarIcon />,
      color: '#1976d2'
    },
    {
      title: 'Hình ảnh dịch vụ',
      value: loading ? <Skeleton width={40} /> : serviceHighlights.filter((service) => service.imageUrl).length,
      icon: <ImageIcon />,
      color: '#2e7d32'
    }
  ]

  // Loading skeleton
  const LoadingSkeleton = () => (
    <TableRow>
      <TableCell>
        <Skeleton variant='rectangular' width={50} height={50} />
      </TableCell>
      <TableCell>
        <Skeleton variant='text' width='60%' />
      </TableCell>
      <TableCell>
        <Skeleton variant='text' width='40%' />
      </TableCell>
      <TableCell>
        <Skeleton variant='circular' width={32} height={32} />
      </TableCell>
    </TableRow>
  )

  return (
    <Box sx={{ p: 3, backgroundColor: '#f8fafc', borderRadius: 3, minHeight: '100vh' }}>
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
          <StarIcon sx={{ fontSize: 40, color: '#1A3C7B' }} />
          Quản lý Dịch vụ Nổi bật
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Cấu hình và quản lý các dịch vụ nổi bật hiển thị trên website
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
          onClick={handleAddNew}
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
          Thêm dịch vụ mới
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
                  Hình ảnh
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2 }}>
                  Tiêu đề
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2 }}>
                  Mô tả
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2 }}>
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                // Loading skeleton
                Array.from({ length: 4 }).map((_, index) => (
                  <LoadingSkeleton key={index} />
                ))
              ) : serviceHighlights.length > 0 ? (
                // Actual data
                serviceHighlights.map((item, index) => (
                  <TableRow
                    key={index}
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
                        {item.imageUrl ? (
                          <img
                            src={optimizeCloudinaryUrl(item.imageUrl, {
                              width: 50,
                              height: 50
                            })}
                            alt={item.title}
                            style={{
                              width: 50,
                              height: 50,
                              objectFit: 'contain',
                              borderRadius: 4,
                              border: '1px solid #e2e8f0'
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 50,
                              height: 50,
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
                          #{index + 1}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography
                        variant='body2'
                        sx={{ fontWeight: 600, color: '#1e293b' }}
                      >
                        {item.title}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant='body2' color='text.secondary'>
                        {item.subtitle}
                      </Typography>
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
                            onClick={() => handleEdit(index)}
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
                            onClick={() => handleDelete(index)}
                          >
                            <DeleteIcon fontSize='small' />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                // No data
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant='body1' color='text.secondary'>
                      Chưa có dịch vụ nổi bật nào
                    </Typography>
                    <Button
                      variant='outlined'
                      startIcon={<AddIcon />}
                      onClick={handleAddNew}
                      sx={{ mt: 2 }}
                    >
                      Thêm dịch vụ đầu tiên
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Modal */}
      <AddServiceHighlight
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={handleModalSuccess}
        editIndex={editIndex}
      />
    </Box>
  )
}

export default ServiceHighlightManagement
