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
  Skeleton,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  Switch,
  FormControlLabel
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Announcement as BannerIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
  Menu as MenuIcon,
  ExpandMore as ExpandMoreIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  DragIndicator as DragIcon
} from '@mui/icons-material'
import AddHeader from './Modal/AddHeader.jsx'
import MegaMenuEditor from './Modal/MegaMenuEditor.jsx'
import {
  getHeaderConfig,
  getMenuConfig,
  getDefaultMenuStructure,
  validateMenuContent
} from '~/services/admin/webConfig/headerService.js'
import {
  getCategories,
  updateCategory
} from '~/services/admin/categoryService.js'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'
import usePermissions from '~/hooks/usePermissions'

const HeaderManagement = () => {
  const theme = useTheme()
  const [openModal, setOpenModal] = useState(false)
  const [openMenuModal, setOpenMenuModal] = useState(false)
  const [headerData, setHeaderData] = useState(null)
  const [menuData, setMenuData] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [expandedCategories, setExpandedCategories] = useState(new Set())
  const { hasPermission } = usePermissions()

  // Fetch header data
  const fetchHeaderData = async () => {
    try {
      setError('')
      const [header, menu, categoriesResponse] = await Promise.all([
        getHeaderConfig(),
        getMenuConfig(),
        getCategories()
      ])
      setHeaderData(header)
      setMenuData(menu)
      setCategories(categoriesResponse?.categories || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching data:', err)
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

  // Handle success from Chart
  const handleModalSuccess = (result) => {
    console.log('Header updated successfully:', result)
    // Refresh data after successful update
    fetchHeaderData()
  }

  // Handle success from menu Chart
  const handleMenuModalSuccess = (result) => {
    console.log('Menu updated successfully:', result)
    // Refresh data after successful update
    fetchHeaderData()
  }

  // Handle toggle category visibility
  const handleToggleCategoryVisibility = async (
    categoryId,
    currentDestroyStatus
  ) => {
    try {
      const newDestroyStatus = !currentDestroyStatus

      // Optimistic update
      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat._id === categoryId ? { ...cat, destroy: newDestroyStatus } : cat
        )
      )

      // Call API to update category destroy status
      const result = await updateCategory(categoryId, {
        destroy: newDestroyStatus
      })

      if (!result) {
        // Revert optimistic update on error
        fetchHeaderData()
      }
    } catch (error) {
      console.error('Error toggling category visibility:', error)
      // Revert optimistic update on error
      fetchHeaderData()
    }
  }

  // Toggle expanded state for a category
  const handleToggleExpanded = (categoryId) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  // Get child categories for a parent
  const getChildCategories = (parentId) => {
    return categories.filter(
      (cat) =>
        cat.parent &&
        (typeof cat.parent === 'object' ? cat.parent._id : cat.parent) ===
          parentId
    )
  }

  // Get only parent categories
  const getParentCategories = () => {
    return categories.filter((cat) => !cat.parent || cat.parent === null)
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
    },
    {
      title: 'Menu items',
      value: menuData?.content?.mainMenu?.length || 0,
      icon: <MenuIcon />,
      color: '#9c27b0'
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

  // Menu item component
  const MenuItemDisplay = ({ item, level = 0 }) => (
    <Box sx={{ ml: level * 2 }}>
      <Stack direction='row' alignItems='center' spacing={1}>
        <DragIcon sx={{ color: '#9ca3af', fontSize: 16 }} />
        <Chip
          label={item.label}
          size='small'
          variant='outlined'
          sx={{
            fontWeight: 600,
            backgroundColor: item.visible ? '#f0f9ff' : '#fef2f2',
            borderColor: item.visible
              ? 'var(--primary-color)'
              : 'var(--error-color)',
            color: item.visible ? 'var(--primary-color)' : 'var(--error-color)'
          }}
        />
        {!item.visible && (
          <VisibilityOffIcon
            sx={{ color: 'var(--error-color)', fontSize: 16 }}
          />
        )}
        {item.children && item.children.length > 0 && (
          <Badge
            badgeContent={item.children.length}
            color='primary'
            size='small'
          >
            <MenuIcon sx={{ color: '#6b7280', fontSize: 16 }} />
          </Badge>
        )}
      </Stack>
      {item.children && item.children.length > 0 && (
        <Box sx={{ mt: 1 }}>
          {item.children.map((child, index) => (
            <MenuItemDisplay key={index} item={child} level={level + 1} />
          ))}
        </Box>
      )}
    </Box>
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
          <ImageIcon sx={{ fontSize: 40, color: 'var(--primary-color)' }} />
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

      {/* Tabs */}
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem'
            }
          }}
        >
          <Tab label='Logo & Nội dung thông báo chạy' />
          <Tab label='Chỉnh sửa Menu mở rộng' />
          <Tab label='Chỉnh sửa menu danh mục' />
        </Tabs>
      </Card>

      {/* Tab Content */}
      {activeTab === 0 && (
        <>
          {/* Action Buttons */}
          <Box
            sx={{
              mb: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            {hasPermission('headerContent:create') && (

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
                  background: 'var(--primary-color)',
                  '&:hover': {
                    background: 'var(--accent-color)'
                  }
                }}
              >
                {headerData ? 'Chỉnh sửa nội dung' : 'Tạo nội dung mới'}
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

          {/* Header Table */}
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
                    <TableCell
                      sx={{ fontWeight: 700, color: '#334155', py: 2 }}
                    >
                      Logo
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 700, color: '#334155', py: 2 }}
                    >
                      Top Banner
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 700, color: '#334155', py: 2 }}
                    >
                      Trạng thái
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
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.04
                          )
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
                                        sx={{
                                          fontWeight: 600,
                                          color: '#1e293b'
                                        }}
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
                      {hasPermission('headerContent:update') && (

                        <TableCell sx={{ py: 2 }}>
                          <Stack direction='row' spacing={1}>
                            <Tooltip title='Chỉnh sửa'>
                              <IconButton
                                size='small'
                                sx={{
                                  color: 'var(--primary-color)',
                                  '&:hover': { backgroundColor: '#dbeafe' }
                                }}
                                onClick={() => setOpenModal(true)}
                              >
                                <EditIcon fontSize='small' />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      )}
                    </TableRow>
                  ) : (
                    // No data
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        sx={{ textAlign: 'center', py: 4 }}
                      >
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
                          Chưa có cấu hình header nào
                        </Typography>

                        {hasPermission('headerContent:create') && (
                          <Button
                            variant='outlined'
                            startIcon={<AddIcon />}
                            onClick={() => setOpenModal(true)}
                            sx={{ mt: 2 }}
                          >
                            Tạo cấu hình đầu tiên
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </>
      )}

      {activeTab === 1 && (
        <>
          {/* Menu Action Buttons */}
          <Box
            sx={{
              mb: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >

            {hasPermission('headerContent:create') && (

              <Button
                variant='contained'
                onClick={() => setOpenMenuModal(true)}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  background: 'var(--primary-color)',
                  '&:hover': {
                    background: 'var(--accent-color)'
                  }
                }}
              >
                {menuData ? 'Chỉnh sửa menu' : 'Tạo menu mới'}
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

          {/* Menu Table */}
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
                    <TableCell
                      sx={{ fontWeight: 700, color: '#334155', py: 2 }}
                    >
                      Thứ tự
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 700, color: '#334155', py: 2 }}
                    >
                      Tên menu
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 700, color: '#334155', py: 2 }}
                    >
                      URL
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 700, color: '#334155', py: 2 }}
                    >
                      Submenu
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    // Loading skeleton
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton variant='text' width={30} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant='text' width='60%' />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant='text' width='40%' />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant='text' width={30} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : menuData?.content?.mainMenu ? (
                    // Render mainMenu và submenu dạng cây
                    menuData.content.mainMenu.length > 0 ? (
                      menuData.content.mainMenu.map((item, index) => [
                        // Main menu row
                        <TableRow
                          key={`main-${index}`}
                          sx={{
                            backgroundColor: '#f8fafc',
                            '&:hover': { backgroundColor: '#e0e7ef' },
                            '&:last-child td, &:last-child th': { border: 0 }
                          }}
                        >
                          <TableCell sx={{ py: 2 }}>
                            <Typography
                              variant='body2'
                              sx={{ fontWeight: 700 }}
                            >
                              {index + 1}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Stack
                              direction='row'
                              alignItems='center'
                              spacing={1}
                            >
                              <MenuIcon
                                sx={{
                                  color: 'var(--primary-color)',
                                  fontSize: 18
                                }}
                              />
                              <Typography
                                variant='body2'
                                sx={{ fontWeight: 700, color: '#1e293b' }}
                              >
                                {item.label}
                              </Typography>
                              {!item.visible && (
                                <VisibilityOffIcon
                                  sx={{
                                    color: 'var(--error-color)',
                                    fontSize: 16
                                  }}
                                />
                              )}
                            </Stack>
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Typography
                              variant='body2'
                              sx={{
                                fontFamily: 'monospace',
                                color: 'var(--primary-color)',
                                fontWeight: 500
                              }}
                            >
                              {item.url || '—'}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ py: 2 }}>
                            <Typography
                              variant='body2'
                              sx={{ fontWeight: 600 }}
                            >
                              {item.children ? item.children.length : 0}
                            </Typography>
                          </TableCell>
                        </TableRow>,
                        // Submenu rows
                        ...(item.children && item.children.length > 0
                          ? item.children.map((child, childIdx) => (
                              <TableRow
                                key={`sub-${index}-${childIdx}`}
                                sx={{
                                  backgroundColor: '#f1f5f9',
                                  '&:hover': { backgroundColor: '#e0e7ef' },
                                  '&:last-child td, &:last-child th': {
                                    border: 0
                                  }
                                }}
                              >
                                <TableCell sx={{ py: 2 }}>
                                  <Typography
                                    variant='body2'
                                    sx={{
                                      fontWeight: 500,
                                      color: '#64748b',
                                      pl: 8.75
                                    }}
                                  >
                                    ↳ {childIdx + 1}
                                  </Typography>
                                </TableCell>
                                <TableCell sx={{ py: 2, pl: 4 }}>
                                  <Stack
                                    direction='row'
                                    alignItems='center'
                                    spacing={1}
                                  >
                                    <MenuIcon
                                      sx={{ color: '#64748b', fontSize: 16 }}
                                    />
                                    <Typography
                                      variant='body2'
                                      sx={{ fontWeight: 500, color: '#334155' }}
                                    >
                                      {child.label}
                                    </Typography>
                                    {!child.visible && (
                                      <VisibilityOffIcon
                                        sx={{
                                          color: 'var(--error-color)',
                                          fontSize: 16
                                        }}
                                      />
                                    )}
                                  </Stack>
                                </TableCell>
                                <TableCell sx={{ py: 2 }}>
                                  <Typography
                                    variant='body2'
                                    sx={{
                                      fontFamily: 'monospace',
                                      color: 'var(--primary-color)',
                                      fontWeight: 500
                                    }}
                                  >
                                    {child.url || '—'}
                                  </Typography>
                                </TableCell>
                                <TableCell sx={{ py: 2 }}>—</TableCell>
                              </TableRow>
                            ))
                          : [])
                      ])
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          sx={{ textAlign: 'center', py: 4 }}
                        >
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
                            Chưa có menu items nào
                          </Typography>
                          {hasPermission('headerContent:create') && (

                            <Button
                              variant="outlined"
                              startIcon={<AddIcon />}
                              onClick={() => setOpenMenuModal(true)}
                              sx={{ mt: 2 }}
                            >
                              Tạo menu đầu tiên
                            </Button>

                          )}
                        </TableCell>
                      </TableRow>
                    )
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        sx={{ textAlign: 'center', py: 4 }}
                      >
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
                          Chưa có cấu hình menu nào
                        </Typography>
                        {hasPermission('headerContent:create') && (

                          <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => setOpenMenuModal(true)}
                            sx={{ mt: 2 }}
                          >
                            Tạo cấu hình menu đầu tiên
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </>
      )}

      {activeTab === 2 && (
        <>
          {/* Category Action Buttons */}
          <Box
            sx={{
              mb: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
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

          {/* Category Table */}
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
                    <TableCell
                      sx={{ fontWeight: 700, color: '#334155', py: 2 }}
                    >
                      Thứ tự
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 700, color: '#334155', py: 2 }}
                    >
                      Tên danh mục
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 700, color: '#334155', py: 2 }}
                    >
                      Mô tả
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 700, color: '#334155', py: 2 }}
                    >
                      Trạng thái
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    // Loading skeleton
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton variant='text' width={30} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant='text' width='60%' />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant='text' width='40%' />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant='text' width='50%' />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant='text' width={30} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant='circular' width={32} height={32} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : categories && categories.length > 0 ? (
                    // Render categories with expandable parent-child structure
                    getParentCategories()
                      .map((parentCategory, index) => {
                        const childCategories = getChildCategories(
                          parentCategory._id
                        )
                        const isExpanded = expandedCategories.has(
                          parentCategory._id
                        )

                        return [
                          // Parent category row
                          <TableRow
                            key={`parent-${parentCategory._id}`}
                            sx={{
                              backgroundColor: '#f0f9ff',
                              '&:hover': {
                                backgroundColor: '#dbeafe'
                              },
                              '&:last-child td, &:last-child th': { border: 0 }
                            }}
                          >
                            <TableCell sx={{ py: 2 }}>
                              <Stack
                                direction='row'
                                alignItems='center'
                                spacing={1}
                              >
                                <IconButton
                                  size='small'
                                  onClick={() =>
                                    handleToggleExpanded(parentCategory._id)
                                  }
                                  disabled={childCategories.length === 0}
                                  sx={{
                                    color: 'var(--primary-color)',
                                    '&:hover': { backgroundColor: '#3b82f620' },
                                    transform: isExpanded
                                      ? 'rotate(90deg)'
                                      : 'rotate(0deg)',
                                    transition: 'transform 0.2s ease'
                                  }}
                                >
                                  <ExpandMoreIcon />
                                </IconButton>
                                <Typography
                                  variant='body2'
                                  sx={{ fontWeight: 700 }}
                                >
                                  {index + 1}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell sx={{ py: 2 }}>
                              <Stack
                                direction='row'
                                alignItems='center'
                                spacing={1}
                              >
                                <DragIcon
                                  sx={{
                                    color: 'var(--primary-color)',
                                    fontSize: 16
                                  }}
                                />
                                <Box>
                                  <Stack
                                    direction='row'
                                    alignItems='center'
                                    spacing={1}
                                  >
                                    <Typography
                                      variant='body2'
                                      sx={{
                                        fontWeight: 700,
                                        color: '#1e293b'
                                      }}
                                    >
                                      {parentCategory.name}
                                    </Typography>
                                    <Chip
                                      label='Parent'
                                      size='small'
                                      sx={{
                                        backgroundColor: 'var(--primary-color)',
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '0.7rem',
                                        height: 20
                                      }}
                                    />
                                    {childCategories.length > 0 && (
                                      <Chip
                                        label={`${childCategories.length} children`}
                                        size='small'
                                        variant='outlined'
                                        sx={{
                                          borderColor: 'var(--primary-color)',
                                          color: 'var(--primary-color)',
                                          fontWeight: 600,
                                          fontSize: '0.7rem',
                                          height: 20
                                        }}
                                      />
                                    )}
                                  </Stack>
                                  <Typography
                                    variant='caption'
                                    color='text.secondary'
                                    sx={{ fontFamily: 'monospace' }}
                                  >
                                    ID: {parentCategory._id}
                                  </Typography>
                                </Box>
                              </Stack>
                            </TableCell>
                            <TableCell sx={{ py: 2 }}>
                              <Typography
                                variant='body2'
                                color='text.secondary'
                                sx={{
                                  maxWidth: 200,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {parentCategory.description || 'Không có mô tả'}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ py: 2 }}>
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={parentCategory.destroy === false}
                                    onChange={() =>
                                      handleToggleCategoryVisibility(
                                        parentCategory._id,
                                        parentCategory.destroy
                                      )
                                    }
                                    color='success'
                                    size='small'
                                  />
                                }
                                label={
                                  <Typography
                                    variant='body2'
                                    sx={{ fontSize: '0.75rem' }}
                                  >
                                    {parentCategory.destroy === false
                                      ? 'Hiển thị'
                                      : 'Ẩn'}
                                  </Typography>
                                }
                                sx={{ margin: 0 }}
                              />
                            </TableCell>
                          </TableRow>,
                          // Child category rows (only if expanded)
                          ...(isExpanded
                            ? childCategories.map(
                                (childCategory, childIndex) => (
                                  <TableRow
                                    key={`child-${childCategory._id}`}
                                    sx={{
                                      backgroundColor: '#f8fafc',
                                      borderLeft: '4px solid #e2e8f0',
                                      '&:hover': {
                                        backgroundColor: '#e0e7ef',
                                        borderLeft:
                                          '4px solid var(--primary-color)'
                                      },
                                      '&:last-child td, &:last-child th': {
                                        border: 0
                                      }
                                    }}
                                  >
                                    <TableCell sx={{ py: 2 }}>
                                      <Typography
                                        variant='body2'
                                        sx={{
                                          fontWeight: 500,
                                          color: '#64748b',
                                          pl: 5
                                        }}
                                      >
                                        ↳ {childIndex + 1}
                                      </Typography>
                                    </TableCell>
                                    <TableCell sx={{ py: 2 }}>
                                      <Stack
                                        direction='row'
                                        alignItems='center'
                                        spacing={1}
                                      >
                                        <DragIcon
                                          sx={{
                                            color: '#64748b',
                                            fontSize: 16
                                          }}
                                        />
                                        <Box>
                                          <Stack
                                            direction='row'
                                            alignItems='center'
                                            spacing={1}
                                          >
                                            <Typography
                                              variant='body2'
                                              sx={{
                                                fontWeight: 500,
                                                color: '#334155'
                                              }}
                                            >
                                              {childCategory.name}
                                            </Typography>
                                            <Chip
                                              label='item'
                                              size='small'
                                              sx={{
                                                backgroundColor: '#64748b',
                                                color: 'white',
                                                fontWeight: 600,
                                                fontSize: '0.7rem',
                                                height: 20
                                              }}
                                            />
                                          </Stack>
                                          <Typography
                                            variant='caption'
                                            color='text.secondary'
                                            sx={{ fontFamily: 'monospace' }}
                                          >
                                            ID: {childCategory._id}
                                          </Typography>
                                        </Box>
                                      </Stack>
                                    </TableCell>
                                    <TableCell sx={{ py: 2 }}>
                                      <Typography
                                        variant='body2'
                                        color='text.secondary'
                                        sx={{
                                          maxWidth: 200,
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap'
                                        }}
                                      >
                                        {childCategory.description ||
                                          'Không có mô tả'}
                                      </Typography>
                                    </TableCell>
                                    <TableCell sx={{ py: 2 }}>
                                      <FormControlLabel
                                        control={
                                          <Switch
                                            checked={
                                              childCategory.destroy === false
                                            }
                                            onChange={() =>
                                              handleToggleCategoryVisibility(
                                                childCategory._id,
                                                childCategory.destroy
                                              )
                                            }
                                            color='success'
                                            size='small'
                                          />
                                        }
                                        label={
                                          <Typography
                                            variant='body2'
                                            sx={{ fontSize: '0.75rem' }}
                                          >
                                            {childCategory.destroy === false
                                              ? 'Hiển thị'
                                              : 'Ẩn'}
                                          </Typography>
                                        }
                                        sx={{ margin: 0 }}
                                      />
                                    </TableCell>
                                  </TableRow>
                                )
                              )
                            : [])
                        ]
                      })
                      .flat()
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        sx={{ textAlign: 'center', py: 4 }}
                      >
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
                          Chưa có danh mục nào
                        </Typography>
                        {hasPermission('headerContent:create') && (
                          <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => {
                              // TODO: Open category editor modal
                              console.log('Create new category')
                            }}
                            sx={{ mt: 2 }}
                          >
                            Tạo danh mục đầu tiên
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </>
      )}

      {/* Modals */}
      <AddHeader
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={handleModalSuccess}
      />

      <MegaMenuEditor
        open={openMenuModal}
        onClose={() => setOpenMenuModal(false)}
        onSuccess={handleMenuModalSuccess}
        initialData={menuData?.content || null}
      />
    </Box>
  )
}

export default HeaderManagement
