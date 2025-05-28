// src/data.js
export const Products = [
  {
    id: '66f1a2b3c4d5e6f789123456',
    code: 'PRD-001',
    name: 'Áo thun nam cổ tròn',
    slug: 'ao-thun-nam-co-tron',
    description:
      'Áo thun nam chất liệu cotton thoáng mát, phù hợp mặc hàng ngày.',
    category: 'Áo thun',
    images: [
      'https://example.com/images/ao-thun-nam-1.jpg',
      'https://example.com/images/ao-thun-nam-2.jpg'
    ],
    importPrice: 50000,
    exportPrice: 100000,
    destroyed: false,
    createdAt: '2025-05-27T09:00:00Z',
    updatedAt: '2025-05-27T09:00:00Z'
  },
  {
    id: '66f1a2b3c4d5e6f789123457',
    code: 'PRD-002',
    name: 'Quần jeans nam',
    slug: 'quan-jeans-nam',
    description: 'Quần jeans nam phong cách hiện đại, chất liệu bền đẹp.',
    category: 'Quần jeans',
    images: ['https://example.com/images/quan-jeans-1.jpg'],
    importPrice: 150000,
    exportPrice: 300000,
    destroyed: false,
    createdAt: '2025-05-27T09:30:00Z',
    updatedAt: '2025-05-27T09:30:00Z'
  }
]

export const ColorPalette = [
  {
    id: '66f1a2b3c4d5e6f789123458',
    productId: '66f1a2b3c4d5e6f789123456',
    colors: [
      {
        name: 'Đỏ',
        image: 'https://example.com/images/ao-thun-do.jpg',
        isActive: true
      },
      {
        name: 'Xanh dương',
        image: 'https://example.com/images/ao-thun-xanh.jpg',
        isActive: true
      }
    ]
  },
  {
    id: '66f1a2b3c4d5e6f789123459',
    productId: '66f1a2b3c4d5e6f789123457',
    colors: [
      {
        name: 'Đen',
        image: 'https://example.com/images/quan-jeans-den.jpg',
        isActive: true
      }
    ]
  }
]

export const SizePalette = [
  {
    id: '66f1a2b3c4d5e6f789123460',
    productId: '66f1a2b3c4d5e6f789123456',
    sizes: [
      { name: 'M', isActive: true },
      { name: 'L', isActive: true }
    ]
  },
  {
    id: '66f1a2b3c4d5e6f789123461',
    productId: '66f1a2b3c4d5e6f789123457',
    sizes: [
      { name: '30', isActive: true },
      { name: '32', isActive: true }
    ]
  }
]

export const Colors = [
  {
    id: '66f1a2b3c4d5e6f789123462',
    name: 'Đỏ',
    destroyed: false,
    createdAt: '2025-05-27T08:00:00Z',
    updatedAt: '2025-05-27T08:00:00Z'
  },
  {
    id: '66f1a2b3c4d5e6f789123463',
    name: 'Xanh dương',
    destroyed: false,
    createdAt: '2025-05-27T08:00:00Z',
    updatedAt: '2025-05-27T08:00:00Z'
  },
  {
    id: '66f1a2b3c4d5e6f789123464',
    name: 'Đen',
    destroyed: false,
    createdAt: '2025-05-27T08:00:00Z',
    updatedAt: '2025-05-27T08:00:00Z'
  }
]

export const Sizes = [
  {
    id: '66f1a2b3c4d5e6f789123465',
    name: 'M',
    destroyed: false,
    createdAt: '2025-05-27T08:00:00Z',
    updatedAt: '2025-05-27T08:00:00Z'
  },
  {
    id: '66f1a2b3c4d5e6f789123466',
    name: 'L',
    destroyed: false,
    createdAt: '2025-05-27T08:00:00Z',
    updatedAt: '2025-05-27T08:00:00Z'
  },
  {
    id: '66f1a2b3c4d5e6f789123467',
    name: '30',
    destroyed: false,
    createdAt: '2025-05-27T08:00:00Z',
    updatedAt: '2025-05-27T08:00:00Z'
  },
  {
    id: '66f1a2b3c4d5e6f789123468',
    name: '32',
    destroyed: false,
    createdAt: '2025-05-27T08:00:00Z',
    updatedAt: '2025-05-27T08:00:00Z'
  }
]

export const Warehouses = [
  {
    id: '66f1a2b3c4d5e6f789123469',
    code: 'WH-HCM',
    name: 'Kho TP.HCM',
    address: '123 Đường Lê Lợi',
    ward: 'Phường Bến Nghé',
    district: 'Quận 1',
    city: 'TP. Hồ Chí Minh',
    destroyed: false,
    createdAt: '2025-05-27T07:00:00Z',
    updatedAt: '2025-05-27T07:00:00Z'
  }
]

// Các biến thể sản phẩm cụ thể theo màu sắc, size
export const Variants = [
  {
    id: '66f1a2b3c4d5e6f789123470',
    productId: '66f1a2b3c4d5e6f789123456',
    color: { name: 'Đỏ', image: 'https://example.com/images/ao-thun-do.jpg' },
    size: { name: 'M' },
    productCode: 'PRD-001',
    sku: 'PRD-001-Đỏ-M',
    name: 'Áo thun nam cổ tròn Đỏ size M',
    destroyed: false,
    importPrice: 55000,
    exportPrice: 110000,
    overridePrice: true,
    createdAt: '2025-05-27T09:10:00Z',
    updatedAt: '2025-05-27T09:10:00Z'
  },
  {
    id: '66f1a2b3c4d5e6f789123471',
    productId: '66f1a2b3c4d5e6f789123456',
    color: {
      name: 'Xanh dương',
      image: 'https://example.com/images/ao-thun-xanh.jpg'
    },
    size: { name: 'L' },
    productCode: 'PRD-001',
    sku: 'PRD-001-Xanh dương-L',
    name: 'Áo thun nam cổ tròn Xanh dương size L',
    destroyed: false,
    importPrice: 50000,
    exportPrice: 100000,
    overridePrice: false,
    createdAt: '2025-05-27T09:15:00Z',
    updatedAt: '2025-05-27T09:15:00Z'
  }
]

// Tồn kho từng biến thể ở từng kho
export const Inventory = [
  {
    id: '66f1a2b3c4d5e6f789123472',
    variantId: '66f1a2b3c4d5e6f789123470',
    warehouseId: '66f1a2b3c4d5e6f789123469',
    quantity: 100,
    minQuantity: 10,
    importPrice: 55000,
    exportPrice: 110000,
    status: 'in-stock',
    destroyed: false,
    createdAt: '2025-05-27T09:20:00Z',
    updatedAt: '2025-05-27T09:20:00Z'
  },
  {
    id: '66f1a2b3c4d5e6f789123473',
    variantId: '66f1a2b3c4d5e6f789123471',
    warehouseId: '66f1a2b3c4d5e6f789123469',
    quantity: 5,
    minQuantity: 10,
    importPrice: 50000,
    exportPrice: 100000,
    status: 'low-stock',
    destroyed: false,
    createdAt: '2025-05-27T09:25:00Z',
    updatedAt: '2025-05-27T09:25:00Z'
  }
]

// Phiếu nhập kho
export const WarehouseSlips = [
  {
    id: '66f1a2b3c4d5e6f789123474',
    code: 'NHAP-001',
    createdAt: '2025-05-26T15:00:00Z',
    updatedAt: '2025-05-26T15:00:00Z',
    warehouseId: '66f1a2b3c4d5e6f789123469',
    createdBy: 'admin',
    note: 'Nhập hàng áo thun đợt đầu',
    type: 'input',
    destroyed: false,
    status: 'done'
  }
]

// Chi tiết phiếu nhập kho (hàng hóa cụ thể trong phiếu)
export const Batch = [
  {
    id: '66f1a2b3c4d5e6f789123475',
    warehouseSlipId: '66f1a2b3c4d5e6f789123474',
    variantId: '66f1a2b3c4d5e6f789123470',
    quantity: 100,
    importPrice: 55000,
    exportPrice: 110000,
    destroyed: false,
    createdAt: '2025-05-26T15:00:00Z',
    updatedAt: '2025-05-26T15:00:00Z'
  }
]

// Nhật ký nhập/xuất tồn kho
export const InventoryLog = [
  {
    id: '66f1a2b3c4d5e6f789123476',
    variantId: '66f1a2b3c4d5e6f789123470',
    warehouseId: '66f1a2b3c4d5e6f789123469',
    quantityChange: 100,
    type: 'in',
    note: 'Nhập hàng lô đầu tiên',
    createdBy: 'admin',
    createdAt: '2025-05-26T15:00:00Z'
  }
]
