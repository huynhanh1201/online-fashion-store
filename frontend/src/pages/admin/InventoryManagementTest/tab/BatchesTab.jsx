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
  warehouseSlips,
  variants,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange
}) => {
  const enrichedBatches = data.map((batch) => {
    const slip = warehouseSlips.find((s) => s.id === batch.warehouseSlipId)
    const variant = variants.find((v) => v.id === batch.variantId)
    return {
      ...batch,
      slipCode: slip ? slip.code : 'N/A',
      variantName: variant ? variant.name : 'N/A',
      createdAtFormatted: new Date(batch.createdAt).toLocaleString()
    }
  })

  const batchColumns = [
    { id: 'slipCode', label: 'Mã phiếu', minWidth: 100 },
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
      id: 'exportPrice',
      label: 'Giá bán',
      minWidth: 100,
      align: 'right',
      format: (value) => `${value.toLocaleString()}đ`
    },
    { id: 'createdAtFormatted', label: 'Ngày tạo', minWidth: 150 },
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
