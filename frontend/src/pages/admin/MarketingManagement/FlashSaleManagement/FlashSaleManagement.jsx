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
  Tooltip,
  Alert
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
  ExpandMore as ExpandMoreIcon,
  Stop as StopIcon
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
  removeProductFromFlashSaleCampaign,
  checkAndRestoreExpiredFlashSales,
  restoreFlashSaleCampaignPrices
} from '~/services/admin/webConfig/flashsaleService'
import { getProducts } from '~/services/productService'
import { getProductVariants, restoreProductVariantsOriginalDiscountPrice } from '~/services/admin/variantService'

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
  const [success, setSuccess] = useState('')
  const [warning, setWarning] = useState('')
  const [restoringPrices, setRestoringPrices] = useState({})
  const [restoringAllPrices, setRestoringAllPrices] = useState(false)

  useEffect(() => {
    fetchCampaigns()
  }, [])

  // Tự động kiểm tra và khôi phục giá cho Flash Sale hết thời gian
  useEffect(() => {
    // Kiểm tra ngay khi component mount
    const checkExpiredFlashSales = async () => {
      try {
        await checkAndRestoreExpiredFlashSales()
      } catch (err) {
        console.error('Lỗi khi tự động kiểm tra Flash Sale hết thời gian:', err)
      }
    }
    
    checkExpiredFlashSales()

    // Kiểm tra định kỳ mỗi 5 phút
    const interval = setInterval(checkExpiredFlashSales, 5 * 60 * 1000)

    return () => clearInterval(interval)
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
          const enrichedProducts = await Promise.all(
            campaign.products.map(async (item) => {
              const prod = allProducts.find((p) => p._id === item.productId)
              
              // Lấy thông tin variants để có originalDiscountPrice
              let originalDiscountPrice = null
              try {
                const variants = await getProductVariants(item.productId)
                if (variants && variants.length > 0) {
                  // Lấy originalDiscountPrice từ variant đầu tiên (giả sử tất cả variants có cùng giá)
                  originalDiscountPrice = variants[0]?.originalDiscountPrice || 0
                }
              } catch (err) {
                console.error('Lỗi khi lấy thông tin variants:', err)
                originalDiscountPrice = 0
              }
              
              return {
                ...item,
                productName: item.name || prod?.name || '---',
                image: prod?.image || [],
                stock: prod?.stock,
                campaignId: campaign.id,
                originalDiscountPrice: originalDiscountPrice
              }
            })
          )
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

  // Kiểm tra và khôi phục giá cho Flash Sale hết thời gian
  const handleCheckAndRestoreExpired = async () => {
    try {
      setRefreshing(true)
      const expiredCount = await checkAndRestoreExpiredFlashSales()
      if (expiredCount > 0) {
        setSuccess(`Đã khôi phục giá cho ${expiredCount} Flash Sale hết thời gian`)
      } else {
        setSuccess('Không có Flash Sale nào hết thời gian cần khôi phục')
      }
      await fetchCampaigns() // Refresh lại danh sách
    } catch (err) {
      setError('Không thể kiểm tra và khôi phục Flash Sale hết thời gian')
      console.error(err)
    } finally {
      setRefreshing(false)
    }
  }

  // Khôi phục giá cho một campaign cụ thể
  const handleRestoreCampaignPrices = async (campaign) => {
    try {
      setRefreshing(true)
      const results = await restoreFlashSaleCampaignPrices(campaign.id)
      const successCount = results.filter(r => r.success).length
      const failCount = results.filter(r => !r.success).length
      
      if (successCount > 0) {
        setSuccess(`Đã khôi phục giá cho ${successCount} sản phẩm trong chiến dịch "${campaign.title}"`)
      }
      if (failCount > 0) {
        setWarning(`Không thể khôi phục giá cho ${failCount} sản phẩm`)
      }
      await fetchCampaigns() // Refresh lại danh sách
    } catch (err) {
      setError('Không thể khôi phục giá cho chiến dịch này')
      console.error(err)
    } finally {
      setRefreshing(false)
    }
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
    if (!deleteCampaign) return

    try {
      await deleteFlashSaleCampaign(deleteCampaign.id)
      setSuccess('Đã xóa chiến dịch Flash Sale thành công!')
      await fetchCampaigns()
    } catch (err) {
      setError('Không thể xóa chiến dịch Flash Sale')
      console.error(err)
    } finally {
      setDeleteModal(false)
      setSelectedDeleteCampaign(null)
    }
  }

  const handleEndCampaignEarly = async (campaign) => {
    try {
      // Cập nhật thời gian kết thúc thành thời gian hiện tại
      const updatedCampaign = {
        ...campaign,
        endTime: new Date().toISOString()
      }
      
      await updateFlashSaleCampaign(campaign.id, updatedCampaign)
      setSuccess('Đã kết thúc sớm chiến dịch Flash Sale thành công!')
      await fetchCampaigns()
    } catch (err) {
      setError('Không thể kết thúc sớm chiến dịch Flash Sale')
      console.error(err)
    }
  }

  // Khôi phục giá về ban đầu cho một Flash Sale cụ thể
  const handleRestorePricesForCampaign = async (campaignId, productId) => {
    try {
      setRestoringPrices(prev => ({ ...prev, [campaignId]: true }))
      await restoreProductVariantsOriginalDiscountPrice(productId)
      setSuccess('Đã khôi phục giá về ban đầu cho tất cả biến thể của sản phẩm')
      // Refresh data
      fetchCampaigns()
    } catch (error) {
      console.error('Lỗi khi khôi phục giá:', error)
      setError(`Không thể khôi phục giá: ${error.message}`)
    } finally {
      setRestoringPrices(prev => ({ ...prev, [campaignId]: false }))
    }
  }

  // Khôi phục giá về ban đầu cho tất cả Flash Sale đã hết hạn
  const handleRestoreAllExpiredPrices = async () => {
    try {
      setRestoringAllPrices(true)
      const expiredCampaigns = campaigns.filter(campaign => 
        new Date(campaign.endTime) < new Date() && campaign.status === 'active'
      )
      
      if (expiredCampaigns.length === 0) {
        setWarning('Không có Flash Sale nào đã hết hạn cần khôi phục giá')
        return
      }

      const restorePromises = expiredCampaigns.map(campaign => 
        restoreProductVariantsOriginalDiscountPrice(campaign.productId)
      )
      
      await Promise.all(restorePromises)
      setSuccess(`Đã khôi phục giá về ban đầu cho ${expiredCampaigns.length} Flash Sale đã hết hạn`)
      // Refresh data
      fetchCampaigns()
    } catch (error) {
      console.error('Lỗi khi khôi phục tất cả giá:', error)
      setError(`Không thể khôi phục giá: ${error.message}`)
    } finally {
      setRestoringAllPrices(false)
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
          <OfferIcon sx={{ fontSize: 40, color: 'var(--primary-color)' }} />
          Quản lý chương trình khuyến mãi
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Quản lý và theo dõi các chiến dịch khuyên mãi
        </Typography>
      </Box>

      {/* Notifications */}
      {error && (
        <Alert
          severity='error'
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity='success'
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setSuccess('')}
        >
          {success}
        </Alert>
      )}

      {warning && (
        <Alert
          severity='warning'
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setWarning('')}
        >
          {warning}
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
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
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
              background: 'var(--primary-color)',
              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)',
              '&:hover': {
                background: 'var(--accent-color)',
                boxShadow: '0 6px 20px rgba(59, 130, 246, 0.6)',
                transform: 'translateY(-1px)'
              }
            }}
          >
            Thêm chiến dịch mới
          </Button>

          <Button
            variant='outlined'
            color='warning'
            startIcon={<RefreshIcon />}
            onClick={handleRestoreAllExpiredPrices}
            disabled={restoringAllPrices}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              borderColor: 'var(--warning-color)',
              color: 'var(--warning-color)',
              '&:hover': {
                borderColor: 'var(--warning-hover-color)',
                backgroundColor: 'var(--warning-light-color)'
              }
            }}
          >
            {restoringAllPrices ? 'Đang khôi phục...' : 'Khôi phục giá tất cả Flash Sale hết hạn'}
          </Button>
        </Box>

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
                    
                    {/* Nút khôi phục giá cho campaign hết thời gian */}
                    {campaign.status === 'expired' && (
                      <Tooltip title='Khôi phục giá về ban đầu'>
                        <IconButton
                          size='small'
                          sx={{
                            color: '#ed6c02',
                            '&:hover': { backgroundColor: '#fff3e0' }
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRestoreCampaignPrices(campaign)
                          }}
                        >
                          <RefreshIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                    )}
                    
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
                    {/* Nút kết thúc sớm chỉ hiển thị cho chiến dịch đang hoạt động */}
                    {(campaign.status === 'active' || campaign.status === 'upcoming') && (
                      <Tooltip title='Kết thúc sớm'>
                        <IconButton
                          size='small'
                          sx={{
                            color: '#f59e0b',
                            '&:hover': { backgroundColor: '#fef3c7' }
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEndCampaignEarly(campaign)
                          }}
                        >
                          <StopIcon fontSize='small' />
                        </IconButton>
                      </Tooltip>
                    )}
                    {/* Nút xóa chỉ hiển thị cho chiến dịch đã kết thúc hoặc bị tắt */}
                    {(campaign.status === 'expired' || campaign.status === 'disabled') && (
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
                    )}
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
                          Giá giảm ban đầu
                        </TableCell>
                        <TableCell
                          sx={{ fontWeight: 700, color: '#334155', py: 2 }}
                        >
                          Giá giảm hiện tại
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
                                fontWeight: 600,
                                color: '#059669',
                                fontSize: '1rem'
                              }}
                            >
                              {item.originalDiscountPrice != null && item.originalDiscountPrice > 0
                                ? Number(item.originalDiscountPrice).toLocaleString()
                                : 'Chưa có'}
                              {item.originalDiscountPrice > 0 && ' đ'}
                            </Typography>
                            {item.originalDiscountPrice > 0 && (
                              <Typography
                                variant='caption'
                                sx={{
                                  color: '#6b7280',
                                  fontStyle: 'italic'
                                }}
                              >
                                Giá giảm trước
                              </Typography>
                            )}
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
                            <Typography
                              variant='caption'
                              sx={{
                                color: '#dc2626',
                                fontWeight: 600
                              }}
                            >
                              Giá giảm sau
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Stack spacing={0.5}>
                              {/* Giảm giá so với giá gốc */}
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
                              {/* Giảm giá so với giá ban đầu (nếu có) */}
                              {item.originalDiscountPrice > 0 && (
                                <Chip
                                  label={`-${calculateDiscount(item.originalDiscountPrice, item.flashPrice)}%`}
                                  size='small'
                                  sx={{
                                    backgroundColor: '#f0fdf4',
                                    color: '#059669',
                                    fontWeight: 600,
                                    border: '1px solid #bbf7d0',
                                    fontSize: '0.7rem'
                                  }}
                                />
                              )}
                            </Stack>
                            <Typography
                              variant='caption'
                              sx={{
                                color: '#6b7280',
                                display: 'block',
                                mt: 0.5
                              }}
                            >
                              {item.originalDiscountPrice > 0 
                                ? 'So với giá gốc / So với giá ban đầu'
                                : 'So với giá gốc'
                              }
                            </Typography>
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
                              {/* Nút khôi phục giá cho sản phẩm trong Flash Sale hết thời gian */}
                              {campaign.status === 'expired' && (
                                <Tooltip title='Khôi phục giá về ban đầu'>
                                  <IconButton
                                    size='small'
                                    sx={{
                                      color: '#ed6c02',
                                      '&:hover': { backgroundColor: '#fff3e0' }
                                    }}
                                    onClick={() =>
                                      handleRestorePricesForCampaign(campaign.id, item.productId)
                                    }
                                    disabled={restoringPrices[campaign.id]}
                                  >
                                    <RefreshIcon fontSize='small' />
                                  </IconButton>
                                </Tooltip>
                              )}
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
                              {/* Nút kết thúc sớm chỉ hiển thị cho sản phẩm trong chiến dịch đang hoạt động */}
                              {(campaign.status === 'active' || campaign.status === 'upcoming') && (
                                <Tooltip title='Kết thúc sớm sản phẩm này'>
                                  <IconButton
                                    size='small'
                                    sx={{
                                      color: '#f59e0b',
                                      '&:hover': { backgroundColor: '#fef3c7' }
                                    }}
                                    onClick={() =>
                                      handleEndCampaignEarly(campaign)
                                    }
                                  >
                                    <StopIcon fontSize='small' />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {/* Nút xóa chỉ hiển thị cho sản phẩm trong chiến dịch đã kết thúc hoặc bị tắt */}
                              {(campaign.status === 'expired' || campaign.status === 'disabled') && (
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
                              )}
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