import { InventoryModel } from '~/models/InventoryModel'

const createInventory = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newInventory = {
      name: reqBody.name,
      destroy: false
    }

    const inventories = await InventoryModel.create(newInventory)

    return inventories
  } catch (err) {
    throw err
  }
}

const getInventoryList = async () => {
  const result = await InventoryModel.find({}).lean()

  return result
}

const getInventory = async (inventoryId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await InventoryModel.findById(inventoryId).lean()

    return result
  } catch (err) {
    throw err
  }
}

const updateInventory = async (inventoryId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedInventory = await InventoryModel.findOneAndUpdate(
      { _id: inventoryId },
      reqBody,
      { new: true }
    )

    return updatedInventory
  } catch (err) {
    throw err
  }
}

const deleteInventory = async (inventoryId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const inventoryDeleted = await InventoryModel.findOneAndUpdate(
      { _id: inventoryId },
      { destroy: true },
      { new: true }
    )

    return inventoryDeleted
  } catch (err) {
    throw err
  }
}

export const inventoriesService = {
  createInventory,
  getInventoryList,
  getInventory,
  updateInventory,
  deleteInventory
}
