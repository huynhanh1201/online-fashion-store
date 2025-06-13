export const roles = [
  {
    name: 'owner',
    label: 'Chủ cửa hàng',
    permissions: [
      // User
      'user:create',
      'user:read',
      'user:update',
      'user:delete',

      // Product
      'product:create',
      'product:read',
      'product:update',
      'product:delete',

      // Category
      'category:create',
      'category:read',
      'category:update',
      'category:delete',

      // Order
      'order:create',
      'order:read',
      'order:update',
      'order:delete',
      'orderItem:read',

      // Shipping Address
      'shippingAddress:create',
      'shippingAddress:read',
      'shippingAddress:update',
      'shippingAddress:delete',

      // Payment Transaction
      'payment:read',
      'payment:update',

      // Order Status History
      'orderStatusHistory:read',
      'orderStatusHistory:create',

      // Coupon
      'coupon:create',
      'coupon:read',
      'coupon:update',
      'coupon:delete',

      // Cart
      'cart:read',
      'cart:update',

      // Color Palette
      'colorPalette:read',
      'colorPalette:update',
      'sizePalette:read',
      'sizePalette:update',

      // Colors
      'color:create',
      'color:read',
      'color:update',
      'color:delete',

      // Sizes
      'size:create',
      'size:read',
      'size:update',
      'size:delete',

      // Warehouse
      'warehouse:create',
      'warehouse:read',
      'warehouse:update',
      'warehouse:delete'
    ]
  },
  {
    name: 'technical_admin',
    label: 'Kỹ thuật viên hệ thống',
    permissions: [
      'product:read',
      'category:read',
      'coupon:read',
      'color:read',
      'size:read',
      'warehouse:read',

      'colorPalette:update',
      'sizePalette:update',
      'colorPalette:read',
      'sizePalette:read'
    ]
  },
  {
    name: 'staff',
    label: 'Nhân viên quản lý',
    permissions: [
      // Product
      'product:create',
      'product:read',
      'product:update',
      'product:delete',

      // Category
      'category:create',
      'category:read',
      'category:update',
      'category:delete',

      // Coupon
      'coupon:create',
      'coupon:read',
      'coupon:update',
      'coupon:delete',

      // Cart
      'cart:read',
      'cart:update',

      // Order
      'order:create',
      'order:read',
      'order:update',
      'order:delete',
      'orderItem:read',

      // Order status history
      'orderStatusHistory:read',
      'orderStatusHistory:create',

      // Shipping address
      'shippingAddress:create',
      'shippingAddress:read',
      'shippingAddress:update',
      'shippingAddress:delete',

      // Payment transaction (chỉ xem)
      'payment:read',

      // Warehouse
      'warehouse:create',
      'warehouse:read',
      'warehouse:update',
      'warehouse:delete',

      // Color & Size palette
      'colorPalette:update',
      'colorPalette:read',
      'sizePalette:update',
      'sizePalette:read',

      // Colors
      'color:create',
      'color:read',
      'color:update',
      'color:delete',

      // Sizes
      'size:create',
      'size:read',
      'size:update',
      'size:delete'
    ]
  },
  {
    name: 'customer',
    label: 'Khách hàng',
    permissions: [
      'product:read',
      'category:read',

      // Cart
      'cart:read',
      'cart:update',

      // Order
      'order:create',
      'order:read',
      'orderItem:read',

      // Shipping address
      'shippingAddress:create',
      'shippingAddress:read',
      'shippingAddress:update',
      'shippingAddress:delete',

      // Payment Transaction
      'payment:read',

      // Order Status
      'orderStatusHistory:read',

      // Coupon
      'coupon:read'
    ]
  }
]
