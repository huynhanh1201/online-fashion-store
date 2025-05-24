import { SizeModel } from '~/models/SizeModel'

const createSize = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newSize = {
      name: reqBody.name,
      destroy: false
    }

    const sizes = await SizeModel.create(newSize)

    return sizes
  } catch (err) {
    throw err
  }
}

const getSizeList = async () => {
  const result = await SizeModel.find({}).lean()

  return result
}

const getSize = async (sizeId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await SizeModel.findById(sizeId).lean()

    return result
  } catch (err) {
    throw err
  }
}

const updateSize = async (sizeId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedSize = await SizeModel.findOneAndUpdate(
      { _id: sizeId },
      reqBody,
      { new: true }
    )

    return updatedSize
  } catch (err) {
    throw err
  }
}

const deleteSize = async (sizeId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const sizeDeleted = await SizeModel.findOneAndUpdate(
      { _id: sizeId },
      { destroy: true },
      { new: true }
    )

    return sizeDeleted
  } catch (err) {
    throw err
  }
}

export const sizesService = {
  createSize,
  getSizeList,
  getSize,
  updateSize,
  deleteSize
}
