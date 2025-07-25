import React, { useState, useEffect } from 'react'
import HeaderCategories from './HeaderCategories'
import ProductSection from './ProductSection'
import { getCategories, getChildCategories } from '~/services/categoryService'
import { getProductsByCategory } from '~/services/productService'
import { useNavigate } from 'react-router-dom'
import { Box } from '@mui/material'

const ProductContent = () => {
  const [categories, setCategories] = useState([])
  const [sectionActiveIds, setSectionActiveIds] = useState([]) // Mỗi section 1 activeCategoryId
  const [sectionProducts, setSectionProducts] = useState([]) // Mỗi section 1 mảng sản phẩm
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState([])
  const [errorCategories, setErrorCategories] = useState(null)
  const [errorProducts, setErrorProducts] = useState([])
  const [categoryHasProducts, setCategoryHasProducts] = useState({}) // Track which categories have products
  const navigate = useNavigate()

  // Chia categories thành các nhóm 3 (sections)
  const categoriesPerSection = 3
  const sections = []
  for (let i = 0; i < categories.length; i += categoriesPerSection) {
    sections.push(categories.slice(i, i + categoriesPerSection))
  }

  // Load danh mục khi component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true)
        setErrorCategories(null)
        const response = await getCategories(1, 1000)
        const fetchedCategories = response.categories?.data || []
        
        // Kiểm tra tất cả danh mục (cả parent=null và parent!=null) xem có sản phẩm không
        const validCategories = []
        for (const cat of fetchedCategories) {
          try {
            const response = await getProductsByCategory(cat._id, 1, 1) // Chỉ lấy 1 sản phẩm để kiểm tra
            if (response && response.products && response.products.length > 0) {
              console.log(`Category ${cat.name} has products`)
              validCategories.push(cat)
            } else {
              console.log(`Category ${cat.name} has no products`)
            }
          } catch (err) {
            console.error(`Error checking products for ${cat.name}:`, err)
          }
        }
        
        console.log('Valid categories (with products):', validCategories)
        setCategories(validCategories)
        
        // Khởi tạo state cho từng section
        const newSections = []
        for (let i = 0; i < validCategories.length; i += categoriesPerSection) {
          const group = validCategories.slice(i, i + categoriesPerSection)
          newSections.push(group)
        }
        console.log('Created sections:', newSections)
        setSectionActiveIds(newSections.map(group => group[0]?._id || null))
        setSectionProducts(newSections.map(() => []))
        setLoadingProducts(newSections.map(() => false))
        setErrorProducts(newSections.map(() => null))
      } catch (err) {
        setErrorCategories(err.message || 'Lỗi khi tải danh mục')
      } finally {
        setLoadingCategories(false)
      }
    }
    fetchCategories()
  }, [])

  // Load sản phẩm cho từng section khi activeCategoryId thay đổi
  useEffect(() => {
    if (!sections.length) return
    sectionActiveIds.forEach((categoryId, idx) => {
      if (!categoryId) return
      setLoadingProducts(prev => {
        const arr = [...prev]
        arr[idx] = true
        return arr
      })
      setErrorProducts(prev => {
        const arr = [...prev]
        arr[idx] = null
        return arr
      })
      
      // Load products for category
      const loadProductsForCategory = async () => {
        try {
          console.log(`Loading products for category: ${categoryId}`)
          
          // Chỉ load sản phẩm từ danh mục hiện tại (đã là danh mục con có sản phẩm)
          const response = await getProductsByCategory(categoryId, 1, 20)
          const products = response && response.products ? response.products : []
          
          console.log(`Found ${products.length} products in category ${categoryId}`)
          
          setSectionProducts(prev => {
            const arr = [...prev]
            arr[idx] = products
            return arr
          })
          
          // Update categoryHasProducts state
          setCategoryHasProducts(prev => ({
            ...prev,
            [categoryId]: products.length > 0
          }))
          
        } catch (err) {
          console.error(`Error in loadProductsForCategory for ${categoryId}:`, err)
          setErrorProducts(prev => {
            const arr = [...prev]
            arr[idx] = err.message || 'Lỗi khi tải sản phẩm'
            return arr
          })
          setSectionProducts(prev => {
            const arr = [...prev]
            arr[idx] = []
            return arr
          })
          setCategoryHasProducts(prev => ({
            ...prev,
            [categoryId]: false
          }))
        } finally {
          setLoadingProducts(prev => {
            const arr = [...prev]
            arr[idx] = false
            return arr
          })
        }
      }
      
      loadProductsForCategory()
    })
    // eslint-disable-next-line
  }, [JSON.stringify(sectionActiveIds), sections.length])

  // Handler đổi tab cho từng section
  const handleCategoryChange = (sectionIdx, categoryId) => {
    setSectionActiveIds(prev => {
      const arr = [...prev]
      arr[sectionIdx] = categoryId
      return arr
    })
  }

  if (loadingCategories) {
    return <div>Đang tải danh mục...</div>
  }
  if (errorCategories) {
    return <div style={{ color: 'red' }}>{errorCategories}</div>
  }

  return (
    <div className='container' style={{ maxWidth: '95vw', margin: '0 auto' }}>
      {sections.map((group, idx) => {
        const activeCategory = group.find(c => c._id === sectionActiveIds[idx]) || group[0] || {}
        const hasProducts = sectionProducts[idx] && sectionProducts[idx].length > 0;
        
        // Tất cả danh mục trong group đều là danh mục con có sản phẩm, nên luôn hiển thị
        return (
          <div key={idx} style={{ marginBottom: 40 }}>
            <HeaderCategories
              categories={group}
              activeCategoryId={sectionActiveIds[idx]}
              onCategoryChange={categoryId => handleCategoryChange(idx, categoryId)}
            />
            <ProductSection
              bannerImg={activeCategory.image || 'https://placehold.co/500x440?text=No+Category+Image'}
              bannerTitle={activeCategory.name || ''}
              bannerDesc={activeCategory.description || ' '}
              products={sectionProducts[idx]}
              loading={loadingProducts[idx]}
              error={errorProducts[idx]}
            />
            {hasProducts && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mt: { xs: 4, sm: 5, md: 6 }
                }}
              >
                <Box
                  component="button"
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
                  onClick={() => navigate(`/productbycategory/${activeCategory._id}`)}
                >
                  Xem tất cả
                </Box>
              </Box>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ProductContent
