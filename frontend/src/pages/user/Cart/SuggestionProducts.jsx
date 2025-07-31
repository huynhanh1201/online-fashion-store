import React, { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
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
    <Box className="related-products-container" sx={{ px: { xs: 1, sm: 2 }, py: 3 }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 'bold',
          mb: 2,
          fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
        }}
      >
        Có thể bạn sẽ thích
      </Typography>
      {loading ? (
        <Typography>Đang tải...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : suggestedProducts.length > 0 ? (
        <Box
          className="product-grid"
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr', // 1 column on mobile
              sm: 'repeat(2, 1fr)', // 2 columns on small screens
              md: 'repeat(3, 1fr)', // 3 columns on medium screens
              lg: 'repeat(5, 1fr)', // 5 columns on large screens
            },
          }}
        >
          {suggestedProducts.map((product) => (
            <Box
              key={product._id}
              sx={{
                minHeight: {
                  xs: '220px', // Smaller height on mobile
                  sm: '260px', // Medium height on small screens
                  md: '300px', // Larger height on medium screens
                },
                maxWidth: '100%',
                overflow: 'hidden',
              }}
            >
              <ProductCard product={product} />
            </Box>
          ))}
        </Box>
      ) : (
        <Typography>Không có sản phẩm gợi ý.</Typography>
      )}
    </Box>
  )
}