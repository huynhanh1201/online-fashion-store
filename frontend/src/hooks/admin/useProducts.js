// import { useState } from 'react'
// import { getProducts, getProductById } from '~/services/admin/productService'
//
// const useProducts = (initialPage = 1) => {
//   const [products, setProducts] = useState([])
//   const [totalPages, setTotalPages] = useState(1)
//   const [loading, setLoading] = useState(false)
//
//   const fetchProducts = async (page = initialPage, limit) => {
//     setLoading(true)
//     const { products, totalPages } = await getProducts(page, limit) // chắc chắn có total trong response
//     setProducts(products)
//     setTotalPages(totalPages) // tính tổng số trang
//     setLoading(false)
//   }
//   const fetchProductById = async (productId) => {
//     setLoading(true)
//     const product = await getProductById(productId)
//     setLoading(false)
//     return product
//   }
//   // useEffect(() => {
//   //   fetchProducts(initialPage) // gọi khi hook được render lần đầu
//   //   console.log('số trang', initialPage)
//   // }, [initialPage])
//
//   return { products, totalPages, fetchProducts, loading, fetchProductById }
// }
//
// export default useProducts

import { useState } from 'react'
import {
  getProducts,
  getProductById,
  addProduct,
  deleteProduct,
  updateProduct
} from '~/services/admin/productService'

const useProducts = () => {
  const [products, setProducts] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchProducts = async (page = 1, limit = 10, params = {}) => {
    setLoading(true)
    const buildQuery = (input) => {
      const query = { page, limit, ...input }
      Object.keys(query).forEach((key) => {
        if (
          query[key] === '' ||
          query[key] === undefined ||
          query[key] === null
        ) {
          delete query[key]
        }
      })
      return query
    }
    try {
      const query = buildQuery(params)
      const { products, totalPages, total } = await getProducts(query)
      setProducts(products || [])
      setTotalPages(totalPages || 1)
      setTotal(total || 0)
    } catch (error) {
      console.error('Lỗi khi fetch sản phẩm:', error)
      setProducts([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  const fetchProductById = async (productId) => {
    setLoading(true)
    try {
      return await getProductById(productId)
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm theo ID:', error)
      return null
    } finally {
      setLoading(false)
    }
  }

  const createNewProduct = async (data) => {
    try {
      const result = await addProduct(data)
      setProducts((prev) => {
        const newProducts = [result, ...prev]
        return newProducts.slice(0, 10) // ✅ Giới hạn danh sách còn 10 item
      })
      setTotal((prev) => prev + 1)
      return result
    } catch (error) {
      console.error('Lỗi khi tạo sản phẩm mới:', error)
      return null
    }
  }
  const deleteProductById = async (productId) => {
    try {
      await deleteProduct(productId)
      setProducts((prev) => prev.filter((p) => p._id !== productId))
      setTotal((prev) => prev - 1)
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error)
    }
  }
  const updateProductById = async (productId, data) => {
    try {
      const updatedProduct = await updateProduct(productId, data)
      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? updatedProduct : p))
      )
      return updatedProduct
    } catch (error) {
      console.error('Lỗi khi cập nhật sản phẩm:', error)
      return null
    }
  }

  const Save = (data) => {
    setProducts((prev) => prev.map((d) => (d._id === data._id ? data : d)))
  }

  return {
    total,
    products,
    totalPages,
    fetchProducts,
    loading,
    fetchProductById,
    createNewProduct,
    Save,
    deleteProductById,
    updateProductById
  }
}

export default useProducts
