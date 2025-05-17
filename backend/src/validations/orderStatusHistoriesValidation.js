import validObjectId from '~/utils/validObjectId'

const verifyId = (req, res, next) => {
  const orderId = req.params.orderId

  // Kiểm tra format ObjectId
  validObjectId(orderId, next)

  next()
}

export const orderStatusHistoriesValidation = {
  verifyId
}
