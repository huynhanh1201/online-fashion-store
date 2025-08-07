import React, { useState, useEffect } from 'react'
import {
  Typography,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  Stack,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material'
import GavelIcon from '@mui/icons-material/Gavel'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import RefreshIcon from '@mui/icons-material/Refresh'
import WarningIcon from '@mui/icons-material/Warning'
import { toast } from 'react-toastify'
import { getPolicies, createPolicy, updatePolicy, deletePolicy } from '~/services/admin/policyService'
import PolicyModal from './Modal/AddPolicyModal'
import ViewPolicyModal from './Modal/ViewPolicyModal'
import DeletePolicyModal from './Modal/DeletePolicyModal'
import usePermissions from '~/hooks/usePermissions'
import { RouteGuard } from '~/components/PermissionGuard'

const POLICY_LABELS = {
  privacy_policy: 'Chính sách bảo mật',
  member_policy: 'Chính sách member',
  shipping_policy: 'Chính sách giao hàng',
  return_policy: 'Chính sách đổi trả và bảo hành',
  terms_of_service: 'Điều khoản sử dụng',
  warranty_policy: 'Chính sách bảo hành'
}

const POLICY_COLORS = {
  privacy_policy: 'secondary',
  member_policy: 'info',
  shipping_policy: 'primary',
  return_policy: 'success',
  terms_of_service: 'warning',
  warranty_policy: 'error'
}

export default function PolicyManagement() {
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [selectedPolicy, setSelectedPolicy] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [modalMode, setModalMode] = useState('add') // 'add' hoặc 'edit'
  const [openView, setOpenView] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { hasPermission } = usePermissions()

  // Load policies khi component mount
  useEffect(() => {
    fetchPolicies()
  }, [])

  const fetchPolicies = async () => {
    try {
      setError('')
      setLoading(true)
      const response = await getPolicies({ page: 1, limit: 100 })
      console.log('Raw response from API:', response)
      console.log('Policies data:', response.policies)
      // Filter policies: chỉ lấy destroy = false và type = 'policy'
      const filteredPolicies = response.policies.filter(policy =>
        policy.destroy === false && policy.type === 'policy'
      )
      console.log('Filtered policies:', filteredPolicies)
      setPolicies(filteredPolicies)
    } catch (error) {
      setError('Không thể tải danh sách chính sách')
      console.error('Lỗi khi tải danh sách chính sách:', error)
      toast.error('Không thể tải danh sách chính sách')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchPolicies()
    setRefreshing(false)
  }

  const handlePolicySave = async (policyData, isEditMode) => {
    try {
      // Map policy data to blog format (không bao gồm field type)
      const blogData = {
        title: policyData.title,
        excerpt: policyData.description, // Map description to excerpt
        content: policyData.content,
        category: policyData.type, // Map type to category
        type: 'policy', // Set type as policy
        status: policyData.status,
        coverImage: null,
        images: [],
        tags: [],
        brand: null,
        meta: {
          title: policyData.title,
          description: policyData.description,
          keywords: []
        }
      }
      if (isEditMode) {
        await updatePolicy(selectedPolicy._id, blogData)
        toast.success('Cập nhật chính sách thành công!')
      } else {
        await createPolicy(blogData)
        toast.success('Tạo chính sách thành công!')
      }
      setOpenModal(false)
      setSelectedPolicy(null)
      setModalMode('add')
      fetchPolicies() // Reload danh sách
    } catch (error) {
      toast.error('Không thể lưu chính sách. Vui lòng thử lại.')
    }
  }

  const handleDelete = async () => {
    if (!selectedPolicy) return
    try {
      setDeleting(true)
      await deletePolicy(selectedPolicy._id)
      toast.success('Xóa chính sách thành công!')
      setOpenDelete(false)
      setSelectedPolicy(null)
      fetchPolicies() // Reload danh sách
    } catch (error) {
      toast.error('Không thể xóa chính sách. Vui lòng thử lại.')
    } finally {
      setDeleting(false)
    }
  }

  const handleAdd = () => {
    setModalMode('add')
    setSelectedPolicy(null)
    setOpenModal(true)
  }

  const handleEdit = (policy) => {
    // Map blog data to policy format for editing
    const policyData = {
      ...policy,
      description: policy.excerpt, // Map excerpt to description
      type: policy.category // Map category to type
    }
    setSelectedPolicy(policyData)
    setModalMode('edit')
    setOpenModal(true)
  }

  const handleView = (policy) => {
    // Map blog data to policy format for viewing
    const policyData = {
      ...policy,
      description: policy.excerpt, // Map excerpt to description
      type: policy.category // Map category to type
    }
    setSelectedPolicy(policyData)
    setOpenView(true)
  }

  const handleDeleteClick = (policy) => {
    setSelectedPolicy(policy)
    setOpenDelete(true)
  }

  // Thống kê
  const totalPolicies = policies.length
  const activePolicies = policies.filter(p => p.status === 'active').length
  const draftPolicies = policies.filter(p => p.status === 'draft').length
  const archivedPolicies = policies.filter(p => p.status === 'archived').length

  // Lấy danh sách loại chính sách đã có
  const existingTypes = policies.map(p => p.category)

  // Loading skeleton
  const LoadingSkeleton = () => (
    <TableRow>
      <TableCell><Skeleton variant='text' width='60%' /></TableCell>
      <TableCell><Skeleton variant='text' width='40%' /></TableCell>
      <TableCell><Skeleton variant='text' width='30%' /></TableCell>
      <TableCell><Skeleton variant='circular' width={32} height={32} /></TableCell>
    </TableRow>
  )

  return (
    <RouteGuard requiredPermissions={['admin:access', 'policy:use']}>
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
            <GavelIcon sx={{ fontSize: 40, color: 'var(--primary-color)' }} />
            Quản lý Chính sách Website
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            Cấu hình và quản lý các chính sách hiển thị trên website
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
          {[{
            title: 'Tổng chính sách',
            value: totalPolicies,
            icon: <GavelIcon />,
            color: '#1976d2'
          }, {
            title: 'Đang hoạt động',
            value: activePolicies,
            icon: <GavelIcon />,
            color: '#2e7d32'
          }, {
            title: 'Bản nháp',
            value: draftPolicies,
            icon: <GavelIcon />,
            color: '#ed6c02'
          }, {
            title: 'Lưu trữ',
            value: archivedPolicies,
            icon: <GavelIcon />,
            color: '#9c27b0'
          }].map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
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
                <CardContent sx={{ pl: 4, py: 2, width: '15vw', backgroundColor: '#f5f5f5' }}>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5,fontWeight: 'bold' , fontSize: '20px'}}>
                    {item.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ color: item.color || '#22c55e', fontSize: 28, fontWeight: 700 }}>
                      {item.icon}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, ml: 1 }}>
                      {loading ? <Skeleton width={40} /> : item.value}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {hasPermission('policy:create') && (

            <Button
              variant='contained'
              startIcon={<AddIcon />}
              onClick={handleAdd}
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
              Thêm chính sách
            </Button>
          )}
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
                    Tiêu đề
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#334155', py: 2 }}>
                    Loại chính sách
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
                  Array.from({ length: 3 }).map((_, index) => (
                    <LoadingSkeleton key={index} />
                  ))
                ) : policies.length > 0 ? (
                  policies.map((policy) => {
                    console.log('Rendering policy:', policy)
                    return (
                    <TableRow
                      key={policy._id}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#f1f5f9'
                        },
                        '&:last-child td, &:last-child th': { border: 0 }
                      }}
                    >
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant='body2' sx={{ fontWeight: 600, color: '#1e293b' }}>
                          {policy.title}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Chip
                          label={POLICY_LABELS[policy.category] || policy.category}
                          color={POLICY_COLORS[policy.category] || 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Chip
                          label={
                            policy.status === 'active' ? 'Hoạt động' :
                            policy.status === 'draft' ? 'Bản nháp' :
                            policy.status === 'archived' ? 'Lưu trữ' :
                            policy.status
                          }
                          color={
                            policy.status === 'active' ? 'success' :
                            policy.status === 'draft' ? 'warning' :
                            policy.status === 'archived' ? 'secondary' :
                            'default'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Stack direction='row' spacing={1}>
                          {hasPermission('policy:read') && (
                            <Tooltip title='Xem chi tiết'>
                              <IconButton size='small' onClick={() => handleView(policy)}>
                                <VisibilityIcon fontSize='small' />
                              </IconButton>
                            </Tooltip>
                          )}
                          {hasPermission('policy:update') && (
                            <Tooltip title='Chỉnh sửa'>
                              <IconButton size='small' onClick={() => handleEdit(policy)}>
                                <EditIcon fontSize='small' />
                              </IconButton>
                            </Tooltip>
                          )}
                          {hasPermission('policy:delete') && (
                            <Tooltip title='Xóa'>
                              <IconButton size='small' color='error' onClick={() => handleDeleteClick(policy)}>
                                <DeleteIcon fontSize='small' />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
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
                        Chưa có chính sách nào
                      </Typography>
                      <Button
                        variant='outlined'
                        startIcon={<AddIcon />}
                        onClick={handleAdd}
                        sx={{ mt: 2 }}
                      >
                        Thêm chính sách đầu tiên
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Modal Thêm/Sửa */}
        <PolicyModal
          open={openModal}
          onClose={() => {
            setOpenModal(false)
            setSelectedPolicy(null)
            setModalMode('add')
          }}
          onSave={handlePolicySave}
          policyData={selectedPolicy}
          mode={modalMode}
          existingTypes={existingTypes}
        />
        {/* Modal Xem chi tiết */}
        <ViewPolicyModal
          open={openView}
          policy={selectedPolicy}
          onClose={() => {
            setOpenView(false)
            setSelectedPolicy(null)
          }}
        />
        {/* Modal Xác nhận xóa */}
        <Dialog
          open={openDelete}
          onClose={() => {
            setOpenDelete(false)
            setSelectedPolicy(null)
          }}
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
            Xác nhận xóa chính sách
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description" sx={{ mb: 2 }}>
              Bạn có chắc chắn muốn xóa chính sách này không?
            </DialogContentText>
            {selectedPolicy && (
              <Box sx={{
                p: 2,
                backgroundColor: '#fef2f2',
                borderRadius: 2,
                border: '1px solid #fecaca',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                    {selectedPolicy.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {POLICY_LABELS[selectedPolicy.category] || selectedPolicy.category}
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
              onClick={() => {
                setOpenDelete(false)
                setSelectedPolicy(null)
              }}
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
              onClick={handleDelete}
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
              {deleting ? 'Đang xóa...' : 'Xóa chính sách'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </RouteGuard>
  )
}
