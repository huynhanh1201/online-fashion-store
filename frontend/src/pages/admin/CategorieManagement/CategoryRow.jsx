// import React from 'react'
// import { TableRow, Stack } from '@mui/material'
// import IconButton from '@mui/material/IconButton'
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
// import BorderColorIcon from '@mui/icons-material/BorderColor'
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
// import {
//   StyledTableCell,
//   StyledTableRow,
//   StyledTableContainer
// } from '~/assets/StyleAdmin.jsx'
//
// const styles = {
//   groupIcon: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '100%'
//   },
//   iconStyle: {
//     cursor: 'pointer'
//   }
// }
// export default function CategoryRow({ category, idx, handleOpenModal }) {
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
//         {category.name}
//       </StyledTableCell>
//       <StyledTableCell
//         sx={{
//           maxWidth: 950,
//           overflow: 'hidden',
//           textOverflow: 'ellipsis',
//           whiteSpace: 'nowrap'
//         }}
//       >
//         {category.description}
//       </StyledTableCell>
//       <StyledTableCell>
//         <Stack direction='row' spacing={1} sx={styles.groupIcon}>
//           <IconButton
//             onClick={() => handleOpenModal('view', category)}
//             size='small'
//           >
//             <RemoveRedEyeIcon color='primary' />
//           </IconButton>
//           <IconButton
//             onClick={() => handleOpenModal('edit', category)}
//             size='small'
//           >
//             <BorderColorIcon color='warning' />
//           </IconButton>
//           <IconButton
//             onClick={() => handleOpenModal('delete', category)}
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

const styles = {
  groupIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 1
  }
}

export default function CategoryRow({
  category,
  index,
  columns,
  handleOpenModal
}) {
  return (
    <TableRow hover role='checkbox' tabIndex={-1}>
      {columns.map((column) => {
        if (column.id === 'action') {
          return (
            <TableCell key={column.id} align={column.align}>
              <Stack direction='row' sx={styles.groupIcon}>
                <IconButton
                  onClick={() => handleOpenModal('view', category)}
                  size='small'
                  color='primary'
                >
                  <RemoveRedEyeIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleOpenModal('edit', category)}
                  size='small'
                  color='info'
                >
                  <BorderColorIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleOpenModal('delete', category)}
                  size='small'
                  color='error'
                >
                  <DeleteForeverIcon />
                </IconButton>
              </Stack>
            </TableCell>
          )
        }

        const value = column.id === 'index' ? index : category[column.id]
        return (
          <TableCell
            key={column.id}
            align={column.align}
            title={
              ['name', 'description'].includes(column.id) ? value : undefined
            }
          >
            {value ?? 'Không có dữ liệu'}
          </TableCell>
        )
      })}
    </TableRow>
  )
}
