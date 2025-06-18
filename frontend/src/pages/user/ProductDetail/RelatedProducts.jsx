import React, { useEffect, useState } from 'react'
import ProductCard from '~/components/ProductCards/ProductCards'
import { getProductsByCategory } from '~/services/productService'
import '~/assets/HomeCSS/Content.css'

export default function RelatedProducts({ currentProductId, categoryId }) {
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log('currentProductId:', currentProductId)
    console.log('categoryId:', categoryId)
    const fetchRelated = async () => {
      setLoading(true)
      try {
        const { products } = await getProductsByCategory(categoryId, 1, 10)
        const filtered = products.filter((p) => p._id !== currentProductId)
        console.log('RelatedProducts - filtered:', filtered)
        setRelatedProducts(filtered)
      } catch (err) {
        setError('Không thể tải sản phẩm gợi ý.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (categoryId && currentProductId) {
      fetchRelated()
    }
  }, [categoryId, currentProductId])
  
  return (
    <div className='related-products-container'>
      <h2 style={{ fontWeight: 'bold', marginBottom: '15px' }}>Sản phẩm cùng loại</h2>
      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p>{error}</p>
      ) : relatedProducts.length > 0 ? (
        <section className='product-grid'>
          {relatedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </section>
      ) : (
        <p>Không có sản phẩm gợi ý.</p>
      )}
    </div>
  )
}
