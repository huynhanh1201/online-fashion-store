export const permissions = [
  // Admin
  {
    key: 'admin:access',
    label: 'Cho phép truy cập trang quản lý',
    group: 'Quản trị hệ thống'
  },

  // Statistics

  { key: 'statistics:use', label: 'Sử dụng trang thống kê toàn hệ thống', group: 'Thống kê' },

  { key: 'userStatistics:use', label: 'Sử dụng trang thống kê tài khoản', group: 'Thống kê' },

  { key: 'productStatistics:use', label: 'Sử dụng trang thống kê sản phẩm', group: 'Thống kê' },

  { key: 'warehouseStatistics:use', label: 'Sử dụng trang thống kê kho', group: 'Thống kê' },

  { key: 'orderStatistics:use', label: 'Sử dụng trang thống kê đơn hàng', group: 'Thống kê' },


  // User
  {
    key: 'user:use',
    label: 'Sử dụng trang tài khoản khách hàng',
    group: 'Tài khoản khách hàng'
  },
  { key: 'user:read', label: 'Xem tài khoản khách hàng', group: 'Tài khoản khách hàng' },
  { key: 'user:create', label: 'Tạo tài khoản khách hàng', group: 'Tài khoản khách hàng' },
  { key: 'user:delete', label: 'Xóa tài khoản khách hàng', group: 'Tài khoản khách hàng' },

  // Account
  { key: 'account:use', label: 'Sử dụng trang tài khoản hệ thống', group: 'Tài khoản hệ thống' },
  { key: 'account:read', label: 'Xem tài khoản hệ thống', group: 'Tài khoản hệ thống' },
  { key: 'account:create', label: 'Tạo tài khoản hệ thống', group: 'Tài khoản hệ thống' },
  { key: 'account:update', label: 'Sửa tài khoản hệ thống', group: 'Tài khoản hệ thống' },
  { key: 'account:delete', label: 'Xóa tài khoản hệ thống', group: 'Tài khoản hệ thống' },

  // Role
  { key: 'role:use', label: 'Sử dụng trang vai trò', group: 'Vai trò' },
  { key: 'role:read', label: 'Xem vai trò', group: 'Vai trò' },
  { key: 'role:create', label: 'Tạo vai trò', group: 'Vai trò' },
  { key: 'role:update', label: 'Sửa vai trò', group: 'Vai trò' },
  { key: 'role:delete', label: 'Xóa vai trò', group: 'Vai trò' },


  { key: 'policy:use', label: 'Sử dụng trang chính sách', group: 'Chính sách' },
  { key: 'policy:read', label: 'Xem chính sách', group: 'Chính sách' },
  { key: 'policy:create', label: 'Tạo chính sách', group: 'Chính sách' },
  { key: 'policy:update', label: 'Sửa chính sách', group: 'Chính sách' },
  { key: 'policy:delete', label: 'Xóa chính sách', group: 'Chính sách' },

  { key: 'blog:use', label: 'Sử dụng trang bài viết', group: 'Bài viết' },
  { key: 'blog:read', label: 'Xem bài viết', group: 'Bài viết' },
  { key: 'blog:create', label: 'Tạo bài viết', group: 'Bài viết' },
  { key: 'blog:update', label: 'Sửa bài viết', group: 'Bài viết' },
  { key: 'blog:delete', label: 'Xóa bài viết', group: 'Bài viết' },

  { key: 'banner:use', label: 'Sử dụng trang quảng cáo', group: 'Ảnh quảng cáo' },
  { key: 'banner:create', label: 'Tạo quảng cáo', group: 'Ảnh quảng cáo' },
  { key: 'banner:update', label: 'Cập nhật quảng cáo', group: 'Ảnh quảng cáo' },
  { key: 'banner:delete', label: 'Xóa quảng cáo', group: 'Ảnh quảng cáo' },

  // Content Management
  { key: 'content:use', label: 'Sử dụng trang quản lý nội dung', group: 'Nội dung' },
  { key: 'content:read', label: 'Xem nội dung', group: 'Nội dung' },
  { key: 'content:create', label: 'Tạo nội dung', group: 'Nội dung' },
  { key: 'content:update', label: 'Cập nhật nội dung', group: 'Nội dung' },
  { key: 'content:delete', label: 'Xóa nội dung', group: 'Nội dung' },

  // Flash Sale
  { key: 'flashSale:use', label: 'Sử dụng trang khuyến mãi', group: 'Khuyến mãi' },
  { key: 'flashSale:create', label: 'Tạo khuyến mãi', group: 'Khuyến mãi' },
  { key: 'flashSale:update', label: 'Cập nhật khuyến mãi', group: 'Khuyến mãi' },
  { key: 'flashSale:delete', label: 'Xóa khuyến mãi', group: 'Khuyến mãi' },

  // Header Content
  { key: 'headerContent:use', label: 'Sử dụng trang nội dung đầu trang', group: 'Nội dung đầu trang' },
  { key: 'headerContent:create', label: 'Tạo nội dung đầu trang', group: 'Nội dung đầu trang' },
  { key: 'headerContent:update', label: 'Cập nhật nội dung đầu trang', group: 'Nội dung đầu trang' },
  { key: 'headerContent:delete', label: 'Xóa nội dung đầu trang', group: 'Nội dung đầu trang' },

  // Footer Content
  { key: 'footerContent:use', label: 'Sử dụng trang nội dung cuối trang', group: 'Nội dung cuối trang' },
  { key: 'footerContent:create', label: 'Tạo nội dung cuối trang', group: 'Nội dung cuối trang' },
  { key: 'footerContent:update', label: 'Cập nhật nội dung cuối trang', group: 'Nội dung cuối trang' },
  { key: 'footerContent:delete', label: 'Xóa nội dung cuối trang', group: 'Nội dung cuối trang' },

  // Featured Category
  { key: 'featuredCategory:use', label: 'Sử dụng trang danh mục nổi bật', group: 'Danh mục nổi bật' },
  { key: 'featuredCategory:create', label: 'Tạo danh mục nổi bật', group: 'Danh mục nổi bật' },
  { key: 'featuredCategory:update', label: 'Cập nhật danh mục nổi bật', group: 'Danh mục nổi bật' },
  { key: 'featuredCategory:delete', label: 'Xóa danh mục nổi bật', group: 'Danh mục nổi bật' },

  // Service
  { key: 'service:use', label: 'Sử dụng trang dịch vụ nổi bật', group: 'Dịch vụ' },
  { key: 'service:create', label: 'Tạo dịch vụ', group: 'Dịch vụ' },
  { key: 'service:update', label: 'Cập nhật dịch vụ', group: 'Dịch vụ' },
  { key: 'service:delete', label: 'Xóa dịch vụ', group: 'Dịch vụ' },

  { key: 'theme:use', label: 'Sử dụng trang giao diện', group: 'Giao diện chủ đề' },
  { key: 'theme:update', label: 'Cập nhật giao diện', group: 'Giao diện chủ đề' },


  // Category
  {
    key: 'category:use',
    label: 'Sử dụng trang danh mục sản phẩm',
    group: 'Danh mục'
  },
  { key: 'category:read', label: 'Xem danh mục sản phẩm', group: 'Danh mục' },
  { key: 'category:create', label: 'Tạo danh mục sản phẩm', group: 'Danh mục' },
  { key: 'category:update', label: 'Sửa danh mục sản phẩm', group: 'Danh mục' },
  { key: 'category:delete', label: 'Xóa danh mục sản phẩm', group: 'Danh mục' },

  // Product
  { key: 'product:use', label: 'Sử dụng trang sản phẩm', group: 'Sản phẩm' },
  { key: 'product:read', label: 'Xem sản phẩm', group: 'Sản phẩm' },
  { key: 'product:create', label: 'Tạo sản phẩm', group: 'Sản phẩm' },
  { key: 'product:update', label: 'Sửa sản phẩm', group: 'Sản phẩm' },
  { key: 'product:delete', label: 'Xóa sản phẩm', group: 'Sản phẩm' },

  // Variant
  {
    key: 'variant:use',
    label: 'Sử dụng trang biến thể sản phẩm',
    group: 'Biến thể sản phẩm'
  },
  { key: 'variant:read', label: 'Xem biến thể', group: 'Biến thể sản phẩm' },
  { key: 'variant:create', label: 'Tạo biến thể', group: 'Biến thể sản phẩm' },
  { key: 'variant:update', label: 'Sửa biến thể', group: 'Biến thể sản phẩm' },
  { key: 'variant:delete', label: 'Xóa biến thể', group: 'Biến thể sản phẩm' },

  // Color
  {
    key: 'color:use',
    label: 'Sử dụng trang màu sắc',
    group: 'Màu sắc'
  },
  { key: 'color:read', label: 'Xem màu', group: 'Màu sắc' },
  { key: 'color:create', label: 'Tạo màu', group: 'Màu sắc' },
  { key: 'color:update', label: 'Sửa màu', group: 'Màu sắc' },
  { key: 'color:delete', label: 'Xóa màu', group: 'Màu sắc' },

  // Color Palette
  // {
  //   key: 'colorPalette:use',
  //   label: 'Sử dụng trang bảng màu',
  //   group: 'Thuộc tính sản phẩm'
  // },
  // {
  //   key: 'colorPalette:read',
  //   label: 'Xem bảng màu',
  //   group: 'Thuộc tính sản phẩm'
  // },
  // {
  //   key: 'colorPalette:create',
  //   label: 'Tạo bảng màu',
  //   group: 'Thuộc tính sản phẩm'
  // },
  // {
  //   key: 'colorPalette:update',
  //   label: 'Sửa bảng màu',
  //   group: 'Thuộc tính sản phẩm'
  // },
  // {
  //   key: 'colorPalette:delete',
  //   label: 'Xóa bảng màu',
  //   group: 'Thuộc tính sản phẩm'
  // },

  // Size
  {
    key: 'size:use',
    label: 'Sử dụng trang kích cỡ',
    group: 'Kích thước'
  },
  { key: 'size:read', label: 'Xem kích cỡ', group: 'Kích thước' },
  { key: 'size:create', label: 'Tạo kích cỡ', group: 'Kích thước' },
  { key: 'size:update', label: 'Sửa kích cỡ', group: 'Kích thước' },
  { key: 'size:delete', label: 'Xóa kích cỡ', group: 'Kích thước' },

  // Size Palette
  // {
  //   key: 'sizePalette:use',
  //   label: 'Sử dụng trang bảng kích cỡ',
  //   group: 'Thuộc tính sản phẩm'
  // },
  // {
  //   key: 'sizePalette:read',
  //   label: 'Xem bảng kích cỡ',
  //   group: 'Thuộc tính sản phẩm'
  // },
  // {
  //   key: 'sizePalette:create',
  //   label: 'Tạo bảng kích cỡ',
  //   group: 'Thuộc tính sản phẩm'
  // },
  // {
  //   key: 'sizePalette:update',
  //   label: 'Sửa bảng kích cỡ',
  //   group: 'Thuộc tính sản phẩm'
  // },
  // {
  //   key: 'sizePalette:delete',
  //   label: 'Xóa bảng kích cỡ',
  //   group: 'Thuộc tính sản phẩm'
  // },

  // Order
  { key: 'order:use', label: 'Sử dụng trang đơn hàng', group: 'Đơn hàng' },
  { key: 'order:read', label: 'Xem đơn hàng', group: 'Đơn hàng' },
  { key: 'order:update', label: 'Cập nhật đơn hàng', group: 'Đơn hàng' },

  // Payment Transaction
  {
    key: 'payment:use',
    label: 'Sử dụng trang giao dịch thanh toán',
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
    label: 'Sử dụng trang mã giảm giá',
    group: 'Khuyến mãi'
  },
  { key: 'coupon:read', label: 'Xem mã giảm giá', group: 'Mã giảm giá' },
  { key: 'coupon:create', label: 'Tạo mã giảm giá', group: 'Mã giảm giá' },
  { key: 'coupon:update', label: 'Sửa mã giảm giá', group: 'Mã giảm giá' },
  { key: 'coupon:delete', label: 'Xóa mã giảm giá', group: 'Mã giảm giá' },



  // Inventory
  { key: 'inventory:use', label: 'Sử dụng trang tồn kho', group: 'Kho hàng' },
  { key: 'inventory:read', label: 'Xem tồn kho', group: 'Kho hàng' },
  { key: 'inventory:update', label: 'Sửa tồn kho', group: 'Kho hàng' },

  // Warehouse Slip
  {
    key: 'warehouseSlip:use',
    label: 'Sử dụng trang phiếu kho',
    group: 'Kho hàng'
  },
  { key: 'warehouseSlip:create', label: 'Tạo phiếu kho', group: 'Kho hàng' },
  { key: 'warehouseSlip:read', label: 'Xem phiếu kho', group: 'Kho hàng' },

  // Inventory Log
  {
    key: 'inventoryLog:use',
    label: 'Sử dụng trang lịch sử tồn kho',
    group: 'Kho hàng'
  },
  { key: 'inventoryLog:read', label: 'Xem lịch sử tồn kho', group: 'Kho hàng' },

  // Warehouse
  { key: 'warehouse:use', label: 'Sử dụng trang kho hàng', group: 'Kho hàng' },
  { key: 'warehouse:read', label: 'Xem kho', group: 'Kho hàng' },
  { key: 'warehouse:create', label: 'Tạo kho', group: 'Kho hàng' },
  { key: 'warehouse:update', label: 'Sửa kho', group: 'Kho hàng' },
  { key: 'warehouse:delete', label: 'Xóa kho', group: 'Kho hàng' },

  // Batch
  { key: 'batch:use', label: 'Sử dụng trang lô hàng', group: 'Lô hàng' },
  { key: 'batch:read', label: 'Xem lô hàng', group: 'Lô hàng' },
  { key: 'batch:update', label: 'Sửa lô hàng', group: 'Lô hàng' },

  // Partner
  { key: 'partner:use', label: 'Sử dụng trang đối tác', group: 'Đối tác' },
  { key: 'partner:read', label: 'Xem đối tác', group: 'Đối tác' },
  { key: 'partner:create', label: 'Tạo đối tác', group: 'Đối tác' },
  { key: 'partner:update', label: 'Sửa đối tác', group: 'Đối tác' },
  { key: 'partner:delete', label: 'Xóa đối tác', group: 'Đối tác' },

  // // Shipping Address
  // {
  //   key: 'shippingAddress:read',
  //   label: 'Xem địa chỉ giao hàng',
  //   group: 'Địa chỉ giao hàng'
  // },
  // {
  //   key: 'shippingAddress:create',
  //   label: 'Tạo địa chỉ giao hàng',
  //   group: 'Địa chỉ giao hàng'
  // },
  // {
  //   key: 'shippingAddress:update',
  //   label: 'Sửa địa chỉ giao hàng',
  //   group: 'Địa chỉ giao hàng'
  // },
  // {
  //   key: 'shippingAddress:delete',
  //   label: 'Xóa địa chỉ giao hàng',
  //   group: 'Địa chỉ giao hàng'
  // },

  // Review
  { key: 'review:use', label: 'Sử dụng trang đánh giá', group: 'Đánh giá' },
  { key: 'review:create', label: 'Tạo đánh giá', group: 'Đánh giá' },
  { key: 'review:read', label: 'Xem đánh giá', group: 'Đánh giá' },
  { key: 'review:update', label: 'Sửa đánh giá', group: 'Đánh giá' },
  { key: 'review:delete', label: 'Xóa đánh giá', group: 'Đánh giá' },

  // Cart
  // { key: 'cart:create', label: 'Tạo giỏ hàng', group: 'Giỏ hàng' },
  // { key: 'cart:read', label: 'Xem giỏ hàng', group: 'Giỏ hàng' },
  // { key: 'cart:update', label: 'Cập nhật giỏ hàng', group: 'Giỏ hàng' },
  // { key: 'cart:delete', label: 'Xóa giỏ hàng', group: 'Giỏ hàng' },


  // Blog


]
