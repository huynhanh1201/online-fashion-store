import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Table,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material'

const getPartnerTypeLabel = (type) => {
  switch (type) {
    case 'supplier':
      return <Chip label='Nhà cung cấp' color='primary' size='small' />
    case 'customer':
      return <Chip label='Khách hàng' color='success' size='small' />
    case 'both':
      return <Chip label='Khách hàng & NCC' color='warning' size='small' />
    default:
      return <Chip label='Không xác định' size='small' />
  }
}

export default function ViewPartnerModal({ open, onClose, partner }) {
  if (!partner) return null
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle>Thông tin đối tác</DialogTitle>
      <DialogContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <strong>Tên</strong>
              </TableCell>
              <TableCell>{partner.name || '---'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Loại</strong>
              </TableCell>
              <TableCell>{getPartnerTypeLabel(partner.type)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Điện thoại</strong>
              </TableCell>
              <TableCell>{partner.contact?.phone || '---'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>{partner.contact?.email || '---'}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='contained'>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}
