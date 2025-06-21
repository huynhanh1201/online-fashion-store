export const permissions = [
  // User
  { key: 'user:create', label: 'Tạo tài khoản nhân viên', group: 'Tài khoản' },
  { key: 'user:read', label: 'Xem tài khoản nhân viên', group: 'Tài khoản' },
  { key: 'user:update', label: 'Sửa tài khoản nhân viên', group: 'Tài khoản' },
  { key: 'user:delete', label: 'Xóa tài khoản nhân viên', group: 'Tài khoản' },

  // Category
  { key: 'category:create', label: 'Tạo danh mục sản phẩm', group: 'Danh mục' },
  { key: 'category:read', label: 'Xem danh mục sản phẩm', group: 'Danh mục' },
  { key: 'category:update', label: 'Sửa danh mục sản phẩm', group: 'Danh mục' },
  { key: 'category:delete', label: 'Xóa danh mục sản phẩm', group: 'Danh mục' },

  // Product
  { key: 'product:create', label: 'Tạo sản phẩm', group: 'Sản phẩm' },
  { key: 'product:read', label: 'Xem sản phẩm', group: 'Sản phẩm' },
  { key: 'product:update', label: 'Sửa sản phẩm', group: 'Sản phẩm' },
  { key: 'product:delete', label: 'Xóa sản phẩm', group: 'Sản phẩm' },

  // Variant
  { key: 'variant:create', label: 'Tạo biến thể', group: 'Biến thể sản phẩm' },
  { key: 'variant:read', label: 'Xem biến thể', group: 'Biến thể sản phẩm' },
  { key: 'variant:update', label: 'Sửa biến thể', group: 'Biến thể sản phẩm' },
  { key: 'variant:delete', label: 'Xóa biến thể', group: 'Biến thể sản phẩm' },

  // Color
  { key: 'color:create', label: 'Tạo màu', group: 'Thuộc tính sản phẩm' },
  { key: 'color:read', label: 'Xem màu', group: 'Thuộc tính sản phẩm' },
  { key: 'color:update', label: 'Sửa màu', group: 'Thuộc tính sản phẩm' },
  { key: 'color:delete', label: 'Xóa màu', group: 'Thuộc tính sản phẩm' },

  // Color Palette
  {
    key: 'colorPalette:create',
    label: 'Tạo bảng màu',
    group: 'Thuộc tính sản phẩm'
  },
  {
    key: 'colorPalette:read',
    label: 'Xem bảng màu',
    group: 'Thuộc tính sản phẩm'
  },
  {
    key: 'colorPalette:update',
    label: 'Sửa bảng màu',
    group: 'Thuộc tính sản phẩm'
  },
  {
    key: 'colorPalette:delete',
    label: 'Xóa bảng màu',
    group: 'Thuộc tính sản phẩm'
  },

  // Size
  { key: 'size:create', label: 'Tạo kích cỡ', group: 'Thuộc tính sản phẩm' },
  { key: 'size:read', label: 'Xem kích cỡ', group: 'Thuộc tính sản phẩm' },
  { key: 'size:update', label: 'Sửa kích cỡ', group: 'Thuộc tính sản phẩm' },
  { key: 'size:delete', label: 'Xóa kích cỡ', group: 'Thuộc tính sản phẩm' },

  // Size Palette
  {
    key: 'sizePalette:create',
    label: 'Tạo bảng kích cỡ',
    group: 'Thuộc tính sản phẩm'
  },
  {
    key: 'sizePalette:read',
    label: 'Xem bảng kích cỡ',
    group: 'Thuộc tính sản phẩm'
  },
  {
    key: 'sizePalette:update',
    label: 'Sửa bảng kích cỡ',
    group: 'Thuộc tính sản phẩm'
  },
  {
    key: 'sizePalette:delete',
    label: 'Xóa bảng kích cỡ',
    group: 'Thuộc tính sản phẩm'
  },

  // Order
  { key: 'order:create', label: 'Tạo đơn hàng', group: 'Đơn hàng' },
  { key: 'order:read', label: 'Xem đơn hàng', group: 'Đơn hàng' },
  { key: 'order:update', label: 'Cập nhật đơn hàng', group: 'Đơn hàng' },
  { key: 'order:delete', label: 'Xóa đơn hàng', group: 'Đơn hàng' },

  // Payment Transaction
  {
    key: 'paymentTransaction:read',
    label: 'Xem giao dịch thanh toán',
    group: 'Thanh toán'
  },
  {
    key: 'paymentTransaction:update',
    label: 'Cập nhật giao dịch thanh toán',
    group: 'Thanh toán'
  },

  // Coupon
  { key: 'coupon:create', label: 'Tạo mã giảm giá', group: 'Khuyến mãi' },
  { key: 'coupon:read', label: 'Xem mã giảm giá', group: 'Khuyến mãi' },
  { key: 'coupon:update', label: 'Sửa mã giảm giá', group: 'Khuyến mãi' },
  { key: 'coupon:delete', label: 'Xóa mã giảm giá', group: 'Khuyến mãi' },

  // Statistics
  { key: 'statistics:read', label: 'Xem thống kê', group: 'Thống kê' },

  // Inventory
  { key: 'inventory:read', label: 'Xem tồn kho', group: 'Kho hàng' },
  { key: 'inventory:update', label: 'Sửa tồn kho', group: 'Kho hàng' },

  // Warehouse Slip
  { key: 'warehouseSlip:create', label: 'Tạo phiếu kho', group: 'Kho hàng' },
  { key: 'warehouseSlip:read', label: 'Xem phiếu kho', group: 'Kho hàng' },

  // Inventory Log
  { key: 'inventoryLog:read', label: 'Xem lịch sử tồn kho', group: 'Kho hàng' },

  // Warehouse
  { key: 'warehouse:create', label: 'Tạo kho', group: 'Kho hàng' },
  { key: 'warehouse:read', label: 'Xem kho', group: 'Kho hàng' },
  { key: 'warehouse:update', label: 'Sửa kho', group: 'Kho hàng' },
  { key: 'warehouse:delete', label: 'Xóa kho', group: 'Kho hàng' },

  // Batch
  { key: 'batch:read', label: 'Xem lô hàng', group: 'Lô hàng' },
  { key: 'batch:update', label: 'Sửa lô hàng', group: 'Lô hàng' },

  // Partner
  { key: 'partner:create', label: 'Tạo đối tác', group: 'Đối tác' },
  { key: 'partner:read', label: 'Xem đối tác', group: 'Đối tác' },
  { key: 'partner:update', label: 'Sửa đối tác', group: 'Đối tác' },
  { key: 'partner:delete', label: 'Xóa đối tác', group: 'Đối tác' },

  // Shipping Address
  {
    key: 'shippingAddress:read',
    label: 'Xem địa chỉ giao hàng',
    group: 'Địa chỉ giao hàng'
  },
  {
    key: 'shippingAddress:create',
    label: 'Tạo địa chỉ giao hàng',
    group: 'Địa chỉ giao hàng'
  },
  {
    key: 'shippingAddress:update',
    label: 'Sửa địa chỉ giao hàng',
    group: 'Địa chỉ giao hàng'
  },
  {
    key: 'shippingAddress:delete',
    label: 'Xóa địa chỉ giao hàng',
    group: 'Địa chỉ giao hàng'
  },

  // Review
  { key: 'review:create', label: 'Tạo đánh giá', group: 'Đánh giá' },
  { key: 'review:read', label: 'Xem đánh giá', group: 'Đánh giá' },
  { key: 'review:update', label: 'Sửa đánh giá', group: 'Đánh giá' },
  { key: 'review:delete', label: 'Xóa đánh giá', group: 'Đánh giá' },

  // Cart
  { key: 'cart:create', label: 'Tạo giỏ hàng', group: 'Giỏ hàng' },
  { key: 'cart:read', label: 'Xem giỏ hàng', group: 'Giỏ hàng' },
  { key: 'cart:update', label: 'Cập nhật giỏ hàng', group: 'Giỏ hàng' },
  { key: 'cart:delete', label: 'Xóa giỏ hàng', group: 'Giỏ hàng' }
]
