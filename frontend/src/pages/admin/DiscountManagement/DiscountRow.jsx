// import React from 'react'
// import { TableRow, TableCell, IconButton, Stack, Chip } from '@mui/material'
//
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
// import BorderColorIcon from '@mui/icons-material/BorderColor'
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
//
// const styles = {
//   groupIcon: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 1
//   }
// }
// const formatDate = (isoString) => {
//   const date = new Date(isoString)
//   return date.toLocaleString('vi-VN', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric'
//   })
// }
// export default function DiscountRow({ discount, index.jsx, columns, onAction }) {
//   const remaining = discount.usageLimit - discount.usedCount
//
//   return (
//     <TableRow hover>
//       {columns.map((col) => {
//         const { id, align } = col
//         let value
//
//         switch (id) {
//           case 'index.jsx':
//             value = index.jsx
//             break
//           case 'code':
//             value = discount.code?.toUpperCase()
//             break
//           case 'type':
//             value = discount.type === 'fixed' ? 'Cố định' : 'Phần trăm'
//             break
//           case 'amount':
//             value =
//               discount.type === 'fixed'
//                 ? `${discount.amount?.toLocaleString('vi-VN')} VNĐ`
//                 : `${discount.amount}%`
//             break
//           case 'minOrderValue':
//             value = discount.minOrderValue
//             if (discount.minOrderValue) {
//               value = `${discount.minOrderValue.toLocaleString('vi-VN')}`
//             }
//             break
//           case 'usageLimit':
//             value = discount.usageLimit
//             break
//           case 'remaining':
//             value = remaining >= 0 ? remaining : 0
//             break
//           case 'status':
//             value = (
//               <Chip
//                 label={discount.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
//                 color={discount.isActive ? 'success' : 'error'}
//                 size='large'
//                 sx={{ width: '120px', fontWeight: '800' }}
//               />
//             )
//             break
//           case 'validFrom':
//             value = formatDate(discount.validFrom)
//             break
//           case 'validUntil':
//             value = formatDate(discount.validUntil)
//             break
//           case 'action':
//             value = (
//               <Stack direction='row' spacing={1} sx={styles.groupIcon}>
//                 <IconButton
//                   onClick={() => onAction('view', discount)}
//                   size='small'
//                 >
//                   <RemoveRedEyeIcon color='primary' />
//                 </IconButton>
//                 <IconButton
//                   onClick={() => onAction('edit', discount)}
//                   size='small'
//                 >
//                   <BorderColorIcon color='warning' />
//                 </IconButton>
//                 <IconButton
//                   onClick={() => onAction('delete', discount)}
//                   size='small'
//                 >
//                   <DeleteForeverIcon color='error' />
//                 </IconButton>
//               </Stack>
//             )
//             break
//           default:
//             value = '—'
//         }
//
//         return (
//           <TableCell key={id} align={align || 'left'}>
//             {value}
//           </TableCell>
//         )
//       })}
//     </TableRow>
//   )
// }

import React from 'react'
import { TableRow, TableCell, IconButton, Stack, Chip } from '@mui/material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import VisibilityIcon from '@mui/icons-material/Visibility'
import StyleAdmin from '~/assets/StyleAdmin.jsx'
import Tooltip from '@mui/material/Tooltip'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : '—'

const styles = {
  cell: {
    height: 55,
    minHeight: 55,
    maxHeight: 55,
    lineHeight: '49px',
    py: 0,
    px: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    verticalAlign: 'middle'
  },
  groupIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 1,
    width: '130px'
  }
}

export default function DiscountRow({ discount, index, columns, onAction }) {
  const remaining = discount.usageLimit - discount.usedCount

  return (
    <TableRow hover>
      {columns.map(({ id, align }) => {
        let content = null

        switch (id) {
          case 'index':
            content = index
            break
          case 'code':
            content = discount.code?.toUpperCase() || '—'
            break
          case 'type':
            content = discount.type === 'fixed' ? 'Cố định' : 'Phần trăm'
            break
          case 'amount':
            content =
              discount.type === 'fixed'
                ? `${discount.amount?.toLocaleString('vi-VN')}đ`
                : `${discount.amount}%`
            break
          case 'minOrderValue':
            content = `${discount.minOrderValue?.toLocaleString('vi-VN')}đ`
            break
          case 'usageLimit':
            content = discount.usageLimit
            break
          case 'remaining':
            content = remaining >= 0 ? remaining : 0
            break
          case 'status':
            content = (
              <Chip
                label={discount.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                color={discount.isActive ? 'success' : 'error'}
                size='large'
                sx={{ width: '127px', fontWeight: '800' }}
              />
            )
            break
          case 'validFrom':
            content = formatDate(discount.validFrom)
            break
          case 'validUntil':
            content = formatDate(discount.validUntil)
            break
          case 'action':
            content = (
              <Stack direction='row' sx={styles.groupIcon}>
                <Tooltip title='Xem'>
                  <IconButton
                    onClick={() => onAction('view', discount)}
                    size='small'
                  >
                    <RemoveRedEyeIcon color='primary' />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Sửa'>
                  <IconButton
                    onClick={() => onAction('edit', discount)}
                    size='small'
                  >
                    <BorderColorIcon color='warning' />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Ẩn'>
                  <IconButton
                    onClick={() => onAction('delete', discount)}
                    size='small'
                  >
                    <VisibilityOffIcon color='error' />
                  </IconButton>
                </Tooltip>
              </Stack>
            )
            break
          default:
            content = discount[id] ?? '—'
        }

        return (
          <TableCell
            key={id}
            align={align || 'left'}
            sx={{
              ...styles.cell,
              ...(id === 'index' && StyleAdmin.TableColumnSTT)
            }}
            title={typeof content === 'string' ? content : undefined}
          >
            {content}
          </TableCell>
        )
      })}
    </TableRow>
  )
}
