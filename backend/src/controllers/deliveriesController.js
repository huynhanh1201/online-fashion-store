import { StatusCodes } from 'http-status-codes'

import { deliveriesService } from '~/services/deliveriesService'

const getDelivery = async (req, res, next) => {
  try {
    const result = await deliveriesService.getDelivery(req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const deliveriesController = {
  getDelivery
}
