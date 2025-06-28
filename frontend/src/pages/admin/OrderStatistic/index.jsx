import React, { useEffect } from 'react'
import OrderStatistic from './OrderStatistic.jsx'
import useInventoryStatistics from '~/hooks/admin/useStatistic.js'
const orderStatistics = {
  totalOrders: 150,
  totalDiscountAmount: 750000,
  totalShippingFee: 300000,
  totalCoupons: 60,
  usedCoupons: 40,
  expiredCoupons: 15,
  fullyUsedCoupons: 5,
  monthlyOrderCounts: {
    January: 12,
    February: 10,
    March: 15,
    April: 20,
    May: 18,
    June: 22,
    July: 25,
    August: 30,
    September: 28,
    October: 35,
    November: 40,
    December: 45
  },
  paymentMethodCounts: {
    COD: 50,
    VNPay: 40
  },
  orderStatusCounts: {
    Processing: 25,
    Shipped: 20,
    Shipping: 15,
    Delivered: 60,
    Cancelled: 20,
    Failed: 10
  }
}

function OrderDashboard() {
  const { statistics, fetchOrdersStatistics } = useInventoryStatistics()
  useEffect(() => {
    fetchOrdersStatistics()
  }, [])
  return <OrderStatistic stats={statistics} />
}

export default OrderDashboard
