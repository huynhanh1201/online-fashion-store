import { BatchModel } from '~/models/BatchModel'

const getBatchList = async () => {
  const result = await BatchModel.find({ destroy: false }).lean()

  return result
}

const getBatch = async (batchId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await BatchModel.findOne({
      _id: batchId,
      destroy: false
    }).lean()

    return result
  } catch (err) {
    throw err
  }
}

const updateBatch = async (batchId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedBatch = await BatchModel.findOneAndUpdate(
      { _id: batchId },
      reqBody,
      { new: true }
    )

    return updatedBatch
  } catch (err) {
    throw err
  }
}

const deleteBatch = async (batchId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const batchDeleted = await BatchModel.findOneAndUpdate(
      { _id: batchId },
      { destroy: true },
      { new: true }
    )

    return batchDeleted
  } catch (err) {
    throw err
  }
}

export const batchesService = {
  getBatchList,
  getBatch,
  updateBatch,
  deleteBatch
}
