import { StatusCodes } from 'http-status-codes'

import { deliveriesService } from '~/services/deliveriesService'

const getDeliveryFee = async (req, res, next) => {
  try {
    const result = await deliveriesService.getDeliveryFee(req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const ghnWebhook = async (req, res, next) => {
  try {
    const result = await deliveriesService.ghnWebhook(req.body)

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const deliveriesController = {
  getDeliveryFee,
  ghnWebhook
}
