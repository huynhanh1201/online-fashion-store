import React, { useMemo, useEffect } from 'react'
import {
  Avatar,
  Box,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  CircularProgress
} from '@mui/material'
import {
  ExpandLess,
  ExpandMore,
  Poll as PollIcon,
  Person as PersonIcon,
  Inventory as InventoryIcon,
  ReceiptLong as ReceiptLongIcon,
  Category as CategoryIcon,
  Palette as PaletteIcon,
  Straighten as StraightenIcon,
  LocalOffer as LocalOfferIcon,
  Payment as PaymentIcon,
  Warehouse as WarehouseIcon,
  CheckCircle as CheckCircleIcon,
  ViewQuilt as ViewQuiltIcon,
  FlashOn as FlashOnIcon
} from '@mui/icons-material'
import { Link, useLocation } from 'react-router-dom'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'

import { useDispatch } from 'react-redux'
import { logoutUserAPI } from '~/redux/user/userSlice'
import usePermissions from '~/hooks/usePermissions'
import useRoles from '~/hooks/admin/useRoles.js'
import LogoutButton from '~/components/modals/Logout.jsx'
import logo from '~/assets/img/logo.jpg'
import { getHeaderConfig } from '~/services/admin/webConfig/headerService'
export default function AdminDrawer({
  open,
  profile,
  onDrawerOpen,
  onClose,
  onProfileOpen
}) {
  const location = useLocation()
  const { hasPermission, isLoading, isInitialized } = usePermissions()
  const { roles, fetchRoles } = useRoles()
  const [openProduct, setOpenProduct] = React.useState(false)
  const [openOrder, setOpenOrder] = React.useState(false)
  const [openInventory, setOpenInventory] = React.useState(false)
  const [openContent, setOpenContent] = React.useState(false)
  const [openUser, setOpenUser] = React.useState(false)
  const toggleUser = () => setOpenUser(!openUser)
  const toggleProduct = () => setOpenProduct(!openProduct)
  const toggleOrder = () => setOpenOrder(!openOrder)
  const toggleInventory = () => setOpenInventory(!openInventory)
  const toggleContent = () => setOpenContent(!openContent)
  const currentPath = location.pathname
  const [tokenUpdated, setTokenUpdated] = React.useState(
    localStorage.getItem('accessToken')
  )
  const isActive = (path) => {
    const normalizedPath = path.endsWith('/') ? path.slice(0, -1) : path
    const current = currentPath.endsWith('/')
      ? currentPath.slice(0, -1)
      : currentPath
    return current === normalizedPath
  }
  const [logoData, setLogoData] = React.useState(null)

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const headerConfig = await getHeaderConfig()
        if (headerConfig?.content?.logo) {
          setLogoData(headerConfig.content.logo)
        }
      } catch (error) {
        console.error('Lỗi khi lấy logo:', error)
      }
    }

    fetchLogo()
  }, [])
  useEffect(() => {
    fetchRoles()
  }, [])

  const roleMap =
    roles.find((r) => r.name === profile?.role)?.label || 'Không có vai trò'

  const activeButtonStyle = {
    '&.Mui-selected': {
      backgroundColor: 'transparent',
      '& .MuiListItemIcon-root': {
        color: 'var(--primary-color)'
      },
      '& .MuiListItemText-primary': {
        color: 'var(--primary-color)',
        fontWeight: 700
      }
    },
    '&.Mui-selected:hover': {
      backgroundColor: 'var(--primary-color)20'
    },
    '&.MuiListItemButton-root:hover': {
      backgroundColor: 'var(--primary-color)20'
    }
  }

  const dispatch = useDispatch()
  const handleLogout = () => {
    dispatch(logoutUserAPI())
    localStorage.removeItem('accessToken')
    setTokenUpdated(null)
    onClose()
  }

  // Cấu hình menu với quyền tương ứng
  const menuConfig = useMemo(
    () => ({
      statistics: {
        permission: 'admin:access',
        label: 'Bảng điều khiển',
        path: '/admin',
        icon: <PollIcon />
      },
      accountManagement: {
        permissions: [
          'userStatistics:use',
          'user:use',
          'account:use',
          'role:use'
        ],
        label: 'Quản lý tài khoản',
        icon: <PersonIcon />,
        children: [
          {
            permission: 'userStatistics:use',
            label: 'Thống kê tài khoản',
            path: '/admin/account-statistic'
          },
          {
            permission: 'user:use',
            label: 'Tài khoản khách hàng',
            path: '/admin/user-management'
          },
          {
            permission: 'account:use',
            label: 'Tài khoản hệ thống',
            path: '/admin/account-management'
          },
          {
            permission: 'role:use',
            label: 'Quản lý vai trò',
            path: '/admin/role-management'
          }
        ]
      },
      contentManagement: {
        permissions: [
          'banner:use',
          'flashSale:use',
          'headerContent:use',
          'footerContent:use',
          'featuredCategory:use',
          'service:use',
          'theme:use',
          'blog:use'
        ],
        label: 'Quản lý nội dung',
        icon: <LocalOfferIcon />,
        children: [
          {
            permission: 'banner:use',
            label: 'Ảnh quảng cáo',
            path: '/admin/display-management'
          },
          {
            permission: 'headerContent:use',
            label: 'Nội dung đầu trang',
            path: '/admin/header-management'
          },
          {
            permission: 'footerContent:use',
            label: 'Nội dung cuối trang',
            path: '/admin/footer-management'
          },
          {
            permission: 'featuredCategory:use',
            label: 'Danh mục nổi bật',
            path: '/admin/featured-category-management'
          },
          {
            permission: 'service:use',
            label: 'Dịch vụ nổi bật',
            path: '/admin/service-highlight-management'
          },
          {
            permission: 'policy:use',
            label: 'Chính sách website',
            path: '/admin/policy-management'
          },
          // {
          //   permission: 'flashSale:use',
          //   label: 'Khuyến mãi',
          //   path: '/admin/flashsale-management'
          // },
          {
            permission: 'blog:use',
            label: 'Nội dung bài viết',
            path: '/admin/blog-management'
          },
          {
            permission: 'theme:use',
            label: 'Chủ đề',
            path: '/admin/theme-management'
          }
        ]
      },
      productManagement: {
        permissions: [
          'product:use',
          'category:use',
          'color:use',
          'size:use',
          'review:use',
          'variant:use'
        ],
        label: 'Quản lý sản phẩm',
        icon: <InventoryIcon />,
        children: [
          {
            permission: 'productStatistics:use',
            label: 'Thống kê sản phẩm',
            path: '/admin/product-statistic',
            icon: <CategoryIcon />
          },
          {
            permission: 'category:use',
            label: 'Quản lý danh mục',
            path: '/admin/categorie-management',
            icon: <CategoryIcon />
          },
          {
            permission: 'product:use',
            label: 'Quản lý sản phẩm',
            path: '/admin/product-management',
            icon: <InventoryIcon />
          },
          {
            permission: 'color:use',
            label: 'Quản lý màu sắc',
            path: '/admin/color-management',
            icon: <PaletteIcon />
          },
          {
            permission: 'size:use',
            label: 'Quản lý kích thước',
            path: '/admin/size-management',
            icon: <StraightenIcon />
          },
          {
            permission: 'variant:use',
            label: 'Quản lý biến thể',
            path: '/admin/variant-management'
          },
          {
            permission: 'review:use',
            label: 'Quản lý đánh giá',
            path: '/admin/review-management'
          }
        ]
      },
      orderManagement: {
        permissions: ['order:use', 'coupon:use', 'payment:use'],
        label: 'Quản lý đơn hàng',
        icon: <ReceiptLongIcon />,
        children: [
          {
            permission: 'orderStatistics:use',
            label: 'Thống kê đơn hàng',
            path: '/admin/order-statistic',
            icon: <ReceiptLongIcon />
          },
          {
            permission: 'order:use',
            label: 'Quản lý đơn hàng',
            path: '/admin/order-management',
            icon: <ReceiptLongIcon />
          },
          {
            permission: 'payment:use',
            label: 'Quản lý giao dịch',
            path: '/admin/transaction-management',
            icon: <PaymentIcon />
          },
          {
            permission: 'coupon:use',
            label: 'Quản lý mã giảm giá',
            path: '/admin/discount-management',
            icon: <LocalOfferIcon />
          }
        ]
      },
      inventoryManagement: {
        permissions: [
          'inventory:use',
          'warehouse:use',
          'warehouseSlip:use',
          'inventoryLog:use',
          'batch:use',
          'partner:use'
        ],
        label: 'Quản lý kho',
        icon: <WarehouseIcon />,
        children: [
          {
            permission: 'warehouseStatistics:use',
            label: 'Thống kê kho',
            path: '/admin/warehouse-statistic-management',
            icon: <ReceiptLongIcon />
          },
          {
            permission: 'inventory:use',
            label: 'Quản lý tồn kho',
            path: '/admin/inventory-management'
          },
          {
            permission: 'warehouseSlip:use',
            label: 'Quản lý phiếu kho',
            path: '/admin/warehouse-slips-management'
          },
          {
            permission: 'inventoryLog:use',
            label: 'Quản lý nhật ký kho',
            path: '/admin/inventory-log-management'
          },
          {
            permission: 'warehouse:use',
            label: 'Quản lý kho hàng',
            path: '/admin/warehouses-management'
          },
          {
            permission: 'batch:use',
            label: 'Quản lý lô hàng',
            path: '/admin/batches-management'
          },
          {
            permission: 'partner:use',
            label: 'Quản lý đối tác',
            path: '/admin/partner-management'
          }
        ]
      }
    }),
    []
  )

  // Kiểm tra xem user có quyền truy cập menu không (sync function)
  const canAccessMenu = (menuItem) => {
    // Chỉ kiểm tra quyền use, không fallback sang quyền CRUD

    // Kiểm tra quyền đơn lẻ
    if (menuItem.permission) {
      // Chỉ kiểm tra chính xác quyền được chỉ định (use)
      return hasPermission(menuItem.permission)
    }

    // Kiểm tra danh sách quyền
    if (menuItem.permissions) {
      // Kiểm tra từng quyền trong danh sách (các quyền use)
      return menuItem.permissions.some((permission) =>
        hasPermission(permission)
      )
    }

    return false
  }

  // Lọc children dựa trên quyền (memoized)
  const getVisibleChildren = useMemo(() => {
    return (children) => {
      if (!isInitialized) return []
      return children.filter((child) => canAccessMenu(child))
    }
  }, [isInitialized, canAccessMenu])

  const profileName = profile?.name || 'Không có dữ liệu'

  // Hiển thị loading khi đang tải permissions
  if (isLoading || !isInitialized) {
    return (
      <Box
        sx={{
          width: open ? 270 : 80,
          height: '100vh',
          backgroundColor: 'white',
          boxShadow: 3,
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Đang tải quyền...</Typography>
      </Box>
    )
  }

  if (!open) {
    return (
      <Box
        sx={{
          width: 80,
          height: '100vh',
          backgroundColor: 'white',
          boxShadow: 3,
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1200,
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={onDrawerOpen}
      >
        <Box
          onClick={onClose}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 2,
            py: 0.4,
            cursor: 'pointer',
            userSelect: 'none',
            height: 62
          }}
        >
          {/* <img
            src={logoSmall}
            alt={'logo'}
            style={{
              width: '100%',
              height: 56,
              objectFit: 'contain',
              pointerEvents: 'none',
              userSelect: 'none'
            }}
          /> */}
          <p style={{ fontSize: 25, fontWeight: 900, color: '#1b3982' }}>FS</p>
        </Box>

        <Divider sx={{ my: 0 }} />
        <List sx={{ flexGrow: 1, pt: 0 }}>
          {canAccessMenu(menuConfig.statistics) && (
            <ListItem disablePadding sx={{ height: 48 }}>
              <ListItemButton
                component={Link}
                to='/admin'
                selected={isActive('/admin')}
                sx={{ padding: '12px 24px', ...activeButtonStyle }}
              >
                <ListItemIcon>
                  <PollIcon />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          )}
          {canAccessMenu(menuConfig.accountManagement) && (
            <ListItem disablePadding sx={{ height: 48 }}>
              <ListItemButton
                onClick={toggleUser}
                sx={{ padding: '12px 24px' }}
              >
                <ListItemIcon sx={{ minWidth: 45 }}>
                  <PersonIcon />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          )}
          {canAccessMenu(menuConfig.contentManagement) && (
            <ListItem disablePadding sx={{ height: 48 }}>
              <ListItemButton
                onClick={toggleProduct}
                sx={{ padding: '12px 24px' }}
              >
                <ListItemIcon sx={{ minWidth: 45 }}>
                  <LocalOfferIcon />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          )}

          {canAccessMenu(menuConfig.productManagement) && (
            <ListItem disablePadding sx={{ height: 48 }}>
              <ListItemButton
                onClick={toggleProduct}
                sx={{ padding: '12px 24px' }}
              >
                <ListItemIcon sx={{ minWidth: 45 }}>
                  <InventoryIcon />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          )}
          {canAccessMenu(menuConfig.orderManagement) && (
            <ListItem disablePadding sx={{ height: 48 }}>
              <ListItemButton
                onClick={toggleOrder}
                sx={{ padding: '12px 24px' }}
              >
                <ListItemIcon sx={{ minWidth: 45 }}>
                  <ReceiptLongIcon />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          )}
          {canAccessMenu(menuConfig.inventoryManagement) && (
            <ListItem disablePadding sx={{ height: 48 }}>
              <ListItemButton
                onClick={toggleInventory}
                sx={{ padding: '12px 24px', ...activeButtonStyle }}
              >
                <ListItemIcon>
                  <WarehouseIcon />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          )}
        </List>
        <Divider sx={{ my: 0 }} />
        <Box sx={{ p: 0, textAlign: 'center' }}>
          <List sx={{ flexGrow: 1, p: 0 }}>
            <ListItem disablePadding sx={{ height: 48 }}>
              <ListItemButton
                onClick={handleLogout}
                sx={{ padding: '12px 24px', ...activeButtonStyle }}
              >
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        width: 270,
        height: '100vh',
        backgroundColor: 'white',
        boxShadow: 3,
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1200,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box
        onClick={onClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2,
          pt: 0.7,
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <img
          src={logoData?.imageUrl ? logoData.imageUrl : logo}
          alt={'logo'}
          style={{
            width: '100%',
            height: 56,
            objectFit: 'contain',
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        />
      </Box>

      <Divider sx={{ my: 0 }} />
      <Box
        onClick={onProfileOpen}
        sx={{ display: 'flex', alignItems: 'center', p: 2, cursor: 'pointer' }}
      >
        <Avatar
          src={optimizeCloudinaryUrl(profile?.avatarUrl)}
          alt={profileName}
          sx={{ width: 48, height: 48, mr: 2 }}
        />
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              fontWeight='bold'
              fontSize={14}
              sx={{
                maxWidth: 150, // hoặc width cố định tùy ý
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
              }}
            >
              {profileName
                ?.toLowerCase()
                .split(' ')
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ') || ''}
            </Typography>
            <CheckCircleIcon sx={{ color: '#61b865' }} fontSize='small' />
          </Box>
          <Typography
            variant='caption'
            sx={{
              maxWidth: 150, // hoặc width cố định tùy ý
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis'
            }}
          >
            {roleMap}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 0 }} />
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        <List sx={{ flexGrow: 1, pt: 0 }}>
          {canAccessMenu(menuConfig.statistics) && (
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to='/admin'
                selected={isActive('/admin')}
                sx={activeButtonStyle}
              >
                <ListItemIcon>
                  <PollIcon />
                </ListItemIcon>
                <ListItemText primary='Bảng điều khiển' />
              </ListItemButton>
            </ListItem>
          )}
          {canAccessMenu(menuConfig.accountManagement) && (
            <>
              <ListItem disablePadding>
                <ListItemButton onClick={toggleUser} sx={activeButtonStyle}>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary='Quản lý tài khoản' />
                  {openUser ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse in={openUser} timeout='auto' unmountOnExit>
                <List component='div' disablePadding>
                  {getVisibleChildren(
                    menuConfig.accountManagement.children
                  ).map((item) => (
                    <ListItemButton
                      key={item.path}
                      component={Link}
                      to={item.path}
                      selected={isActive(item.path)}
                      sx={{ pl: 2, ...activeButtonStyle }}
                    >
                      <ListItemText primary={item.label} sx={{ ml: 7 }} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </>
          )}
          {canAccessMenu(menuConfig.contentManagement) && (
            <>
              <ListItem disablePadding>
                <ListItemButton onClick={toggleContent} sx={activeButtonStyle}>
                  <ListItemIcon>
                    <LocalOfferIcon />
                  </ListItemIcon>
                  <ListItemText primary='Quản lý nội dung' />
                  {openContent ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse in={openContent} timeout='auto' unmountOnExit>
                <List component='div' disablePadding>
                  {getVisibleChildren(
                    menuConfig.contentManagement.children
                  ).map((item) => (
                    <ListItemButton
                      key={item.path}
                      component={Link}
                      to={item.path}
                      selected={isActive(item.path)}
                      sx={{ pl: 2, ...activeButtonStyle }}
                    >
                      {item.icon && (
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          {item.icon}
                        </ListItemIcon>
                      )}
                      <ListItemText primary={item.label} sx={{ ml: 7 }} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </>
          )}
          {canAccessMenu(menuConfig.productManagement) && (
            <>
              <ListItem disablePadding>
                <ListItemButton onClick={toggleProduct} sx={activeButtonStyle}>
                  <ListItemIcon>
                    <InventoryIcon />
                  </ListItemIcon>
                  <ListItemText primary='Quản lý sản phẩm' />
                  {openProduct ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse in={openProduct} timeout='auto' unmountOnExit>
                <List component='div' disablePadding>
                  {getVisibleChildren(
                    menuConfig.productManagement.children
                  ).map((item) => (
                    <ListItemButton
                      key={item.path}
                      component={Link}
                      to={item.path}
                      selected={isActive(item.path)}
                      sx={{ pl: 2, ...activeButtonStyle }}
                    >
                      <ListItemText primary={item.label} sx={{ ml: 7 }} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </>
          )}

          {canAccessMenu(menuConfig.orderManagement) && (
            <>
              <ListItem disablePadding>
                <ListItemButton onClick={toggleOrder} sx={activeButtonStyle}>
                  <ListItemIcon>
                    <ReceiptLongIcon />
                  </ListItemIcon>
                  <ListItemText primary='Quản lý đơn hàng' />
                  {openOrder ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse in={openOrder} timeout='auto' unmountOnExit>
                <List component='div' disablePadding>
                  {getVisibleChildren(menuConfig.orderManagement.children).map(
                    (item) => (
                      <ListItemButton
                        key={item.path}
                        component={Link}
                        to={item.path}
                        selected={isActive(item.path)}
                        sx={{ pl: 2, ...activeButtonStyle }}
                      >
                        <ListItemText primary={item.label} sx={{ ml: 7 }} />
                      </ListItemButton>
                    )
                  )}
                </List>
              </Collapse>
            </>
          )}

          {canAccessMenu(menuConfig.inventoryManagement) && (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={toggleInventory}
                  sx={activeButtonStyle}
                >
                  <ListItemIcon>
                    <WarehouseIcon />
                  </ListItemIcon>
                  <ListItemText primary='Quản lý kho' />
                  {openInventory ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse in={openInventory} timeout='auto' unmountOnExit>
                <List component='div' disablePadding>
                  {getVisibleChildren(
                    menuConfig.inventoryManagement.children
                  ).map((item) => (
                    <ListItemButton
                      key={item.path}
                      component={Link}
                      to={item.path}
                      selected={isActive(item.path)}
                      sx={{ pl: 2, ...activeButtonStyle }}
                    >
                      <ListItemText primary={item.label} sx={{ ml: 7 }} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </>
          )}
        </List>
      </Box>
      <Divider sx={{ my: 0 }} />
      <LogoutButton handleLogout={handleLogout} />
    </Box>
  )
}
