// import React from 'react'
// import { Stack, IconButton, TableCell, TableRow } from '@mui/material'
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
// import BorderColorIcon from '@mui/icons-material/BorderColor'
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
//
// const formatDateTime = (isoString) => {
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
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '100%'
//   }
// }
//
// export default function SizeRow({ size, idx, handleOpenModal }) {
//   return (
//     <TableRow>
//       <TableCell sx={{ textAlign: 'center' }}>{idx + 1}</TableCell>
//       <TableCell
//         sx={{
//           maxWidth: 200,
//           overflow: 'hidden',
//           textOverflow: 'ellipsis',
//           whiteSpace: 'nowrap'
//         }}
//       >
//         {size.name}
//       </TableCell>
//       <TableCell>{formatDateTime(size.createdAt)}</TableCell>
//       <TableCell>{formatDateTime(size.updatedAt)}</TableCell>
//       <TableCell
//         sx={{
//           width: '130px',
//           maxWidth: '130px',
//           padding: '0px',
//           textAlign: 'center'
//         }}
//       >
//         <Stack direction='row' sx={styles.groupIcon}>
//           <IconButton
//             onClick={() => handleOpenModal('view', size)}
//             size='small'
//             color='primary'
//           >
//             <RemoveRedEyeIcon color='primary' />
//           </IconButton>
//           <IconButton
//             onClick={() => handleOpenModal('edit', size)}
//             size='small'
//             color='info'
//           >
//             <BorderColorIcon color='warning' />
//           </IconButton>
//           <IconButton
//             onClick={() => handleOpenModal('delete', size)}
//             size='small'
//             color='error'
//           >
//             <DeleteForeverIcon color='error' />
//           </IconButton>
//         </Stack>
//       </TableCell>
//     </TableRow>
//   )
// }

import React from 'react'
import { Stack, IconButton, TableCell, TableRow } from '@mui/material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

const formatDateTime = (isoString) => {
  if (!isoString) return '—'
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
export default function SizeRow({ size, index, columns, handleOpenModal }) {
  return (
    <TableRow hover>
      {columns.map(({ id, align }) => {
        let value

        switch (id) {
          case 'index':
            value = index
            break
          case 'name':
            value = size.name || '—'
            break
          case 'createdAt':
            value = formatDateTime(size.createdAt)
            break
          case 'updatedAt':
            value = formatDateTime(size.updatedAt)
            break
          case 'action':
            value = (
              <Stack direction='row' sx={styles.groupIcon}>
                <IconButton
                  onClick={() => handleOpenModal('view', size)}
                  size='small'
                >
                  <RemoveRedEyeIcon color='primary' />
                </IconButton>
                <IconButton
                  onClick={() => handleOpenModal('edit', size)}
                  size='small'
                >
                  <BorderColorIcon color='warning' />
                </IconButton>
                <IconButton
                  onClick={() => handleOpenModal('delete', size)}
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
