import React from 'react'
import { Table, TableBody, TableHead, TableRow, TableCell } from '@mui/material'
import InventoryLogRow from './InventoryLogRow'

const InventoryLogTable = ({ logs, loading }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Ngày</TableCell>
          <TableCell>SKU</TableCell>
          <TableCell>Màu</TableCell>
          <TableCell>Size</TableCell>
          <TableCell>Loại</TableCell>
          <TableCell>Nguồn</TableCell>
          <TableCell>SL</TableCell>
          <TableCell>Giá nhập</TableCell>
          <TableCell>Giá bán</TableCell>
          <TableCell>Ghi chú</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={10} align='center'>
              Đang tải dữ liệu...
            </TableCell>
          </TableRow>
        ) : logs.length === 0 ? (
          <TableRow>
            <TableCell colSpan={10} align='center'>
              Không có dữ liệu
            </TableCell>
          </TableRow>
        ) : (
          logs.map((log) => <InventoryLogRow key={log._id} log={log} />)
        )}
      </TableBody>
    </Table>
  )
}

export default InventoryLogTable
