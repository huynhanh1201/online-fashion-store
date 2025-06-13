// // UserRow.jsx
// import React from 'react'
//
// import IconButton from '@mui/material/IconButton'
// import TableRow from '@mui/material/TableRow'
// import Stack from '@mui/material/Stack'
//
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
// import BorderColorIcon from '@mui/icons-material/BorderColor'
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
//
// import { StyledTableCell, StyledTableRow } from '~/assets/StyleAdmin.jsx'
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
//
// export default React.memo(function UserRow({ user, index.jsx, handleOpenModal }) {
//   return (
//     <StyledTableRow>
//       <StyledTableCell sx={{ textAlign: 'center' }}>{index.jsx}</StyledTableCell>
//       <StyledTableCell title={user.name}>
//         {user.name
//           ?.toLowerCase()
//           .split(' ')
//           .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//           .join(' ') || ''}
//       </StyledTableCell>
//       <StyledTableCell title={user.email}>{user.email}</StyledTableCell>
//       <StyledTableCell>
//         {user.role === 'admin' ? 'QUẢN TRỊ' : 'KHÁCH HÀNG'}
//       </StyledTableCell>
//       <StyledTableCell className='hide-on-mobile'>
//         {new Date(user.createdAt).toLocaleDateString()}
//       </StyledTableCell>
//       <StyledTableCell className='hide-on-mobile'>
//         {new Date(user.updatedAt).toLocaleDateString()}
//       </StyledTableCell>
//       <StyledTableCell>
//         <Stack direction='row' spacing={1} sx={styles.groupIcon}>
//           <IconButton
//             onClick={() => handleOpenModal('view', user)}
//             size='small'
//           >
//             <RemoveRedEyeIcon color='primary' />
//           </IconButton>
//           <IconButton
//             onClick={() => handleOpenModal('edit', user)}
//             size='small'
//           >
//             <BorderColorIcon color='warning' />
//           </IconButton>
//           <IconButton
//             onClick={() => handleOpenModal('delete', user)}
//             size='small'
//           >
//             <DeleteForeverIcon color='error' />
//           </IconButton>
//         </Stack>
//       </StyledTableCell>
//     </StyledTableRow>
//   )
// })
import React from 'react'
import { TableCell, TableRow, IconButton, Stack } from '@mui/material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { StyledTableCell, StyledTableRow } from '~/assets/StyleAdmin.jsx'

const styles = {
  groupIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 1
  }
}

export default React.memo(function UserRow({
  user,
  index,
  handleOpenModal,
  columns
}) {
  // console.log('UserRow render', index.jsx)
  return (
    <TableRow hover role='checkbox' tabIndex={-1}>
      {columns.map((column) => {
        if (column.id === 'action') {
          return (
            <TableCell key={column.id} align={column.align}>
              <Stack direction='row' sx={styles.groupIcon}>
                <IconButton
                  onClick={() => handleOpenModal('view', user)}
                  size='small'
                  color='primary'
                >
                  <RemoveRedEyeIcon color='primary' />
                </IconButton>
                <IconButton
                  onClick={() => handleOpenModal('edit', user)}
                  size='small'
                  color='info'
                >
                  <BorderColorIcon color='warning' />
                </IconButton>
                <IconButton
                  onClick={() => handleOpenModal('delete', user)}
                  size='small'
                  color='error'
                >
                  <DeleteForeverIcon color='error' />
                </IconButton>
              </Stack>
            </TableCell>
          )
        }

        const value = column.id === 'index' ? index : user[column.id]
        return (
          <TableCell
            key={column.id}
            align={column.align}
            title={['name', 'email'].includes(column.id) ? value : undefined}
            className={
              ['createdAt', 'updatedAt'].includes(column.id)
                ? 'hide-on-mobile'
                : ''
            }
          >
            {column.id === 'name' && value
              ? value
                  .toLowerCase()
                  .split(' ')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')
              : column.id === 'role'
                ? value === 'admin'
                  ? 'QUẢN TRỊ'
                  : 'KHÁCH HÀNG'
                : column.format && value
                  ? column.format(value)
                  : (value ?? 'Không có dữ liệu')}
          </TableCell>
        )
      })}
    </TableRow>
  )
})
