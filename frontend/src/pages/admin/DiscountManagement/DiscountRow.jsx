// import React from 'react'
//
// import IconButton from '@mui/material/IconButton'
// import Stack from '@mui/material/Stack'
// import Chip from '@mui/material/Chip'
//
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
// import BorderColorIcon from '@mui/icons-material/BorderColor'
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
//
// import { StyledTableCell, StyledTableRow } from '~/assets/StyleAdmin.jsx'
//
// const DiscountRow = ({ discount, index, onAction }) => {
//   const remaining = discount.usageLimit - discount.usedCount
//
//   return (
//     <StyledTableRow>
//       <StyledTableCell sx={{ textAlign: 'center' }}>
//         {index + 1}
//       </StyledTableCell>
//       <StyledTableCell>{discount.code.toUpperCase()}</StyledTableCell>
//       <StyledTableCell>
//         {discount.type === 'fixed' ? 'Cố định' : 'Phần trăm'}
//       </StyledTableCell>
//       <StyledTableCell>
//         {discount.type === 'fixed'
//           ? `${discount.amount?.toLocaleString('vi-VN')} VNĐ`
//           : `${discount.amount}%`}
//       </StyledTableCell>
//
//       <StyledTableCell>{discount.usageLimit}</StyledTableCell>
//       <StyledTableCell>{remaining >= 0 ? remaining : 0}</StyledTableCell>
//       <StyledTableCell>
//         <Chip
//           label={discount.status !== 'active' ? 'Hoạt động' : 'Ngừng hoạt động'}
//           color={discount.status !== 'active' ? 'success' : 'error'}
//           size='small'
//         />
//       </StyledTableCell>
//       <StyledTableCell>
//         {discount.validFrom
//           ? new Date(discount.validFrom).toLocaleString()
//           : ''}
//       </StyledTableCell>
//       <StyledTableCell>
//         {discount.validUntil
//           ? new Date(discount.validUntil).toLocaleString()
//           : ''}
//       </StyledTableCell>
//       <StyledTableCell>
//         <Stack direction='row' spacing={1}>
//           <IconButton onClick={() => onAction('view', discount)} size='small'>
//             <RemoveRedEyeIcon color='primary' />
//           </IconButton>
//           <IconButton onClick={() => onAction('edit', discount)} size='small'>
//             <BorderColorIcon color='warning' />
//           </IconButton>
//           <IconButton onClick={() => onAction('delete', discount)} size='small'>
//             <DeleteForeverIcon color='error' />
//           </IconButton>
//         </Stack>
//       </StyledTableCell>
//     </StyledTableRow>
//   )
// }
//
// export default DiscountRow

import React from 'react'
import { TableRow, TableCell, IconButton, Stack, Chip } from '@mui/material'

import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

const styles = {
  groupIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 1
  }
}
const formatDate = (isoString) => {
  const date = new Date(isoString)
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
export default function DiscountRow({ discount, index, columns, onAction }) {
  const remaining = discount.usageLimit - discount.usedCount

  return (
    <TableRow hover>
      {columns.map((col) => {
        const { id, align } = col
        let value

        switch (id) {
          case 'index':
            value = index
            break
          case 'code':
            value = discount.code?.toUpperCase()
            break
          case 'type':
            value = discount.type === 'fixed' ? 'Cố định' : 'Phần trăm'
            break
          case 'amount':
            value =
              discount.type === 'fixed'
                ? `${discount.amount?.toLocaleString('vi-VN')} VNĐ`
                : `${discount.amount}%`
            break
          case 'minOrderValue':
            value = discount.minOrderValue
            if (discount.minOrderValue) {
              value = `${discount.minOrderValue.toLocaleString('vi-VN')}`
            }
            break
          case 'usageLimit':
            value = discount.usageLimit
            break
          case 'remaining':
            value = remaining >= 0 ? remaining : 0
            break
          case 'status':
            value = (
              <Chip
                label={discount.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                color={discount.isActive ? 'success' : 'error'}
                size='large'
                sx={{ width: '120px', fontWeight: '800' }}
              />
            )
            break
          case 'validFrom':
            value = formatDate(discount.validFrom)
            break
          case 'validUntil':
            value = formatDate(discount.validUntil)
            break
          case 'action':
            value = (
              <Stack direction='row' spacing={1} sx={styles.groupIcon}>
                <IconButton
                  onClick={() => onAction('view', discount)}
                  size='small'
                >
                  <RemoveRedEyeIcon color='primary' />
                </IconButton>
                <IconButton
                  onClick={() => onAction('edit', discount)}
                  size='small'
                >
                  <BorderColorIcon color='warning' />
                </IconButton>
                <IconButton
                  onClick={() => onAction('delete', discount)}
                  size='small'
                >
                  <DeleteForeverIcon color='error' />
                </IconButton>
              </Stack>
            )
            break
          default:
            value = '—'
        }

        return (
          <TableCell key={id} align={align || 'left'}>
            {value}
          </TableCell>
        )
      })}
    </TableRow>
  )
}
