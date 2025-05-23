import { ColorModel } from '~/models/ColorModel'

const createColor = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newColor = {
      name: reqBody.name,
      destroy: false
    }

    const colors = await ColorModel.create(newColor)

    return colors
  } catch (err) {
    throw err
  }
}

const getColorList = async () => {
  const result = await ColorModel.find({}).lean()

  return result
}

const getColor = async (colorId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await ColorModel.findById(colorId).lean()

    return result
  } catch (err) {
    throw err
  }
}

const updateColor = async (colorId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedColor = await ColorModel.findOneAndUpdate(
      { _id: colorId },
      reqBody,
      { new: true }
    )

    return updatedColor
  } catch (err) {
    throw err
  }
}

const deleteColor = async (colorId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const colorDeleted = await ColorModel.findOneAndUpdate(
      { _id: colorId },
      { destroy: true },
      { new: true }
    )

    return colorDeleted
  } catch (err) {
    throw err
  }
}

export const colorsService = {
  createColor,
  getColorList,
  getColor,
  updateColor,
  deleteColor
}
