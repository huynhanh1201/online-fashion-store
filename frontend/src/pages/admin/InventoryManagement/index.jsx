import React from 'react'
import { Box, Typography, Tabs, Tab } from '@mui/material'
import usePermissions from '~/hooks/usePermissions'
import { RouteGuard, PermissionWrapper } from '~/components/PermissionGuard'

// Lazy load tabs
const InventoryTab = React.lazy(() => import('./tab/InventoryTab'))
const WarehousesTab = React.lazy(() => import('./tab/WarehousesTab'))
const WarehouseSlipsTab = React.lazy(() => import('./tab/WarehouseSlipsTab'))
const InventoryLogTab = React.lazy(() => import('./tab/InventoryLogTab'))
const BatchesTab = React.lazy(() => import('./tab/BatchesTab'))
const PartnersTab = React.lazy(() => import('./tab/PartnersTab'))
const WarehouseStatisticTab = React.lazy(() => import('./tab/WarehouseStatisticTab'))

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`inventory-tabpanel-${index}`}
      aria-labelledby={`inventory-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

function InventoryManagement() {
  const { hasPermission } = usePermissions()
  const [tabValue, setTabValue] = React.useState(0)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  // Tạo danh sách tabs dựa trên quyền
  const availableTabs = []

  if (hasPermission('inventory:read')) {
    availableTabs.push({ label: 'Tồn kho', component: InventoryTab, permission: 'inventory:read' })
  }

  if (hasPermission('warehouse:read')) {
    availableTabs.push({ label: 'Kho hàng', component: WarehousesTab, permission: 'warehouse:read' })
  }

  if (hasPermission('warehouseSlip:read')) {
    availableTabs.push({ label: 'Phiếu kho', component: WarehouseSlipsTab, permission: 'warehouseSlip:read' })
  }

  if (hasPermission('inventoryLog:read')) {
    availableTabs.push({ label: 'Lịch sử tồn kho', component: InventoryLogTab, permission: 'inventoryLog:read' })
  }

  if (hasPermission('batch:read')) {
    availableTabs.push({ label: 'Lô hàng', component: BatchesTab, permission: 'batch:read' })
  }

  if (hasPermission('partner:read')) {
    availableTabs.push({ label: 'Đối tác', component: PartnersTab, permission: 'partner:read' })
  }

  if (hasPermission('statisticsWarehouse:read') && hasPermission('warehouse:read')) {
    availableTabs.push({ label: 'Thống kê kho', component: WarehouseStatisticTab, permission: 'statistics:read' })
  }

  // Nếu không có quyền nào, hiển thị thông báo
  if (availableTabs.length === 0) {
    return (
      <RouteGuard requiredPermissions={['admin:access']}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Bạn không có quyền truy cập vào bất kỳ chức năng quản lý kho nào.
          </Typography>
        </Box>
      </RouteGuard>
    )
  }

  return (
    <RouteGuard requiredPermissions={['admin:access']}>
      <Box sx={{ width: '100%' }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ p: 3, pb: 0 }}>
          Quản lý kho hàng
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="inventory management tabs"
            sx={{ px: 3 }}
          >
            {availableTabs.map((tab, index) => (
              <Tab key={index} label={tab.label} />
            ))}
          </Tabs>
        </Box>

        {availableTabs.map((tab, index) => (
          <TabPanel key={index} value={tabValue} index={index}>
            <PermissionWrapper requiredPermissions={[tab.permission]}>
              <React.Suspense fallback={<div>Đang tải...</div>}>
                <tab.component />
              </React.Suspense>
            </PermissionWrapper>
          </TabPanel>
        ))}
      </Box>
    </RouteGuard>
  )
}

export default InventoryManagement