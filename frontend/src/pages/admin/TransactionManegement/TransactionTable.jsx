import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress
} from '@mui/material'
import TransactionRow from './TransactionRow'
import {
  StyledTableCell,
  StyledTableRow
} from '../UserManagement/UserTableStyles.js'
const TransactionTable = ({
  transactions,
  loading,
  onView,
  onEdit,
  onDelete
}) => {
  return (
    <Table>
      <TableHead>
        <StyledTableRow>
          <StyledTableCell sx={{ textAlign: 'center', width: '50px' }}>
            STT
          </StyledTableCell>
          <StyledTableCell>Mã giao dịch</StyledTableCell>
          <StyledTableCell>Đơn hàng</StyledTableCell>
          <StyledTableCell>Phương thức</StyledTableCell>
          <StyledTableCell>Trạng thái</StyledTableCell>
          <StyledTableCell>Số tiền</StyledTableCell>
          <StyledTableCell sx={{ width: '100px', maxWidth: '100px' }}>
            Ghi chú
          </StyledTableCell>
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
              <CircularProgress size={24} />
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
    </Table>
  )
}

export default TransactionTable
