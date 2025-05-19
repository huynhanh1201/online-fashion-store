import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

import OrderRow from './OrderRow'

import StyleAdmin, {
  StyledTableCell,
  StyledTableRow,
  StyledTableContainer
} from '~/components/StyleAdmin'

const OrderTable = ({
  orders = [],
  loading = false,
  onView,
  onEdit,
  onDelete
}) => {
  const columnsCount = 9

  return (
    <StyledTableContainer component={Paper} sx={{ maxHeight: 600 }}>
      <Table stickyHeader>
        <TableHead>
          <StyledTableRow>
            <StyledTableCell sx={StyleAdmin.TableColumnSTT}>
              STT
            </StyledTableCell>
            <StyledTableCell sx={{ width: '30%' }}>Mã đơn hàng</StyledTableCell>
            <StyledTableCell sx={{ width: '20%' }}>
              Tên khách hàng
            </StyledTableCell>
            <StyledTableCell sx={{ width: '170px' }}>
              Trạng thái đơn hàng
            </StyledTableCell>
            <StyledTableCell sx={{ width: '170px' }}>
              Trạng thái thanh toán
            </StyledTableCell>
            <StyledTableCell sx={{ width: '170px' }}>
              Ngày đặt hàng
            </StyledTableCell>
            <StyledTableCell sx={{ maxWidth: '130px', width: '130px' }}>
              Hành động
            </StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <StyledTableRow>
              <StyledTableCell colSpan={columnsCount} align='center'>
                <CircularProgress />
              </StyledTableCell>
            </StyledTableRow>
          ) : orders.length === 0 ? (
            <StyledTableRow>
              <StyledTableCell colSpan={columnsCount} align='center'>
                <Typography>Không có đơn hàng nào.</Typography>
              </StyledTableCell>
            </StyledTableRow>
          ) : (
            orders.map((order, index) => (
              <OrderRow
                key={order._id}
                order={order}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                index={index}
              />
            ))
          )}
        </TableBody>
      </Table>
    </StyledTableContainer>
  )
}

export default OrderTable
