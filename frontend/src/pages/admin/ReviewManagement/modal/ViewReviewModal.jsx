import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Grid,
  Rating,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Box
} from '@mui/material'

const ViewReviewModal = ({ open, onClose, review }) => {
  if (!review) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Chi tiết đánh giá</DialogTitle>
      <DialogContent dividers>
        <Table size='small'>
          <TableBody>
            <TableRow>
              <TableCell variant='head'>Người dùng</TableCell>
              <TableCell>
                {review.user.fullName} ({review.user.email})
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell variant='head'>Sản phẩm</TableCell>
              <TableCell>{review.productId}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell variant='head'>Đánh giá</TableCell>
              <TableCell>
                <Rating value={review.rating} readOnly />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell variant='head'>Trạng thái</TableCell>
              <TableCell>
                <Chip
                  label={review.status}
                  color={review.status === 'approved' ? 'success' : 'warning'}
                  size='small'
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell variant='head'>Bình luận</TableCell>
              <TableCell>{review.comment}</TableCell>
            </TableRow>

            {review.images.length > 0 && (
              <TableRow>
                <TableCell variant='head'>Hình ảnh</TableCell>
                <TableCell>
                  <Grid container spacing={1}>
                    {review.images.map((img, idx) => (
                      <Grid item xs={4} key={idx}>
                        <img
                          src={img}
                          alt={`Ảnh ${idx + 1}`}
                          style={{ width: '100%', borderRadius: 4 }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </TableCell>
              </TableRow>
            )}

            <TableRow>
              <TableCell variant='head'>Tạo lúc</TableCell>
              <TableCell>
                {new Date(review.createdAt).toLocaleString()}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell variant='head'>Cập nhật</TableCell>
              <TableCell>
                {new Date(review.updatedAt).toLocaleString()}
              </TableCell>
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

export default ViewReviewModal
