import { Card, CardContent, Typography, Box } from '@mui/material'
import Inventory2Icon from '@mui/icons-material/Inventory2'

const InventoryStatusCards = ({ inventoryData }) => {
  // Giả sử inventoryData chứa các trạng thái và số lượng từ API hoặc hook
  const { inStock = 23, lowStock = 3, outOfStock = 1 } = inventoryData || {}
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        display: 'flex',
        gap: 2,
        alignItems: 'end',
        flexDirection: 'column'
      }}
    >
      {/* Card Tồn kho */}
      <Card
        sx={{
          width: 150,
          borderLeft: '5px solid #4caf50', // Màu xanh
          height: 90,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxShadow: 1,
          borderRadius: 2
        }}
      >
        <CardContent>
          <Typography gutterBottom color='text.secondary'>
            Tồng tồn kho
          </Typography>
          <Typography color='success.main'>
            <strong>{inStock} SP</strong>
          </Typography>
        </CardContent>
      </Card>

      {/* Card Cảnh báo thiếu */}
      <Card
        sx={{
          width: 150,
          borderLeft: '5px solid #ff9800', // Màu vàng
          height: 90,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxShadow: 1,
          borderRadius: 2
        }}
      >
        <CardContent>
          <Typography gutterBottom color='text.secondary'>
            Cảnh báo thiếu
          </Typography>
          <Typography color='warning.main'>
            <strong>{lowStock} SP</strong>
          </Typography>
        </CardContent>
      </Card>

      {/* Card Hết hàng */}
      <Card
        sx={{
          width: 150,
          borderLeft: '5px solid #f44336', // Màu đỏ
          height: 90,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxShadow: 1,
          borderRadius: 2
        }}
      >
        <CardContent>
          <Typography gutterBottom color='text.secondary'>
            Hết hàng
          </Typography>
          <Typography color='error.main'>
            <strong>{outOfStock} SP</strong>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default InventoryStatusCards
