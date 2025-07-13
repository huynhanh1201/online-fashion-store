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
  TablePagination,
  Button
} from '@mui/material'
import RoleRow from './RoleRow'
import AddIcon from '@mui/icons-material/Add'
import TablePaginationActions from '~/components/PaginationAdmin/TablePaginationActions.jsx'
import TableNoneData from '~/components/TableAdmin/NoneData.jsx'
import FilterRole from '~/components/FilterAdmin/FilterRole.jsx'
import usePermissions from '~/hooks/usePermissions'

const RoleTable = ({
  roles,
  loading,
  page,
  rowsPerPage,
  handleOpenModal,
  addRole,
  onPageChange,
  onChangeRowsPerPage,
  total,
  permissions = {},
  onFilter,
  fetchRoles,
  filters
}) => {
  const columns = [
    { id: 'index', label: 'STT', align: 'center', width: 50 },
    { id: 'label', label: 'Tên vai trò', align: 'left', minWidth: 200 },
    { id: 'name', label: 'Tên định danh', align: 'left', minWidth: 200 },
    {
      id: 'permissionCount',
      label: 'Số quyền',
      align: 'right',
      minWidth: 136,
      pr: 11
    },
    { id: 'createdAt', label: 'Ngày tạo', align: 'left', minWidth: 200 },
    { id: 'updatedAt', label: 'Ngày cập nhật', align: 'left', minWidth: 200 },
    {
      id: 'action',
      label: 'Hành động',
      align: 'left',
      width: 130,
      maxWidth: 130,
      pl: '20px'
    }
  ]
  const { hasPermission } = usePermissions()

  return (
    <Paper sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader aria-label='roles table'>
          <TableHead>
            <TableRow>
              <TableCell colSpan={columns.length}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start'
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      minWidth: 250
                    }}
                  >
                    <Typography variant='h6' sx={{ fontWeight: '800' }}>
                      Danh sách vai trò
                    </Typography>
                    {hasPermission('role:create') && (
                      <Button
                        variant='contained'
                        color='primary'
                        onClick={addRole}
                        startIcon={<AddIcon />}
                        sx={{
                          textTransform: 'none',
                          width: 100,
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: 'var(--primary-color)',
                          color: '#fff'
                        }}
                      >
                        Thêm
                      </Button>
                    )}
                  </Box>
                  <FilterRole
                    onFilter={onFilter}
                    roles={roles}
                    loading={loading}
                    fetchRoles={fetchRoles}
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
                    pr: column.pr,
                    ...(column.minWidth && { minWidth: column.minWidth }),
                    ...(column.width && { width: column.width }),
                    ...(column.maxWidth && { maxWidth: column.maxWidth }),
                    ...(column.pl && {
                      paddingLeft: (theme) => theme.spacing(column.pl)
                    }),
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
            ) : roles.length > 0 ? (
              roles.map((role, idx) => (
                <RoleRow
                  key={role._id}
                  role={role}
                  index={page * rowsPerPage + idx + 1}
                  columns={columns}
                  handleOpenModal={handleOpenModal}
                  permissions={permissions}
                  filters={filters}
                />
              ))
            ) : (
              <TableNoneData
                col={columns.length}
                message='Không có dữ liệu vai trò.'
              />
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        sx={{ background: '#fff' }}
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

export default RoleTable
