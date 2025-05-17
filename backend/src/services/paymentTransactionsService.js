import { PaymentTransactionModel } from '~/models/PaymentTransactionModel'

const getPaymentTransactionList = async (orderId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
    //   throw new ApiError(
    //     StatusCodes.BAD_REQUEST,
    //     'Thiếu tham số orderId trong query string (?orderId=...) hoặc orderId không tồn tại'
    //   )
    // }

    const filter = orderId
      ? { orderId } // Có orderId → chỉ tìm transaction của order đó
      : {}

    const result = await PaymentTransactionModel.find(filter).lean()

    return result
  } catch (err) {
    throw err
  }
}

const getPaymentTransaction = async (paymentTransactionId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await PaymentTransactionModel.findOne({
      _id: paymentTransactionId
    })
      .populate({
        path: 'orderId',
        select: '-destroy'
      })
      .lean()

    return result
  } catch (err) {
    throw err
  }
}

const updatePaymentTransaction = async (paymentTransactionId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const updatedPaymentTransaction =
      await PaymentTransactionModel.findOneAndUpdate(
        { _id: paymentTransactionId },
        reqBody,
        {
          new: true,
          runValidators: true
        }
      )

    return updatedPaymentTransaction
  } catch (err) {
    throw err
  }
}

const deletePaymentTransaction = async (paymentTransactionId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const paymentTransactionUpdated =
      await PaymentTransactionModel.findOneAndUpdate(
        {
          _id: paymentTransactionId
        },
        {
          $set: { destroy: true }
        },
        {
          new: true
        }
      )

    return paymentTransactionUpdated
  } catch (err) {
    throw err
  }
}

export const paymentTransactionsService = {
  getPaymentTransactionList,
  getPaymentTransaction,
  updatePaymentTransaction,
  deletePaymentTransaction
}
