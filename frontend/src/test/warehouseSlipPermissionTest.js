// Test phân quyền cho trang WarehouseSlip
const roles = {
  OWNER: 'owner',
  TECHNICAL_ADMIN: 'technical_admin',
  STAFF: 'staff',
  CUSTOMER: 'customer'
}

// Cấu hình quyền theo role (giống với rbacConfig.js)
const ROLE_PERMISSIONS = {
  [roles.OWNER]: [
    'warehouseSlip:create',
    'warehouseSlip:read',
    'admin:access'
  ],
  [roles.TECHNICAL_ADMIN]: [
    'warehouseSlip:read',
    'admin:access'
  ],
  [roles.STAFF]: [
    'warehouseSlip:create',
    'warehouseSlip:read',
    'admin:access'
  ],
  [roles.CUSTOMER]: []
}

// Mô phỏng hook usePermissions
const createMockPermissions = (role) => {
  const userPermissions = ROLE_PERMISSIONS[role] || []

  return {
    hasPermission: (permission) => userPermissions.includes(permission),
    currentUser: { role }
  }
}

// Test các chức năng trên trang WarehouseSlip
const testWarehouseSlipPermissions = (role) => {
  const { hasPermission } = createMockPermissions(role)

  console.log(`\n📋 ROLE: ${role.toUpperCase()}`)
  console.log('--------------------------------------------------')

  // Test quyền tạo phiếu kho (Nhập/Xuất)
  const canCreate = hasPermission('warehouseSlip:create')
  console.log(`${canCreate ? '✅' : '❌'} Tạo phiếu kho (Nhập/Xuất)`)

  // Test quyền xem phiếu kho
  const canRead = hasPermission('warehouseSlip:read')
  console.log(`${canRead ? '✅' : '❌'} Xem chi tiết phiếu kho`)

  // Tổng kết quyền
  const permissions = ROLE_PERMISSIONS[role] || []
  console.log(`\n📊 Tổng quyền liên quan: ${permissions.filter(p => p.includes('warehouseSlip')).length}`)
  console.log(`🔑 Quyền WarehouseSlip: ${permissions.filter(p => p.includes('warehouseSlip')).join(', ') || 'Không có'}`)

  // Mô phỏng UI sẽ hiển thị như thế nào
  console.log('\n🖥️  Giao diện sẽ hiển thị:')
  if (canCreate) {
    console.log('   ✅ Nút "Nhập kho"')
    console.log('   ✅ Nút "Xuất kho"')
  } else {
    console.log('   ❌ Thông báo: "Bạn không có quyền tạo phiếu kho"')
  }

  if (canRead) {
    console.log('   ✅ Nút "Xem" trong bảng')
  } else {
    console.log('   ❌ Thông báo: "Không có quyền" trong cột hành động')
  }
}

// Chạy test cho tất cả các role
console.log('================================================================================')
console.log('KIỂM TRA PHÂN QUYỀN TRANG WAREHOUSE SLIP')
console.log('================================================================================')

Object.values(roles).forEach(role => {
  testWarehouseSlipPermissions(role)
})

console.log('\n================================================================================')
console.log('KẾT THÚC KIỂM TRA')
console.log('================================================================================')