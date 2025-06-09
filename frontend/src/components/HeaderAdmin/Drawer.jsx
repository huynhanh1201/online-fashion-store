// // import React from 'react'
// // import {
// //   Drawer,
// //   Divider,
// //   List,
// //   ListItem,
// //   ListItemButton,
// //   ListItemIcon,
// //   ListItemText
// // } from '@mui/material'
// // import ArrowRightIcon from '@mui/icons-material/ArrowRight'
// // import { Link, useLocation } from 'react-router-dom'
// // // icon
// // import PollIcon from '@mui/icons-material/Poll'
// // import PersonIcon from '@mui/icons-material/Person'
// // import CategoryIcon from '@mui/icons-material/Category'
// // import InventoryIcon from '@mui/icons-material/Inventory'
// // import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
// // import LocalOfferIcon from '@mui/icons-material/LocalOffer'
// // import PaymentIcon from '@mui/icons-material/Payment'
// // const tab = [
// //   { name: 'Thống kê', path: '/admin', icon: <PollIcon /> },
// //   {
// //     name: 'Quản lý người dùng',
// //     path: '/admin/user-management',
// //     icon: <PersonIcon />
// //   },
// //   {
// //     name: 'Quản lý danh mục',
// //     path: '/admin/categorie-management',
// //     icon: <CategoryIcon />
// //   },
// //   {
// //     name: 'Quản lý sản phẩm',
// //     path: '/admin/product-management',
// //     icon: <InventoryIcon />
// //   },
// //   {
// //     name: 'Quản lý đơn hàng',
// //     path: '/admin/order-management',
// //     icon: <ReceiptLongIcon />
// //   },
// //   {
// //     name: 'Quản lý mã giảm giá',
// //     path: '/admin/discount-management',
// //     icon: <LocalOfferIcon />
// //   },
// //   {
// //     name: 'Quản lý thanh toán',
// //     path: '/admin/transaction-management',
// //     icon: <PaymentIcon />
// //   }
// // ]
// //
// // export default function AdminDrawer({ open, onClose }) {
// //   const location = useLocation()
// //   const currentPath = location.pathname
// //   const activeTabPath = tab
// //     .map((t) => t.path)
// //     .filter(
// //       (path) => currentPath === path || currentPath.startsWith(path + '/')
// //     )
// //     .sort((a, b) => b.length - a.length)[0] // path dài nhất sẽ chính xác nhất
// //   return (
// //     <Drawer
// //       className={`drawer ${open ? 'open' : ''}`}
// //       classes={{ paper: 'drawer-paper' }}
// //       variant='temporary'
// //       anchor='left'
// //       open={open}
// //       onClose={onClose}
// //       ModalProps={{
// //         keepMounted: true,
// //         BackdropProps: { sx: { backgroundColor: 'transparent' } }
// //       }}
// //       hideBackdrop={true}
// //     >
// //       <div className='drawer-header Drawer-header'></div>
// //       <Divider />
// //       <List sx={{ padding: 0 }} className='drawer-list'>
// //         {tab.map((item) => {
// //           const isActive = item.path === activeTabPath
// //           return (
// //             <Link to={item.path} className='drawer-link' key={item.name}>
// //               <ListItem className='list-item' disablePadding>
// //                 <ListItemButton
// //                   className='list-item-button'
// //                   sx={{
// //                     backgroundColor: isActive
// //                       ? 'rgba(0, 31, 93, 0.3)'
// //                       : 'transparent',
// //                     '&:hover': {
// //                       backgroundColor: isActive
// //                         ? 'rgba(0, 31, 93, 0.3)'
// //                         : 'rgba(0, 31, 93, 0.1)'
// //                     }
// //                   }}
// //                 >
// //                   <ListItemIcon
// //                     className='list-item-icon'
// //                     sx={{
// //                       minWidth: '36px',
// //                       color: isActive ? '#001f5d' : 'inherit'
// //                     }}
// //                   >
// //                     {item.icon}
// //                   </ListItemIcon>
// //                   <ListItemText
// //                     className='list-item-text'
// //                     primary={item.name}
// //                     primaryTypographyProps={{
// //                       sx: { color: isActive ? '#001f5d' : 'inherit' }
// //                     }}
// //                   />
// //                 </ListItemButton>
// //               </ListItem>
// //             </Link>
// //           )
// //         })}
// //       </List>
// //     </Drawer>
// //   )
// // }
//
// import React from 'react'
// import {
//   Divider,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Box,
//   Typography
// } from '@mui/material'
// import ArrowRightIcon from '@mui/icons-material/ArrowRight'
// import { Link, useLocation } from 'react-router-dom'
//
// // icon
// import PollIcon from '@mui/icons-material/Poll'
// import PersonIcon from '@mui/icons-material/Person'
// import CategoryIcon from '@mui/icons-material/Category'
// import InventoryIcon from '@mui/icons-material/Inventory'
// import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
// import LocalOfferIcon from '@mui/icons-material/LocalOffer'
// import PaymentIcon from '@mui/icons-material/Payment'
// import PaletteIcon from '@mui/icons-material/Palette'
// import StraightenIcon from '@mui/icons-material/Straighten'
// import WarehouseIcon from '@mui/icons-material/Warehouse'
// import HistoryIcon from '@mui/icons-material/History'
// const tab = [
//   { name: 'Thống kê', path: '/admin', icon: <PollIcon /> },
//   {
//     name: 'Quản lý người dùng',
//     path: '/admin/user-management',
//     icon: <PersonIcon />
//   },
//   {
//     name: 'Quản lý danh mục',
//     path: '/admin/categorie-management',
//     icon: <CategoryIcon />
//   },
//   {
//     name: 'Quản lý sản phẩm',
//     path: '/admin/product-management',
//     icon: <InventoryIcon />
//   },
//   {
//     name: 'Quản lý đơn hàng',
//     path: '/admin/order-management',
//     icon: <ReceiptLongIcon />
//   },
//   {
//     name: 'Quản lý mã giảm giá',
//     path: '/admin/discount-management',
//     icon: <LocalOfferIcon />
//   },
//   {
//     name: 'Quản lý thanh toán',
//     path: '/admin/transaction-management',
//     icon: <PaymentIcon />
//   },
//   {
//     name: 'Quản lý màu sản phẩm',
//     path: '/admin/color-management',
//     icon: <PaletteIcon />
//   },
//   {
//     name: 'Quản lý kích cỡ',
//     path: '/admin/size-management',
//     icon: <StraightenIcon />
//   },
//   {
//     name: 'Quản lý kho',
//     path: '/admin/inventory-management',
//     icon: <WarehouseIcon />
//   },
//   {
//     name: 'Nhật ký kho',
//     path: '/admin/inventory-log-management',
//     icon: <HistoryIcon />
//   }
// ]
//
// export default function AdminSidebar({ open }) {
//   const location = useLocation()
//   const currentPath = location.pathname
//   const activeTabPath = tab
//     .map((t) => t.path)
//     .filter(
//       (path) => currentPath === path || currentPath.startsWith(path + '/')
//     )
//     .sort((a, b) => b.length - a.length)[0]
//
//   if (!open) return null
//
//   return (
//     <Box
//       sx={{
//         width: 240,
//         height: '100vh',
//         backgroundColor: 'white',
//         boxShadow: 3,
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         zIndex: 1200,
//         display: 'flex',
//         flexDirection: 'column'
//       }}
//     >
//       <Box sx={{ height: 64, display: 'flex', alignItems: 'center', px: 2 }}>
//         <Typography variant='h6' sx={{ color: '#001f5d' }}>
//           Admin Menu
//         </Typography>
//       </Box>
//       <Divider />
//       <List sx={{ flexGrow: 1 }}>
//         {tab.map((item) => {
//           const isActive = item.path === activeTabPath
//           return (
//             <Link
//               to={item.path}
//               key={item.name}
//               style={{ textDecoration: 'none', color: 'inherit' }}
//             >
//               <ListItem disablePadding>
//                 <ListItemButton
//                 // sx={{
//                 //   backgroundColor: isActive
//                 //     ? 'rgba(0, 31, 93, 0.3)'
//                 //     : 'transparent',
//                 //   '&:hover': {
//                 //     backgroundColor: isActive
//                 //       ? 'rgba(0, 31, 93, 0.3)'
//                 //       : 'rgba(0, 31, 93, 0.1)'
//                 //   }
//                 // }}
//                 >
//                   <ListItemIcon
//                     sx={{
//                       minWidth: '36px',
//                       color: isActive ? '#1A3C7B' : 'inherit'
//                     }}
//                   >
//                     {item.icon}
//                   </ListItemIcon>
//                   <ListItemText
//                     primary={item.name}
//                     primaryTypographyProps={{
//                       sx: {
//                         color: isActive ? '#1A3C7B' : 'inherit',
//                         fontWeight: isActive ? '900' : 'normal'
//                       }
//                     }}
//                   />
//                 </ListItemButton>
//               </ListItem>
//             </Link>
//           )
//         })}
//       </List>
//     </Box>
//   )
// }

// import React from 'react'
// import {
//   Divider,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Collapse,
//   Box,
//   Typography
// } from '@mui/material'
// import { Link, useLocation } from 'react-router-dom'
// import ExpandLess from '@mui/icons-material/ExpandLess'
// import ExpandMore from '@mui/icons-material/ExpandMore'
//
// // Icon
// import PollIcon from '@mui/icons-material/Poll'
// import PersonIcon from '@mui/icons-material/Person'
// import CategoryIcon from '@mui/icons-material/Category'
// import InventoryIcon from '@mui/icons-material/Inventory'
// import PaletteIcon from '@mui/icons-material/Palette'
// import StraightenIcon from '@mui/icons-material/Straighten'
// import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
// import LocalOfferIcon from '@mui/icons-material/LocalOffer'
// import PaymentIcon from '@mui/icons-material/Payment'
// import WarehouseIcon from '@mui/icons-material/Warehouse'
// import HistoryIcon from '@mui/icons-material/History'
//
// export default function AdminSidebar({ open }) {
//   const location = useLocation()
//   const [openProduct, setOpenProduct] = React.useState(true)
//   const [openOrder, setOpenOrder] = React.useState(true)
//
//   const toggleProduct = () => setOpenProduct(!openProduct)
//   const toggleOrder = () => setOpenOrder(!openOrder)
//
//   const currentPath = location.pathname
//
//   const isActive = (path) =>
//     currentPath === path || currentPath.startsWith(path + '/')
//
//   if (!open) return null
//
//   return (
//     <Box
//       sx={{
//         width: 260,
//         height: '100vh',
//         backgroundColor: 'white',
//         boxShadow: 3,
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         zIndex: 1200,
//         display: 'flex',
//         flexDirection: 'column'
//       }}
//     >
//       <Box sx={{ height: 64, display: 'flex', alignItems: 'center', px: 2 }}>
//         <Typography variant='h6' sx={{ color: '#001f5d' }}>
//           Admin Menu
//         </Typography>
//       </Box>
//       <Divider />
//       <List sx={{ flexGrow: 1 }}>
//         {/* Thống kê */}
//         <Link to='/admin' style={{ textDecoration: 'none', color: 'inherit' }}>
//           <ListItem disablePadding>
//             <ListItemButton selected={isActive('/admin')}>
//               <ListItemIcon>
//                 <PollIcon />
//               </ListItemIcon>
//               <ListItemText primary='Thống kê' />
//             </ListItemButton>
//           </ListItem>
//         </Link>
//
//         {/* Quản lý người dùng */}
//         <Link
//           to='/admin/user-management'
//           style={{ textDecoration: 'none', color: 'inherit' }}
//         >
//           <ListItem disablePadding>
//             <ListItemButton selected={isActive('/admin/user-management')}>
//               <ListItemIcon>
//                 <PersonIcon />
//               </ListItemIcon>
//               <ListItemText primary='Quản lý người dùng' />
//             </ListItemButton>
//           </ListItem>
//         </Link>
//
//         {/* Quản lý sản phẩm */}
//         <ListItem disablePadding>
//           <ListItemButton onClick={toggleProduct}>
//             <ListItemIcon>
//               <InventoryIcon />
//             </ListItemIcon>
//             <ListItemText primary='Quản lý sản phẩm' />
//             {openProduct ? <ExpandLess /> : <ExpandMore />}
//           </ListItemButton>
//         </ListItem>
//         <Collapse in={openProduct} timeout='auto' unmountOnExit>
//           <List component='div' disablePadding sx={{ pl: 4 }}>
//             {[
//               {
//                 label: 'Quản lý danh mục',
//                 path: '/admin/categorie-management',
//                 icon: <CategoryIcon />
//               },
//               {
//                 label: 'Quản lý sản phẩm',
//                 path: '/admin/product-management',
//                 icon: <InventoryIcon />
//               },
//               {
//                 label: 'Quản lý màu sắc',
//                 path: '/admin/color-management',
//                 icon: <PaletteIcon />
//               },
//               {
//                 label: 'Quản lý kích thước',
//                 path: '/admin/size-management',
//                 icon: <StraightenIcon />
//               }
//             ].map((item) => (
//               <Link
//                 key={item.label}
//                 to={item.path}
//                 style={{ textDecoration: 'none', color: 'inherit' }}
//               >
//                 <ListItemButton selected={isActive(item.path)} sx={{ pl: 2 }}>
//                   {/*<ListItemIcon>{item.icon}</ListItemIcon>*/}
//                   <ListItemText primary={item.label} />
//                 </ListItemButton>
//               </Link>
//             ))}
//           </List>
//         </Collapse>
//
//         {/* Quản lý đơn hàng */}
//         <ListItem disablePadding>
//           <ListItemButton onClick={toggleOrder}>
//             <ListItemIcon>
//               <ReceiptLongIcon />
//             </ListItemIcon>
//             <ListItemText primary='Quản lý đơn hàng' />
//             {openOrder ? <ExpandLess /> : <ExpandMore />}
//           </ListItemButton>
//         </ListItem>
//         <Collapse in={openOrder} timeout='auto' unmountOnExit>
//           <List component='div' disablePadding sx={{ pl: 4 }}>
//             {[
//               {
//                 label: 'Quản lý đơn hàng',
//                 path: '/admin/order-management',
//                 icon: <ReceiptLongIcon />
//               },
//               {
//                 label: 'Quản lý mã giảm giá',
//                 path: '/admin/discount-management',
//                 icon: <LocalOfferIcon />
//               },
//               {
//                 label: 'Quản lý mã thanh toán',
//                 path: '/admin/transaction-management',
//                 icon: <PaymentIcon />
//               }
//             ].map((item) => (
//               <Link
//                 key={item.label}
//                 to={item.path}
//                 style={{ textDecoration: 'none', color: 'inherit' }}
//               >
//                 <ListItemButton selected={isActive(item.path)} sx={{ pl: 2 }}>
//                   {/*<ListItemIcon>{item.icon}</ListItemIcon>*/}
//                   <ListItemText primary={item.label} />
//                 </ListItemButton>
//               </Link>
//             ))}
//           </List>
//         </Collapse>
//
//         {/* Quản lý kho */}
//         {[
//           {
//             label: 'Quản lý kho',
//             path: '/admin/inventory-management',
//             icon: <WarehouseIcon />
//           }
//         ].map((item) => (
//           <Link
//             key={item.label}
//             to={item.path}
//             style={{ textDecoration: 'none', color: 'inherit' }}
//           >
//             <ListItem disablePadding>
//               <ListItemButton selected={isActive(item.path)}>
//                 <ListItemIcon>{item.icon}</ListItemIcon>
//                 <ListItemText primary={item.label} />
//               </ListItemButton>
//             </ListItem>
//           </Link>
//         ))}
//       </List>
//     </Box>
//   )
// }

import React from 'react'
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Typography,
  Avatar
} from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'

// Icon
import PollIcon from '@mui/icons-material/Poll'
import PersonIcon from '@mui/icons-material/Person'
import CategoryIcon from '@mui/icons-material/Category'
import InventoryIcon from '@mui/icons-material/Inventory'
import PaletteIcon from '@mui/icons-material/Palette'
import StraightenIcon from '@mui/icons-material/Straighten'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import PaymentIcon from '@mui/icons-material/Payment'
import WarehouseIcon from '@mui/icons-material/Warehouse'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

export default function AdminSidebar({ open, profile, onDrawerOpen }) {
  const location = useLocation()
  const [openProduct, setOpenProduct] = React.useState(false)
  const [openOrder, setOpenOrder] = React.useState(false)

  const toggleProduct = () => setOpenProduct(!openProduct)
  const toggleOrder = () => setOpenOrder(!openOrder)

  const currentPath = location.pathname

  // Danh sách các path thuộc menu sản phẩm
  const productPaths = [
    '/admin/categorie-management',
    '/admin/product-management',
    '/admin/color-management',
    '/admin/size-management'
  ]

  // Danh sách các path thuộc menu đơn hàng
  const orderPaths = [
    '/admin/order-management',
    '/admin/discount-management',
    '/admin/transaction-management'
  ]

  const isActive = (path) => {
    const normalizedPath = path.endsWith('/') ? path.slice(0, -1) : path
    const current = currentPath.endsWith('/')
      ? currentPath.slice(0, -1)
      : currentPath
    return current === normalizedPath
  }

  // Kiểm tra menu cha có active không
  const isProductMenuActive = productPaths.some((path) => isActive(path))
  const isOrderMenuActive = orderPaths.some((path) => isActive(path))

  // Tự động mở menu cha khi tab con active
  React.useEffect(() => {
    if (isProductMenuActive) {
      setOpenProduct(true)
    }
    if (isOrderMenuActive) {
      setOpenOrder(true)
    }
  }, [currentPath])

  const activeButtonStyle = {
    '&.Mui-selected': {
      // backgroundColor: '#89a9e5',
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
        onClick={onDrawerOpen} // Mở drawer khi click vào sidebar
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
              sx={{ padding: '12px 16px', ...activeButtonStyle }}
            >
              <ListItemIcon>
                <PollIcon />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ height: 48 }}>
            <ListItemButton
              selected={isActive('/admin/user-management')}
              sx={{ padding: '12px 16px', ...activeButtonStyle }}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ height: 48 }}>
            <ListItemButton
              onClick={toggleProduct}
              selected={isProductMenuActive}
              sx={{ padding: '12px 16px', ...activeButtonStyle }}
            >
              <ListItemIcon sx={{ minWidth: 45 }}>
                <InventoryIcon />
                <ExpandLess sx={{ transform: 'rotate(90deg)' }} />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ height: 48 }}>
            <ListItemButton
              onClick={toggleOrder}
              selected={isOrderMenuActive}
              sx={{ padding: '12px 16px', ...activeButtonStyle }}
            >
              <ListItemIcon sx={{ minWidth: 35 }}>
                <ReceiptLongIcon />
                <ExpandLess sx={{ transform: 'rotate(90deg)' }} />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ height: 48 }}>
            <ListItemButton
              selected={isActive('/admin/inventory-management')}
              sx={{ padding: '12px 16px', ...activeButtonStyle }}
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
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
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

      <List sx={{ flexGrow: 1, pt: 0 }}>
        <Link to='/admin' style={{ textDecoration: 'none', color: 'inherit' }}>
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
          <ListItemButton
            onClick={toggleProduct}
            selected={isProductMenuActive}
            sx={activeButtonStyle}
          >
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
          <ListItemButton
            onClick={toggleOrder}
            selected={isOrderMenuActive}
            sx={activeButtonStyle}
          >
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

        <Link
          to='/admin/inventory-management'
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <ListItem disablePadding>
            <ListItemButton
              selected={isActive('/admin/inventory-management')}
              sx={activeButtonStyle}
            >
              <ListItemIcon>
                <WarehouseIcon />
              </ListItemIcon>
              <ListItemText primary='Quản lý kho' />
            </ListItemButton>
          </ListItem>
        </Link>
      </List>
    </Box>
  )
}
