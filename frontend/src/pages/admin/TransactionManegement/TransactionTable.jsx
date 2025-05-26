import React from 'react'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import CircularProgress from '@mui/material/CircularProgress'

import TransactionRow from './TransactionRow'
import StyleAdmin, {
  StyledTableCell,
  StyledTableRow,
  StyledTableContainer
} from '~/assets/StyleAdmin.jsx'
import Paper from '@mui/material/Paper'

const TransactionTable = ({
  transactions,
  loading,
  onView,
  onEdit,
  onDelete
}) => {
  return (
    <StyledTableContainer component={Paper}>
      <TableHead>
        <StyledTableRow>
          <StyledTableCell sx={StyleAdmin.TableColumnSTT}>STT</StyledTableCell>
          <StyledTableCell sx={{ width: '20%' }}>Mã giao dịch</StyledTableCell>
          <StyledTableCell sx={{ width: '20%' }}>Đơn hàng</StyledTableCell>
          <StyledTableCell>Phương thức</StyledTableCell>
          <StyledTableCell>Trạng thái</StyledTableCell>
          <StyledTableCell sx={{ width: '100px' }}>
            Số tiền (VNĐ)
          </StyledTableCell>
          <StyledTableCell sx={{ width: '30%' }}>Ghi chú</StyledTableCell>
          <StyledTableCell>Ngày tạo</StyledTableCell>
          <StyledTableCell sx={{ maxWidth: '130px', width: '130px' }}>
            Hành động
          </StyledTableCell>
        </StyledTableRow>
      </TableHead>
      <TableBody>
        {loading ? (
          <StyledTableRow>
            <StyledTableCell colSpan={9} align='center'>
              đang tải dữ liệu ....
            </StyledTableCell>
          </StyledTableRow>
        ) : transactions.filter((transaction) => !transaction.destroy).length >
          0 ? (
          transactions
            .filter((transaction) => !transaction.destroy)
            .map((transaction, index) => (
              <TransactionRow
                key={transaction._id}
                index={index}
                transaction={transaction}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
        ) : (
          <StyledTableRow>
            <StyledTableCell colSpan={9} align='center'>
              Không có giao dịch nào.
            </StyledTableCell>
          </StyledTableRow>
        )}
      </TableBody>
    </StyledTableContainer>
  )
}

export default TransactionTable
