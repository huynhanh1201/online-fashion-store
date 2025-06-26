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
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip // Added Tooltip import
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalOffer as OfferIcon,
  Schedule as ScheduleIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material'
import AddFlashSale from './Modal/AddFlashSale.jsx'
import EditFlashSaleModal from './Modal/EditFlashSaleModal'
import DeleteFlashSaleModal from './Modal/DeleteFlashSaleModal'
import {
  getFlashSaleCampaigns,
  getFlashSaleCampaignStatus,
  updateFlashSaleCampaign,
  deleteFlashSaleCampaign,
  updateProductInFlashSaleCampaign,
  removeProductFromFlashSaleCampaign
} from '~/services/admin/webConfig/flashsaleService'
import { getProducts } from '~/services/productService'

const FlashSaleManagement = () => {
  const theme = useTheme()

  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openAddModal, setModal] = useState(false) // Fixed: Renamed setOpenAddModal to avoid conflict with setter name
  const [refreshing, setRefreshing] = useState(false) // Fixed: Added comma for consistency
  const [editModalOpen, setEditModalOpen] = useState(false) // Fixed: Renamed for clarity
  const [deleteModal, setDeleteModalOpen] = useState(false) // Fixed: Renamed for clarity
  const [deleteCampaignModalOpen, setDeleteModal] = useState(false) // Fixed: Renamed for clarity
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedCampaignId, setSelectedCampaignId] = useState(null) // Fixed: Renamed for clarity
  const [deleteCampaign, setSelectedDeleteCampaign] = useState(null) // Fixed: Renamed for clarity
  const [editCampaignData, setEditCampaignData] = useState(null)

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    setLoading(true)
    setError('')
    try {
      const campaignsData = await getFlashSaleCampaigns()
      const { products: allProducts = [] } = await getProducts({
        page: 1,
        limit: 1000
      })

      const enrichedCampaigns = await Promise.all(
        campaignsData.map(async (campaign) => {
          const status = await getFlashSaleCampaignStatus(campaign.id)
          const enrichedProducts = campaign.products.map((item) => {
            const prod = allProducts.find((p) => p._id === item.productId)
            return {
              ...item,
              productName: item.name || prod?.name || '---',
              image: prod?.image || [],
              stock: prod?.stock,
              campaignId: campaign.id
            }
          })
          return {
            ...campaign,
            status,
            products: enrichedProducts
          }
        })
      )

      setCampaigns(enrichedCampaigns)
    } catch (err) {
      setError('Không thể tải dữ liệu Flash Sale')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (isoString) => new Date(isoString).toLocaleString('vi-VN')

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'warning'
      case 'active':
        return 'success'
      case 'expired':
        return 'default'
      case 'disabled':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'upcoming':
        return 'Sắp diễn ra'
      case 'active':
        return 'Đang diễn ra'
      case 'expired':
        return 'Đã kết thúc'
      case 'disabled':
        return 'Đã tắt'
      default:
        return 'Không xác định'
    }
  }

  const calculateDiscount = (originalPrice, flashPrice) => {
    return Math.round(((originalPrice - flashPrice) / originalPrice) * 100)
  }

  const handleAddFlashSale = async () => {
    await fetchCampaigns()
    setModal(false)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchCampaigns()
    setRefreshing(false)
  }

  const handleEditClick = (product, campaignId) => {
    setSelectedProduct(product)
    setSelectedCampaignId(campaignId)
    setEditModalOpen(true)
  }

  const handleEditSave = async (updatedProduct) => {
    setEditModalOpen(false)
    try {
      await updateProductInFlashSaleCampaign(
        selectedCampaignId,
        updatedProduct.productId,
        {
          flashPrice: updatedProduct.flashPrice
        }
      )
      await fetchCampaigns()
    } catch (err) {
      setError('Không thể cập nhật sản phẩm Flash Sale')
    } finally {
      setSelectedProduct(null)
      setSelectedCampaignId(null)
    }
  }

  const handleDeleteClick = (product, campaignId) => {
    setSelectedProduct(product)
    setSelectedCampaignId(campaignId)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    setDeleteModalOpen(false)
    try {
      await removeProductFromFlashSaleCampaign(
        selectedCampaignId,
        selectedProduct.productId
      )
      await fetchCampaigns()
    } catch (err) {
      setError('Không thể xóa sản phẩm Flash Sale')
    } finally {
      setSelectedProduct(null)
      setSelectedCampaignId(null)
    }
  }

  const handleToggleCampaign = async (campaign) => {
    try {
      const updatedCampaign = { ...campaign, enabled: !campaign.enabled }
      await updateFlashSaleCampaign(campaign.id, updatedCampaign)
      await fetchCampaigns()
    } catch (err) {
      setError('Không thể cập nhật trạng thái chiến dịch')
      console.error(err)
    }
  }

  const handleEditCampaign = (campaign) => {
    setEditCampaignData(campaign)
    setModal(true)
  }

  const handleDeleteCampaignClick = (campaign) => {
    setSelectedDeleteCampaign(campaign)
    setDeleteModal(true)
  }

  const handleDeleteCampaignConfirm = async () => {
    setDeleteModal(false)
    try {
      await deleteFlashSaleCampaign(deleteCampaign.id)
      await fetchCampaigns()
    } catch (err) {
      setError('Không thể xóa chiến dịch Flash Sale')
      console.error(err)
    } finally {
      setSelectedDeleteCampaign(null)
    }
  }

  const summaryData = [
    {
      title: 'Tổng chiến dịch',
      value: campaigns.length,
      icon: <OfferIcon />,
      color: '#1976d2'
    },
    {
      title: 'Đang hoạt động',
      value: campaigns.filter((item) => item.status === 'active').length,
      icon: <TrendingUpIcon />,
      color: '#2e7d32'
    },
    {
      title: 'Sắp diễn ra',
      value: campaigns.filter((item) => item.status === 'upcoming').length,
      icon: <ScheduleIcon />,
      color: '#ed6c02'
    },
    {
      title: 'Tổng sản phẩm',
      value: campaigns.reduce((sum, item) => sum + item.products.length, 0),
      icon: <InventoryIcon />,
      color: '#9c27b0'
    }
  ]

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
          <OfferIcon sx={{ fontSize: 40, color: '#1A3C7B' }} />
          Quản lý chương trình khuyến mãi
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Quản lý và theo dõi các chiến dịch khuyên mãi
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
            setEditCampaignData(null)
            setModal(true)
          }}
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            background:
              'linear-gradient(135deg, rgb(17, 58, 122) 0%, rgb(11, 49, 156) 100%)',
            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              boxShadow: '0 6px 20px rgba(59, 130, 246, 0.6)',
              transform: 'translateY(-1px)'
            }
          }}
        >
          Thêm chiến dịch mới
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

      <AddFlashSale
        open={openAddModal}
        onClose={() => setModal(false)}
        onSave={handleAddFlashSale}
        initialData={editCampaignData}
      />

      {/* Edit Modal */}
      <EditFlashSaleModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        product={selectedProduct}
        onSave={handleEditSave}
      />
      {/* Delete Product Modal */}
      <DeleteFlashSaleModal
        open={deleteModal}
        onClose={() => setDeleteModalOpen(false)}
        product={selectedProduct}
        onDelete={handleDeleteConfirm}
      />
      {/* Delete Campaign Modal */}
      <Dialog
        open={deleteCampaignModalOpen}
        onClose={() => setDeleteModal(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle
          sx={{
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            py: 2,
            fontWeight: 700,
            color: '#1e293b'
          }}
        >
          Xác nhận xóa chiến dịch
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography variant='body1'>
            Bạn có chắc chắn muốn xóa chiến dịch{' '}
            <strong>{deleteCampaign?.title}</strong> (ID: {deleteCampaign?.id})?
            Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            p: 2,
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #e2e8f0'
          }}
        >
          <Button
            onClick={() => setDeleteModal(false)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              color: '#64748b'
            }}
          >
            Hủy
          </Button>
          <Button
            variant='contained'
            color='error'
            onClick={handleDeleteCampaignConfirm}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Campaign List */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0'
        }}
      >
        {loading ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            Đang tải dữ liệu Flash Sale...
          </Box>
        ) : error ? (
          <Box sx={{ p: 4, textAlign: 'center', color: 'red' }}>{error}</Box>
        ) : campaigns.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant='body1' color='text.secondary'>
              Chưa có chiến dịch Flash Sale nào.
            </Typography>
          </Box>
        ) : (
          campaigns.map((campaign) => (
            <Accordion key={campaign.id}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: '#f8f6fc',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04)
                  }
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    width: '100%'
                  }}
                >
                  <Typography variant='h6' sx={{ fontWeight: 600, flex: 1 }}>
                    {campaign.title} (ID: {campaign.id})
                  </Typography>
                  <Stack direction='row' spacing={1} alignItems='center'>
                    <Tooltip
                      title={
                        campaign.enabled ? 'Tắt chiến dịch' : 'Bật chiến dịch'
                      }
                    >
                      <Switch
                        checked={campaign.enabled}
                        onChange={() => handleToggleCampaign(campaign)}
                        color='primary'
                      />
                    </Tooltip>
                    <Tooltip title='Chỉnh sửa chiến dịch'>
                      <IconButton
                        size='small'
                        sx={{
                          color: '#3b82f6',
                          '&:hover': { backgroundColor: '#dbeafe' }
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditCampaign(campaign)
                        }}
                      >
                        <EditIcon fontSize='small' />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Xóa chiến dịch'>
                      <IconButton
                        size='small'
                        sx={{
                          color: '#ef4444',
                          '&:hover': { backgroundColor: '#fee2e2' }
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteCampaignClick(campaign)
                        }}
                      >
                        <DeleteIcon fontSize='small' />
                      </IconButton>
                    </Tooltip>
                    <Chip
                      label={getStatusLabel(campaign.status)}
                      color={getStatusColor(campaign.status)}
                      size='small'
                      sx={{ fontWeight: 600, borderRadius: 2 }}
                    />
                  </Stack>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ mb: 2 }}>
                  <Typography variant='body2' color='text.secondary'>
                    Bắt đầu:{' '}
                    {campaign.startTime
                      ? formatTime(campaign.startTime)
                      : '---'}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Kết thúc:{' '}
                    {campaign.endTime ? formatTime(campaign.endTime) : '---'}
                  </Typography>
                </Box>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                        <TableCell
                          sx={{ fontWeight: 700, color: '#334155', py: 2 }}
                        >
                          Sản phẩm
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 700, color: '#334155', py: 2 }}
                        >
                          Giá gốc
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 700, color: '#334155', py: 2 }}
                        >
                          Giá Flash
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 700, color: '#334155', py: 2 }}
                        >
                          Giảm giá
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 700, color: '#334155', py: 2 }}
                        >
                          Số lượng
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 700, color: '#334155', py: 2 }}
                        >
                          Thao tác
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {campaign.products.map((item, index) => (
                        <TableRow
                          key={item.productId || index}
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
                            <Typography
                              variant='body1'
                              sx={{ fontWeight: 600, color: '#1e293b' }}
                            >
                              {item.productName}
                            </Typography>
                            <Typography
                              variant='caption'
                              color='text.secondary'
                            >
                              ID: {item.productId}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Typography
                              variant='body1'
                              sx={{
                                color: '#64748b',
                                textDecoration: 'line-through'
                              }}
                            >
                              {item.originalPrice != null
                                ? Number(item.originalPrice).toLocaleString()
                                : '---'}
                              đ
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
                              {item.flashPrice != null
                                ? Number(item.flashPrice).toLocaleString()
                                : '---'}
                              đ
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
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                              }}
                            >
                              <InventoryIcon
                                sx={{ fontSize: 16, color: '#6b7280' }}
                              />
                              <Typography
                                variant='body2'
                                sx={{ fontWeight: 600 }}
                              >
                                {item.stock != null ? item.stock : 0}
                              </Typography>
                            </Box>
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
                                  onClick={() =>
                                    handleEditClick(item, campaign.id)
                                  }
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
                                  onClick={() =>
                                    handleDeleteClick(item, campaign.id)
                                  }
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
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Card>
    </Box>
  )
}

export default FlashSaleManagement