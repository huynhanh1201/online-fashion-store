import { ProductModel } from '~/models/ProductModel'
import { productHandler } from '~/sockets/handlers/productsHandler'

export const setupProductStream = (io) => {
  const stream = ProductModel.watch([], { fullDocument: 'updateLookup' })

  stream.on('change', async (change) => {
    const { operationType, fullDocument } = change

    const result = await productHandler.getCountProduct()

    console.log('result: ', result)

    io.emit('products:update', { operationType, data: { count: result } })
  })

  stream.on('error', (err) => {
    console.error('Product stream error:', err)
  })
}
