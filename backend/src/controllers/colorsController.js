import { StatusCodes } from 'http-status-codes'

import { colorsService } from '~/services/colorsService'

const createColor = async (req, res, next) => {
  try {
    const result = await colorsService.createColor(req.body)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.CREATED).json(result)
  } catch (err) {
    next(err)
  }
}

const getColorList = async (req, res, next) => {
  try {
    const queryString = req.query

    // Lấy danh sách Danh mục sản phẩm từ tầng Service chuyển qua
    const result = await colorsService.getColorList(queryString)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const getColor = async (req, res, next) => {
  try {
    const colorId = req.params.colorId

    const result = await colorsService.getColor(colorId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const updateColor = async (req, res, next) => {
  try {
    const colorId = req.params.colorId

    const result = await colorsService.updateColor(colorId, req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const deleteColor = async (req, res, next) => {
  try {
    const colorId = req.params.colorId

    const result = await colorsService.deleteColor(colorId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const restoreColor = async (req, res, next) => {
  try {
    const colorId = req.params.colorId

    const result = await colorsService.restoreColor(colorId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const colorsController = {
  createColor,
  getColorList,
  getColor,
  updateColor,
  deleteColor,
  restoreColor
}
