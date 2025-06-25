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
import TablePaginationActions from '~/components/PaginationAdmin/TablePaginationActions.jsx'
import TableNoneData from '~/components/TableAdmin/NoneData.jsx'
import FilterUser from '~/components/FilterAdmin/FilterUser' // nếu chưa có thì có thể tạo tương tự FilterColor

const UserTable = ({
  users,
  loading,
  page,
  rowsPerPage,
  handleOpenModal,
  onFilters,
  onPageChange,
  onChangeRowsPerPage,
  total,
  permissions = {}
}) => {
  const columns = [
    { id: 'index', label: 'STT', align: 'center', width: 50 },
    { id: 'avatar', label: 'Ảnh', align: 'left', width: 100 },
    { id: 'name', label: 'Tên người dùng', align: 'left' },
    {
      id: 'email',
      label: 'Email',
      align: 'left',
      maxWidth: 200
    },
    { id: 'role', label: 'Vai trò', align: 'left', width: 180 },
    { id: 'createdAt', label: 'Ngày tạo', align: 'left', minWidth: 100 },
    { id: 'updatedAt', label: 'Ngày cập nhật', align: 'left', minWidth: 100 },
    {
      id: 'action',
      label: 'Hành động',
      align: 'left',
      width: 130,
      maxWidth: 130,
      pl: '11px'
    }
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
                    alignItems: 'start',
                    minHeight: 76.5
                  }}
                >
                  <Typography variant='h6' sx={{ fontWeight: '800' }}>
                    Danh sách người dùng
                  </Typography>
                  <FilterUser
                    onFilter={onFilters}
                    users={users}
                    loading={loading}
                  />
                </Box>
              </TableCell>
            </TableRow>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  sx={{
                    px: 1,
                    ...(column.minWidth && { minWidth: column.minWidth }),
                    ...(column.width && { width: column.width }),
                    ...(column.maxWidth && { maxWidth: column.maxWidth }),
                    pl: column.pl,
                    whiteSpace: 'nowrap'
                  }}
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
            ) : users.length > 0 ? (
              users.map((user, idx) => (
                <UserRow
                  key={user._id}
                  user={user}
                  index={page * rowsPerPage + idx + 1}
                  columns={columns}
                  handleOpenModal={handleOpenModal}
                  permissions={permissions}
                />
              ))
            ) : (
              <TableNoneData
                col={columns.length}
                message='Không có dữ liệu người dùng.'
              />
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={total || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => onPageChange(event, newPage + 1)}
        onRowsPerPageChange={(event) => {
          const newLimit = parseInt(event.target.value, 10)
          if (onChangeRowsPerPage) {
            onChangeRowsPerPage(newLimit)
          }
        }}
        labelRowsPerPage='Số dòng mỗi trang'
        labelDisplayedRows={({ from, to, count }) => {
          const totalPages = Math.ceil(count / rowsPerPage)
          return `${from}–${to} trên ${count} | Trang ${page + 1} / ${totalPages}`
        }}
        ActionsComponent={TablePaginationActions}
      />
    </Paper>
  )
}

export default UserTable
