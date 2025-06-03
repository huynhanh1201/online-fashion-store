import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Chip
} from '@mui/material'
import { Box } from '@mui/system'

const ViewInventoryModal = ({ open, onClose, inventory }) => {
  const statusColor =
    inventory?.quantity <= inventory?.minQuantity ? 'error' : 'success'
  const statusLabel =
    inventory?.quantity <= inventory?.minQuantity ? 'Cảnh báo' : 'Ổn định'

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>Chi tiết tồn kho</DialogTitle>
      <DialogContent>
        {inventory ? (
          <Box sx={{ mt: 1 }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong>Mã biến thể</strong>
                  </TableCell>
                  <TableCell>{inventory.variantId?.sku || '—'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Kho hàng</strong>
                  </TableCell>
                  <TableCell>{inventory.warehouseId?.name || '—'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Sản phẩm</strong>
                  </TableCell>
                  <TableCell>{inventory.variantId?.name || '—'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Trạng thái</strong>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={statusLabel}
                      color={statusColor}
                      size='small'
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Số lượng</strong>
                  </TableCell>
                  <TableCell>{inventory.quantity}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Ngưỡng cảnh báo</strong>
                  </TableCell>
                  <TableCell>{inventory.minQuantity}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Giá nhập</strong>
                  </TableCell>
                  <TableCell>
                    {inventory.importPrice?.toLocaleString()}đ
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Giá bán</strong>
                  </TableCell>
                  <TableCell>
                    {inventory.exportPrice?.toLocaleString()}đ
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Ngày tạo</strong>
                  </TableCell>
                  <TableCell>
                    {inventory.createdAt
                      ? new Date(inventory.createdAt).toLocaleString('vi-VN')
                      : '—'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Ngày cập nhật</strong>
                  </TableCell>
                  <TableCell>
                    {inventory.updatedAt
                      ? new Date(inventory.updatedAt).toLocaleString('vi-VN')
                      : '—'}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        ) : (
          <Typography>Không có dữ liệu tồn kho</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='outlined' color='primary'>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewInventoryModal
