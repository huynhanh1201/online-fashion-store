import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

function AddressTable({ addresses, onView, onEdit, onDelete }) {
  return (
    <TableContainer component={Paper} sx={{ width: '100%' }}>
      <Table
        sx={{ minWidth: { xs: '100%', sm: 450 }, width: '100%' }}
        aria-label='address table'
      >
        <TableHead>
          <TableRow>
            <TableCell>Họ và tên</TableCell>
            <TableCell>Số điện thoại</TableCell>
            <TableCell>Địa chỉ</TableCell>
            <TableCell>Phường/Xã</TableCell>
            <TableCell>Quận/Huyện</TableCell>
            <TableCell>Tỉnh/Thành</TableCell>
            <TableCell align='right'>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {addresses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align='center'>
                <Typography color='text.secondary'>
                  Chưa có địa chỉ giao hàng
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            addresses.map((addr) => (
              <TableRow
                key={addr._id}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 }
                }}
              >
                <TableCell>{addr.fullName}</TableCell>
                <TableCell>{addr.phone}</TableCell>
                <TableCell>{addr.address}</TableCell>
                <TableCell>{addr.ward}</TableCell>
                <TableCell>{addr.district}</TableCell>
                <TableCell>{addr.city}</TableCell>
                <TableCell align='right'>
                  <IconButton onClick={() => onView(addr)} sx={{ mr: 1 }}>
                    <VisibilityIcon color='info' />
                  </IconButton>
                  <IconButton onClick={() => onEdit(addr)} sx={{ mr: 1 }}>
                    <EditIcon color='primary' />
                  </IconButton>
                  <IconButton onClick={() => onDelete(addr._id)}>
                    <DeleteIcon color='error' />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default AddressTable
