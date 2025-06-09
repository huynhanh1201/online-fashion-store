export const rolesData = [
  {
    name: 'technical_admin',
    label: 'Kỹ thuật viên hệ thống',
    permissions: [
      { key: 'product:create', label: 'Tạo sản phẩm mới', group: 'Sản phẩm' }
      // ... Thêm tùy quyền
    ]
  },
  {
    name: 'owner',
    label: 'Chủ cửa hàng',
    permissions: [
      { key: 'product:create', label: 'Tạo sản phẩm mới', group: 'Sản phẩm' }
      // ... Thêm tùy quyền
    ]
  },
  {
    name: 'staff',
    label: 'Nhân viên quản lý',
    permissions: [
      { key: 'category:create', label: 'Tạo sản phẩm mới', group: 'Sản phẩm' }
    ]
  }
]
