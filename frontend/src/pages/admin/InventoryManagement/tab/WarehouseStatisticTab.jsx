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
import useBatches from '~/hooks/admin/Inventory/useBatches.js'
import usePartner from '~/hooks/admin/Inventory/usePartner.js'
import useVariants from '~/hooks/admin/Inventory/useVariants.js'
import useWarehouses from '~/hooks/admin/Inventory/useWarehouses.js'
import useWarehouseSlips from '~/hooks/admin/Inventory/useWarehouseSlip.js'
import usePermissions from '~/hooks/usePermissions'
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
  const { hasPermission } = usePermissions()
  const { warehouses, fetchWarehouses, createNewWarehouse } = useWarehouses()
  const { variants, fetchVariants } = useVariants()
  const { batches } = useBatches()
  const { partners, fetchPartners, createNewPartner } = usePartner()
  const { createNewWarehouseSlip } = useWarehouseSlips()

  const { statistics, loading, fetchStatistics } = useInventoryStatistics()

  React.useEffect(() => {
    fetchStatistics()
  }, [])

  // Kiểm tra quyền truy cập thống kê
  if (!hasPermission('statistics:read')) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant='h6' color='error'>
          Bạn không có quyền truy cập thống kê kho hàng
        </Typography>
      </Box>
    )
  }

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
          Biến Động Tồn Kho Theo Thời Gian
        </Typography>
        <ChartDashboard data={statistics} loading={loading} />
      </Box>
      <Box sx={styles.BoxCard}>
        <Typography
          variant='h5'
          gutterBottom
          fontWeight='700'
          sx={styles.header}
        >
          Cảnh Báo Hết Hàng
        </Typography>
        <LowStockAlertCard
          data={statistics}
          loading={loading}
          warehouses={warehouses}
          variants={variants}
          addWarehouseSlip={createNewWarehouseSlip}
          addWarehouse={createNewWarehouse}
          fetchVariants={fetchVariants}
          batches={batches}
          partners={partners}
          addPartner={createNewPartner}
          fetchWarehouses={fetchWarehouses}
          fetchPartner={fetchPartners}
        />
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
