import { ProductModel } from '~/models/ProductModel'

const getCountProduct = async () => {
  const result = await ProductModel.countDocuments()

  return result
}

// ⬇️ Hàm emit dữ liệu ban đầu cho client mới kết nối
const emitInitialProductData = async (socket) => {
  try {
    const count = await getCountProduct()
    socket.emit('products:update', {
      operationType: 'initial',
      data: { count }
    })
  } catch (err) {
    console.error('Emit initial product data error:', err)
  }
}

export const productHandler = {
  getCountProduct,
  emitInitialProductData
}
