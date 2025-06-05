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
  Typography
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
import HistoryIcon from '@mui/icons-material/History'

export default function AdminSidebar({ open }) {
  const location = useLocation()
  const [openProduct, setOpenProduct] = React.useState(true)
  const [openOrder, setOpenOrder] = React.useState(true)

  const toggleProduct = () => setOpenProduct(!openProduct)
  const toggleOrder = () => setOpenOrder(!openOrder)

  const currentPath = location.pathname

  const isActive = (path) =>
    currentPath === path || currentPath.startsWith(path + '/')

  if (!open) return null

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
      <Box sx={{ height: 64, display: 'flex', alignItems: 'center', px: 2 }}>
        <Typography variant='h6' sx={{ color: '#001f5d' }}>
          Admin Menu
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {/* Thống kê */}
        <Link to='/admin' style={{ textDecoration: 'none', color: 'inherit' }}>
          <ListItem disablePadding>
            <ListItemButton selected={isActive('/admin')}>
              {/*<ListItemIcon>*/}
              {/*  <PollIcon />*/}
              {/*</ListItemIcon>*/}
              <ListItemText primary='Thống kê' />
            </ListItemButton>
          </ListItem>
        </Link>

        {/* Quản lý người dùng */}
        <Link
          to='/admin/user-management'
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <ListItem disablePadding>
            <ListItemButton selected={isActive('/admin/user-management')}>
              {/*<ListItemIcon>*/}
              {/*  <PersonIcon />*/}
              {/*</ListItemIcon>*/}
              <ListItemText primary='Quản lý người dùng' />
            </ListItemButton>
          </ListItem>
        </Link>

        {/* Quản lý sản phẩm */}
        <ListItem disablePadding>
          <ListItemButton onClick={toggleProduct}>
            {/*<ListItemIcon>*/}
            {/*  <InventoryIcon />*/}
            {/*</ListItemIcon>*/}
            <ListItemText primary='Quản lý sản phẩm' />
            {openProduct ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openProduct} timeout='auto' unmountOnExit>
          <List component='div' disablePadding sx={{ pl: 4 }}>
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
                key={item.label}
                to={item.path}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <ListItemButton selected={isActive(item.path)} sx={{ pl: 2 }}>
                  {/*<ListItemIcon>{item.icon}</ListItemIcon>*/}
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </Link>
            ))}
          </List>
        </Collapse>

        {/* Quản lý đơn hàng */}
        <ListItem disablePadding>
          <ListItemButton onClick={toggleOrder}>
            {/*<ListItemIcon>*/}
            {/*  <ReceiptLongIcon />*/}
            {/*</ListItemIcon>*/}
            <ListItemText primary='Quản lý đơn hàng' />
            {openOrder ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openOrder} timeout='auto' unmountOnExit>
          <List component='div' disablePadding sx={{ pl: 4 }}>
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
                label: 'Quản lý mã thanh toán',
                path: '/admin/transaction-management',
                icon: <PaymentIcon />
              }
            ].map((item) => (
              <Link
                key={item.label}
                to={item.path}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <ListItemButton selected={isActive(item.path)} sx={{ pl: 2 }}>
                  {/*<ListItemIcon>{item.icon}</ListItemIcon>*/}
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </Link>
            ))}
          </List>
        </Collapse>

        {/* Quản lý kho */}
        {[
          {
            label: 'Quản lý kho',
            path: '/admin/inventory-management',
            icon: <WarehouseIcon />
          }
        ].map((item) => (
          <Link
            key={item.label}
            to={item.path}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <ListItem disablePadding>
              <ListItemButton selected={isActive(item.path)}>
                {/*<ListItemIcon>{item.icon}</ListItemIcon>*/}
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  )
}
