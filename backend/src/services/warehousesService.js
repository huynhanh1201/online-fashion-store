import { WarehouseModel } from '~/models/WarehouseModel'
import generateSequentialCode from '~/utils/generateSequentialCode'
import { InventoryModel } from '~/models/InventoryModel'
import { WarehouseSlipModel } from '~/models/WarehouseSlipsModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const createWarehouse = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const prefixCodeWarehouse = 'WH-'

    const codeWarehouse = await generateSequentialCode(
      prefixCodeWarehouse,
      4,
      async (prefixCodeWarehouse) => {
        // Query mã lớn nhất đã có với prefixCodeWarehouse đó
        const regex = new RegExp(`^${prefixCodeWarehouse}(\\d{4})$`)
        const latest = await WarehouseModel.findOne({
          code: { $regex: regex }
        })
          .sort({ code: -1 }) // sort giảm dần, AV10 > AV09
          .lean()

        // Tính số thứ tự tiếp theo
        let nextNumber = 1
        if (latest) {
          const match = latest.code.match(regex)
          if (match && match[1]) {
            nextNumber = parseInt(match[1], 10) + 1 // ví dụ AV10 → match[1] = "10" → +1 = 11
          }
        }

        return nextNumber
      }
    )

    const newWarehouse = {
      code: codeWarehouse,
      name: reqBody.name,
      address: reqBody.address,
      ward: reqBody.ward,
      district: reqBody.district,
      city: reqBody.city,

      destroy: false
    }

    const warehouses = await WarehouseModel.create(newWarehouse)

    return warehouses
  } catch (err) {
    throw err
  }
}

const getWarehouseList = async () => {
  const result = await WarehouseModel.find({ destroy: false }).lean()

  return result || []
}

const getWarehouse = async (warehouseId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await WarehouseModel.findById(warehouseId).lean()

    return result
  } catch (err) {
    throw err
  }
}

const updateWarehouse = async (warehouseId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedWarehouse = await WarehouseModel.findOneAndUpdate(
      { _id: warehouseId },
      reqBody,
      { new: true }
    )

    return updatedWarehouse
  } catch (err) {
    throw err
  }
}

const deleteWarehouse = async (warehouseId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const inventoryPromise = InventoryModel.exists({
      warehouseId,
      destroy: false
    })

    const warehouseSlipPromise = WarehouseSlipModel.exists({
      warehouseId,
      destroy: false
    })

    const [inventoryExsits, warehouseSlipExsits] = await Promise.all([
      inventoryPromise,
      warehouseSlipPromise
    ])

    if (inventoryExsits) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        'Không thể xóa KHO HÀNG khi vẫn còn TỒN KHO hoạt động.'
      )
    }

    if (warehouseSlipExsits) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        'Không thể xóa KHO HÀNG khi vẫn còn PHIẾU NHÂP/XUẤT hoạt động.'
      )
    }

    const warehouseDeleted = await WarehouseModel.findOneAndUpdate(
      { _id: warehouseId },
      { destroy: true },
      { new: true }
    )

    if (!warehouseDeleted) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Kho hàng không tồn tại.')
    }

    return warehouseDeleted
  } catch (err) {
    throw err
  }
}

export const warehousesService = {
  createWarehouse,
  getWarehouseList,
  getWarehouse,
  updateWarehouse,
  deleteWarehouse
}
