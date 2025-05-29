import { InventoryModel } from '~/models/InventoryModel'

const handleCreateInventory = async () => {
  return 'Empty'
}

const getInventoryList = async () => {
  const result = await InventoryModel.find({ destroy: false }).lean()

  return result
}

const getInventory = async (inventoryId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await InventoryModel.findOne({
      _id: inventoryId,
      destroy: false
    })
      .populate('productId')
      .lean()

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
  getInventoryList,
  getInventory,
  updateInventory,
  deleteInventory,
  handleCreateInventory
}
