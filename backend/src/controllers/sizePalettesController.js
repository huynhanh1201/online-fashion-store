import { StatusCodes } from 'http-status-codes'

import { sizePalettesService } from '~/services/sizePalettesService'

const createSizePalette = async (req, res, next) => {
  try {
    const productId = req.query.productId

    // Lấy Danh mục sản phẩm mới tạo từ tầng Service chuyển qua
    const result = await sizePalettesService.createSizePalette(
      productId,
      req.body
    )

    // Có kết quả thì trả về Client
    res.status(StatusCodes.CREATED).json(result)
  } catch (err) {
    next(err)
  }
}

const getSizePaletteList = async (req, res, next) => {
  try {
    const productId = req.query.productId

    // Lấy danh sách Danh mục sản phẩm từ tầng Service chuyển qua
    const result = await sizePalettesService.getSizePaletteList(productId)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const getSizePalette = async (req, res, next) => {
  try {
    const sizePaletteId = req.params.sizePaletteId

    const result = await sizePalettesService.getSizePalette(sizePaletteId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const updateSizePalette = async (req, res, next) => {
  try {
    const sizePaletteId = req.params.sizePaletteId

    const result = await sizePalettesService.updateSizePalette(
      sizePaletteId,
      req.body
    )

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const deleteSizePalette = async (req, res, next) => {
  try {
    const sizePaletteId = req.params.sizePaletteId

    const result = await sizePalettesService.deleteSizePalette(sizePaletteId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const sizePalettesController = {
  createSizePalette,
  getSizePaletteList,
  getSizePalette,
  updateSizePalette,
  deleteSizePalette
}
