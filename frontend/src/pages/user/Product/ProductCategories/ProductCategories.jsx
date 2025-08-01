import React, { useState, useEffect } from 'react'
import { Box, Grid, Typography, Skeleton, CircularProgress } from '@mui/material'
import { Link } from 'react-router-dom'
import { getCategories } from '~/services/admin/categoryService.js'
import { optimizeCloudinaryUrl } from '~/utils/cloudinary.js'

const ProductCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await getCategories({})
      const categoryData = response.categories || []

      // Filter out categories that are marked as destroyed (hidden)
      const activeCategories = categoryData.filter(category => category.destroy === false && (!category.parent || category.parent === null))

      setCategories(activeCategories)
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError('Không thể tải danh mục sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  // Don't render anything if loading
  if (loading) {
    return (
      <Box
        sx={{ padding: '5px', borderRadius: '20px', margin: '30px', gap: '50px' }}
      >
        <Grid
          container
          direction='row'
          justifyContent={{ xs: 'center', md: 'flex-start' }}
          alignItems='center'
          sx={{
            marginTop: '50px',
            gap: { xs: '20px', sm: '40px', md: '60px', lg: '100px' },
            flexWrap: 'wrap'
          }}
        >
          {[1, 2, 3].map((index) => (
            <Box key={index} sx={{ textAlign: 'center' }}>
              <Skeleton
                variant="circular"
                width={100}
                height={100}
                sx={{ mb: 1 }}
              />
              <Skeleton variant="text" width={80} height={24} />
            </Box>
          ))}
        </Grid>
      </Box>
    )
  }

  // Don't render anything if no categories or error
  if (categories.length === 0) {
    return null
  }

  return (
    <Box
      sx={{ padding: '5px', borderRadius: '20px', margin: '10px', gap: '30px' }}
    >
      <Grid
        container
        direction='row'
        justifyContent={{ xs: 'center', md: 'flex-start' }}
        alignItems='center'
        sx={{
          marginTop: '2px',
          gap: { xs: '20px', sm: '30px', md: '40px', lg: '50px' },
          flexWrap: 'wrap'
        }}
      >
        {categories.map((category, index) => (
          <Box
            component={Link}
            to={category.link || `/productbycategory/${category._id}`}
            key={category._id}
            sx={{
              textAlign: 'center',
              textDecoration: 'none',
              color: 'inherit',
              display: 'inline-block',
              '&:hover img': { transform: 'translateY(-8px)' }
            }}
          >
            <Box
              component='img'
              src={
                category.image
                  ? optimizeCloudinaryUrl(category.image, { width: 100, height: 100 })
                  : 'https://www.rcuw.org/wp-content/themes/champion/images/SM-placeholder.png'
              }
              alt={`Nhóm ${category.name}`}
              sx={{
                width: 100,
                height: 100,
                objectFit: 'cover',
                borderRadius: '50%',
                transition: 'transform 0.3s ease'
              }}
            />
            <Typography
              variant='h6'
              mt={1}
            >{`Nhóm ${category.name}`}</Typography>
          </Box>
        ))}
      </Grid>
    </Box>
  )
}

export default ProductCategories
