import { Grid, Typography, Box } from '@mui/material'
import CustomerCard from '~/components/dashboard/CustomerCard'
import OrderCard from '~/components/dashboard/OrderCard'
import ProductCard from '~/components/dashboard/ProductCard'
import { RouteGuard } from '~/components/PermissionGuard'

export default function AdminHome() {
  // Dữ liệu giả lập
  const newCustomers = 5
  const ordersProcessing = 7
  const ordersDelivered = 12
  const totalProducts = 123

  return (
    <RouteGuard requiredPermissions={['admin:access']}>
      <Typography variant='h4' gutterBottom>
        Thống kê tổng quan
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ height: '100%' }}>
            <CustomerCard count={newCustomers} />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ height: '100%' }}>
            <OrderCard
              processing={ordersProcessing}
              delivered={ordersDelivered}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ height: '100%' }}>
            <ProductCard total={totalProducts} />
          </Box>
        </Grid>
      </Grid>
    </RouteGuard>
  )
}
