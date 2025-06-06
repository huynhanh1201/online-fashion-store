import { InventoryModel } from '~/models/InventoryModel'
import { InventoryLogModel } from '~/models/InventoryLogModel'

const getInventoryStatistics = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    // Thống kê kho
    const warehouseStats = await InventoryModel.aggregate([
      { $match: { destroy: false } },
      {
        $group: {
          _id: '$warehouseId',
          totalStock: { $sum: '$quantity' },
          totalValue: { $sum: { $multiply: ['$quantity', '$importPrice'] } },
          estimatedProfit: {
            $sum: {
              $multiply: [
                '$quantity',
                { $subtract: ['$exportPrice', '$importPrice'] }
              ]
            }
          }
        }
      }
    ])

    // Lấy số lượng biến thể sắp hết (quantity <= minQuantity)
    const lowStockCount = await InventoryModel.aggregate([
      {
        $match: {
          destroy: false,
          $expr: { $lte: ['$quantity', '$minQuantity'] }
        }
      },
      {
        $group: {
          _id: '$warehouseId',
          lowStockCount: { $sum: 1 }
        }
      }
    ])

    // Lấy danh sách cảnh báo sắp hết hàng
    const stockWarnings = await InventoryModel.aggregate([
      {
        $match: {
          destroy: false,
          $expr: { $lte: ['$quantity', '$minQuantity'] }
        }
      },
      {
        $lookup: {
          from: 'variants',
          localField: 'variantId',
          foreignField: '_id',
          as: 'variant'
        }
      },
      { $unwind: '$variant' },
      {
        $group: {
          _id: '$warehouseId',
          lowStockVariants: {
            $push: {
              variantId: '$variantId',
              quantity: '$quantity',
              minQuantity: '$minQuantity',
              name: '$variant.name',
              sku: '$variant.sku',
              importPrice: '$variant.importPrice',
              exportPrice: '$variant.exportPrice',
              color: '$variant.color',
              size: '$variant.size'
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          warehouseId: '$_id',
          lowStockVariants: 1
        }
      }
    ])

    // Dữ liệu biến động tồn kho theo thời gian (nhập/xuất từng ngày)
    const stockMovements = await InventoryLogModel.aggregate([
      {
        $group: {
          _id: '$type',

          totalAmount: { $sum: '$amount' }
        }
      }
    ])

    const inventoryStatisticsInfo = {
      // Phần thống kê chính về tồn kho, liên quan trực tiếp đến kho hàng
      inventorySummary: warehouseStats,

      // Số lượng biến thể sắp hết hàng (ví dụ tồn kho nhỏ hơn ngưỡng cảnh báo minQuantity)
      lowStockCount: lowStockCount,

      // Danh sách cảnh báo hết hàng hoặc gần hết hàng, giúp quản lý kho biết biến thể nào cần nhập thêm
      stockWarnings: stockWarnings,

      // Dữ liệu biến động tồn kho theo thời gian (nhập/xuất từng ngày)
      // Thường dùng để vẽ biểu đồ theo dõi hàng tồn di chuyển ra vào kho
      stockMovements: stockMovements
    }

    return inventoryStatisticsInfo
  } catch (err) {
    throw err
  }
}

export const statisticsService = {
  getInventoryStatistics
}
