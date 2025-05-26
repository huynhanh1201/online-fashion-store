import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'

import StyleAdmin, {
  StyledTableCell,
  StyledTableRow
} from '~/assets/StyleAdmin.jsx'

import SizeRow from './SizeRow'

const SizeTable = ({ sizes, loading, handleOpenModal }) => {
  const filteredSizes = sizes.filter((s) => !s.destroy)

  return (
    <Table>
      <TableHead>
        <StyledTableRow>
          <StyledTableCell sx={StyleAdmin.TableColumnSTT}>STT</StyledTableCell>
          <StyledTableCell sx={{ width: '50%' }}>
            Tên kích thước
          </StyledTableCell>
          <StyledTableCell sx={{ width: '20%' }}>Ngày tạo</StyledTableCell>
          <StyledTableCell sx={{ width: '20%' }}>Ngày cập nhật</StyledTableCell>
          <StyledTableCell sx={{ width: '130px', maxWidth: '130px' }}>
            Hành động
          </StyledTableCell>
        </StyledTableRow>
      </TableHead>
      <TableBody>
        {loading ? (
          <StyledTableRow>
            <StyledTableCell colSpan={5} align='center'>
              Đang tải kích thước...
            </StyledTableCell>
          </StyledTableRow>
        ) : filteredSizes.length === 0 ? (
          <StyledTableRow>
            <StyledTableCell colSpan={5} align='center'>
              Không có kích thước nào.
            </StyledTableCell>
          </StyledTableRow>
        ) : (
          filteredSizes.map((size, idx) => (
            <SizeRow
              key={size._id}
              size={size}
              idx={idx}
              handleOpenModal={handleOpenModal}
            />
          ))
        )}
      </TableBody>
    </Table>
  )
}

export default SizeTable
