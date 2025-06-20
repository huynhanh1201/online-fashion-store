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
    'order:read',
    'order:update',

    // Payment Transaction
    'paymentTransaction:read',
    'paymentTransaction:update',

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

    // Admin access
    'admin:access'
  ],
  [roles.STAFF]: [
    // Order
    'order:read',
    'order:update',

    // Inventory
    'inventory:read',
    'inventory:update',

    // Warehouse Slip
    'warehouseSlip:create',
    'warehouseSlip:read',

    // Inventory Log
    'inventoryLog:read',

    // Statistics
    'statistics:read',

    // Admin access
    'admin:access'
  ],
  [roles.CUSTOMER]: []
}
