import { InventoryModel } from '~/models/InventoryModel'
import { InventoryLogModel } from '~/models/InventoryLogModel'
import convertArrToMap from '~/utils/convertArrToMap'
import { ProductModel } from '~/models/ProductModel'
import { CategoryModel } from '~/models/CategoryModel'
import { VariantModel } from '~/models/VariantModel'

const getInventoryStatistics = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    // Thống kê kho
    const warehouseStatsPromise = InventoryModel.aggregate([
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
    const lowStockCountPromise = InventoryModel.aggregate([
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
    const stockWarningsPromise = InventoryModel.aggregate([
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
    const stockMovementsPromise = InventoryLogModel.aggregate([
      {
        // Bước 1: Thêm trường tháng
        $addFields: {
          month: {
            $dateToString: { format: '%Y-%m', date: '$createdAt' }
          }
        }
      },
      {
        // Bước 2: Gom theo kho + tháng + loại (in/out)
        $group: {
          _id: {
            warehouseId: '$warehouseId',
            month: '$month',
            type: '$type'
          },
          totalAmount: { $sum: '$amount' }
        }
      },
      {
        // Bước 3: Tách in/out
        $project: {
          warehouseId: '$_id.warehouseId',
          month: '$_id.month',
          inAmount: {
            $cond: [{ $eq: ['$_id.type', 'in'] }, '$totalAmount', 0]
          },
          outAmount: {
            $cond: [{ $eq: ['$_id.type', 'out'] }, '$totalAmount', 0]
          }
        }
      },
      {
        // Bước 4: Gom lại theo warehouse + tháng
        $group: {
          _id: {
            warehouseId: '$warehouseId',
            month: '$month'
          },
          inAmount: { $sum: '$inAmount' },
          outAmount: { $sum: '$outAmount' }
        }
      },
      {
        // Bước 5: Đưa về dạng dễ nhét vào mảng
        $project: {
          _id: 0,
          warehouseId: '$_id.warehouseId',
          data: {
            month: '$_id.month',
            inAmount: '$inAmount',
            outAmount: '$outAmount'
          }
        }
      },
      {
        // Bước 6: Gom về theo warehouseId
        $group: {
          _id: '$warehouseId',
          data: { $push: '$data' }
        }
      }
    ])

    // Xử lý chạy song song bằng Promise.all
    const [warehouseStats, lowStockCount, stockWarnings, stockMovements] =
      await Promise.all([
        warehouseStatsPromise,
        lowStockCountPromise,
        stockWarningsPromise,
        stockMovementsPromise
      ])

    // Xử lý cấu trúc dữ liệu về dạng Hash map
    const warehouseStatsMap = convertArrToMap(warehouseStats, '_id')

    const lowStockCountMap = convertArrToMap(lowStockCount, '_id')

    const stockWarningsMap = convertArrToMap(stockWarnings, 'warehouseId')

    const stockMovementsMap = convertArrToMap(stockMovements, '_id')

    // Xử lý làm phảng dữ liệu trước khi trả về
    const mergedWarehouses = []

    const warehouseIds = new Set([
      ...Object.keys(warehouseStatsMap),
      ...Object.keys(lowStockCountMap),
      ...Object.keys(stockWarningsMap),
      ...Object.keys(stockMovementsMap)
    ])

    warehouseIds.forEach((warehouseId) => {
      const stats = warehouseStatsMap[warehouseId] || {}
      const lowStock = lowStockCountMap[warehouseId] || { lowStockCount: 0 }
      const warnings = stockWarningsMap[warehouseId] || { lowStockVariants: [] }
      const movements = stockMovementsMap[warehouseId] || {
        inAmount: 0,
        outAmount: 0
      }

      mergedWarehouses.push({
        warehouseId,
        ...stats,
        ...lowStock,
        ...warnings,
        ...movements
      })
    })

    return mergedWarehouses
  } catch (err) {
    throw err
  }
}

const getProductStatistics = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const productsTotalPromise = ProductModel.countDocuments({ destroy: false })

    const categoriesTotalPromise = CategoryModel.countDocuments({
      destroy: false
    })

    const variantsTotalPromise = VariantModel.countDocuments({
      destroy: false
    })

    const productCountByCategoryPromise = ProductModel.aggregate([
      {
        $match: { destroy: false, parent: null }
      },
      {
        $group: {
          _id: '$categoryId',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $project: {
          _id: 0,
          categoryId: '$_id',
          categoryName: '$category.name',
          count: 1
        }
      }
    ])

    const [
      productsTotal,
      categoriesTotal,
      variantsTotal,
      productCountByCategory
    ] = await Promise.all([
      productsTotalPromise,
      categoriesTotalPromise,
      variantsTotalPromise,
      productCountByCategoryPromise
    ])

    const result = {
      productsTotal,
      categoriesTotal,
      variantsTotal,
      productCountByCategory
    }

    return result
  } catch (err) {
    throw err
  }
}

export const statisticsService = {
  getInventoryStatistics,
  getProductStatistics
}
