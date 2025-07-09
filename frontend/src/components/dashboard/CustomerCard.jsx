import { Card, CardContent, Typography } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'

export default function CustomerCard({ count }) {
  return (
    <Card
      sx={{
        height: '100%',
        borderLeft: '5px solid #1976d2',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <CardContent>
        <Typography variant='h6' gutterBottom>
          <PersonIcon sx={{ mr: 1 }} />
          Khách hàng mới
        </Typography>
        <Typography variant='h4' color='primary'>
          {count}
        </Typography>
      </CardContent>
    </Card>
  )
}
