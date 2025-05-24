import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'

import StyleAdmin, {
  StyledTableCell,
  StyledTableRow
} from '~/assets/StyleAdmin.jsx'

import ColorRow from './ColorRow'

const ColorTable = ({ colors, loading, handleOpenModal }) => {
  const filteredColors = colors.filter((c) => !c.destroy)

  return (
    <Table>
      <TableHead>
        <StyledTableRow>
          <StyledTableCell sx={StyleAdmin.TableColumnSTT}>STT</StyledTableCell>
          <StyledTableCell sx={{ width: '50%' }}>Tên màu</StyledTableCell>
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
              Đang tải màu sắc...
            </StyledTableCell>
          </StyledTableRow>
        ) : filteredColors.length === 0 ? (
          <StyledTableRow>
            <StyledTableCell colSpan={5} align='center'>
              Không có màu sắc nào.
            </StyledTableCell>
          </StyledTableRow>
        ) : (
          filteredColors.map((color, idx) => (
            <ColorRow
              key={color._id}
              color={color}
              idx={idx}
              handleOpenModal={handleOpenModal}
            />
          ))
        )}
      </TableBody>
    </Table>
  )
}

export default ColorTable
