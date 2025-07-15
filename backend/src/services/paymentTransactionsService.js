import { PaymentTransactionModel } from '~/models/PaymentTransactionModel'
import validatePagination from '~/utils/validatePagination'
import getDateRange from '~/utils/getDateRange'

const getPaymentTransactionList = async (queryString) => {
  // eslint-disable-next-line no-useless-catch
  try {
    let {
      page = 1,
      limit = 10,
      search,
      status,
      sort,
      filterTypeDate,
      startDate,
      endDate,
      statusPayment,
      method
    } = queryString

    // Kiểm tra dữ liệu đầu vào của limit và page
    validatePagination(page, limit)

    // Xử lý thông tin Filter
    const filter = {}

    if (statusPayment) filter.status = statusPayment

    if (method) filter.method = method

    if (status === 'true' || status === 'false') {
      status = JSON.parse(status)

      filter.destroy = status
    }

    if (search) {
      filter.orderCode = { $regex: search, $options: 'i' }
    }

    const dateRange = getDateRange(filterTypeDate, startDate, endDate)

    if (dateRange.startDate && dateRange.endDate) {
      filter['createdAt'] = {
        $gte: new Date(dateRange.startDate),
        $lte: new Date(dateRange.endDate)
      }
    }

    let sortField = {}

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 }
    }

    if (sort) {
      sortField = sortMap[sort]
    }

    const [paymentTransactions, total] = await Promise.all([
      PaymentTransactionModel.find(filter)
        .sort(sortField)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({
          path: 'orderId',
          select: 'code total'
        })
        .lean(),

      PaymentTransactionModel.countDocuments(filter)
    ])

    const result = {
      data: paymentTransactions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }

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
    const paymentTransactionUpdated = await PaymentTransactionModel.updateOne(
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
