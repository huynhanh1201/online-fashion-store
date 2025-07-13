import React, { useEffect, useState } from 'react'
import ProductCard from '~/components/ProductCards/ProductCards'
import { getProducts } from '~/services/productService'
import '~/assets/HomeCSS/Content.css'

export default function SuggestionProducts({ limit = 5 }) {
  const [suggestedProducts, setSuggestedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSuggestions = async () => {
      setLoading(true)
      try {
        const { products } = await getProducts({ page: 1, limit: 100 })
        // Lấy ngẫu nhiên limit sản phẩm
        const shuffled = products.sort(() => 0.5 - Math.random())
        setSuggestedProducts(shuffled.slice(0, limit))
      } catch (err) {
        setError('Không thể tải sản phẩm gợi ý.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchSuggestions()
  }, [limit])

  return (
    <div className='related-products-container'>
      <h2 style={{ fontWeight: 'bold', marginBottom: '15px' }}>Có thể bạn sẽ thích</h2>
      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p>{error}</p>
      ) : suggestedProducts.length > 0 ? (
        <section className='product-grid'>
          {suggestedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </section>
      ) : (
        <p>Không có sản phẩm gợi ý.</p>
      )}
    </div>
  )
}
