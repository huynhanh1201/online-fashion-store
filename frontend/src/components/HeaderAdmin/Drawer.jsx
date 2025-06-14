import React from 'react'
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
  Typography
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

export default function AdminDrawer({ open, profile, onDrawerOpen, onClose }) {
  const location = useLocation()
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
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
          <Avatar
            src={profile?.avatarUrl}
            alt={profile?.name}
            sx={{ width: 48, height: 48 }}
          />
        </Box>
        <Divider sx={{ my: 0 }} />
        <List sx={{ flexGrow: 1, pt: 0 }}>
          <ListItem disablePadding sx={{ height: 48 }}>
            <ListItemButton
              selected={isActive('/admin')}
              sx={{ padding: '12px 24px', ...activeButtonStyle }}
            >
              <ListItemIcon>
                <PollIcon />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ height: 48 }}>
            <ListItemButton
              selected={isActive('/admin/user-management')}
              sx={{ padding: '12px 24px', ...activeButtonStyle }}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ height: 48 }}>
            <ListItemButton
              onClick={toggleProduct}
              sx={{ padding: '12px 24px' }}
            >
              <ListItemIcon sx={{ minWidth: 45 }}>
                <InventoryIcon />
                {/*<ExpandLess sx={{ transform: 'rotate(90deg)' }} />*/}
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ height: 48 }}>
            <ListItemButton onClick={toggleOrder} sx={{ padding: '12px 24px' }}>
              <ListItemIcon sx={{ minWidth: 35 }}>
                <ReceiptLongIcon />
                {/*<ExpandLess sx={{ transform: 'rotate(90deg)' }} />*/}
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ height: 48 }}>
            <ListItemButton
              selected={isActive('/admin/inventory-management')}
              sx={{ padding: '12px 24px', ...activeButtonStyle }}
            >
              <ListItemIcon>
                <WarehouseIcon />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        width: 260,
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
        <Avatar
          src={profile?.avatarUrl}
          alt={profile?.name}
          sx={{ width: 48, height: 48, mr: 2 }}
        />
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography fontWeight='bold' fontSize={14}>
              {profile?.name
                ?.toLowerCase()
                .split(' ')
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ') || ''}
            </Typography>
            <CheckCircleIcon sx={{ color: '#b8f0f9' }} fontSize='small' />
          </Box>
          <Typography variant='caption'>Quản trị viên</Typography>
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
          <Link
            to='/admin'
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <ListItem disablePadding>
              <ListItemButton
                selected={isActive('/admin')}
                sx={activeButtonStyle}
              >
                <ListItemIcon>
                  <PollIcon />
                </ListItemIcon>
                <ListItemText primary='Thống kê' />
              </ListItemButton>
            </ListItem>
          </Link>

          <Link
            to='/admin/user-management'
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <ListItem disablePadding>
              <ListItemButton
                selected={isActive('/admin/user-management')}
                sx={activeButtonStyle}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary='Quản lý người dùng' />
              </ListItemButton>
            </ListItem>
          </Link>

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
              {[
                {
                  label: 'Quản lý danh mục',
                  path: '/admin/categorie-management',
                  icon: <CategoryIcon />
                },
                {
                  label: 'Quản lý sản phẩm',
                  path: '/admin/product-management',
                  icon: <InventoryIcon />
                },
                {
                  label: 'Quản lý biến thể',
                  path: '/admin/variant-management'
                },
                {
                  label: 'Quản lý màu sắc',
                  path: '/admin/color-management',
                  icon: <PaletteIcon />
                },
                {
                  label: 'Quản lý kích thước',
                  path: '/admin/size-management',
                  icon: <StraightenIcon />
                }
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <ListItemButton
                    selected={isActive(item.path)}
                    sx={{ pl: 2, ...activeButtonStyle }}
                  >
                    <ListItemText primary={item.label} sx={{ ml: 7 }} />
                  </ListItemButton>
                </Link>
              ))}
            </List>
          </Collapse>

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
              {[
                {
                  label: 'Quản lý đơn hàng',
                  path: '/admin/order-management',
                  icon: <ReceiptLongIcon />
                },
                {
                  label: 'Quản lý mã giảm giá',
                  path: '/admin/discount-management',
                  icon: <LocalOfferIcon />
                },
                {
                  label: 'Quản lý giao dịch',
                  path: '/admin/transaction-management',
                  icon: <PaymentIcon />
                }
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <ListItemButton
                    selected={isActive(item.path)}
                    sx={{ pl: 2, ...activeButtonStyle }}
                  >
                    <ListItemText primary={item.label} sx={{ ml: 7 }} />
                  </ListItemButton>
                </Link>
              ))}
            </List>
          </Collapse>

          <ListItem disablePadding>
            <ListItemButton onClick={toggleInventory} sx={activeButtonStyle}>
              <ListItemIcon>
                <WarehouseIcon />
              </ListItemIcon>
              <ListItemText primary='Quản lý kho' />
              {openInventory ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={openInventory} timeout='auto' unmountOnExit>
            <List component='div' disablePadding>
              {[
                {
                  label: 'Thống kê kho',
                  path: '/admin/warehouse-statistic-management',
                  icon: <ReceiptLongIcon />
                },
                { label: 'Quản lý kho', path: '/admin/inventory-management' },
                {
                  label: 'Quản lý phiếu kho',
                  path: '/admin/warehouse-slips-management'
                },
                {
                  label: 'Quản lý nhật ký kho',
                  path: '/admin/inventory-log-management'
                },
                {
                  label: 'Quản lý kho hàng',
                  path: '/admin/warehouses-management'
                },
                { label: 'Quản lý lô hàng', path: '/admin/batches-management' },
                {
                  label: 'Quản lý đối tác',
                  path: '/admin/partner-management'
                }
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <ListItemButton
                    selected={isActive(item.path)}
                    sx={{ pl: 2, ...activeButtonStyle }}
                  >
                    <ListItemText primary={item.label} sx={{ ml: 7 }} />
                  </ListItemButton>
                </Link>
              ))}
            </List>
          </Collapse>
        </List>
      </Box>
    </Box>
  )
}
