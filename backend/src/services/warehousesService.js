import { WarehouseModel } from '~/models/WarehouseModel'
import generateSequentialCode from '~/utils/generateSequentialCode'
import { WarehouseSlipModel } from '~/models/WarehouseSlipsModel'

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
    const warehouseDeleted = await WarehouseModel.findOneAndUpdate(
      { _id: warehouseId },
      { destroy: true },
      { new: true }
    )

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
