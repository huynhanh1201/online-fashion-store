import { ProductModel } from '~/models/ProductModel'

export const setupProductStream = (io) => {
  const stream = ProductModel.watch([], { fullDocument: 'updateLookup' })

  stream.on('change', (change) => {
    const { operationType, fullDocument } = change
    console.log('[Product Change]', change)

    io.emit('products:update', { operationType, data: fullDocument })
  })

  stream.on('error', (err) => {
    console.error('Product stream error:', err)
  })
}
