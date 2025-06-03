import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Table,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material'

export default function ViewWarehouseModal({ open, onClose, warehouse }) {
  if (!warehouse) return null
  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Chi tiết kho hàng</DialogTitle>
      <DialogContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <strong>Mã kho</strong>
              </TableCell>
              <TableCell>{warehouse.code || '-'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Tên kho</strong>
              </TableCell>
              <TableCell>{warehouse.name || '-'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Địa chỉ</strong>
              </TableCell>
              <TableCell>{warehouse.address || '-'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Phường</strong>
              </TableCell>
              <TableCell>{warehouse.ward || '-'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Quận</strong>
              </TableCell>
              <TableCell>{warehouse.district || '-'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Thành phố</strong>
              </TableCell>
              <TableCell>{warehouse.city || '-'}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='outlined'>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}
