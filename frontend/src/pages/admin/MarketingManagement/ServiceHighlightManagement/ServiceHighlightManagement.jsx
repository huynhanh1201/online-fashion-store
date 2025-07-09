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
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  Image as ImageIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon
} from '@mui/icons-material'
import AddServiceHighlight from './Modal/AddServiceHighlight.jsx'
import {
  getServiceHighlights,
  deleteServiceHighlight
} from '~/services/admin/webConfig/highlightedService.js'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'
import usePermissions from '~/hooks/usePermissions'

const ServiceHighlightManagement = () => {
  const theme = useTheme()
  const [openModal, setOpenModal] = useState(false)
  const [editIndex, setEditIndex] = useState(null)
  const [serviceHighlights, setServiceHighlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const { hasPermission } = usePermissions()
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState(null)
  const [deleting, setDeleting] = useState(false)

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

  // Handle success from Chart
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
  const handleDelete = (index) => {
    setDeleteIndex(index)
    setDeleteConfirmOpen(true)
  }

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (deleteIndex === null) return

    try {
      setDeleting(true)
      await deleteServiceHighlight(deleteIndex)
      // Refresh data after successful delete
      fetchServiceHighlights()
      setDeleteConfirmOpen(false)
      setDeleteIndex(null)
    } catch (error) {
      setError(error.message)
      console.error('Error deleting service highlight:', error)
    } finally {
      setDeleting(false)
    }
  }

  // Handle delete cancel
  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false)
    setDeleteIndex(null)
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
      value: loading ? (
        <Skeleton width={40} />
      ) : (
        serviceHighlights.filter((service) => service.imageUrl).length
      ),
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
          <StarIcon sx={{ fontSize: 40, color: 'var(--primary-color)' }} />
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
                display: 'flex',
                alignItems: 'center',
                borderRadius: 2,
                boxShadow: 'none',
                border: 'none',
                background: '#fafbfc',
                minHeight: 90,
                position: 'relative',
              }}
            >
              {/* Thanh màu bên trái */}
              <Box
                sx={{
                  width: 8,
                  height: '100%',
                  borderRadius: '8px 0 0 8px',
                  background: item.color || '#22c55e',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                }}
              />
              <CardContent sx={{ pl: 4, py: 2, width: '100%' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {item.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ color: item.color || '#22c55e', fontSize: 28, fontWeight: 700 }}>
                    {item.icon}
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, ml: 1 }}>
                    {item.value}
                  </Typography>
                </Box>
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
        {hasPermission('service:create') && (
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
            Thêm dịch vụ mới
          </Button>
        )}
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
                            <ImageIcon
                              sx={{ color: '#cbd5e1', fontSize: 24 }}
                            />
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
                        {hasPermission('service:update') && (

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
                        )}
                        {hasPermission('service:delete') && (
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
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                // No data
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
                    {/* SVG No data icon */}
                    <svg
                      width='64'
                      height='41'
                      viewBox='0 0 64 41'
                      xmlns='http://www.w3.org/2000/svg'
                      style={{ marginBottom: 8 }}
                    >
                      <title>No data</title>
                      <g
                        transform='translate(0 1)'
                        fill='none'
                        fillRule='evenodd'
                      >
                        <ellipse
                          fill='#f5f5f5'
                          cx='32'
                          cy='33'
                          rx='32'
                          ry='7'
                        ></ellipse>
                        <g fillRule='nonzero' stroke='#d9d9d9'>
                          <path d='M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z'></path>
                          <path
                            d='M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z'
                            fill='#fafafa'
                          ></path>
                        </g>
                      </g>
                    </svg>
                    <Typography variant='body1' color='text.secondary'>
                      Chưa có dịch vụ nổi bật nào
                    </Typography>
                    {hasPermission('service:create') && (
                      <Button
                        variant='outlined'
                        startIcon={<AddIcon />}
                        onClick={handleAddNew}
                        sx={{ mt: 2 }}
                      >
                        Thêm dịch vụ đầu tiên
                      </Button>
                    )}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 400
          }
        }}
      >
        <DialogTitle
          id='alert-dialog-title'
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: '#dc2626',
            fontWeight: 600
          }}
        >
          <WarningIcon color='error' />
          Xác nhận xóa dịch vụ
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description' sx={{ mb: 2 }}>
            Bạn có chắc chắn muốn xóa dịch vụ này không?
          </DialogContentText>
          {deleteIndex !== null && serviceHighlights[deleteIndex] && (
            <Box
              sx={{
                p: 2,
                backgroundColor: '#fef2f2',
                borderRadius: 2,
                border: '1px solid #fecaca',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              {serviceHighlights[deleteIndex].imageUrl && (
                <img
                  src={optimizeCloudinaryUrl(
                    serviceHighlights[deleteIndex].imageUrl,
                    {
                      width: 60,
                      height: 60
                    }
                  )}
                  alt={serviceHighlights[deleteIndex].title}
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: 'contain',
                    borderRadius: 6,
                    border: '1px solid #e2e8f0'
                  }}
                />
              )}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant='body1'
                  sx={{ fontWeight: 600, color: '#1e293b' }}
                >
                  {serviceHighlights[deleteIndex].title}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {serviceHighlights[deleteIndex].subtitle}
                </Typography>
              </Box>
            </Box>
          )}
          <DialogContentText sx={{ mt: 2, color: '#dc2626', fontWeight: 500 }}>
            ⚠️ Hành động này không thể hoàn tác!
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={handleDeleteCancel}
            variant='outlined'
            disabled={deleting}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant='contained'
            disabled={deleting}
            startIcon={
              deleting ? <CircularProgress size={16} /> : <DeleteIcon />
            }
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              backgroundColor: '#dc2626',
              '&:hover': {
                backgroundColor: '#b91c1c'
              }
            }}
          >
            {deleting ? 'Đang xóa...' : 'Xóa dịch vụ'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ServiceHighlightManagement
