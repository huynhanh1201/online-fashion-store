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
import AddMenu from './Modal/AddMenu.jsx'
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

  // Handle success from modal
  const handleModalSuccess = (result) => {
    console.log('Header updated successfully:', result)
    // Refresh data after successful update
    fetchHeaderData()
  }

  // Handle success from menu modal
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
            borderColor: item.visible ? '#3b82f6' : '#ef4444',
            color: item.visible ? '#1e40af' : '#dc2626'
          }}
        />
        {!item.visible && (
          <VisibilityOffIcon sx={{ color: '#ef4444', fontSize: 16 }} />
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
          <Tab label='Quản lý Menu mở rộng' />
          <Tab label='Quản lý Menu danh mục' />
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
                  background:
                    'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
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
                    <TableCell
                      sx={{ fontWeight: 700, color: '#334155', py: 2 }}
                    >
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
            <Button
              variant='contained'
              startIcon={<AddIcon />}
              onClick={() => setOpenMenuModal(true)}
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
                  background:
                    'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                  boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              {menuData ? 'Chỉnh sửa menu' : 'Tạo menu mới'}
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
                      Loại menu
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 700, color: '#334155', py: 2 }}
                    >
                      Trạng thái
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 700, color: '#334155', py: 2 }}
                    >
                      Submenu
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 700, color: '#334155', py: 2 }}
                    >
                      Thao tác
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
                          <Skeleton
                            variant='rectangular'
                            width={80}
                            height={24}
                          />
                        </TableCell>
                        <TableCell>
                          <Skeleton
                            variant='rectangular'
                            width={80}
                            height={24}
                          />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant='text' width={30} />
                        </TableCell>
                        <TableCell>
                          <Skeleton variant='circular' width={32} height={32} />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : menuData?.content ? (
                    // Render all menu items from different sections
                    (() => {
                      const allMenuItems = []

                      // Add main menu items
                      if (menuData.content.mainMenu) {
                        menuData.content.mainMenu.forEach((item, index) => {
                          allMenuItems.push({
                            ...item,
                            menuType: 'Main Menu',
                            originalIndex: index
                          })
                          // Add submenu items
                          if (item.children) {
                            item.children.forEach((child, childIndex) => {
                              allMenuItems.push({
                                ...child,
                                menuType: 'Main Menu - Sub',
                                parentLabel: item.label,
                                originalIndex: `${index}.${childIndex}`
                              })
                            })
                          }
                        })
                      }

                      // Add mobile menu items
                      if (menuData.content.mobileMenu) {
                        menuData.content.mobileMenu.forEach((item, index) => {
                          allMenuItems.push({
                            ...item,
                            menuType: 'Mobile Menu',
                            originalIndex: index
                          })
                        })
                      }

                      // Add footer menu items
                      if (menuData.content.footerMenu) {
                        menuData.content.footerMenu.forEach((item, index) => {
                          allMenuItems.push({
                            ...item,
                            menuType: 'Footer Menu',
                            originalIndex: index
                          })
                        })
                      }

                      return allMenuItems.length > 0 ? (
                        allMenuItems.map((item, index) => (
                          <TableRow
                            key={`${item.menuType}-${item.originalIndex}`}
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
                                variant='body2'
                                sx={{ fontWeight: 600 }}
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
                                <DragIcon
                                  sx={{ color: '#9ca3af', fontSize: 16 }}
                                />
                                <Box>
                                  <Typography
                                    variant='body2'
                                    sx={{
                                      fontWeight: 600,
                                      color: '#1e293b',
                                      ml: item.parentLabel ? 2 : 0
                                    }}
                                  >
                                    {item.label}
                                  </Typography>
                                  {item.parentLabel && (
                                    <Typography
                                      variant='caption'
                                      color='text.secondary'
                                      sx={{ ml: 2 }}
                                    >
                                      Parent: {item.parentLabel}
                                    </Typography>
                                  )}
                                </Box>
                              </Stack>
                            </TableCell>
                            <TableCell sx={{ py: 2 }}>
                              <Typography
                                variant='body2'
                                sx={{
                                  fontFamily: 'monospace',
                                  color: '#3b82f6',
                                  fontWeight: 500
                                }}
                              >
                                {item.url}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ py: 2 }}>
                              <Chip
                                label={item.menuType}
                                size='small'
                                variant='outlined'
                                sx={{
                                  fontWeight: 600,
                                  backgroundColor:
                                    item.menuType === 'Main Menu'
                                      ? '#f0f9ff'
                                      : item.menuType === 'Mobile Menu'
                                        ? '#f0fdf4'
                                        : item.menuType === 'Footer Menu'
                                          ? '#fef2f2'
                                          : '#f8fafc',
                                  borderColor:
                                    item.menuType === 'Main Menu'
                                      ? '#3b82f6'
                                      : item.menuType === 'Mobile Menu'
                                        ? '#059669'
                                        : item.menuType === 'Footer Menu'
                                          ? '#dc2626'
                                          : '#6b7280',
                                  color:
                                    item.menuType === 'Main Menu'
                                      ? '#1e40af'
                                      : item.menuType === 'Mobile Menu'
                                        ? '#047857'
                                        : item.menuType === 'Footer Menu'
                                          ? '#b91c1c'
                                          : '#374151'
                                }}
                              />
                            </TableCell>
                            <TableCell sx={{ py: 2 }}>
                              <Stack
                                direction='row'
                                alignItems='center'
                                spacing={1}
                              >
                                <Chip
                                  label={item.visible ? 'Hiển thị' : 'Ẩn'}
                                  color={item.visible ? 'success' : 'error'}
                                  size='small'
                                  sx={{ fontWeight: 600 }}
                                />
                                {!item.visible && (
                                  <VisibilityOffIcon
                                    sx={{ color: '#ef4444', fontSize: 16 }}
                                  />
                                )}
                              </Stack>
                            </TableCell>
                            <TableCell sx={{ py: 2 }}>
                              <Typography
                                variant='body2'
                                sx={{ fontWeight: 600 }}
                              >
                                {item.children ? item.children.length : 0}
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
                                    onClick={() => {
                                      // TODO: Open edit modal
                                      console.log('Edit menu item:', item)
                                    }}
                                  >
                                    <EditIcon fontSize='small' />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title='Xóa'>
                                  <IconButton
                                    size='small'
                                    sx={{
                                      color: '#ef4444',
                                      '&:hover': { backgroundColor: '#fef2f2' }
                                    }}
                                    onClick={() => {
                                      // TODO: Delete menu item
                                      console.log('Delete menu item:', item)
                                    }}
                                  >
                                    <DeleteIcon fontSize='small' />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={7}
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
                            <Button
                              variant='outlined'
                              startIcon={<AddIcon />}
                              onClick={() => setOpenMenuModal(true)}
                              sx={{ mt: 2 }}
                            >
                              Tạo menu đầu tiên
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })()
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
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
                        <Button
                          variant='outlined'
                          startIcon={<AddIcon />}
                          onClick={() => setOpenMenuModal(true)}
                          sx={{ mt: 2 }}
                        >
                          Tạo cấu hình menu đầu tiên
                        </Button>
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
                    <TableCell
                      sx={{ fontWeight: 700, color: '#334155', py: 2 }}
                    >
                      Số sản phẩm
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 700, color: '#334155', py: 2 }}
                    >
                      Thao tác
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
                    // Render categories
                    categories.map((category, index) => (
                      <TableRow
                        key={category._id}
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
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {index + 1}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Stack
                            direction='row'
                            alignItems='center'
                            spacing={1}
                          >
                            <DragIcon sx={{ color: '#9ca3af', fontSize: 16 }} />
                            <Box>
                              <Typography
                                variant='body2'
                                sx={{
                                  fontWeight: 600,
                                  color: '#1e293b'
                                }}
                              >
                                {category.name}
                              </Typography>
                              <Typography
                                variant='caption'
                                color='text.secondary'
                                sx={{ fontFamily: 'monospace' }}
                              >
                                ID: {category._id}
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
                            {category.description || 'Không có mô tả'}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={category.destroy === false}
                                onChange={() =>
                                  handleToggleCategoryVisibility(
                                    category._id,
                                    category.destroy
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
                                {category.destroy === false ? 'Hiển thị' : 'Ẩn'}
                              </Typography>
                            }
                            sx={{ margin: 0 }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 2 }}>
                          <Typography variant='body2' sx={{ fontWeight: 600 }}>
                            {category.productCount || 0}
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
                                onClick={() => {
                                  // TODO: Open edit modal
                                  console.log('Edit category:', category)
                                }}
                              >
                                <EditIcon fontSize='small' />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title='Xóa'>
                              <IconButton
                                size='small'
                                sx={{
                                  color: '#ef4444',
                                  '&:hover': { backgroundColor: '#fef2f2' }
                                }}
                                onClick={() => {
                                  // TODO: Delete category
                                  console.log('Delete category:', category)
                                }}
                              >
                                <DeleteIcon fontSize='small' />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
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
                        <Button
                          variant='outlined'
                          startIcon={<AddIcon />}
                          onClick={() => {
                            // TODO: Open category editor modal
                            console.log('Create new category')
                          }}
                          sx={{ mt: 2 }}
                        >
                          Tạo danh mục đầu tiên
                        </Button>
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

      <AddMenu
        open={openMenuModal}
        onClose={() => setOpenMenuModal(false)}
        onSuccess={handleMenuModalSuccess}
        initialData={menuData?.content}
      />
    </Box>
  )
}

export default HeaderManagement
