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
  Category as CategoryIcon,
  Collections as CollectionsIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon
} from '@mui/icons-material'
import AddFeaturedCategory from './Modal/AddFeaturedCategory.jsx'
import {
  getFeaturedCategories,
  deleteFeaturedCategory
} from '~/services/admin/webConfig/featuredcategoryService.js'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'
import usePermissions from '~/hooks/usePermissions.js'

const FeaturedCategoryManagement = () => {
  const theme = useTheme()
  const [openModal, setOpenModal] = useState(false)
  const [editIndex, setEditIndex] = useState(null)
  const [featuredCategories, setFeaturedCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const { hasPermission } = usePermissions()
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Fetch featured categories data
  const fetchFeaturedCategories = async () => {
    try {
      setError('')
      const data = await getFeaturedCategories()
      setFeaturedCategories(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching featured categories:', err)
    } finally {
      setLoading(false)
    }
  }

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchFeaturedCategories()
    setRefreshing(false)
  }

  // Handle success from Chart
  const handleModalSuccess = (result) => {
    console.log('Featured category updated successfully:', result)
    // Refresh data after successful update
    fetchFeaturedCategories()
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
      await deleteFeaturedCategory(deleteIndex)
      // Refresh data after successful delete
      fetchFeaturedCategories()
      setDeleteConfirmOpen(false)
      setDeleteIndex(null)
    } catch (error) {
      setError(error.message)
      console.error('Error deleting featured category:', error)
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
    fetchFeaturedCategories()
  }, [])

  const summaryData = [
    {
      title: 'Tổng danh mục',
      value: loading ? <Skeleton width={40} /> : featuredCategories.length,
      icon: <CategoryIcon />,
      color: '#1976d2'
    },
    {
      title: 'Hình ảnh danh mục',
      value: loading ? (
        <Skeleton width={40} />
      ) : (
        featuredCategories.filter((cat) => cat.imageUrl).length
      ),
      icon: <CollectionsIcon />,
      color: '#2e7d32'
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
          <CategoryIcon sx={{ fontSize: 40, color: 'var(--primary-color)' }} />
          Quản lý Danh mục Nổi bật
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Cấu hình và quản lý các danh mục nổi bật hiển thị trên website
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
        {hasPermission('featuredCategory:create') && (
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
              background: 'var(--primary-color)',
              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
              '&:hover': {
                background: 'var(--accent-color)',
                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
                transform: 'translateY(-1px)'
              }
            }}
          >
            Thêm danh mục mới
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
                  Tên danh mục
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2 }}>
                  Link
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
              ) : featuredCategories.length > 0 ? (
                // Actual data
                featuredCategories.map((item, index) => (
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
                              width: 80,
                              height: 60
                            })}
                            alt={item.name}
                            style={{
                              width: 80,
                              height: 60,
                              objectFit: 'cover',
                              borderRadius: 8,
                              border: '1px solid #e2e8f0'
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 80,
                              height: 60,
                              borderRadius: 8,
                              border: '1px solid #e2e8f0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#f8fafc'
                            }}
                          >
                            <CollectionsIcon
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
                        {item.name}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography
                        variant='body2'
                        sx={{
                          fontFamily: 'monospace',
                          color: '#3b82f6',
                          fontWeight: 500,
                          wordBreak: 'break-all',
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline'
                          }
                        }}
                        onClick={() => {
                          if (item.link) {
                            navigator.clipboard
                              .writeText(item.link)
                              .then(() => {
                                // You could add a toast notification here
                                console.log('Link copied to clipboard')
                              })
                              .catch((err) => {
                                console.error('Failed to copy link:', err)
                              })
                          }
                        }}
                        title='Click to copy link'
                      >
                        {item.link || 'Chưa có link'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Stack direction='row' spacing={1}>
                        {hasPermission('featuredCategory:update') && (
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
                        {hasPermission('featuredCategory:delete') && (
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
                      Chưa có danh mục nổi bật nào
                    </Typography>
                    {hasPermission('blog:create') && (
                      <Button
                        variant='outlined'
                        startIcon={<AddIcon />}
                        onClick={handleAddNew}
                        sx={{ mt: 2 }}
                      >
                        Thêm danh mục đầu tiên
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
      <AddFeaturedCategory
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
          Xác nhận xóa danh mục
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description' sx={{ mb: 2 }}>
            Bạn có chắc chắn muốn xóa danh mục này không?
          </DialogContentText>
          {deleteIndex !== null && featuredCategories[deleteIndex] && (
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
              {featuredCategories[deleteIndex].imageUrl && (
                <img
                  src={optimizeCloudinaryUrl(
                    featuredCategories[deleteIndex].imageUrl,
                    {
                      width: 60,
                      height: 45
                    }
                  )}
                  alt={featuredCategories[deleteIndex].name}
                  style={{
                    width: 60,
                    height: 45,
                    objectFit: 'cover',
                    borderRadius: 6,
                    border: '1px solid #e2e8f0'
                  }}
                />
              )}
              <Box>
                <Typography
                  variant='body1'
                  sx={{ fontWeight: 600, color: '#1e293b' }}
                >
                  {featuredCategories[deleteIndex].name}
                </Typography>
                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{ fontFamily: 'monospace' }}
                >
                  {featuredCategories[deleteIndex].link || 'Chưa có link'}
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
            {deleting ? 'Đang xóa...' : 'Xóa danh mục'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default FeaturedCategoryManagement
