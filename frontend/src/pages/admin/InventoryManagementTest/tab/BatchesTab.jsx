import React from 'react'
import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Typography
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'

const BatchesTab = ({
  data,
  variants,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange
}) => {
  const enrichedBatches = (data || []).map((batch) => {
    const variant = (variants || []).find((v) => v._id === batch.variantId)

    return {
      ...batch,
      variantName: variant ? variant.name : 'N/A',
      importedAtFormatted: batch.importedAt
        ? new Date(batch.importedAt).toLocaleString('vi-VN')
        : 'Chưa nhập',
      createdAtFormatted: new Date(batch.createdAt).toLocaleString('vi-VN')
    }
  })

  const batchColumns = [
    { id: 'batchCode', label: 'Mã lô', minWidth: 120 },
    { id: 'variantName', label: 'Biến thể', minWidth: 150 },
    { id: 'quantity', label: 'Số lượng', minWidth: 100, align: 'right' },
    {
      id: 'importPrice',
      label: 'Giá nhập',
      minWidth: 100,
      align: 'right',
      format: (value) => `${value.toLocaleString()}đ`
    },
    {
      id: 'importedAtFormatted',
      label: 'Ngày nhập',
      minWidth: 160,
      align: 'center'
    },
    {
      id: 'createdAtFormatted',
      label: 'Ngày tạo',
      minWidth: 160,
      align: 'center'
    },
    { id: 'action', label: 'Hành động', minWidth: 100, align: 'center' }
  ]

  return (
    <Paper sx={{ border: '1px solid #ccc', width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='batches table'>
          <TableHead>
            <TableRow>
              <TableCell colSpan={batchColumns.length}>
                <Typography variant='h6' sx={{ fontWeight: '800' }}>
                  Quản lý Lô hàng
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              {batchColumns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {enrichedBatches
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow hover role='checkbox' tabIndex={-1} key={index}>
                  {batchColumns.map((column) => {
                    const value = row[column.id]
                    if (column.id === 'action') {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <VisibilityIcon />
                        </TableCell>
                      )
                    }
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number'
                          ? column.format(value)
                          : value}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={enrichedBatches.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Paper>
  )
}

export default BatchesTab
