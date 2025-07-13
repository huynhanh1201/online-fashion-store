import { useState } from 'react'
import { getProducts, getProductById } from '~/services/productService'

const useProducts = (initialPage = 1, limit = 1000) => {
  const [products, setProducts] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const fetchProducts = async (page = initialPage) => {
    setLoading(true)
    const { products, total } = await getProducts(page, limit) // chắc chắn có total trong response
    setProducts(products)
    setTotalPages(Math.max(1, Math.ceil(total / limit))) // tính tổng số trang
    setLoading(false)
  }
  const fetchProductById = async (productId) => {
    setLoading(true)
    const product = await getProductById(productId)
    setLoading(false)
    return product
  }
  const fetchProductsByCategory = async (categoryName) => {
    try {
      setLoading(true)
      setError(null)

      const response = await getProducts(1, limit, { category: categoryName }) // tuỳ vào API backend
      setProducts(response.products)
      setTotalPages(Math.max(1, Math.ceil(response.total / limit)))
    } catch (err) {
      setError('Không thể tải sản phẩm theo danh mục: ' + err.message)
    } finally {
      setLoading(false)
    }
  }
  // useEffect(() => {
  //   fetchProducts(initialPage) // gọi khi hook được render lần đầu
  //   console.log('số trang', initialPage)
  // }, [initialPage])

  return {
    products,
    totalPages,
    fetchProducts,
    loading,
    fetchProductById,
    fetchProductsByCategory
  }
}

export default useProducts
