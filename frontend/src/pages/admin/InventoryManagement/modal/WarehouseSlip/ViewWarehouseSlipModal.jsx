// Chart/WarehouseSlip/ViewWarehouseSlipModal.jsx
import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Divider,
  Box
} from '@mui/material'
import StyleAdmin from '~/assets/StyleAdmin.jsx'

const ViewWarehouseSlipModal = ({ open, onClose, slip }) => {
  if (!slip) return null
  const warehouseName = slip.warehouseId?.name || 'Không có kho hàng'
  const partnerName = slip.partnerId?.name || 'Không có đối tác'
  const createdByName = slip.createdBy?.name || 'Không có người tạo'
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='lg'
      sx={{
        '& .MuiDialog-paper': {
          maxHeight: '95%',
          mb: 2.4,
          width: 'auto', // Chiều rộng theo nội dung
          maxWidth: 'lg', // Giới hạn không vượt quá md
          minWidth: 900 // (tuỳ chọn) đảm bảo không quá nhỏ
        }
      }}
      BackdropProps={{
        sx: StyleAdmin.OverlayModal
      }}
    >
      <DialogTitle>
        Thông tin phiếu {slip.type === 'Nhập' ? 'nhập' : 'xuất'} kho
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ py: 0 }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell sx={{ minWidth: 200 }}>
                <strong>
                  Mã phiếu {slip.type === 'Nhập' ? 'nhập' : 'xuất'} kho
                </strong>
              </TableCell>
              <TableCell>{slip.slipId || 'N/A'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Loại phiếu</strong>
              </TableCell>
              <TableCell>
                <Chip
                  label={slip.type}
                  color={slip.type === 'Nhập' ? 'success' : 'error'}
                  size='large'
                  sx={{
                    width: '120px',
                    fontWeight: '800',
                    backgroundColor: slip.type === 'Nhập' && '#4CAF50'
                  }}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Kho hàng</strong>
              </TableCell>
              <TableCell>
                {warehouseName
                  .split(' ')
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(' ') || 'N/A'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Tên đối tác</strong>
              </TableCell>
              <TableCell>
                {partnerName
                  .split(' ')
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(' ') || 'N/A'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Người tạo phiếu</strong>
              </TableCell>
              <TableCell>
                {createdByName
                  .split(' ')
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(' ') || 'N/A'}
              </TableCell>
            </TableRow>
            {/*<TableRow>*/}
            {/*  <TableCell>*/}
            {/*    <strong>Trạng thái phiếu kho</strong>*/}
            {/*  </TableCell>*/}
            {/*  <TableCell>*/}
            {/*    <Chip*/}
            {/*      label={*/}
            {/*        slip.status === 'pending' ? 'Đang xử lý' : 'Hoàn thành'*/}
            {/*      }*/}
            {/*      color={slip.status === 'pending' ? 'warning' : 'success'}*/}
            {/*      size='large'*/}
            {/*      sx={{ width: '120px', fontWeight: '800' }}*/}
            {/*    />*/}
            {/*  </TableCell>*/}
            {/*</TableRow>*/}
            <TableRow>
              <TableCell>
                <strong>Ngày tạo</strong>
              </TableCell>
              <TableCell>
                {slip.createdAt
                  ? new Date(slip.createdAt).toLocaleString('vi-VN')
                  : 'N/A'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Ngày cập nhật</strong>
              </TableCell>
              <TableCell>
                {slip.updatedAt
                  ? new Date(slip.updatedAt).toLocaleString('vi-VN')
                  : 'N/A'}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <strong>Ghi chú</strong>
              </TableCell>
              <TableCell>{slip.note || 'Không có'}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Typography variant='h6' gutterBottom sx={{ mt: 2 }}>
          Danh sách mặt hàng
        </Typography>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>Mã biến thể</TableCell>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell align='right'>Số lượng</TableCell>
              <TableCell>Đơn vị</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {slip.items.length > 0 ? (
              slip.items.map((item, index) => {
                const variantName = item.variantId?.name || 'Không có tên'
                const formattedName = variantName
                  .split(' ')
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                  )
                  .join(' ')

                return (
                  <TableRow key={index}>
                    {/* Mã biến thể */}
                    <TableCell>
                      <Box
                        sx={{
                          maxWidth: 150,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {item.variantId.sku || 'Không có mã biến thể'}
                      </Box>
                    </TableCell>

                    {/* Tên sản phẩm */}
                    <TableCell>
                      <Box
                        sx={{
                          maxWidth: 450,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {formattedName}
                      </Box>
                    </TableCell>

                    {/* Số lượng */}
                    <TableCell align='right'>
                      {item.quantity
                        ? `${Number(item.quantity).toLocaleString('vi-VN')}`
                        : 0}
                    </TableCell>

                    {/* Đơn vị */}
                    <TableCell>
                      <Box
                        sx={{
                          maxWidth: 100,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {item.unit || 'cái'}
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} align='center'>
                  Không có mặt hàng
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button
          onClick={onClose}
          sx={{ textTransform: 'none' }}
          variant='outlined'
          color='error'
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewWarehouseSlipModal
