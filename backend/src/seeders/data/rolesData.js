export const roles = [
  {
    name: 'owner',
    label: 'Chủ cửa hàng',
    permissions: [
      // Admin
      'admin:access',

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
      'payment:read',
      'payment:update',

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
      'review:create',
      'review:read',
      'review:update',
      'review:delete'
    ]
  },
  {
    name: 'technical_admin',
    label: 'Kỹ thuật viên hệ thống',
    permissions: [
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
      'partner:read'
    ]
  },
  {
    name: 'staff',
    label: 'Nhân viên quản lý',
    permissions: [
      // Order
      'order:read',
      'order:update',

      // Inventory
      'inventory:read',
      'inventory:update',

      // Warehose Slip
      'warehouseSlip:create',
      'warehouseSlip:read',

      // Inventory Log
      'inventoryLog:read',

      // statistics
      'statistics:read'
    ]
  },
  {
    name: 'customer',
    label: 'Khách hàng',
    permissions: [
      // User - xem và cập nhật tài khoản của chính họ
      'user:read',
      'user:update',

      // Product  - để duyệt sản phẩm
      'product:read',

      // Variant - để xem các biến thể của sản phẩm
      'variant:read',

      // Color Palette - để chọn lựa
      'colorPalette:read',

      // Size Palette - để chọn lựa
      'sizePalette:read',

      // Order - tạo đơn và xem đơn hàng cá nhân
      'order:read', // có thể cần filter theo userId ở backend
      'order:create',

      // Payment Transaction - theo dõi trạng thái thanh toán
      'paymentTransaction:read',

      // Coupon - áp dụng mã
      'coupon:read',

      // Inventory - (nếu muốn show "còn hàng / hết hàng")
      'inventory:read',

      //Shipping Addresses
      'shippingAddress:read',
      'shippingAddress:create',
      'shippingAddress:update',
      'shippingAddress:delete',

      // Review - khách hàng có thể tạo và quản lý đánh giá của mình
      'review:create',
      'review:read',
      'review:update',
      'review:delete',

      // Cart - quản lý giỏ hàng
      'cart:create',
      'cart:read',
      'cart:update',
      'cart:delete'
    ]
  }
]
