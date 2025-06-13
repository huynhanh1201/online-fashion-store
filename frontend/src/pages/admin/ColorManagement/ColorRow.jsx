// import React from 'react'
// import { TableCell, TableRow, IconButton, Stack } from '@mui/material'
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
// import BorderColorIcon from '@mui/icons-material/BorderColor'
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
//
// // Hàm định dạng ngày giờ
// const formatDateTime = (isoString) => {
//   if (!isoString) return 'Không xác định'
//   const date = new Date(isoString)
//   return date.toLocaleString('vi-VN', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric'
//   })
// }
//
// const styles = {
//   groupIcon: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 1,
//     width: '130px'
//   }
// }
//
// export default function ColorRow({ color, index, columns, handleOpenModal }) {
//   return (
//     <TableRow hover>
//       {columns.map((column) => {
//         if (column.id === 'action') {
//           return (
//             <TableCell key={column.id} align={column.align}>
//               <Stack direction='row' sx={styles.groupIcon}>
//                 <IconButton
//                   onClick={() => handleOpenModal('view', color)}
//                   size='small'
//                   color='primary'
//                 >
//                   <RemoveRedEyeIcon color='primary' />
//                 </IconButton>
//                 <IconButton
//                   onClick={() => handleOpenModal('edit', color)}
//                   size='small'
//                   color='info'
//                 >
//                   <BorderColorIcon color='warning' />
//                 </IconButton>
//                 <IconButton
//                   onClick={() => handleOpenModal('delete', color)}
//                   size='small'
//                   color='error'
//                 >
//                   <DeleteForeverIcon color='error' />
//                 </IconButton>
//               </Stack>
//             </TableCell>
//           )
//         }
//
//         let value = ''
//         if (column.id === 'index') value = index
//         else if (['createdAt', 'updatedAt'].includes(column.id))
//           value = formatDateTime(color[column.id])
//         else value = color[column.id]
//
//         return (
//           <TableCell
//             key={column.id}
//             align={column.align}
//             title={typeof value === 'string' ? value : undefined}
//           >
//             {value ?? 'Không có dữ liệu'}
//           </TableCell>
//         )
//       })}
//     </TableRow>
//   )
// }

import React from 'react'
import { TableCell, TableRow, IconButton, Stack } from '@mui/material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

const formatDateTime = (isoString) => {
  if (!isoString) return 'Không xác định'
  const date = new Date(isoString)
  return date.toLocaleDateString('vi-VN')
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
    <TableRow hover role='checkbox' tabIndex={-1}>
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
