import { StatusCodes } from 'http-status-codes'

import { paymentTransactionsService } from '~/services/paymentTransactionsService'

const getPaymentTransactionList = async (req, res, next) => {
  try {
    const queryString = req.query

    // Lấy danh sách Danh mục sản phẩm từ tầng Service chuyển qua
    const result =
      await paymentTransactionsService.getPaymentTransactionList(queryString)

    // Có kết quả thì trả về Client
    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const getPaymentTransaction = async (req, res, next) => {
  try {
    const paymentTransactionId = req.params.paymentTransactionId

    const result =
      await paymentTransactionsService.getPaymentTransaction(
        paymentTransactionId
      )

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const updatePaymentTransaction = async (req, res, next) => {
  try {
    const paymentTransactionId = req.params.paymentTransactionId

    const result = await paymentTransactionsService.updatePaymentTransaction(
      paymentTransactionId,
      req.body
    )

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

const deletePaymentTransaction = async (req, res, next) => {
  try {
    const paymentTransactionId = req.params.paymentTransactionId

    const result =
      await paymentTransactionsService.deletePaymentTransaction(
        paymentTransactionId
      )

    res.status(StatusCodes.OK).json(result)
  } catch (err) {
    next(err)
  }
}

export const paymentTransactionsController = {
  getPaymentTransactionList,
  getPaymentTransaction,
  updatePaymentTransaction,
  deletePaymentTransaction
}
