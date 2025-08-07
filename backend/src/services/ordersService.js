import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'

import ApiError from '~/utils/ApiError'
import { OrderModel } from '~/models/OrderModel'
import { OrderStatusHistoryModel } from '~/models/OrderStatusHistoryModel'
import { UserModel } from '~/models/UserModel'
import validatePagination from '~/utils/validatePagination'
import getDateRange from '~/utils/getDateRange'
import { orderHelpers } from '~/helpers/orderHelpers'
import { PaymentSessionDraftModel } from '~/models/PaymentSessionDraftModel'
import { deliveriesService } from '~/services/deliveriesService'
import { warehouseSlipsService } from '~/services/warehouseSlipsService'
import { OrderItemModel } from '~/models/OrderItemModel'
import { WarehouseModel } from '~/models/WarehouseModel'
import {PaymentTransactionModel} from "~/models/PaymentTransactionModel";

const createOrder = async (userId, reqBody, ipAddr, jwtDecoded) => {
  // eslint-disable-next-line no-useless-catch

  // Bắt đầu phiên làm việc với Mongoose Transactions
  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const { cartItems, shippingAddressId, total, couponCode, paymentMethod } =
      reqBody

    // Kiểm tra tồn kho có đủ không
    await orderHelpers.checkInventorySufficient(cartItems, session)

    // Lấy các variantIds từ cartItems
    const variantIds = orderHelpers.getVariantIdsFromCartItems(cartItems)

    // Lấy các variants từ cartItems
    const variants = await orderHelpers.getVariantsFromCartItems(
      cartItems,
      variantIds
    )

    // Kiểm tra địa ch giao hàng
    const address = await orderHelpers.checkShippingAddress(
      userId,
      shippingAddressId,
      session
    )

    // Tạo dữ liệu variantMap
    const variantMap = new Map(variants.map((p) => [p._id.toString(), p]))

    // Tính tổng tiền từ giỏ hàng
    const calculatedSubtotal = orderHelpers.calculatedSubtotal(
      cartItems,
      variantMap
    )
    // Kiểm tra tổng giá tri của đơn hàng FE gửi lên có đúng không
    await orderHelpers.validateOrderTotal(calculatedSubtotal, total)

    // Xác thực mã giảm giá
    const validatedCoupon = await orderHelpers.applyCouponToCart(
      userId,
      couponCode,
      calculatedSubtotal,
      session
    )

    const discountAmount = validatedCoupon?.discountAmount || 0

    // Tạo order trong hệ thống
    const order = await orderHelpers.handleCreateOrder(
      userId,
      reqBody,
      address,
      discountAmount,
      calculatedSubtotal,
      session
    )

    // Tạo OrderItems
    const orderItemsPromise = orderHelpers.handleCreateOrderItems(
      cartItems,
      variantMap,
      order,
      session
    )

    if (paymentMethod === 'COD') {
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
        session
      )
      // Xóa sản phẩm trong giỏ hàng
      const cartItemPromise = orderHelpers.handleDeleteCartItems(
        userId,
        variantIds,
        session
      )

      // Tạo đơn hàng vận chuyển (GHN)
      const createDeliveryOrderPromise = deliveriesService.createDeliveryOrder(
        reqBody,
        cartItems,
        order,
        address,
        variantMap
      )

      // Xử lý tất cả promise song song
      const [
        warehouseSlip,
        orderItems,
        transaction,
        cartItemsUpdated,
        createDeliveryOrder
      ] = await Promise.all([
        warehouseSlipPromise,
        orderItemsPromise,
        transactionPromise,
        cartItemPromise,
        createDeliveryOrderPromise
      ])

      // Cập nhật mã ghnOrderCode
      await OrderModel.findOneAndUpdate(
        { _id: order._id },
        {
          ghnOrderCode: createDeliveryOrder?.data?.data?.order_code
        },
        {
          new: true,
          session: session
        }
      )
    } else {
      await PaymentSessionDraftModel.create(
        [
          {
            orderId: order._id.toString(),
            cartItems,
            variantMap,
            order,
            reqBody,
            userId,
            variantIds,
            address,
            jwtDecoded
          }
        ],
        { session }
      )
    }

    // Commit transaction
    await session.commitTransaction()

    // Xử lý thanh toán VNPAY
    const paymentUrl = orderHelpers.handlePaymentByVnpay(reqBody, order, ipAddr)

    return paymentUrl || order
  } catch (err) {
    await session.abortTransaction()
    throw err
  } finally {
    session.endSession()
  }
}

const getOrderList = async (queryString) => {
  // eslint-disable-next-line no-useless-catch
  try {
    let {
      page = 1,
      limit = 10,
      userId,
      sort,
      filterTypeDate,
      startDate,
      endDate,
      status,
      paymentMethod,
      paymentStatus
    } = queryString

    // Kiểm tra dữ liệu đầu vào của limit và page
    validatePagination(page, limit)

    // Xử lý thông tin Filter
    const filter = {}

    if (userId) filter.userId = userId

    if (status) filter.status = status

    if (paymentMethod) filter.paymentMethod = paymentMethod

    if (paymentStatus) filter.paymentStatus = paymentStatus

    const dateRange = getDateRange(filterTypeDate, startDate, endDate)

    if (dateRange.startDate && dateRange.endDate) {
      filter['createdAt'] = {
        $gte: new Date(dateRange.startDate),
        $lte: new Date(dateRange.endDate)
      }
    }

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 }
    }

    let sortField = {}

    if (sort) {
      sortField = sortMap[sort]
    }

    const [orders, total] = await Promise.all([
      OrderModel.find(filter)
        .sort(sortField)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('userId couponId')
        .lean(),

      OrderModel.countDocuments(filter)
    ])

    const result = {
      data: orders,
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

const getOrder = async (orderId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const result = await OrderModel.findById(orderId)
      .populate({
        path: 'userId couponId',
        select: '-password -role -destroy -isActive -verifyToken'
      })
      .lean()

    return result
  } catch (err) {
    throw err
  }
}

const updateOrder = async (jwtDecoded, orderId, reqBody) => {
  // eslint-disable-next-line no-useless-catch
  const session = await mongoose.startSession()
  try {
    // Bắt đầu Transactions
    session.startTransaction()

    const existingOrder = await OrderModel.findById(orderId)
      .session(session)
      .select('status')
      .lean()

    const infoUpdate = {
      ...reqBody
    }

    if(reqBody.status === 'Delivered'){
      infoUpdate.isDelivered = true
      infoUpdate.paymentStatus = 'Completed'

      await PaymentTransactionModel.findOneAndUpdate({orderId},{
        status: "Completed"
      })
    }

    const updatedOrder = await OrderModel.findOneAndUpdate(
      { _id: orderId },
      infoUpdate,
      {
        new: true,
        runValidators: true
      }
    )
      .session(session)
      .populate({
        path: 'userId',
        select: 'name'
      })

    const newStatus = reqBody.status

    if (newStatus && newStatus !== existingOrder.status) {
      const user = await UserModel.findById(jwtDecoded._id)

      if (!user)
        throw new ApiError(StatusCodes.NOT_FOUND, 'Người dùng không tồn tại')

      // status đã đổi, tạo history
      await OrderStatusHistoryModel.create(
        [
          {
            orderId: orderId,
            status: newStatus,
            note: reqBody.note || null,
            updatedBy: { name: user.name, role: user.role },
            updatedAt: new Date()
          }
        ],
        { session }
      )

      // Trả hàng lại kho
      if (['Cancelled', 'Failed'].includes(newStatus)) {
        const warehouse = await WarehouseModel.find({}).session(session)

        const orderItems = await OrderItemModel.find({
          orderId: orderId
        }).session(session)

        const itemsRollback = orderItems.map((item) => ({
          variantId: item.variantId.toString(),
          quantity: item.quantity,
          unit: 'cái'
        }))

        const warehouseId = warehouse[0]._id

        const dataCreateWarehouseSlipImport = {
          type: 'import',
          date: new Date(),
          partnerId: updatedOrder.userId,
          warehouseId: warehouseId,
          items: itemsRollback,
          note: 'Nhập trả về do đơn hàng bị hủy hoặc thất bại.'
        }

        await warehouseSlipsService.importStockWarehouseSlip(
          dataCreateWarehouseSlipImport,
          jwtDecoded,
          session
        )
      }

      // Commit transaction
      await session.commitTransaction()

      return updatedOrder
    }

    // Commit transaction
    await session.commitTransaction()
  } catch (err) {
    await session.abortTransaction()
    throw err
  } finally {
    session.endSession()
  }
}

const deleteOrder = async (orderId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const orderUpdated = await OrderModel.updateOne(
      {
        _id: orderId
      },
      {
        $set: { status: 'Cancelled' }
      },
      {
        new: true
      }
    )

    if (!orderUpdated) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Đơn hàng không tồn tại.')
    }

    return orderUpdated
  } catch (err) {
    throw err
  }
}

export const ordersService = {
  createOrder,
  getOrderList,
  getOrder,
  updateOrder,
  deleteOrder
}
