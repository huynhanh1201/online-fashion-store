import validObjectId from '~/utils/validObjectId'

const verifyId = (req, res, next) => {
  const inventoryId = req.params.inventoryId

  // Kiểm tra format ObjectId
  validObjectId(inventoryId, next)

  next()
}

export const statisticsValidation = {
  verifyId
}
