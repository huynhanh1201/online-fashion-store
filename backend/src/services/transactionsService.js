import { verifyChecksum } from '~/utils/vnpay'
import { OrderModel } from '~/models/OrderModel'
import { env } from '~/config/environment'
import { PaymentSessionDraftModel } from '~/models/PaymentSessionDraftModel'
import { orderHelpers } from '~/helpers/orderHelpers'
import mongoose from 'mongoose'
import { deliveriesService } from '~/services/deliveriesService'

// Thanh toán VNPAY
const vnpayIPN = async (req) => {
  // Bắt đầu phiên làm việc với Mongoose Transactions
  const session = await mongoose.startSession()

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

    const transactionInfo = {
      transactionId: transactionNo,
      paidAt: new Date(),
      note: `Bank: ${bankCode}`
    }

    if (rspCode === '00') {
      console.log('da chay ham vnpayIPN')

      // Bắt đầu transaction
      session.startTransaction()

      transactionInfo.status = 'Completed'

      // Lấy dữ liệu từ lưu trữ tạm thời
      const paymentSessionDraft = await PaymentSessionDraftModel.findOne({
        orderId
      }).lean()

      if (!paymentSessionDraft) {
        await session.abortTransaction()
        return {
          RspCode: '02',
          Message: 'Không tìm thấy dữ liệu thanh toán tạm thời'
        }
      }

      const {
        cartItems,
        variantMap: variantObjMap,
        order,
        reqBody,
        userId,
        variantIds,
        address,
        jwtDecoded
      } = paymentSessionDraft

      // Chuyển đổi variantObjMap thành Map
      const variantMap = new Map(Object.entries(variantObjMap))

      // Cập nhật trạng thái đơn hàng
      const orderPromise = OrderModel.findOneAndUpdate(
        { _id: orderId },
        { status: 'Processing', paymentStatus: 'Completed' }
      ).session(session)

      // Tạo phiếu xuất kho
      const warehouseSlipPromise = orderHelpers.createWarehouseSlipFromOrder(
        jwtDecoded,
        cartItems,
        session,
        'export'
      )

      // Tạo giao dịch thanh toán
      const transactionPromise = orderHelpers.handleCreateTransaction(
        reqBody,
        order,
        transactionInfo,
        session
      )

      // // Tạo OrderItems
      // const orderItemsPromise = orderHelpers.handleCreateOrderItems(
      //   cartItems,
      //   variantMap,
      //   order,
      //   session
      // )

      // Xử lý tất cả promise song song
      const [warehouseSlip, orderData, transaction, orderItems] =
        await Promise.all([
          warehouseSlipPromise,
          orderPromise,
          transactionPromise
          // orderItemsPromise
        ])

      // Tạo đơn hàng vận chuyển (GHN)
      // const createDeliveryOrder = await deliveriesService.createDeliveryOrder(
      //   reqBody,
      //   cartItems,
      //   order,
      //   address,
      //   variantMap
      // )

      // // Cập nhật mã ghnOrderCode
      // await OrderModel.findOneAndUpdate(
      //   { _id: order._id },
      //   {
      //     ghnOrderCode: createDeliveryOrder?.data?.data?.order_code
      //   },
      //   {
      //     new: true,
      //     session: session
      //   }
      // )

      // Xóa sản phẩm trong giỏ hàng
      await orderHelpers.handleDeleteCartItems(userId, variantIds, session)

      // Commit transaction
      await session.commitTransaction()

      // Xóa tất cả dữ liệu từ lưu trữ tạm thời
      await PaymentSessionDraftModel.deleteMany({})

      return { RspCode: '00', Message: 'Giao dịch thành công' }
    } else {
      // Xóa tất cả dữ liệu từ lưu trữ tạm thời
      await PaymentSessionDraftModel.deleteMany({})

      return { RspCode: '01', Message: 'Giao dịch thất bại' }
    }
  } catch (err) {
    await session.abortTransaction()
    return { RspCode: '99', Message: 'Lỗi hệ thống' }
  } finally {
    session.endSession()
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
