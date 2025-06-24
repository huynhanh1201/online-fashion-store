import React, { useMemo } from 'react'
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
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material'
import { Link, useLocation } from 'react-router-dom'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'

import { useDispatch } from 'react-redux'
import { logoutUserAPI } from '~/redux/user/userSlice'
import usePermissions from '~/hooks/usePermissions'

export default function AdminDrawer({
  open,
  profile,
  onDrawerOpen,
  onClose,
  onProfileOpen
}) {
  const location = useLocation()
  const {
    hasPermission,
    hasAnyPermission,
    isLoading,
    isInitialized,
    permissions,
    currentUser
  } = usePermissions()
  const [openProduct, setOpenProduct] = React.useState(false)
  const [openOrder, setOpenOrder] = React.useState(false)
  const [openInventory, setOpenInventory] = React.useState(false)

  const toggleProduct = () => setOpenProduct(!openProduct)
  const toggleOrder = () => setOpenOrder(!openOrder)
  const toggleInventory = () => setOpenInventory(!openInventory)
  const currentPath = location.pathname

  const isActive = (path) => {
    const normalizedPath = path.endsWith('/') ? path.slice(0, -1) : path
    const current = currentPath.endsWith('/')
      ? currentPath.slice(0, -1)
      : currentPath
    return current === normalizedPath
  }

  const activeButtonStyle = {
    '&.Mui-selected': {
      backgroundColor: 'transparent',
      '& .MuiListItemIcon-root': {
        color: '#001f5d'
      },
      '& .MuiListItemText-primary': {
        color: '#001f5d',
        fontWeight: 700
      }
    },
    '&.Mui-selected:hover': {
      backgroundColor: '#bbdefb'
    },
    '&.MuiListItemButton-root:hover': {
      backgroundColor: '#bbdefb'
    }
  }

  const dispatch = useDispatch()
  const handleLogout = () => {
    dispatch(logoutUserAPI())
    onClose()
  }

  const roleMap = {
    technical_admin: 'Kỹ thuật viên hệ thống',
    owner: 'Chủ cửa hàng',
    staff: 'Nhân viên quản lý',
    customer: 'Khách hàng'
  }

  // Cấu hình menu với quyền tương ứng
  const menuConfig = useMemo(
    () => ({
      statistics: {
        permission: 'statistics:read',
        label: 'Thống kê',
        path: '/admin',
        icon: <PollIcon />
      },
      userManagement: {
        permission: 'user:read',
        label: 'Quản lý người dùng',
        path: '/admin/user-management',
        icon: <PersonIcon />
      },
      productManagement: {
        permissions: [
          'product:read',
          'category:read',
          'color:read',
          'size:read',
          'review:read'
        ],
        label: 'Quản lý sản phẩm',
        icon: <InventoryIcon />,
        children: [
          {
            permission: 'category:read',
            label: 'Quản lý danh mục',
            path: '/admin/categorie-management',
            icon: <CategoryIcon />
          },
          {
            permission: 'product:read',
            label: 'Quản lý sản phẩm',
            path: '/admin/product-management',
            icon: <InventoryIcon />
          },
          {
            permission: 'review:read',
            label: 'Quản lý đánh giá',
            path: '/admin/review-management'
          },
          {
            permission: 'variant:read',
            label: 'Quản lý biến thể',
            path: '/admin/variant-management'
          },
          {
            permission: 'color:read',
            label: 'Quản lý màu sắc',
            path: '/admin/color-management',
            icon: <PaletteIcon />
          },
          {
            permission: 'size:read',
            label: 'Quản lý kích thước',
            path: '/admin/size-management',
            icon: <StraightenIcon />
          }
        ]
      },
      orderManagement: {
        permissions: ['order:read', 'coupon:read', 'payment:read'],
        label: 'Quản lý đơn hàng',
        icon: <ReceiptLongIcon />,
        children: [
          {
            permission: 'order:read',
            label: 'Quản lý đơn hàng',
            path: '/admin/order-management',
            icon: <ReceiptLongIcon />
          },
          {
            permission: 'coupon:read',
            label: 'Quản lý mã giảm giá',
            path: '/admin/discount-management',
            icon: <LocalOfferIcon />
          },
          {
            permission: 'payment:read',
            label: 'Quản lý giao dịch',
            path: '/admin/transaction-management',
            icon: <PaymentIcon />
          }
        ]
      },
      inventoryManagement: {
        permissions: [
          'inventory:read',
          'warehouse:read',
          'warehouseSlip:read',
          'inventoryLog:read',
          'batch:read',
          'partner:read'
        ],
        label: 'Quản lý kho',
        icon: <WarehouseIcon />,
        children: [
          {
            permission: 'statistics:read',
            label: 'Thống kê kho',
            path: '/admin/warehouse-statistic-management',
            icon: <ReceiptLongIcon />
          },
          {
            permission: 'inventory:read',
            label: 'Quản lý kho',
            path: '/admin/inventory-management'
          },
          {
            permission: 'warehouseSlip:read',
            label: 'Quản lý xuất/nhập kho',
            path: '/admin/warehouse-slips-management'
          },
          {
            permission: 'inventoryLog:read',
            label: 'Quản lý nhật ký kho',
            path: '/admin/inventory-log-management'
          },
          {
            permission: 'warehouse:read',
            label: 'Quản lý kho hàng',
            path: '/admin/warehouses-management'
          },
          {
            permission: 'batch:read',
            label: 'Quản lý lô hàng',
            path: '/admin/batches-management'
          },
          {
            permission: 'partner:read',
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
    // Chỉ kiểm tra quyền cụ thể, không dựa vào admin:access

    // Kiểm tra quyền đơn lẻ
    if (menuItem.permission) {
      const resource = menuItem.permission.split(':')[0]
      // Kiểm tra các quyền: read, create, update, delete
      const relatedPermissions = [
        `${resource}:read`,
        `${resource}:create`,
        `${resource}:update`,
        `${resource}:delete`
      ]
      return hasAnyPermission(relatedPermissions)
    }

    // Kiểm tra danh sách quyền
    if (menuItem.permissions) {
      // Tạo danh sách tất cả quyền liên quan từ các resource
      const allRelatedPermissions = []
      menuItem.permissions.forEach((permission) => {
        const resource = permission.split(':')[0]
        allRelatedPermissions.push(
          `${resource}:read`,
          `${resource}:create`,
          `${resource}:update`,
          `${resource}:delete`
        )
      })
      return hasAnyPermission(allRelatedPermissions)
    }

    return false
  }

  // Lọc children dựa trên quyền (memoized)
  const getVisibleChildren = useMemo(() => {
    return (children) => {
      if (!isInitialized) return []
      return children.filter((child) => canAccessMenu(child))
    }
  }, [isInitialized, hasPermission, hasAnyPermission])

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
          sx={{ display: 'flex', alignItems: 'center', p: 2 }}
        >
          <Typography fontWeight='bold' fontSize={18}>
            LOGO
          </Typography>
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
          {canAccessMenu(menuConfig.userManagement) && (
            <ListItem disablePadding sx={{ height: 48 }}>
              <ListItemButton
                component={Link}
                to='/admin/user-management'
                selected={isActive('/admin/user-management')}
                sx={{ padding: '12px 24px', ...activeButtonStyle }}
              >
                <ListItemIcon>
                  <PersonIcon />
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
                <ListItemIcon sx={{ minWidth: 35 }}>
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
        sx={{ display: 'flex', alignItems: 'center', p: 2 }}
      >
        <Typography fontWeight='bold' fontSize={18}>
          LOGO
        </Typography>
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
            <Typography fontWeight='bold' fontSize={14}>
              {profileName
                ?.toLowerCase()
                .split(' ')
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ') || ''}
            </Typography>
            <CheckCircleIcon sx={{ color: '#61b865' }} fontSize='small' />
          </Box>
          <Typography variant='caption'>
            {roleMap[profile?.role] || 'Không xác định'}
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
                <ListItemText primary='Thống kê' />
              </ListItemButton>
            </ListItem>
          )}

          {canAccessMenu(menuConfig.userManagement) && (
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to='/admin/user-management'
                selected={isActive('/admin/user-management')}
                sx={activeButtonStyle}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary='Quản lý người dùng' />
              </ListItemButton>
            </ListItem>
          )}
          <Link
            to='/admin/marketing-management'
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <ListItem disablePadding>
              <ListItemButton
                selected={isActive('/admin/marketing-management')}
                sx={activeButtonStyle}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary='Quản lý nội dung' />
              </ListItemButton>
            </ListItem>
          </Link>
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
      <Box sx={{ p: 0, textAlign: 'center' }}>
        <List sx={{ flexGrow: 1, p: 0 }}>
          <ListItem disablePadding onClick={handleLogout}>
            <ListItemButton sx={{ ...activeButtonStyle }}>
              <ListItemIcon>
                <ExitToAppIcon color='error' />
              </ListItemIcon>
              <ListItemText sx={{ color: '#f00' }} primary='Đăng xuất' />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  )
}
