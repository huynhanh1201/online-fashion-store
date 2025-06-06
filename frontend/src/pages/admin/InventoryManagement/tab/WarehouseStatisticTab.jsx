import InventorySummaryCard from '~/components/WarehouseStatistic/Card/InventorySummaryCard'
import VariantSummaryCard from '~/components/WarehouseStatistic/Card/VariantSummaryCard'
import StockStatus from '~/components/WarehouseStatistic/Card/StockStatus'
import TopSellingSlowSellingCard from '~/components/WarehouseStatistic/Card/TopSellingSlowSellingCard'
import LowStockAlertCard from '~/components/WarehouseStatistic/Card/LowStockAlertCard'
import ChartDashboard from '~/components/WarehouseStatistic/Card/ChartDashboard'
import ProductColorDetail from '~/components/WarehouseStatistic/Card/ProductColorDetail'
import { Typography, Box, Divider } from '@mui/material'
import React from 'react'
import useInventoryStatistics from '~/hooks/admin/Inventory/useStatistic.js'
const styles = {
  header: {
    borderBottom: '1px solid #ccc',
    mb: 0.5,
    pb: 0.5
  },
  BoxCard: {
    border: '1px solid #ccc',
    p: 2,
    borderRadius: 2,
    gap: 1,
    display: 'flex',
    flexDirection: 'column'
  }
}

function WarehouseStatisticTab() {
  const { statistics, loading, fetchStatistics } = useInventoryStatistics()

  React.useEffect(() => {
    fetchStatistics()
  }, [])

  return (
    <div
      className='tab-content'
      style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
    >
      {/*<Box sx={styles.BoxCard}>*/}
      {/*  <Typography*/}
      {/*    variant='h5'*/}
      {/*    gutterBottom*/}
      {/*    fontWeight='700'*/}
      {/*    sx={styles.header}*/}
      {/*  >*/}
      {/*    Sản phẩm & Biến thể*/}
      {/*  </Typography>*/}
      {/*  <VariantSummaryCard />*/}
      {/*</Box>*/}
      <Box sx={styles.BoxCard}>
        <Typography
          variant='h5'
          gutterBottom
          fontWeight='700'
          sx={styles.header}
        >
          Thống kê kho hàng
        </Typography>
        <InventorySummaryCard data={statistics} loading={loading} />
      </Box>
      {/*<Box sx={styles.BoxCard}>*/}
      {/*  <Typography*/}
      {/*    variant='h5'*/}
      {/*    gutterBottom*/}
      {/*    fontWeight='700'*/}
      {/*    sx={styles.header}*/}
      {/*  >*/}
      {/*    Tình trạng theo kho*/}
      {/*  </Typography>*/}
      {/*  <StockStatus />*/}
      {/*</Box>*/}
      {/*<Box sx={styles.BoxCard}>*/}
      {/*  <Typography*/}
      {/*    variant='h5'*/}
      {/*    gutterBottom*/}
      {/*    fontWeight='700'*/}
      {/*    sx={styles.header}*/}
      {/*  >*/}
      {/*    Tình trạng theo kho*/}
      {/*  </Typography>*/}
      {/*  <TopSellingSlowSellingCard />*/}
      {/*</Box>*/}
      <Box sx={styles.BoxCard}>
        <Typography
          variant='h5'
          gutterBottom
          fontWeight='700'
          sx={styles.header}
        >
          Cảnh Báo Hết Hàng
        </Typography>
        <LowStockAlertCard data={statistics} loading={loading} />
      </Box>
      <Box sx={styles.BoxCard}>
        <Typography
          variant='h5'
          gutterBottom
          fontWeight='700'
          sx={styles.header}
        >
          Biến Động Tồn Kho Theo Thời Gian
        </Typography>
        <ChartDashboard data={statistics} loading={loading} />
      </Box>
      {/*<Box sx={styles.BoxCard}>*/}
      {/*  <Typography*/}
      {/*    variant='h5'*/}
      {/*    gutterBottom*/}
      {/*    fontWeight='700'*/}
      {/*    sx={styles.header}*/}
      {/*  >*/}
      {/*    Chi Tiết Sản Phẩm Theo Màu Sắc*/}
      {/*  </Typography>*/}
      {/*  <ProductColorDetail />*/}
      {/*</Box>*/}
    </div>
  )
}
export default WarehouseStatisticTab
