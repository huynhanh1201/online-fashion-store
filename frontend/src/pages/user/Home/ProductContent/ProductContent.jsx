import React, { useState, useEffect } from 'react'
import HeaderCategories from './HeaderCategories'
import ProductSection from './ProductSection'
import CollectionBanner from './CollectionBanner'
import ComboSection from './ComboSection'
import { getCategories } from '~/services/categoryService'
import { getProductsByCategory } from '~/services/productService'
import { useNavigate } from 'react-router-dom'

const ProductContent = () => {
  const [categories, setCategories] = useState([])
  const [sectionActiveIds, setSectionActiveIds] = useState([]) // Mỗi section 1 activeCategoryId
  const [sectionProducts, setSectionProducts] = useState([]) // Mỗi section 1 mảng sản phẩm
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState([])
  const [errorCategories, setErrorCategories] = useState(null)
  const [errorProducts, setErrorProducts] = useState([])
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
        if (!Array.isArray(fetchedCategories) || fetchedCategories.length === 0) {
          throw new Error('Không có danh mục nào được tải')
        }
        setCategories(fetchedCategories)
        // Khởi tạo state cho từng section
        const newSections = []
        for (let i = 0; i < fetchedCategories.length; i += categoriesPerSection) {
          const group = fetchedCategories.slice(i, i + categoriesPerSection)
          newSections.push(group)
        }
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
      getProductsByCategory(categoryId, 1, 20)
        .then(response => {
          setSectionProducts(prev => {
            const arr = [...prev]
            arr[idx] = response && response.products ? response.products : []
            return arr
          })
        })
        .catch(err => {
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
        })
        .finally(() => {
          setLoadingProducts(prev => {
            const arr = [...prev]
            arr[idx] = false
            return arr
          })
        })
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
    <div className='container' style={{ maxWidth: '1780px', margin: '0 auto' }}>
      {sections.map((group, idx) => {
        const activeCategory = group.find(c => c._id === sectionActiveIds[idx]) || group[0] || {}
        const hasProducts = sectionProducts[idx] && sectionProducts[idx].length > 0;
        return (
          <div key={idx} style={{ marginBottom: 40 }}>
            <HeaderCategories
              categories={group}
              activeCategoryId={sectionActiveIds[idx]}
              onCategoryChange={categoryId => handleCategoryChange(idx, categoryId)}
            />
            <ProductSection
              bannerImg={activeCategory.bannerImg || activeCategory.image || ''}
              bannerTitle={activeCategory.name || ''}
              bannerDesc={activeCategory.description || 'Bộ sưu tập hot'}
              products={sectionProducts[idx]}
              loading={loadingProducts[idx]}
              error={errorProducts[idx]}
            />
            {hasProducts && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                <button
                  className='view-all-btn'
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#1f2937'
                    e.target.style.color = 'white'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent'
                    e.target.style.color = '#1f2937'
                  }}
                  onClick={() => navigate(`/productbycategory/${activeCategory._id}`)}
                >
                  Xem tất cả ›
                </button>
              </div>
            )}
          </div>
        )
      })}
      <CollectionBanner />
      <ComboSection />
    </div>
  )
}

export default ProductContent
