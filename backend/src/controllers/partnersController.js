import { StatusCodes } from 'http-status-codes'

import { partnersService } from '~/services/partnersService'

const createPartner = async (req, res, next) => {
  try {
    const result = await partnersService.createPartner(req.body)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.CREATED).json(result)
  } catch (err) {
    next(err)
  }
}

const getPartnerList = async (req, res, next) => {
  try {
    const queryString = req.query

    // Lấy danh sách Danh mục sản phẩm từ tầng Service chuyển qua
    const result = await partnersService.getPartnerList(queryString)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const getPartner = async (req, res, next) => {
  try {
    const partnerId = req.params.partnerId

    const result = await partnersService.getPartner(partnerId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const updatePartner = async (req, res, next) => {
  try {
    const partnerId = req.params.partnerId

    const result = await partnersService.updatePartner(partnerId, req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const deletePartner = async (req, res, next) => {
  try {
    const partnerId = req.params.partnerId

    const result = await partnersService.deletePartner(partnerId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const restorePartner = async (req, res, next) => {
  try {
    const partnerId = req.params.partnerId

    const result = await partnersService.restorePartner(partnerId)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const partnersController = {
  createPartner,
  getPartnerList,
  getPartner,
  updatePartner,
  deletePartner,
  restorePartner
}
