import React, { useState } from 'react'
import HeaderCategories from './HeaderCategories'
import ProductSection from './ProductSection'
import CollectionBanner from './CollectionBanner'
import ComboSection from './ComboSection'

const tabData = {
  'Áo Thun': {
    bannerImg: 'https://file.hstatic.net/1000360022/file/button5-01.jpg',
    products: [
      { name: 'Áo Thun Nam In Hình Disney...', exportprice: '290,000đ' },
      { name: 'Áo Thun Nam In Hình Smokie...', exportprice: '290,000đ' },
      { name: 'Áo Thun Nam In Rubber Fusion...', exportprice: '290,000đ' },
      { name: 'Áo Thun Nam In The Pink Cat...', exportprice: '290,000đ' }
    ]
  },
  'Áo Polo': {
    bannerImg: 'https://file.hstatic.net/1000360022/file/background.jpg',
    products: [
      { name: 'Áo Thun Nam In Hình Disney...', exportprice: '290,000đ' },
      { name: 'Áo Thun Nam In Hình Smokie...', exportprice: '290,000đ' },
      { name: 'Áo Thun Nam In Rubber Fusion...', exportprice: '290,000đ' },
      { name: 'Áo Thun Nam In The Pink Cat...', exportprice: '290,000đ' }
    ]
  },
  'Áo Sơ Mi': {
    bannerImg:
      'https://file.hstatic.net/1000360022/file/2_copy__1__1024x1024.jpg',
    products: [
      { name: 'Áo Thun Nam In Hình Disney...', exportprice: '290,000đ' },
      { name: 'Áo Thun Nam In Hình Smokie...', exportprice: '290,000đ' },
      { name: 'Áo Thun Nam In Rubber Fusion...', exportprice: '290,000đ' },
      { name: 'Áo Thun Nam In The Pink Cat...', exportprice: '290,000đ' }
    ]
  }
}

const ProductContent = () => {
  const [activeTab, setActiveTab] = useState('Áo Thun')
  const currentTabData = tabData[activeTab]

  return (
    <div className='container' style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <HeaderCategories
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab)
        }}
      />

      <ProductSection
        bannerImg={currentTabData.bannerImg}
        bannerTitle={activeTab}
        bannerDesc='Bộ sưu tập hot'
        products={currentTabData.products}
      />

      <CollectionBanner />
      <ComboSection />
    </div>
  )
}

export default ProductContent
