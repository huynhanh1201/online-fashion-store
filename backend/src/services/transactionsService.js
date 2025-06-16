import { verifyChecksum } from '~/utils/vnpay'
import { PaymentTransactionModel } from '~/models/PaymentTransactionModel'
import { OrderModel } from '~/models/OrderModel'
import { env } from '~/config/environment'

// Thanh toán VNPAY
const vnpayIPN = async (req) => {
  try {
    const vnp_Params = { ...req.query }
    const isValid = verifyChecksum(vnp_Params)

    if (!isValid) {
      return { RspCode: '97', Message: 'Sai checksum' }
    }

    const orderId = vnp_Params['vnp_TxnRef']
    const rspCode = vnp_Params['vnp_ResponseCode']
    const transactionNo = vnp_Params['vnp_TransactionNo']
    const bankCode = vnp_Params['vnp_BankCode']

    const transaction = await PaymentTransactionModel.findOne({ orderId })
    if (!transaction) {
      return { RspCode: '01', Message: 'Không tìm thấy đơn hàng' }
    }

    const updateData = {
      transactionId: transactionNo,
      paidAt: new Date(),
      note: `Bank: ${bankCode}`
    }

    if (rspCode === '00') {
      updateData.status = 'Completed'
      await PaymentTransactionModel.updateOne({ orderId }, updateData)

      await OrderModel.updateOne(
        { _id: orderId },
        { paymentStatus: 'Completed' }
      )

      console.log('VNPay IPN - Giao dịch thành công')

      return { RspCode: '00', Message: 'Giao dịch thành công' }
    } else {
      updateData.status = 'Failed'
      await PaymentTransactionModel.updateOne({ orderId }, updateData)
      return { RspCode: '01', Message: 'Giao dịch thất bại' }
    }
  } catch (err) {
    return { RspCode: '99', Message: 'Lỗi hệ thống' }
  }
}

const vnpayReturn = async (req) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const vnp_Params = { ...req.query }
    const isValid = verifyChecksum(vnp_Params)

    if (isValid) {
      const rspCode = vnp_Params['vnp_ResponseCode']
      const txnRef = vnp_Params['vnp_TxnRef']

      if (rspCode === '00') {
        const amount = vnp_Params['vnp_Amount']
        const transactionNo = vnp_Params['vnp_TransactionNo']
        const payDate = vnp_Params['vnp_PayDate']
        const bankCode = vnp_Params['vnp_BankCode']

        const query = new URLSearchParams({
          txnRef,
          amount,
          rspCode,
          transactionNo,
          payDate,
          bankCode
        }).toString()

        // Kiểm tra thêm trạng thái đơn hàng nếu cần
        // const Order = require('../models/Order');
        // const order = await Order.findById(vnp_Params['vnp_TxnRef']);
        // if (order.status === 'success' && rspCode === '00') { ... }

        // Trả về URL thanh toán thành công
        return `${env.FE_BASE_URL}/payment-result?${query}`
      }

      const failQuery = new URLSearchParams({
        code: rspCode,
        txnRef: txnRef
      }).toString()

      // Trả về URL thanh toán thất bại
      return `${env.FE_BASE_URL}/payment-failed?${failQuery}`
    }

    // Trả về URL thanh toán thất bại
    return `${env.FE_BASE_URL}/payment-failed?code=97`
  } catch (err) {
    throw err
  }
}

export const transactionsService = {
  vnpayIPN,
  vnpayReturn
}
