import React from 'react'

import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import CircularProgress from '@mui/material/CircularProgress'

import DiscountRow from './DiscountRow'

import StyleAdmin, {
  StyledTableCell,
  StyledTableRow
} from '~/assets/StyleAdmin.jsx'

const DiscountTable = ({ discounts, loading, onAction }) => {
  if (loading) return <CircularProgress />

  return (
    <Table>
      <TableHead>
        <StyledTableRow>
          <StyledTableCell sx={StyleAdmin.TableColumnSTT}>STT</StyledTableCell>
          <StyledTableCell sx={{ minWidth: '100%' }}>Mã giảm</StyledTableCell>
          <StyledTableCell sx={{ width: '100px' }}>Loại</StyledTableCell>
          <StyledTableCell sx={{ width: '120px' }}>
            Giá trị giảm
          </StyledTableCell>
          <StyledTableCell sx={{ width: '100px' }}>SL tối đa</StyledTableCell>
          <StyledTableCell sx={{ width: '100px' }}>SL còn lại</StyledTableCell>
          <StyledTableCell sx={{ width: '100px' }}>Trạng thái</StyledTableCell>
          <StyledTableCell sx={{ width: '170px' }}>
            Ngày bắt đầu
          </StyledTableCell>
          <StyledTableCell sx={{ width: '170px' }}>
            Ngày kết thúc
          </StyledTableCell>
          <StyledTableCell sx={{ maxWidth: '130px', width: '130px' }}>
            Hành động
          </StyledTableCell>
        </StyledTableRow>
      </TableHead>
      <TableBody>
        {loading ? (
          <StyledTableRow>
            <StyledTableCell colSpan={10} align='center'>
              Đang tải...
            </StyledTableCell>
          </StyledTableRow>
        ) : discounts.length > 0 ? (
          discounts.map((discount, index) => (
            <DiscountRow
              key={discount._id}
              discount={discount}
              index={index}
              onAction={onAction}
            />
          ))
        ) : (
          <StyledTableRow>
            <StyledTableCell colSpan={10} align='center'>
              Không có mã giảm giá nào
            </StyledTableCell>
          </StyledTableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default DiscountTable
