import React, { useState, useEffect } from 'react'
import HeaderCategories from './HeaderCategories'
import ProductSection from './ProductSection'
import CollectionBanner from './CollectionBanner'
import ComboSection from './ComboSection'
import { getCategories } from '~/services/categoryService'
import { getProductsByCategory } from '~/services/productService'

const ProductContent = () => {
  const [categories, setCategories] = useState([])
  const [activeCategoryId, setActiveCategoryId] = useState(null)
  const [products, setProducts] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [errorCategories, setErrorCategories] = useState(null)
  const [errorProducts, setErrorProducts] = useState(null)

  // Load danh mục khi component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true)
        setErrorCategories(null)

        const response = await getCategories(1, 1000)
        const fetchedCategories = response.categories?.data || []

        if (!Array.isArray(fetchedCategories) || fetchedCategories.length === 0) {
          throw new Error('Không có danh mục nào được tải')
        }

        setCategories(fetchedCategories)
        // Set active category to first category if none is selected
        if (!activeCategoryId) {
          setActiveCategoryId(fetchedCategories[0]._id)
        }
      } catch (err) {
        console.error('Error fetching categories:', err)
        setErrorCategories(err.message || 'Lỗi khi tải danh mục')
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  // Load sản phẩm khi activeCategoryId thay đổi
  useEffect(() => {
    if (!activeCategoryId) return

    const fetchProducts = async () => {
      try {
        setLoadingProducts(true)
        setErrorProducts(null)
        
        const response = await getProductsByCategory(activeCategoryId, 1, 20)
        console.log('Products response:', response)

        if (response && response.products) {
          setProducts(response.products)
        } else {
          setProducts([])
          console.warn('No products found for category:', activeCategoryId)
        }
      } catch (err) {
        console.error('Error fetching products:', err)
        setErrorProducts(err.message || 'Lỗi khi tải sản phẩm')
        setProducts([])
      } finally {
        setLoadingProducts(false)
      }
    }

    fetchProducts()
  }, [activeCategoryId])

  // Handler cho việc thay đổi category
  const handleCategoryChange = (categoryId) => {
    console.log('Category changed to:', categoryId)
    setActiveCategoryId(categoryId)
  }

  if (loadingCategories) {
    return <div>Đang tải danh mục...</div>
  }

  if (errorCategories) {
    return <div style={{ color: 'red' }}>{errorCategories}</div>
  }

  const activeCategory = categories.find((c) => c._id === activeCategoryId) || {}

  return (
    <div className='container' style={{ maxWidth: '1780px', margin: '0 auto' }}>
      <HeaderCategories
        categories={categories}
        activeCategoryId={activeCategoryId}
        onCategoryChange={handleCategoryChange}
      />

      <ProductSection
        bannerImg={activeCategory.bannerImg || activeCategory.image || ''}
        bannerTitle={activeCategory.name || ''}
        bannerDesc={activeCategory.description || 'Bộ sưu tập hot'}
        products={products}
        loading={loadingProducts}
        error={errorProducts}
      />

      <CollectionBanner />
      <ComboSection />
    </div>
  )
}

export default ProductContent
