export const permissions = [
  // Users
  { key: 'user:create', label: 'Tạo tài khoản nhân viên', group: 'Tài khoản' },
  { key: 'user:read', label: 'Xem tài khoản nhân viên', group: 'Tài khoản' },
  { key: 'user:update', label: 'Sửa tài khoản nhân viên', group: 'Tài khoản' },
  { key: 'user:delete', label: 'Xóa tài khoản nhân viên', group: 'Tài khoản' },

  // Products
  { key: 'product:create', label: 'Tạo sản phẩm mới', group: 'Sản phẩm' },
  { key: 'product:read', label: 'Xem sản phẩm', group: 'Sản phẩm' },
  { key: 'product:update', label: 'Cập nhật sản phẩm', group: 'Sản phẩm' },
  { key: 'product:delete', label: 'Xóa sản phẩm', group: 'Sản phẩm' },

  // Categories
  { key: 'category:create', label: 'Tạo danh mục sản phẩm', group: 'Danh mục' },
  { key: 'category:read', label: 'Xem danh mục sản phẩm', group: 'Danh mục' },
  { key: 'category:update', label: 'Sửa danh mục sản phẩm', group: 'Danh mục' },
  { key: 'category:delete', label: 'Xóa danh mục sản phẩm', group: 'Danh mục' },

  // Orders
  { key: 'order:create', label: 'Tạo đơn hàng', group: 'Đơn hàng' },
  { key: 'order:read', label: 'Xem đơn hàng', group: 'Đơn hàng' },
  { key: 'order:update', label: 'Cập nhật đơn hàng', group: 'Đơn hàng' },
  { key: 'order:delete', label: 'Xóa đơn hàng', group: 'Đơn hàng' },

  // Order Items
  {
    key: 'orderItem:read',
    label: 'Xem chi tiết sản phẩm trong đơn hàng',
    group: 'Đơn hàng'
  },

  // Shipping Addresses
  {
    key: 'shippingAddress:create',
    label: 'Thêm địa chỉ giao hàng',
    group: 'Giao hàng'
  },
  {
    key: 'shippingAddress:read',
    label: 'Xem địa chỉ giao hàng',
    group: 'Giao hàng'
  },
  {
    key: 'shippingAddress:update',
    label: 'Cập nhật địa chỉ giao hàng',
    group: 'Giao hàng'
  },
  {
    key: 'shippingAddress:delete',
    label: 'Xóa địa chỉ giao hàng',
    group: 'Giao hàng'
  },

  // Payment Transactions
  {
    key: 'payment:read',
    label: 'Xem giao dịch thanh toán',
    group: 'Thanh toán'
  },
  {
    key: 'payment:update',
    label: 'Cập nhật trạng thái thanh toán',
    group: 'Thanh toán'
  },

  // Order Status History
  {
    key: 'orderStatusHistory:read',
    label: 'Xem lịch sử trạng thái đơn hàng',
    group: 'Đơn hàng'
  },
  {
    key: 'orderStatusHistory:create',
    label: 'Cập nhật lịch sử đơn hàng',
    group: 'Đơn hàng'
  },

  // Coupons
  { key: 'coupon:create', label: 'Tạo mã giảm giá', group: 'Khuyến mãi' },
  { key: 'coupon:read', label: 'Xem mã giảm giá', group: 'Khuyến mãi' },
  { key: 'coupon:update', label: 'Cập nhật mã giảm giá', group: 'Khuyến mãi' },
  { key: 'coupon:delete', label: 'Xóa mã giảm giá', group: 'Khuyến mãi' },

  // Cart
  { key: 'cart:read', label: 'Xem giỏ hàng', group: 'Giỏ hàng' },
  { key: 'cart:update', label: 'Cập nhật giỏ hàng', group: 'Giỏ hàng' },

  // Color Palette
  { key: 'colorPalette:read', label: 'Xem màu sản phẩm', group: 'Sản phẩm' },
  {
    key: 'colorPalette:update',
    label: 'Cập nhật màu sản phẩm',
    group: 'Sản phẩm'
  },

  // Size Palette
  {
    key: 'sizePalette:read',
    label: 'Xem kích thước sản phẩm',
    group: 'Sản phẩm'
  },
  {
    key: 'sizePalette:update',
    label: 'Cập nhật kích thước sản phẩm',
    group: 'Sản phẩm'
  },

  // Colors
  { key: 'color:create', label: 'Tạo màu mới', group: 'Danh mục phụ' },
  { key: 'color:read', label: 'Xem danh sách màu', group: 'Danh mục phụ' },
  { key: 'color:update', label: 'Cập nhật màu', group: 'Danh mục phụ' },
  { key: 'color:delete', label: 'Xóa màu', group: 'Danh mục phụ' },

  // Sizes
  { key: 'size:create', label: 'Tạo kích cỡ mới', group: 'Danh mục phụ' },
  { key: 'size:read', label: 'Xem danh sách kích cỡ', group: 'Danh mục phụ' },
  { key: 'size:update', label: 'Cập nhật kích cỡ', group: 'Danh mục phụ' },
  { key: 'size:delete', label: 'Xóa kích cỡ', group: 'Danh mục phụ' },

  // Warehouses
  { key: 'warehouse:create', label: 'Tạo kho hàng mới', group: 'Kho hàng' },
  { key: 'warehouse:read', label: 'Xem kho hàng', group: 'Kho hàng' },
  { key: 'warehouse:update', label: 'Cập nhật kho hàng', group: 'Kho hàng' },
  { key: 'warehouse:delete', label: 'Xóa kho hàng', group: 'Kho hàng' }
]
