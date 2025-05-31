import { StatusCodes } from 'http-status-codes'

import { SizePaletteModel } from '~/models/SizePaletteModel'
import ApiError from '~/utils/ApiError'

const createSizePalette = async (productId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const newSizePalette = {
      name: reqBody.name,
      isActive: true
    }

    const updatedPalette = await SizePaletteModel.findOneAndUpdate(
      { productId },
      { $push: { sizes: newSizePalette } },
      {
        new: true,
        upsert: true
      }
    )

    return updatedPalette
  } catch (err) {
    throw err
  }
}

const getSizePaletteList = async (productId) => {
  const result = await SizePaletteModel.findOne({ productId }).lean()
  return result
}

const getSizePalette = async (sizePaletteId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await SizePaletteModel.findById(sizePaletteId).lean()

    if (!result) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Không có dữ liệu Danh mục sản phẩm.'
      )
    }

    return result
  } catch (err) {
    throw err
  }
}

const updateSizePalette = async (sizePaletteId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedSizePalette = await SizePaletteModel.findOneAndUpdate(
      { 'colors._id': sizePaletteId },
      {
        $set: {
          'colors.$.name': reqBody.name, // cập nhật từng trường
          'colors.$.image': reqBody.image,
          'colors.$.isActive': reqBody.isActive
        }
      },
      { new: true }
    )

    return updatedSizePalette
  } catch (err) {
    throw err
  }
}

const deleteSizePalette = async (sizePaletteId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const sizePaletteDeleted = await SizePaletteModel.updateOne(
      { 'colors._id': sizePaletteId }, // tìm document chứa phần tử cần xóa
      { $pull: { colors: { _id: sizePaletteId } } } // pull phần tử có _id khớp
    )

    return sizePaletteDeleted
  } catch (err) {
    throw err
  }
}

export const sizePalettesService = {
  createSizePalette,
  getSizePaletteList,
  getSizePalette,
  updateSizePalette,
  deleteSizePalette
}
