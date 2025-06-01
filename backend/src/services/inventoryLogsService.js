import { InventoryLogModel } from '~/models/InventoryLogModel'

const createInventoryLog = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newInventoryLog = {
      name: reqBody.name,
      destroy: false
    }

    const inventoryLogs = await InventoryLogModel.create(newInventoryLog)

    return inventoryLogs
  } catch (err) {
    throw err
  }
}

const getInventoryLogList = async () => {
  const result = await InventoryLogModel.find({})
    // .populate([
    //   {
    //     path: 'variantId',
    //     select: 'name'
    //   },
    //   {
    //     path: 'warehouseId',
    //     select: 'name'
    //   }
    // ])
    .lean()

  return result
}

const getInventoryLog = async (inventoryLogId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await InventoryLogModel.findById(inventoryLogId)
      .populate([
        {
          path: 'variantId',
          select: 'name'
        },
        {
          path: 'warehouseId',
          select: 'name'
        }
      ])
      .lean()

    return result
  } catch (err) {
    throw err
  }
}

const updateInventoryLog = async (inventoryLogId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedInventoryLog = await InventoryLogModel.findOneAndUpdate(
      { _id: inventoryLogId },
      reqBody,
      { new: true }
    )

    return updatedInventoryLog
  } catch (err) {
    throw err
  }
}

const deleteInventoryLog = async (inventoryLogId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const inventoryLogDeleted = await InventoryLogModel.findOneAndUpdate(
      { _id: inventoryLogId },
      { destroy: true },
      { new: true }
    )

    return inventoryLogDeleted
  } catch (err) {
    throw err
  }
}

export const inventoryLogsService = {
  createInventoryLog,
  getInventoryLogList,
  getInventoryLog,
  updateInventoryLog,
  deleteInventoryLog
}
