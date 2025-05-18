import { useState } from 'react'
import { getProducts, getProductById } from '~/services/productService'

const useProducts = (initialPage = 1, limit = 10) => {
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
  // useEffect(() => {
  //   fetchProducts(initialPage) // gọi khi hook được render lần đầu
  //   console.log('số trang', initialPage)
  // }, [initialPage])

  return { products, totalPages, fetchProducts, loading, fetchProductById }
}

export default useProducts
