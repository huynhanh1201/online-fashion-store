export const roles = {
  OWNER: 'owner',
  TECHNICAL_ADMIN: 'technical_admin',
  STAFF: 'staff',
  CUSTOMER: 'customer'
}

// Định nghĩa quyền theo role
export const ROLE_PERMISSIONS = {
  // [roles.OWNER]: Object.values(permission),
  [roles.OWNER]: [
    // User
    'user:create',
    'user:read',
    'user:update',
    'user:delete',

    // Category
    'category:create',
    'category:read',
    'category:update',
    'category:delete',

    // Product
    'product:create',
    'product:read',
    'product:update',
    'product:delete',

    // Variant
    'variant:create',
    'variant:read',
    'variant:update',
    'variant:delete',

    // Color
    'color:create',
    'color:read',
    'color:update',
    'color:delete',

    // Color Palette
    'colorPalette:create',
    'colorPalette:read',
    'colorPalette:update',
    'colorPalette:delete',

    // Size
    'size:create',
    'size:read',
    'size:update',
    'size:delete',

    // Size Palette
    'sizePalette:create',
    'sizePalette:read',
    'sizePalette:update',
    'sizePalette:delete',

    // Order
    'order:create',
    'order:read',
    'order:update',

    // Payment Transaction
    'payment:read',
    'payment:update',
    'payment:delete',

    // Coupon
    'coupon:create',
    'coupon:read',
    'coupon:update',
    'coupon:delete',

    // Statistics
    'statistics:read',

    // Inventory
    'inventory:read',
    'inventory:update',

    // Warehouse Slip
    'warehouseSlip:create',
    'warehouseSlip:read',

    // Inventory Log
    'inventoryLog:read',

    // Warehouse
    'warehouse:create',
    'warehouse:read',
    'warehouse:update',
    'warehouse:delete',

    // Batch
    'batch:read',
    'batch:update',

    // Partner
    'partner:create',
    'partner:read',
    'partner:update',
    'partner:delete',

    // Review
    'review:read',
    'review:update',
    'review:delete',

    // Admin access
    'admin:access'
  ],
  [roles.TECHNICAL_ADMIN]: [
    // User (service‑account support)
    'user:read',
    'user:update',

    // Category
    'category:read',

    // Product
    'product:read',

    // Variant
    'variant:read',

    // Color
    'color:read',

    // Color Palette
    'colorPalette:read',

    // Size
    'size:read',

    // Size Palette
    'sizePalette:read',

    // Order
    'order:read',

    // Payment Transaction
    'payment:read',

    // Coupon
    'coupon:read',


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
    'order:read',
    'order:update',

    // Coupon (để có thể xem và áp dụng mã giảm giá khi xử lý đơn hàng)
    // 'coupon:read',

    // Payment (để có thể xem thông tin giao dịch khi xử lý đơn hàng)
    'payment:read',

    // Inventory Management
    'inventory:read',
    'inventory:update',

    // Warehouse Slip
    'warehouseSlip:create',
    'warehouseSlip:read',

    // Inventory Log
    // 'inventoryLog:read',

    // // Warehouse (để có thể xem thông tin kho khi quản lý inventory)
    // 'warehouse:read',

    // // Batch (để có thể xem thông tin lô hàng khi quản lý inventory)
    // 'batch:read',

    // // Partner (để có thể xem thông tin đối tác khi tạo phiếu kho)
    // 'partner:read',

    // // Statistics
    'statistics:read',

    // Admin access
    'admin:access'
  ],
  [roles.CUSTOMER]: []
}
