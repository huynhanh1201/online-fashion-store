export const setupProductsSocket = async (socket, db) => {
  const count = await db.collection('products').countDocuments()
  socket.emit('products:count', { count })

  const products = await db.collection('products').find().toArray()
  socket.emit('products:initial', products)
}
