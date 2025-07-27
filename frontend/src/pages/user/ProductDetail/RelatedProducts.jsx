// import React, { useEffect, useState } from 'react'
// import ProductCard from '~/components/ProductCards/ProductCards'
// import { getProductsByCategory, getProducts } from '~/services/productService'
// import '~/assets/HomeCSS/Content.css'
//
// export default function RelatedProducts({ currentProductId, categoryId }) {
//   const [relatedProducts, setRelatedProducts] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//
//   // useEffect(() => {
//   //   console.log('currentProductId:', currentProductId)
//   //   console.log('categoryId:', categoryId)
//   //   const fetchRelated = async () => {
//   //     setLoading(true)
//   //     try {
//   //       const { products } = await getProductsByCategory(categoryId, 1, 4)
//   //       let filtered = products.filter((p) => p._id !== currentProductId)
//   //       console.log('RelatedProducts - filtered:', filtered)
//   //       if (filtered.length === 0) {
//   //         const { products: allProducts } = await getProducts({
//   //           page: 1,
//   //           limit: 4
//   //         })
//   //         filtered = allProducts.filter((p) => p._id !== currentProductId)
//   //         console.log('RelatedProducts - filtered (no category):', filtered)
//   //       }
//   //
//   //       setRelatedProducts(filtered)
//   //     } catch (err) {
//   //       setError('Không thể tải sản phẩm gợi ý.')
//   //       console.error(err)
//   //     } finally {
//   //       setLoading(false)
//   //     }
//   //   }
//   //   if (categoryId && currentProductId) {
//   //     fetchRelated()
//   //   }
//   // }, [categoryId, currentProductId])
//   useEffect(() => {
//     console.log('currentProductId:', currentProductId)
//     console.log('categoryId:', categoryId)
//
//     const fetchRelated = async () => {
//       setLoading(true)
//       try {
//         let finalRelated = []
//
//         // B1: Lấy sản phẩm cùng danh mục
//         const { products: categoryProducts } = await getProductsByCategory(
//           categoryId,
//           1,
//           10
//         )
//         let relatedFromCategory = categoryProducts.filter(
//           (p) => p._id !== currentProductId
//         )
//
//         finalRelated = [...relatedFromCategory]
//
//         // B2: Nếu chưa đủ 4, gọi thêm từ tất cả sản phẩm
//         if (finalRelated.length < 4) {
//           const { products: allProducts } = await getProducts({
//             page: 1,
//             limit: 20
//           })
//           const moreProducts = allProducts.filter(
//             (p) =>
//               p._id !== currentProductId &&
//               !finalRelated.some((r) => r._id === p._id)
//           )
//           finalRelated = [
//             ...finalRelated,
//             ...moreProducts.slice(0, 4 - finalRelated.length)
//           ]
//         }
//
//         setRelatedProducts(finalRelated.slice(0, 4)) // đảm bảo không quá 4
//       } catch (err) {
//         setError('Không thể tải sản phẩm gợi ý.')
//         console.error(err)
//       } finally {
//         setLoading(false)
//       }
//     }
//
//     if (currentProductId) {
//       fetchRelated()
//     }
//   }, [categoryId, currentProductId])
//
//   return (
//     <div className='related-products-container'>
//       <h2 style={{ fontWeight: 'bold', marginBottom: '15px' }}>
//         Sản phẩm cùng loại
//       </h2>
//       {loading ? (
//         <p>Đang tải...</p>
//       ) : error ? (
//         <p>{error}</p>
//       ) : relatedProducts.length > 0 ? (
//         <section className='product-grid productDetail-grid'>
//           {relatedProducts.map((product) => (
//             <ProductCard key={product._id} product={product} />
//           ))}
//         </section>
//       ) : (
//         <p style={{ color: 'red', marginBottom: '15px' }}>
//           Không có sản phẩm gợi ý.
//         </p>
//       )}
//     </div>
//   )
// }

import { useEffect, useState } from 'react'
import { Button } from '@mui/material'
import ProductCard from '~/components/ProductCards/ProductCards'
import { getProducts, getProductsByCategory } from '~/services/productService'
import { Link } from 'react-router-dom'

const RelatedProductSection = ({ categoryId, currentProductId }) => {
  const [relatedProducts, setRelatedProducts] = useState([])
  const [visibleCount, setVisibleCount] = useState(12)
  const [categoryPage, setCategoryPage] = useState(1)
  const [fallbackPage, setFallbackPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const fetchMoreProducts = async (count) => {
    setLoading(true)
    try {
      let combined = [...relatedProducts]
      let tempCategoryPage = categoryPage
      let tempFallbackPage = fallbackPage
      let foundNew = false

      // Ưu tiên lấy từ danh mục
      while (combined.length < visibleCount + count) {
        const { products: categoryProducts } = await getProductsByCategory(
          categoryId,
          tempCategoryPage,
          count
        )

        const filtered = categoryProducts.filter(
          (p) =>
            p._id !== currentProductId &&
            !combined.some((item) => item._id === p._id)
        )

        if (filtered.length === 0) break

        if (filtered.length > 0) foundNew = true

        combined = [...combined, ...filtered]
        tempCategoryPage++
        if (filtered.length < count) break
      }

      // Nếu chưa đủ, lấy tiếp từ tất cả
      if (combined.length < visibleCount + count) {
        while (combined.length < visibleCount + count) {
          const { products: fallbackProducts } = await getProducts({
            page: tempFallbackPage,
            limit: count
          })

          const filteredFallback = fallbackProducts.filter(
            (p) =>
              p._id !== currentProductId &&
              !combined.some((item) => item._id === p._id)
          )

          if (filteredFallback.length === 0) break

          if (filteredFallback.length > 0) foundNew = true

          combined = [...combined, ...filteredFallback]
          tempFallbackPage++
          if (filteredFallback.length < count) break
        }
      }

      setCategoryPage(tempCategoryPage)
      setFallbackPage(tempFallbackPage)
      setRelatedProducts(combined)

      // ✅ cập nhật hasMore dựa trên thực tế
      setHasMore(foundNew && combined.length > relatedProducts.length)
    } catch (err) {
      console.error('Lỗi khi tải sản phẩm gợi ý:', err)
    } finally {
      setLoading(false)
    }
  }

  // Ban đầu: tải 4 sản phẩm
  useEffect(() => {
    if (categoryId && currentProductId) {
      setRelatedProducts([])
      setVisibleCount(12)
      setCategoryPage(1)
      setFallbackPage(1)
      fetchMoreProducts(12)
    }
  }, [categoryId, currentProductId])

  const handleLoadMore = () => {
    const nextCount = 8
    setVisibleCount((prev) => prev + nextCount)
    fetchMoreProducts(nextCount)
  }

  return (
    <>
      <div className='related-products-container'>
        <h2 style={{ fontWeight: 'bold', marginBottom: '15px' }}>
          Sản phẩm tương tự
        </h2>
        <section className='product-grid productDetail-grid'>
          {relatedProducts.slice(0, visibleCount).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </section>
        {hasMore && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Button
              variant='outlined'
              onClick={handleLoadMore}
              disabled={loading}
              sx={{
                border: 1,
                borderColor: 'grey.800',
                color: 'grey.800',
                bgcolor: 'transparent',
                px: { xs: 2.5, sm: 3.5 },
                py: { xs: 1, sm: 1.25 },
                borderRadius: '50px',
                typography: 'body2',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: 500,
                '&:hover': {
                  bgcolor: 'grey.800',
                  color: 'common.white',
                  transform: 'translateY(-1px)',
                  boxShadow: (theme) => theme.shadows[4]
                }
              }}
            >
              {loading ? 'Đang tải...' : 'Xem thêm'}
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

export default RelatedProductSection
