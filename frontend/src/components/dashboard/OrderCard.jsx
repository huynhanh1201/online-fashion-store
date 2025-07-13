import { Card, CardContent, Typography, Stack } from '@mui/material'
import AssignmentIcon from '@mui/icons-material/Assignment'

export default function OrderCard({ processing, delivered }) {
  return (
    <Card
      sx={{
        minWidth: 250,
        borderLeft: '5px solid #ff9800',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <CardContent>
        <Typography variant='h6' gutterBottom>
          <AssignmentIcon sx={{ mr: 1 }} />
          Đơn hàng
        </Typography>
        <Stack direction='row' spacing={4} sx={{ mt: 1 }}>
          <Typography>
            Đang xử lý: <strong>{processing}</strong>
          </Typography>
          <Typography>
            Đã giao: <strong>{delivered}</strong>
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  )
}
