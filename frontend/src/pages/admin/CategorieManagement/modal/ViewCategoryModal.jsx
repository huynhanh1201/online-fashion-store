import React from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Divider,
  Box,
  Typography
} from '@mui/material'

import StyleAdmin from '~/assets/StyleAdmin.jsx'

const ViewCategoryModal = ({ open, onClose, category }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth='sm'
      BackdropProps={{ sx: StyleAdmin.OverlayModal }}
    >
      <DialogTitle>Xem thông tin danh mục</DialogTitle>
      <DialogContent>
        {category ? (
          <Box sx={{ mt: 1 }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong>Tên danh mục</strong>
                  </TableCell>
                  <TableCell>{category.name || '—'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Mô tả</strong>
                  </TableCell>
                  <TableCell>
                    {category.description ? (
                      <Typography
                        component='div'
                        sx={{ whiteSpace: 'pre-line' }}
                      >
                        {category.description}
                      </Typography>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        ) : (
          <Typography>Không có dữ liệu danh mục</Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={onClose} color='error' variant='contained'>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewCategoryModal
