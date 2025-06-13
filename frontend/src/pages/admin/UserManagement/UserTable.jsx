// import React from 'react'
//
// import Table from '@mui/material/Table'
// import TableBody from '@mui/material/TableBody'
// import TableHead from '@mui/material/TableHead'
// import TableRow from '@mui/material/TableRow'
// import Paper from '@mui/material/Paper'
//
// import StyleAdmin, {
//   StyledTableCell,
//   StyledTableRow,
//   StyledTableContainer
// } from '~/assets/StyleAdmin.jsx'
// import UserRow from './UserRow'
//
// const UserTable = React.memo(function UserTable({
//   users,
//   page,
//   handleOpenModal,
//   loading
// }) {
//   const validUsers = users.filter((user) => !user.destroy)
//
//   return (
//     <StyledTableContainer component={Paper}>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <StyledTableCell sx={StyleAdmin.TableColumnSTT}>
//               STT
//             </StyledTableCell>
//             <StyledTableCell sx={{ width: '300px' }}>Tên</StyledTableCell>
//             <StyledTableCell>Email</StyledTableCell>
//             <StyledTableCell sx={{ width: '200px' }}>Quyền</StyledTableCell>
//             <StyledTableCell className='hide-on-mobile'>
//               Ngày tạo
//             </StyledTableCell>
//             <StyledTableCell className='hide-on-mobile'>
//               Cập nhật
//             </StyledTableCell>
//             <StyledTableCell sx={{ maxWidth: '130px', width: '130px' }}>
//               Hành động
//             </StyledTableCell>
//           </TableRow>
//         </TableHead>
//
//         <TableBody>
//           {loading ? (
//             <StyledTableRow>
//               <StyledTableCell></StyledTableCell>
//               <StyledTableCell></StyledTableCell>
//               <StyledTableCell></StyledTableCell>
//               <StyledTableCell></StyledTableCell>
//               <StyledTableCell className='hide-on-mobile'></StyledTableCell>
//               <StyledTableCell className='hide-on-mobile'></StyledTableCell>
//               <StyledTableCell></StyledTableCell>
//             </StyledTableRow>
//           ) : validUsers.length > 0 ? (
//             validUsers.map((user, idx) => (
//               <UserRow
//                 key={user._id}
//                 user={user}
//                 index.jsx={(page - 1) * 10 + idx + 1}
//                 handleOpenModal={handleOpenModal}
//               />
//             ))
//           ) : (
//             <TableRow>
//               <StyledTableCell colSpan={7} align='center'>
//                 Không có người dùng nào
//               </StyledTableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </StyledTableContainer>
//   )
// })
// export default UserTable

import React from 'react'
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Typography,
  Box,
  TablePagination
} from '@mui/material'
import UserRow from './UserRow'
import FilterUser from '~/components/FilterAdmin/FilterUser.jsx'
const UserTable = React.memo(function UserTable({
  users,
  page,
  rowsPerPage,
  handleOpenModal,
  loading,
  onFilter
}) {
  const validUsers = users.filter((user) => !user.destroy)
  const columns = [
    { id: 'index', label: 'STT', minWidth: 50, align: 'center' },
    { id: 'name', label: 'Tên', minWidth: 300 },
    { id: 'email', label: 'Email', minWidth: 200 },
    { id: 'role', label: 'Quyền', minWidth: 200 },
    {
      id: 'createdAt',
      label: 'Ngày tạo',
      minWidth: 120,
      align: 'center',
      format: (value) => new Date(value).toLocaleDateString()
    },
    {
      id: 'updatedAt',
      label: 'Cập nhật',
      minWidth: 120,
      align: 'center',
      format: (value) => new Date(value).toLocaleDateString()
    },
    { id: 'action', label: 'Hành động', minWidth: 130, align: 'center' }
  ]

  return (
    <Paper sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader aria-label='users table'>
          <TableHead>
            <TableRow>
              <TableCell colSpan={columns.length}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <Typography variant='h6' sx={{ fontWeight: '800' }}>
                    Danh sách người dùng
                  </Typography>
                  <FilterUser onFilter={onFilter} />
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sx={{
                    minWidth: column.minWidth,
                    ...(column.id === 'index' && { width: '50px' })
                  }}
                  className={
                    ['createdAt', 'updatedAt'].includes(column.id)
                      ? 'hide-on-mobile'
                      : ''
                  }
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align}></TableCell>
                ))}
              </TableRow>
            ) : validUsers.length > 0 ? (
              validUsers.map((user, idx) => (
                <UserRow
                  key={user._id}
                  user={user}
                  index={idx + 1}
                  handleOpenModal={handleOpenModal}
                  columns={columns}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align='center'>
                  Không có người dùng nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={users.length || 1}
        rowsPerPage={rowsPerPage || 10}
        page={page || 1}
        labelRowsPerPage='Số dòng mỗi trang'
        labelDisplayedRows={({ from, to, count }) => {
          const actualTo = to > count ? count : to
          const actualFrom = from > count ? count : from
          return `${actualFrom}–${actualTo} trên ${count !== -1 ? count : `hơn ${actualTo}`}`
        }}
      />
    </Paper>
  )
})

export default UserTable
