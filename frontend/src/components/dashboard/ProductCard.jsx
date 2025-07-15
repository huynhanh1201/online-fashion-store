import { Card, CardContent, Typography } from '@mui/material'
import Inventory2Icon from '@mui/icons-material/Inventory2'

export default function ProductCard({ total }) {
  return (
    <Card
      sx={{
        minWidth: 250,
        borderLeft: '5px solid #4caf50',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <CardContent>
        <Typography variant='h6' gutterBottom>
          <Inventory2Icon sx={{ mr: 1 }} />
          Sản phẩm trong kho
        </Typography>
        <Typography variant='h4' color='success.main'>
          {total}
        </Typography>
      </CardContent>
    </Card>
  )
}
