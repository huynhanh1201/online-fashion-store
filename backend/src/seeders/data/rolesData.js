export const roles = [
  {
    name: 'owner',
    label: 'Chủ cửa hàng',
    permissions: [
      // Admin
      'admin:access',

      // User
      'user:use',
      'user:create',
      'user:read',
      'user:update',
      'user:delete',

      // Category
      'category:use',
      'category:create',
      'category:read',
      'category:update',
      'category:delete',

      // Product
      'product:use',
      'product:create',
      'product:read',
      'product:update',
      'product:delete',

      // Variant
      'variant:use',
      'variant:create',
      'variant:read',
      'variant:update',
      'variant:delete',

      // Color
      'color:use',
      'color:create',
      'color:read',
      'color:update',
      'color:delete',

      // Color Palette
      'colorPalette:use',
      'colorPalette:create',
      'colorPalette:read',
      'colorPalette:update',
      'colorPalette:delete',

      // Size
      'size:use',
      'size:create',
      'size:read',
      'size:update',
      'size:delete',

      // Size Palette
      'sizePalette:use',
      'sizePalette:create',
      'sizePalette:read',
      'sizePalette:update',
      'sizePalette:delete',

      // Order
      'order:use',
      'order:read',
      'order:update',

      // Payment Transaction
      'paymentTransaction:use',
      'payment:read',
      'payment:update',

      // Coupon
      'coupon:use',
      'coupon:create',
      'coupon:read',
      'coupon:update',
      'coupon:delete',

      // Statistics
      'statistics:use',
      'statistics:read',

      // Inventory
      'inventory:use',
      'inventory:read',
      'inventory:update',

      // Warehouse Slip
      'warehouseSlip:use',
      'warehouseSlip:create',
      'warehouseSlip:read',

      // Inventory Log
      'inventoryLog:use',
      'inventoryLog:read',

      // Warehouse
      'warehouse:use',
      'warehouse:create',
      'warehouse:read',
      'warehouse:update',
      'warehouse:delete',

      // Batch
      'batch:use',
      'batch:read',
      'batch:update',

      // Partner
      'partner:use',
      'partner:create',
      'partner:read',
      'partner:update',
      'partner:delete',

      // Review
      'review:use',
      'review:create',
      'review:read',
      'review:update',
      'review:delete',

      // Blog
      'blog:use',
      'blog:create',
      'blog:read',
      'blog:update',
      'blog:delete',

      // Account
      'account:use',
      'account:create',
      'account:read',
      'account:update',
      'account:delete',

      // Role
      'role:use',
      'role:create',
      'role:read',
      'role:update',

      // Banner
      'banner:use',
      'banner:create',
      'banner:update',
      'banner:delete',

      // Content Management
      'content:use',
      'content:create',
      'content:update',
      'content:delete',

      // Flash Sale
      'flashSale:use',
      'flashSale:create',
      'flashSale:update',
      'flashSale:delete',

      // Header Content
      'headerContent:use',
      'headerContent:create',
      'headerContent:update',
      'headerContent:delete',

      // Footer Content
      'footerContent:use',
      'footerContent:create',
      'footerContent:update',
      'footerContent:delete',

      // Featured Category
      'featuredCategory:use',
      'featuredCategory:create',
      'featuredCategory:update',
      'featuredCategory:delete',

      // Service
      'service:use',
      'service:create',
      'service:update',
      'service:delete'
    ]
  },
  {
    name: 'technical_admin',
    label: 'Kỹ thuật viên hệ thống',
    permissions: [
      // User (service‑account support)
      'user:use',
      'user:read',
      'user:update',

      // Account
      'account:use',
      'account:read',
      'account:update',

      // Role
      'role:use',
      'role:read',

      // Category
      'category:use',
      'category:read',

      // Product
      'product:use',
      'product:read',

      // Variant
      'variant:use',
      'variant:read',

      // Color
      'color:use',
      'color:read',

      // Color Palette
      'colorPalette:use',
      'colorPalette:read',

      // Size
      'size:use',
      'size:read',

      // Size Palette
      'sizePalette:use',
      'sizePalette:read',

      // Order
      'order:use',
      'order:read',

      // Payment Transaction
      'payment:use',
      'payment:read',

      // Coupon
      'coupon:use',
      'coupon:read',

      // Statistics
      'statistics:use',
      'statistics:read',

      // Inventory
      'inventory:use',
      'inventory:read',

      // Warehouse Slip
      'warehouseSlip:use',
      'warehouseSlip:read',

      // Inventory Log
      'inventoryLog:use',
      'inventoryLog:read',

      // Warehouse
      'warehouse:use',
      'warehouse:read',

      // Batch
      'batch:use',
      'batch:read',

      // Partner
      'partner:use',
      'partner:read',

      // Banner
      'banner:use',
      'banner:read',

      // Content Management
      'content:use',
      'content:read',

      // Flash Sale
      'flashSale:use',
      'flashSale:read',

      // Header Content
      'headerContent:use',
      'headerContent:read',

      // Footer Content
      'footerContent:use',
      'footerContent:read',

      // Featured Category
      'featuredCategory:use',
      'featuredCategory:read',

      // Service
      'service:use',
      'service:read',


      'admin:access'
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
  // {
  //   name: 'customer',
  //   label: 'Khách hàng',
  //   permissions: [
  //     // User - xem và cập nhật tài khoản của chính họ
  //     'user:read',
  //     'user:update',

  //     // Product  - để duyệt sản phẩm
  //     'product:read',

  //     // Variant - để xem các biến thể của sản phẩm
  //     'variant:read',

  //     // Color Palette - để chọn lựa
  //     'colorPalette:read',

  //     // Size Palette - để chọn lựa
  //     'sizePalette:read',

  //     // Order - tạo đơn và xem đơn hàng cá nhân
  //     'order:read', // có thể cần filter theo userId ở backend
  //     'order:create',

  //     // Payment Transaction - theo dõi trạng thái thanh toán
  //     'paymentTransaction:read',

  //     // Coupon - áp dụng mã
  //     'coupon:read',

  //     // Inventory - (nếu muốn show "còn hàng / hết hàng")
  //     'inventory:read',

  //     //Shipping Addresses
  //     'shippingAddress:read',
  //     'shippingAddress:create',
  //     'shippingAddress:update',
  //     'shippingAddress:delete',

  //     // Review - khách hàng có thể tạo và quản lý đánh giá của mình
  //     'review:create',
  //     'review:read',
  //     'review:update',
  //     'review:delete',

  //     // Cart - quản lý giỏ hàng
  //     'cart:create',
  //     'cart:read',
  //     'cart:update',
  //     'cart:delete',

  //     // Banner - xem quảng cáo
  //     'banner:read',

  //     // Content Management - xem nội dung trang web
  //     'content:read',

  //     // Flash Sale - xem chương trình khuyến mãi
  //     'flashSale:read',

  //     // Header Content - xem nội dung đầu trang
  //     'headerContent:read',

  //     // Footer Content - xem nội dung cuối trang
  //     'footerContent:read',

  //     // Featured Category - xem danh mục nổi bật
  //     'featuredCategory:read',

  //     // Service - xem dịch vụ nổi bật
  //     'service:read'
  //   ]
  // }
]
