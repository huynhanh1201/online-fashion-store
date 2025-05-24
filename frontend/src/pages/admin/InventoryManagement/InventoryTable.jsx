import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import StyleAdmin, {
  StyledTableCell,
  StyledTableRow,
  StyledTableContainer
} from '~/assets/StyleAdmin.jsx'
import InventoryRow from './InventoryRow'

const InventoryTable = ({ inventories, loading, handleOpenModal }) => {
  return (
    <Table>
      <TableHead>
        <StyledTableRow>
          <StyledTableCell sx={StyleAdmin.TableColumnSTT}>STT</StyledTableCell>
          <StyledTableCell>Tên sản phẩm</StyledTableCell>
          <StyledTableCell>Màu sắc</StyledTableCell>
          <StyledTableCell>Kích thước</StyledTableCell>
          <StyledTableCell>Số lượng</StyledTableCell>
          <StyledTableCell>Giá nhập</StyledTableCell>
          <StyledTableCell>Giá bán</StyledTableCell>
          <StyledTableCell>Trạng thái</StyledTableCell>
          <StyledTableCell sx={{ width: '130px', maxWidth: '130px' }}>
            Hành động
          </StyledTableCell>
        </StyledTableRow>
      </TableHead>
      <TableBody>
        {loading ? (
          <StyledTableRow>
            <StyledTableCell colSpan={9} align='center'>
              Đang tải dữ liệu kho...
            </StyledTableCell>
          </StyledTableRow>
        ) : inventories.length === 0 ? (
          <StyledTableRow>
            <StyledTableCell colSpan={9} align='center'>
              Không có dữ liệu kho.
            </StyledTableCell>
          </StyledTableRow>
        ) : (
          inventories.map((item, idx) => (
            <InventoryRow
              key={item._id}
              inventory={item}
              idx={idx}
              handleOpenModal={handleOpenModal}
            />
          ))
        )}
      </TableBody>
    </Table>
  )
}

export default InventoryTable
