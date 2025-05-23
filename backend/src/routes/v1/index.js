import express from 'express'
import { StatusCodes } from 'http-status-codes'

import { authMiddleware } from '~/middlewares/authMiddleware'

// Router
import { authRoute } from '~/routes/v1/authRoute'
import { usersRoute } from '~/routes/v1/usersRoute'
import { categoriesRoute } from '~/routes/v1/categoriesRoute'
import { productsRoute } from '~/routes/v1/productsRoute'
import { cartsRoute } from '~/routes/v1/cartsRoute'
import { couponsRoute } from '~/routes/v1/couponsRoute'
import { ordersRoute } from '~/routes/v1/ordersRoute'
import { orderItemsRoute } from '~/routes/v1/orderItemsRoute'
import { shippingAddressesRoute } from '~/routes/v1/shippingAddressesRoute'
import { orderStatusHistoriesRoute } from '~/routes/v1/orderStatusHistoriesRoute'
import { paymentTransactionsRoute } from '~/routes/v1/paymentTransactionsRoute'
import { colorPalettesRoute } from '~/routes/v1/colorPalettesRoute'
import { colorsRoute } from '~/routes/v1/colorsRoute'

const Router = express.Router()

Router.route('/status').get(authMiddleware.isAuthorized, (req, res) => {
  res.status(StatusCodes.OK).json({
    message: 'APIs V1 đã sẵn sàng để sử dụng'
  })
})

Router.use('/auth', authRoute)

Router.use('/users', usersRoute)

Router.use('/categories', categoriesRoute)

Router.use('/products', productsRoute)

Router.use('/carts', cartsRoute)

Router.use('/coupons', couponsRoute)

Router.use('/order-items', orderItemsRoute)

Router.use('/shipping-addresses', shippingAddressesRoute)

Router.use('/orders', ordersRoute)

Router.use('/order-status-histories', orderStatusHistoriesRoute)

Router.use('/payment-transactions', paymentTransactionsRoute)

Router.use('/color-palettes', colorPalettesRoute)

Router.use('/colors', colorsRoute)

export const APIs_V1 = Router
