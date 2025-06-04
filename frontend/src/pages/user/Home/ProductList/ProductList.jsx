import React, { useState, useEffect } from 'react'
import ProductCard from '~/components/ProductCards/ProductCards'
import { getProducts } from '~/services/productService'
import '~/assets/HomeCSS/Content.css'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const { products } = await getProducts(1, 20)
        setProducts(products)
      } catch (err) {
        setError('Không thể tải danh sách sản phẩm.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <main className='content-container'>
      {loading ? (
        <p>Đang tải sản phẩm...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <section className='product-grid'>
          {products.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </section>
      )}
    </main>
  )
}
