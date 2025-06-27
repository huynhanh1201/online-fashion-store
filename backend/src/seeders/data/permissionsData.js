export const permissions = [
  // Admin
  {
    key: 'admin:access',
    label: 'Cho phep truy cập trang quản lý',
    group: 'Quản trị hệ thống'
  },
  // User
  {
    key: 'user:use',
    label: 'Sửa dụng trang tài khoản nhân viên',
    group: 'Tài khoản'
  },
  { key: 'user:read', label: 'Xem tài khoản nhân viên', group: 'Tài khoản' },
  { key: 'user:create', label: 'Tạo tài khoản nhân viên', group: 'Tài khoản' },
  { key: 'user:update', label: 'Sửa tài khoản nhân viên', group: 'Tài khoản' },
  { key: 'user:delete', label: 'Xóa tài khoản nhân viên', group: 'Tài khoản' },

  // Category
  {
    key: 'category:use',
    label: 'Sửa dụng trang danh mục sản phẩm',
    group: 'Danh mục'
  },
  { key: 'category:read', label: 'Xem danh mục sản phẩm', group: 'Danh mục' },
  { key: 'category:create', label: 'Tạo danh mục sản phẩm', group: 'Danh mục' },
  { key: 'category:update', label: 'Sửa danh mục sản phẩm', group: 'Danh mục' },
  { key: 'category:delete', label: 'Xóa danh mục sản phẩm', group: 'Danh mục' },

  // Product
  { key: 'product:use', label: 'Sửa dụng trang sản phẩm', group: 'Sản phẩm' },
  { key: 'product:read', label: 'Xem sản phẩm', group: 'Sản phẩm' },
  { key: 'product:create', label: 'Tạo sản phẩm', group: 'Sản phẩm' },
  { key: 'product:update', label: 'Sửa sản phẩm', group: 'Sản phẩm' },
  { key: 'product:delete', label: 'Xóa sản phẩm', group: 'Sản phẩm' },

  // Variant
  {
    key: 'variant:use',
    label: 'Sửa dụng trang biến thể sản phẩm',
    group: 'Biến thể sản phẩm'
  },
  { key: 'variant:read', label: 'Xem biến thể', group: 'Biến thể sản phẩm' },
  { key: 'variant:create', label: 'Tạo biến thể', group: 'Biến thể sản phẩm' },
  { key: 'variant:update', label: 'Sửa biến thể', group: 'Biến thể sản phẩm' },
  { key: 'variant:delete', label: 'Xóa biến thể', group: 'Biến thể sản phẩm' },

  // Color
  {
    key: 'color:use',
    label: 'Sửa dụng trang màu sắc',
    group: 'Thuộc tính sản phẩm'
  },
  { key: 'color:read', label: 'Xem màu', group: 'Thuộc tính sản phẩm' },
  { key: 'color:create', label: 'Tạo màu', group: 'Thuộc tính sản phẩm' },
  { key: 'color:update', label: 'Sửa màu', group: 'Thuộc tính sản phẩm' },
  { key: 'color:delete', label: 'Xóa màu', group: 'Thuộc tính sản phẩm' },

  // Color Palette
  {
    key: 'colorPalette:use',
    label: 'Sửa dụng trang bảng màu',
    group: 'Thuộc tính sản phẩm'
  },
  {
    key: 'colorPalette:read',
    label: 'Xem bảng màu',
    group: 'Thuộc tính sản phẩm'
  },
  {
    key: 'colorPalette:create',
    label: 'Tạo bảng màu',
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
  {
    key: 'size:use',
    label: 'Sửa dụng trang kích cỡ',
    group: 'Thuộc tính sản phẩm'
  },
  { key: 'size:read', label: 'Xem kích cỡ', group: 'Thuộc tính sản phẩm' },
  { key: 'size:create', label: 'Tạo kích cỡ', group: 'Thuộc tính sản phẩm' },
  { key: 'size:update', label: 'Sửa kích cỡ', group: 'Thuộc tính sản phẩm' },
  { key: 'size:delete', label: 'Xóa kích cỡ', group: 'Thuộc tính sản phẩm' },

  // Size Palette
  {
    key: 'sizePalette:use',
    label: 'Sửa dụng trang bảng kích cỡ',
    group: 'Thuộc tính sản phẩm'
  },
  {
    key: 'sizePalette:read',
    label: 'Xem bảng kích cỡ',
    group: 'Thuộc tính sản phẩm'
  },
  {
    key: 'sizePalette:create',
    label: 'Tạo bảng kích cỡ',
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
  { key: 'order:use', label: 'Sửa dụng trang đơn hàng', group: 'Đơn hàng' },
  { key: 'order:read', label: 'Xem đơn hàng', group: 'Đơn hàng' },
  { key: 'order:create', label: 'Tạo đơn hàng', group: 'Đơn hàng' },
  { key: 'order:update', label: 'Cập nhật đơn hàng', group: 'Đơn hàng' },
  { key: 'order:delete', label: 'Xóa đơn hàng', group: 'Đơn hàng' },

  // Payment Transaction
  {
    key: 'payment:use',
    label: 'Sửa dụng trang giao dịch thanh toán',
    group: 'Thanh toán'
  },
  {
    key: 'payment:read',
    label: 'Xem giao dịch thanh toán',
    group: 'Thanh toán'
  },
  {
    key: 'payment:update',
    label: 'Cập nhật giao dịch thanh toán',
    group: 'Thanh toán'
  },

  // Coupon
  {
    key: 'coupon:use',
    label: 'Sửa dụng trang mã giảm giá',
    group: 'Khuyến mãi'
  },
  { key: 'coupon:read', label: 'Xem mã giảm giá', group: 'Khuyến mãi' },
  { key: 'coupon:create', label: 'Tạo mã giảm giá', group: 'Khuyến mãi' },
  { key: 'coupon:update', label: 'Sửa mã giảm giá', group: 'Khuyến mãi' },
  { key: 'coupon:delete', label: 'Xóa mã giảm giá', group: 'Khuyến mãi' },

  // Statistics
  {
    key: 'statistics:use',
    label: 'Sửa dụng trang thống kê',
    group: 'Thống kê'
  },
  { key: 'statistics:read', label: 'Xem thống kê', group: 'Thống kê' },

  // Inventory
  { key: 'inventory:use', label: 'Sửa dụng trang tồn kho', group: 'Kho hàng' },
  { key: 'inventory:read', label: 'Xem tồn kho', group: 'Kho hàng' },
  { key: 'inventory:update', label: 'Sửa tồn kho', group: 'Kho hàng' },

  // Warehouse Slip
  {
    key: 'warehouseSlip:use',
    label: 'Sửa dụng trang phiếu kho',
    group: 'Kho hàng'
  },
  { key: 'warehouseSlip:create', label: 'Tạo phiếu kho', group: 'Kho hàng' },
  { key: 'warehouseSlip:read', label: 'Xem phiếu kho', group: 'Kho hàng' },

  // Inventory Log
  {
    key: 'inventoryLog:use',
    label: 'Sửa dụng trang lịch sử tồn kho',
    group: 'Kho hàng'
  },
  { key: 'inventoryLog:read', label: 'Xem lịch sử tồn kho', group: 'Kho hàng' },

  // Warehouse
  { key: 'warehouse:use', label: 'Sửa dụng trang kho hàng', group: 'Kho hàng' },
  { key: 'warehouse:read', label: 'Xem kho', group: 'Kho hàng' },
  { key: 'warehouse:create', label: 'Tạo kho', group: 'Kho hàng' },
  { key: 'warehouse:update', label: 'Sửa kho', group: 'Kho hàng' },
  { key: 'warehouse:delete', label: 'Xóa kho', group: 'Kho hàng' },

  // Batch
  { key: 'batch:use', label: 'Sửa dụng trang lô hàng', group: 'Lô hàng' },
  { key: 'batch:read', label: 'Xem lô hàng', group: 'Lô hàng' },
  { key: 'batch:update', label: 'Sửa lô hàng', group: 'Lô hàng' },

  // Partner
  { key: 'partner:use', label: 'Sửa dụng trang đối tác', group: 'Đối tác' },
  { key: 'partner:read', label: 'Xem đối tác', group: 'Đối tác' },
  { key: 'partner:create', label: 'Tạo đối tác', group: 'Đối tác' },
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
  { key: 'review:use', label: 'Sửa dụng trang đánh giá', group: 'Đánh giá' },
  { key: 'review:create', label: 'Tạo đánh giá', group: 'Đánh giá' },
  { key: 'review:read', label: 'Xem đánh giá', group: 'Đánh giá' },
  { key: 'review:update', label: 'Sửa đánh giá', group: 'Đánh giá' },
  { key: 'review:delete', label: 'Xóa đánh giá', group: 'Đánh giá' },

  // Cart
  { key: 'cart:create', label: 'Tạo giỏ hàng', group: 'Giỏ hàng' },
  { key: 'cart:read', label: 'Xem giỏ hàng', group: 'Giỏ hàng' },
  { key: 'cart:update', label: 'Cập nhật giỏ hàng', group: 'Giỏ hàng' },
  { key: 'cart:delete', label: 'Xóa giỏ hàng', group: 'Giỏ hàng' },

  // Role
  { key: 'role:use', label: 'Sửa dụng trang vai trò', group: 'Vai trò' },
  { key: 'role:read', label: 'Xem vai trò', group: 'Vai trò' },
  { key: 'role:create', label: 'Tạo vai trò', group: 'Vai trò' },
  { key: 'role:update', label: 'Sửa vai trò', group: 'Vai trò' },
  { key: 'role:delete', label: 'Xóa vai trò', group: 'Vai trò' },

  // Blog
  { key: 'blog:use', label: 'Sửa dụng trang blog', group: 'Blog' },
  { key: 'blog:read', label: 'Xem blog', group: 'Blog' },
  { key: 'blog:create', label: 'Tạo blog', group: 'Blog' },
  { key: 'blog:update', label: 'Sửa blog', group: 'Blog' },
  { key: 'blog:delete', label: 'Xóa blog', group: 'Blog' },

  // Account
  { key: 'account:use', label: 'Sửa dụng trang tài khoản', group: 'Tài khoản' },
  { key: 'account:read', label: 'Xem tài khoản', group: 'Tài khoản' },
  { key: 'account:create', label: 'Tạo tài khoản', group: 'Tài khoản' },
  { key: 'account:update', label: 'Sửa tài khoản', group: 'Tài khoản' },
  { key: 'account:delete', label: 'Xóa tài khoản', group: 'Tài khoản' }
]
