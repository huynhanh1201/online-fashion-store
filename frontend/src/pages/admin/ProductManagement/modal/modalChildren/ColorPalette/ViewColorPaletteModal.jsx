import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Chip
} from '@mui/material'

const ViewColorPaletteModal = ({ open, onClose, color }) => {
  if (!color) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Thông tin màu sắc</DialogTitle>
      <Divider />
      <DialogContent sx={{ py: 3 }}>
        <Box display='flex' flexDirection='column' gap={2}>
          <Box display='flex' justifyContent='center'>
            <Box
              component='img'
              src={color.image}
              alt={color.name}
              sx={{
                width: 120,
                height: 120,
                borderRadius: 2,
                objectFit: 'cover'
              }}
            />
          </Box>
          <Typography>
            <strong>Tên màu:</strong> {color.name}
          </Typography>
          <Typography>
            <strong>Trạng thái:</strong>{' '}
            <Chip
              label={color.destroy ? 'Ngừng bán' : 'Đang bán'}
              color={color.destroy ? 'error' : 'success'}
              size='small'
            />
          </Typography>
          <Typography>
            <strong>Ngày tạo:</strong> {formatDate(color.createdAt)}
          </Typography>
          <Typography>
            <strong>Ngày cập nhật:</strong> {formatDate(color.updatedAt)}
          </Typography>
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={onClose} color='primary'>
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ViewColorPaletteModal
