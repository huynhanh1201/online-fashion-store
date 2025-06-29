// PermissionTable.jsx
import React from 'react'
import {
  Paper,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import TableNoneData from '~/components/TableAdmin/NoneData'
import TablePaginationActions from '~/components/PaginationAdmin/TablePaginationActions'
import PermissionRow from './PermissionRow'

export default function PermissionTable({
  data,
  page,
  rowsPerPage,
  total,
  loading,
  onAdd,
  onEdit,
  onView,
  onDelete,
  onPageChange,
  onChangeRowsPerPage,
  permissions = {}
}) {
  const columns = [
    { id: 'index', label: 'STT', align: 'center', width: 50 },
    { id: 'key', label: 'Key', align: 'left', minWidth: 150 },
    { id: 'label', label: 'Tên hiển thị', align: 'left', minWidth: 200 },
    { id: 'group', label: 'Nhóm quyền', align: 'left', minWidth: 180 },
    { id: 'action', label: 'Hành động', align: 'left', width: 150 }
  ]

  const flattenPermissions = data.flatMap((groupItem) =>
    groupItem.permissions.map((perm) => ({
      ...perm,
      group: groupItem.group
    }))
  )

  return (
    <Paper sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader aria-label='permissions table'>
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
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    <Typography variant='h6' fontWeight='800'>
                      Danh sách quyền
                    </Typography>
                    <Button
                      onClick={onAdd}
                      startIcon={<AddIcon />}
                      sx={{
                        textTransform: 'none',
                        width: 100,
                        backgroundColor: 'var(--primary-color)',
                        color: '#fff'
                      }}
                    >
                      Thêm
                    </Button>
                  </Box>
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
                    width: column.width,
                    px: 1,
                    ...(column.id === 'action' && {
                      width: '130px',
                      maxWidth: '130px',
                      px: 2
                    })
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
            ) : flattenPermissions.length > 0 ? (
              flattenPermissions.map((permission, idx) => (
                <PermissionRow
                  key={permission.key}
                  permission={permission}
                  index={page * rowsPerPage + idx + 1}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            ) : (
              <TableNoneData
                col={columns.length}
                message='Không có quyền nào.'
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
        onPageChange={(event, newPage) => onPageChange(event, newPage + 1)} // truyền lại đúng logic cho parent
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
