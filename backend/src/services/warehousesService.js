import { WarehouseModel } from '~/models/WarehouseModel'

const createWarehouse = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newWarehouse = {
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
