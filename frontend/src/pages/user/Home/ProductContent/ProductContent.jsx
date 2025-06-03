import React from 'react'
import '~/assets/HomeCSS/Productcontent.css'

const ProductContent = () => {
  const products = [
    {
      id: 1,
      name: 'Áo Khoác Nam Gấm Double Stripes ICO',
      price: '450,000đ',
      image: 'https://via.placeholder.com/200x200',
      colors: ['black', 'white', 'blue']
    },
    {
      id: 2,
      name: 'Quần Jeans Nam Xám Tông Sáng',
      price: '540,000đ',
      image: 'https://via.placeholder.com/200x200',
      colors: ['gray', 'black']
    },
    {
      id: 3,
      name: 'Áo Khoác Jeans Nam Hoa Tích Incredible',
      price: '600,000đ',
      image: 'https://via.placeholder.com/200x200',
      colors: ['blue', 'gray']
    },
    {
      id: 4,
      name: 'Quần Boxer Nam Lưng Spandex',
      price: '100,000đ',
      image: 'https://via.placeholder.com/200x200',
      colors: ['black', 'white']
    },
    {
      id: 5,
      name: 'Áo Thun Nam Hoa Tích Strokes Oregon',
      price: '200,000đ',
      image: 'https://via.placeholder.com/200x200',
      colors: ['green', 'white', 'black']
    },
    {
      id: 6,
      name: 'Áo Sơ Mi Nam Tay Ngắn Crinkle Stripes',
      price: '340,000đ',
      image: 'https://via.placeholder.com/200x200',
      colors: ['white', 'black']
    },
    {
      id: 7,
      name: 'Áo Khoác Nam Trucker Denim',
      price: '600,000đ',
      image: 'https://via.placeholder.com/200x200',
      colors: ['black', 'gray']
    },
    {
      id: 8,
      name: 'Áo Thun Nam Hoa Tích Rubber Fusion',
      price: '270,000đ',
      image: 'https://via.placeholder.com/200x200',
      colors: ['black', 'white']
    },
    {
      id: 9,
      name: 'Áo Thun Nam Hoa Tích In Theme',
      price: '200,000đ',
      image: 'https://via.placeholder.com/200x200',
      colors: ['white', 'black']
    }
  ]

  const sidebarProducts = [
    {
      id: 10,
      name: 'Áo Thun Nam Hoa Tích Disney Stitch',
      price: '220,000đ',
      image: 'https://via.placeholder.com/200x200',
      colors: ['green', 'white']
    },
    {
      id: 11,
      name: 'Áo Thun Nam Hoa Tích Strokes Oregon',
      price: '200,000đ',
      image: 'https://via.placeholder.com/200x200',
      colors: ['green', 'black']
    },
    {
      id: 12,
      name: 'Áo Thun Nam Hoa Tích Rubber Fusion',
      price: '270,000đ',
      image: 'https://via.placeholder.com/200x200',
      colors: ['black', 'white']
    },
    {
      id: 13,
      name: 'Áo Thun Nam Hoa Tích Phú Cẩm 17',
      price: '300,000đ',
      image: 'https://via.placeholder.com/200x200',
      colors: ['black', 'white']
    }
  ]

  return (
    <div className='product-content'>
      <h2 className='section-title'>Hàng Mới</h2>
      <div className='banner'>
        <img src='https://via.placeholder.com/300x400' alt='Banner' />
      </div>
      <div className='main-content'>
        <div className='product-grid'>
          {products.map((product) => (
            <div key={product.id} className='product-card'>
              <img
                src={product.image}
                alt={product.name}
                className='product-image'
              />
              <p className='product-name'>{product.name}</p>
              <p className='product-price'>{product.price}</p>
              <div className='color-options'>
                {product.colors.map((color, index) => (
                  <span
                    key={index}
                    className='color-dot'
                    style={{ backgroundColor: color }}
                  ></span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className='sidebar'>
          <h3 className='sidebar-title'>Áo Thun</h3>
          {sidebarProducts.map((product) => (
            <div key={product.id} className='sidebar-product'>
              <img
                src={product.image}
                alt={product.name}
                className='sidebar-product-image'
              />
              <div className='sidebar-product-info'>
                <p className='product-name'>{product.name}</p>
                <p className='product-price'>{product.price}</p>
                <div className='color-options'>
                  {product.colors.map((color, index) => (
                    <span
                      key={index}
                      className='color-dot'
                      style={{ backgroundColor: color }}
                    ></span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductContent
