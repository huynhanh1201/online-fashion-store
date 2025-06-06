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
import { sizePalettesRoute } from '~/routes/v1/sizePalettesRoute'
import { colorsRoute } from '~/routes/v1/colorsRoute'
import { sizesRoute } from '~/routes/v1/sizesRoute'
import { warehousesRoute } from '~/routes/v1/warehousesRoute'
import { variantsRoute } from '~/routes/v1/variantsRoute'
import { inventoriesRoute } from '~/routes/v1/inventoriesRoute'
import { batchesRoute } from '~/routes/v1/batchesRoute'
import { warehouseSlipsRoute } from '~/routes/v1/warehouseSlipsRoute'
import { inventoryLogsRoute } from '~/routes/v1/inventoryLogsRoute'
import { partnersRoute } from '~/routes/v1/partnersRoute'
import { statisticsRoute } from '~/routes/v1/statisticsRoute'

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

Router.use('/size-palettes', sizePalettesRoute)

Router.use('/colors', colorsRoute)

Router.use('/sizes', sizesRoute)

Router.use('/warehouses', warehousesRoute)

Router.use('/variants', variantsRoute)

Router.use('/inventories', inventoriesRoute)

Router.use('/batches', batchesRoute)

Router.use('/warehouse-slips', warehouseSlipsRoute)

Router.use('/inventory-logs', inventoryLogsRoute)

Router.use('/partners', partnersRoute)

Router.use('/statistics', statisticsRoute)

export const APIs_V1 = Router
