import React from 'react'
import { Table, TableBody, TableHead } from '@mui/material'
import InventoryLogRow from './InventoryLogRow'
import StyleAdmin, {
  StyledTableCell,
  StyledTableRow
} from '~/assets/StyleAdmin.jsx'
const InventoryLogTable = ({ logs, loading }) => {
  return (
    <Table>
      <TableHead>
        <StyledTableRow>
          <StyledTableCell>Ngày</StyledTableCell>
          <StyledTableCell>SKU</StyledTableCell>
          <StyledTableCell>Màu</StyledTableCell>
          <StyledTableCell>Size</StyledTableCell>
          <StyledTableCell>Loại</StyledTableCell>
          <StyledTableCell>Nguồn</StyledTableCell>
          <StyledTableCell>SL</StyledTableCell>
          <StyledTableCell>Giá nhập</StyledTableCell>
          <StyledTableCell>Giá bán</StyledTableCell>
          <StyledTableCell>Ghi chú</StyledTableCell>
        </StyledTableRow>
      </TableHead>
      <TableBody>
        {loading ? (
          <StyledTableRow>
            <StyledTableCell colSpan={10} align='center'>
              Đang tải dữ liệu...
            </StyledTableCell>
          </StyledTableRow>
        ) : logs.length === 0 ? (
          <StyledTableRow>
            <StyledTableCell colSpan={10} align='center'>
              Không có dữ liệu
            </StyledTableCell>
          </StyledTableRow>
        ) : (
          logs.map((log) => <InventoryLogRow key={log._id} log={log} />)
        )}
      </TableBody>
    </Table>
  )
}

export default InventoryLogTable
