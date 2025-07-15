import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  CircularProgress,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Grid,
  Stack,
  Tooltip,
  useTheme,
  alpha,
  Skeleton
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Collections as CollectionsIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  Category as CategoryIcon,
  Inventory as InventoryIcon
} from '@mui/icons-material'
import { getCollections, deleteCollection } from '~/services/admin/webConfig/collectionService'
import AddCollection from './Modal/AddCollection'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'
import { RouteGuard } from '~/components/PermissionGuard'

const CollectionManagement = () => {
  const theme = useTheme()
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [openAddModal, setOpenAddModal] = useState(false)
  const [editingCollection, setEditingCollection] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    collection: null,
    index: null
  })
  const [deleting, setDeleting] = useState(false)

  // Fetch collections on component mount
  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getCollections()
      setCollections(data)
    } catch (err) {
      console.error('Error fetching collections:', err)
      setError(err.message || 'Không thể tải danh sách collections')
    } finally {
      setLoading(false)
    }
  }

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchCollections()
    setRefreshing(false)
  }

  const handleAddCollection = () => {
    setEditingCollection(null)
    setOpenAddModal(true)
  }

  const handleEditCollection = (collection, index) => {
    setEditingCollection({ ...collection, index })
    setOpenAddModal(true)
  }

  const handleDeleteCollection = (collection, index) => {
    setDeleteDialog({
      open: true,
      collection,
      index
    })
  }

  const confirmDelete = async () => {
    try {
      setDeleting(true)
      await deleteCollection(deleteDialog.index)
      setSuccess('Xóa collection thành công!')
      fetchCollections()
    } catch (err) {
      setError(err.message || 'Không thể xóa collection')
    } finally {
      setDeleting(false)
      setDeleteDialog({ open: false, collection: null, index: null })
    }
  }

  const handleModalClose = () => {
    setOpenAddModal(false)
    setEditingCollection(null)
  }

  const handleModalSuccess = () => {
    setSuccess(editingCollection ? 'Cập nhật collection thành công!' : 'Thêm collection thành công!')
    fetchCollections()
    handleModalClose()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success'
      case 'inactive':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Hoạt động'
      case 'inactive':
        return 'Không hoạt động'
      default:
        return 'Không xác định'
    }
  }

  const summaryData = [
    {
      title: 'Tổng bộ sưu tập',
      value: loading ? <Skeleton width={40} /> : collections.length,
      icon: <CollectionsIcon />,
      color: '#1976d2'
    },
    {
      title: 'Sản phẩm trong bộ sưu tập',
      value: loading ? <Skeleton width={40} /> : collections.reduce((total, col) => total + (col.products?.length || 0), 0),
      icon: <InventoryIcon />,
      color: '#2e7d32'
    },
    {
      title: 'Bộ sưu tập hoạt động',
      value: loading ? <Skeleton width={40} /> : collections.filter(col => col.status === 'active').length,
      icon: <CategoryIcon />,
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
      </TableCell>
      <TableCell>
        <Skeleton variant='text' width='40%' />
      </TableCell>
      <TableCell>
        <Skeleton variant='circular' width={32} height={32} />
      </TableCell>
      <TableCell>
        <Skeleton variant='circular' width={32} height={32} />
      </TableCell>
      <TableCell>
        <Skeleton variant='rectangular' width={80} height={24} />
      </TableCell>
    </TableRow>
  )

  return (
    <RouteGuard requiredPermissions={['admin:access', 'collection:use']}>
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
          <CollectionsIcon sx={{ fontSize: 40, color: 'var(--primary-color)' }} />
          Quản lý Bộ sưu tập
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Cấu hình và quản lý các bộ sưu tập sản phẩm hiển thị trên website
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

      {/* Success Alert */}
      {success && (
        <Alert severity='success' sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
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
          onClick={handleAddCollection}
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
          Thêm bộ sưu tập mới
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

      {/* Collections Table */}
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
                  Tên bộ sưu tập
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2 }}>
                  Mô tả
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2 }}>
                  Số sản phẩm
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
              ) : collections.length > 0 ? (
                // Actual data
                collections.map((collection, index) => (
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
                        {collection.imageUrl ? (
                          <img
                            src={optimizeCloudinaryUrl(collection.imageUrl, {
                              width: 80,
                              height: 60
                            })}
                            alt={collection.name}
                            style={{
                              width: 80,
                              height: 60,
                              objectFit: 'cover',
                              borderRadius: 8,
                              border: '1px solid #e2e8f0'
                            }}
                            onError={(e) => {
                              e.target.src = '/placeholder-image.jpg'
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
                            <CollectionsIcon sx={{ color: '#cbd5e1', fontSize: 24 }} />
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
                        {collection.name}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ 
                          maxWidth: 300,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {collection.description}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Chip
                        label={`${collection.products?.length || 0} sản phẩm`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Chip
                        label={getStatusLabel(collection.status)}
                        color={getStatusColor(collection.status)}
                        size="small"
                        sx={{ fontWeight: 600 }}
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
                            onClick={() => handleEditCollection(collection, index)}
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
                            onClick={() => handleDeleteCollection(collection, index)}
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
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                    {/* SVG No data icon */}
                    <svg
                      width='64'
                      height='41'
                      viewBox='0 0 64 41'
                      xmlns='http://www.w3.org/2000/svg'
                      style={{ marginBottom: 8 }}
                    >
                      <title>No data</title>
                      <g transform='translate(0 1)' fill='none' fillRule='evenodd'>
                        <ellipse fill='#f5f5f5' cx='32' cy='33' rx='32' ry='7'></ellipse>
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
                      Chưa có bộ sưu tập nào
                    </Typography>
                    <Button
                      variant='outlined'
                      startIcon={<AddIcon />}
                      onClick={handleAddCollection}
                      sx={{ mt: 2 }}
                    >
                      Thêm bộ sưu tập đầu tiên
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add/Edit Collection Modal */}
      <AddCollection
        open={openAddModal}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        editingCollection={editingCollection}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, collection: null, index: null })}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 400
          }
        }}
      >
        <DialogTitle 
          id="alert-dialog-title"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: '#dc2626',
            fontWeight: 600
          }}
        >
          <WarningIcon color="error" />
          Xác nhận xóa bộ sưu tập
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ mb: 2 }}>
            Bạn có chắc chắn muốn xóa bộ sưu tập này không?
          </DialogContentText>
          {deleteDialog.collection && (
            <Box sx={{ 
              p: 2, 
              backgroundColor: '#fef2f2', 
              borderRadius: 2, 
              border: '1px solid #fecaca',
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              {deleteDialog.collection.imageUrl && (
                <img
                  src={optimizeCloudinaryUrl(deleteDialog.collection.imageUrl, {
                    width: 60,
                    height: 45
                  })}
                  alt={deleteDialog.collection.name}
                  style={{
                    width: 60,
                    height: 45,
                    objectFit: 'cover',
                    borderRadius: 6,
                    border: '1px solid #e2e8f0'
                  }}
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg'
                  }}
                />
              )}
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  {deleteDialog.collection.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {deleteDialog.collection.description}
                </Typography>
                <Chip
                  label={`${deleteDialog.collection.products?.length || 0} sản phẩm`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </Box>
          )}
          <DialogContentText sx={{ mt: 2, color: '#dc2626', fontWeight: 500 }}>
            ⚠️ Hành động này không thể hoàn tác!
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setDeleteDialog({ open: false, collection: null, index: null })}
            variant="outlined"
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
            onClick={confirmDelete}
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} /> : <DeleteIcon />}
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
            {deleting ? 'Đang xóa...' : 'Xóa bộ sưu tập'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
      </Box>
    </RouteGuard>
  )
}

export default CollectionManagement
