// import React from 'react'
// import { Stack, IconButton } from '@mui/material'
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
// import BorderColorIcon from '@mui/icons-material/BorderColor'
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
//
// import { StyledTableCell, StyledTableRow } from '~/assets/StyleAdmin.jsx'
//
// // Hàm định dạng ngày giờ thành dạng DD/MM/YYYY HH:mm
// const formatDateTime = (isoString) => {
//   const date = new Date(isoString)
//   return date.toLocaleString('vi-VN', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit'
//   })
// }
//
// const styles = {
//   groupIcon: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '100%'
//   }
// }
//
// export default function ColorRow({ color, idx, handleOpenModal }) {
//   return (
//     <StyledTableRow>
//       <StyledTableCell sx={{ textAlign: 'center' }}>{idx + 1}</StyledTableCell>
//       <StyledTableCell
//         sx={{
//           maxWidth: 200,
//           overflow: 'hidden',
//           textOverflow: 'ellipsis',
//           whiteSpace: 'nowrap'
//         }}
//       >
//         {color.name}
//       </StyledTableCell>
//       <StyledTableCell>{formatDateTime(color.createdAt)}</StyledTableCell>
//       <StyledTableCell>{formatDateTime(color.updatedAt)}</StyledTableCell>
//       <StyledTableCell sx={{ width: '130px', maxWidth: '130px' }}>
//         <Stack direction='row' spacing={1} sx={styles.groupIcon}>
//           <IconButton
//             onClick={() => handleOpenModal('view', color)}
//             size='small'
//           >
//             <RemoveRedEyeIcon color='primary' />
//           </IconButton>
//           <IconButton
//             onClick={() => handleOpenModal('edit', color)}
//             size='small'
//           >
//             <BorderColorIcon color='warning' />
//           </IconButton>
//           <IconButton
//             onClick={() => handleOpenModal('delete', color)}
//             size='small'
//           >
//             <DeleteForeverIcon color='error' />
//           </IconButton>
//         </Stack>
//       </StyledTableCell>
//     </StyledTableRow>
//   )
// }

import React from 'react'
import { TableCell, TableRow, IconButton, Stack } from '@mui/material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

// Hàm định dạng ngày giờ
const formatDateTime = (isoString) => {
  if (!isoString) return 'Không xác định'
  const date = new Date(isoString)
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const styles = {
  groupIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 1,
    width: '130px'
  }
}

export default function ColorRow({ color, index, columns, handleOpenModal }) {
  return (
    <TableRow hover>
      {columns.map((column) => {
        if (column.id === 'action') {
          return (
            <TableCell key={column.id} align={column.align}>
              <Stack direction='row' sx={styles.groupIcon}>
                <IconButton
                  onClick={() => handleOpenModal('view', color)}
                  size='small'
                  color='primary'
                >
                  <RemoveRedEyeIcon color='primary' />
                </IconButton>
                <IconButton
                  onClick={() => handleOpenModal('edit', color)}
                  size='small'
                  color='info'
                >
                  <BorderColorIcon color='warning' />
                </IconButton>
                <IconButton
                  onClick={() => handleOpenModal('delete', color)}
                  size='small'
                  color='error'
                >
                  <DeleteForeverIcon color='error' />
                </IconButton>
              </Stack>
            </TableCell>
          )
        }

        let value = ''
        if (column.id === 'index') value = index
        else if (['createdAt', 'updatedAt'].includes(column.id))
          value = formatDateTime(color[column.id])
        else value = color[column.id]

        return (
          <TableCell
            key={column.id}
            align={column.align}
            title={typeof value === 'string' ? value : undefined}
          >
            {value ?? 'Không có dữ liệu'}
          </TableCell>
        )
      })}
    </TableRow>
  )
}
