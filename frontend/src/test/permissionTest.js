// Test file để kiểm tra phân quyền
const roles = {
  OWNER: 'owner',
  TECHNICAL_ADMIN: 'technical_admin',
  STAFF: 'staff',
  CUSTOMER: 'customer'
}

// Định nghĩa quyền theo role
const ROLE_PERMISSIONS = {
  [roles.OWNER]: [
    // User
    'user:create', 'user:read', 'user:update', 'user:delete',
    // Category
    'category:create', 'category:read', 'category:update', 'category:delete',
    // Product
    'product:create', 'product:read', 'product:update', 'product:delete',
    // Variant
    'variant:create', 'variant:read', 'variant:update', 'variant:delete',
    // Color
    'color:create', 'color:read', 'color:update', 'color:delete',
    // Size
    'size:create', 'size:read', 'size:update', 'size:delete',
    // Order
    'order:create', 'order:read', 'order:update', 'order:delete',
    // Payment Transaction
    'payment:read', 'payment:update', 'payment:delete',
    // Coupon
    'coupon:create', 'coupon:read', 'coupon:update', 'coupon:delete',
    // Statistics
    'statistics:read',
    // Inventory
    'inventory:read', 'inventory:update',
    // Warehouse Slip
    'warehouseSlip:create', 'warehouseSlip:read',
    // Inventory Log
    'inventoryLog:read',
    // Warehouse
    'warehouse:create', 'warehouse:read', 'warehouse:update', 'warehouse:delete',
    // Batch
    'batch:read', 'batch:update',
    // Partner
    'partner:create', 'partner:read', 'partner:update', 'partner:delete',
    // Review
    'review:read', 'review:update', 'review:delete',
    // Admin access
    'admin:access'
  ],
  [roles.TECHNICAL_ADMIN]: [
    // User (service‑account support)
    'user:read', 'user:update',
    // Category
    'category:read',
    // Product
    'product:read',
    // Variant
    'variant:read',
    // Color
    'color:read',
    // Size
    'size:read',
    // Order
    'order:read',
    // Payment Transaction
    'payment:read',
    // Coupon
    'coupon:read',
    // Statistics
    'statistics:read',
    // Inventory
    'inventory:read',
    // Warehouse Slip
    'warehouseSlip:read',
    // Inventory Log
    'inventoryLog:read',
    // Warehouse
    'warehouse:read',
    // Batch
    'batch:read',
    // Partner
    'partner:read',
    // Review
    'review:read',
    // Admin access
    'admin:access'
  ],
  [roles.STAFF]: [
    // Order Management
    'order:read', 'order:update',

    // Coupon (để có thể xem và áp dụng mã giảm giá khi xử lý đơn hàng)
    'coupon:read',

    // Payment (để có thể xem thông tin giao dịch khi xử lý đơn hàng)
    'payment:read',

    // Inventory Management
    'inventory:read', 'inventory:update',

    // Warehouse Slip
    'warehouseSlip:create', 'warehouseSlip:read',

    // Inventory Log
    'inventoryLog:read',

    // Warehouse (để có thể xem thông tin kho khi quản lý inventory)
    'warehouse:read',

    // Batch (để có thể xem thông tin lô hàng khi quản lý inventory)
    'batch:read',

    // Partner (để có thể xem thông tin đối tác khi tạo phiếu kho)
    'partner:read',

    // Statistics
    'statistics:read',

    // Admin access
    'admin:access'
  ],
  [roles.CUSTOMER]: []
}

// Mô phỏng hook usePermissions
const createMockPermissions = (role) => {
  const userPermissions = ROLE_PERMISSIONS[role] || []

  const hasPermission = (permission) => {
    return userPermissions.includes(permission)
  }

  const hasAnyPermission = (permissions) => {
    return permissions.some(permission => userPermissions.includes(permission))
  }

  return { hasPermission, hasAnyPermission, userPermissions }
}

// Cấu hình menu từ Drawer.jsx
const menuConfig = {
  statistics: {
    permission: 'statistics:read',
    label: 'Thống kê',
    path: '/admin'
  },
  userManagement: {
    permission: 'user:read',
    label: 'Quản lý người dùng',
    path: '/admin/user-management'
  },
  productManagement: {
    permissions: ['product:read', 'category:read', 'color:read', 'size:read', 'review:read'],
    label: 'Quản lý sản phẩm',
    children: [
      {
        permission: 'category:read',
        label: 'Quản lý danh mục',
        path: '/admin/categorie-management'
      },
      {
        permission: 'product:read',
        label: 'Quản lý sản phẩm',
        path: '/admin/product-management'
      },
      {
        permission: 'review:read',
        label: 'Quản lý đánh giá',
        path: '/admin/review-management'
      },
      {
        permission: 'variant:read',
        label: 'Quản lý biến thể',
        path: '/admin/variant-management'
      },
      {
        permission: 'color:read',
        label: 'Quản lý màu sắc',
        path: '/admin/color-management'
      },
      {
        permission: 'size:read',
        label: 'Quản lý kích thước',
        path: '/admin/size-management'
      }
    ]
  },
  orderManagement: {
    permissions: ['order:read', 'coupon:read', 'payment:read'],
    label: 'Quản lý đơn hàng',
    children: [
      {
        permission: 'order:read',
        label: 'Quản lý đơn hàng',
        path: '/admin/order-management'
      },
      {
        permission: 'coupon:read',
        label: 'Quản lý mã giảm giá',
        path: '/admin/discount-management'
      },
      {
        permission: 'payment:read',
        label: 'Quản lý giao dịch',
        path: '/admin/transaction-management'
      }
    ]
  },
  inventoryManagement: {
    permissions: ['inventory:read', 'warehouse:read', 'warehouseSlip:read', 'inventoryLog:read', 'batch:read', 'partner:read'],
    label: 'Quản lý kho',
    children: [
      {
        permission: 'statistics:read',
        label: 'Thống kê kho',
        path: '/admin/warehouse-statistic-management'
      },
      {
        permission: 'inventory:read',
        label: 'Quản lý kho',
        path: '/admin/inventory-management'
      },
      {
        permission: 'warehouseSlip:read',
        label: 'Quản lý xuất/nhập kho',
        path: '/admin/warehouse-slips-management'
      },
      {
        permission: 'inventoryLog:read',
        label: 'Quản lý nhật ký kho',
        path: '/admin/inventory-log-management'
      },
      {
        permission: 'warehouse:read',
        label: 'Quản lý kho hàng',
        path: '/admin/warehouses-management'
      },
      {
        permission: 'batch:read',
        label: 'Quản lý lô hàng',
        path: '/admin/batches-management'
      },
      {
        permission: 'partner:read',
        label: 'Quản lý đối tác',
        path: '/admin/partner-management'
      }
    ]
  }
}

// Kiểm tra xem user có quyền truy cập menu không
const canAccessMenu = (menuItem, permissions) => {
  if (menuItem.permission) {
    return permissions.hasPermission(menuItem.permission)
  }
  if (menuItem.permissions) {
    return permissions.hasAnyPermission(menuItem.permissions)
  }
  return false
}

// Lọc children dựa trên quyền
const getVisibleChildren = (children, permissions) => {
  return children.filter(child => canAccessMenu(child, permissions))
}

// Test function
const testPermissions = () => {
  const testRoles = ['owner', 'technical_admin', 'staff', 'customer']

  console.log('================================================================================')
  console.log('KIỂM TRA PHÂN QUYỀN HỆ THỐNG ADMIN')
  console.log('================================================================================')

  testRoles.forEach(role => {
    console.log(`\n📋 ROLE: ${role.toUpperCase()}`)
    console.log('--------------------------------------------------')

    const permissions = createMockPermissions(role)

    // Kiểm tra từng menu chính
    Object.entries(menuConfig).forEach(([key, menu]) => {
      const canAccess = canAccessMenu(menu, permissions)
      const status = canAccess ? '✅' : '❌'
      console.log(`${status} ${menu.label}`)

      // Kiểm tra submenu nếu có
      if (menu.children && canAccess) {
        const visibleChildren = getVisibleChildren(menu.children, permissions)
        menu.children.forEach(child => {
          const childCanAccess = canAccessMenu(child, permissions)
          const childStatus = childCanAccess ? '  ✅' : '  ❌'
          console.log(`${childStatus}   └─ ${child.label}`)
        })
        console.log(`     Tổng submenu có thể truy cập: ${visibleChildren.length}/${menu.children.length}`)
      }
    })

    console.log(`\n📊 Tổng quyền: ${permissions.userPermissions.length}`)
    console.log(`🔑 Danh sách quyền: ${permissions.userPermissions.join(', ')}`)
  })

  console.log('\n================================================================================')
  console.log('KẾT THÚC KIỂM TRA')
  console.log('================================================================================')
}

// Chạy test
testPermissions()