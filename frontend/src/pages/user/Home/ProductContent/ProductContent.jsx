import React from 'react'
import '~/assets/HomeCSS/Productcontent.css'
const ProductContent = () => {
  return (
    <div className='container'>
      {/* Header Categories */}
      <div className='header-categories'>
        <span>Áo Thun</span>
        <span>Áo Polo</span>
        <span>Áo Sơ Mi</span>
      </div>

      {/* Áo Thun Section */}
      <div className='product-section'>
        <div className='product-grid'>
          {/* Large Banner */}
          <div className='product-banner'>
            <img
              src='https://product.hstatic.net/1000360022/product/quan_jean_nam_blue_sand_ong_suong_vintage_wash_form_straight__5__6d392538c746486da6a2f2f7d151c852_master.jpg'
              alt='Áo Thun Banner'
              className='product-banner-img'
            />
            <div className='product-banner-text'>
              <h1>QUẦN JEAN</h1>
              <p>ABCXYZ</p>
            </div>
          </div>
          {/* Product Cards */}
          {[
            { name: 'Áo Thun Nam In Hình Disney Origin...', price: '290,000đ' },
            { name: 'Áo Thun Nam In Hình Smokie Origin...', price: '290,000đ' },
            { name: 'Áo Thun Nam In Hình Rubber Fusion...', price: '290,000đ' },
            { name: 'Áo Thun Nam In Hình The Pink Cat...', price: '290,000đ' }
          ].map((product, index) => (
            <div key={index} className='product-card'>
              <img
                src='https://product.hstatic.net/1000360022/product/quan_jean_nam_blue_sand_ong_suong_vintage_wash_form_straight_51408e414a4949e7b1512d20a679b43a_master.jpg'
                alt={product.name}
                className='product-card-img'
              />
              <p className='product-card-name'>{product.name}</p>
              <p className='product-card-price price'>{product.price}</p>
            </div>
          ))}
        </div>
        <div className='see-more'>
          <button>Xem thêm</button>
        </div>
      </div>

      {/* Quần Jeans Section */}
      <div className='product-section'>
        <div className='product-grid'>
          {/* Large Banner */}
          <div className='product-banner'>
            <img
              src='https://product.hstatic.net/1000360022/product/ao-thun-nam-hoa-tiet-in-phoi-co-tim-superior-form-oversize__10__c1e7b9790d4541bc8129e822fe6913d3_master.jpg'
              alt='Quần Jeans Banner'
              className='product-banner-img'
            />
            <div className='product-banner-text'>
              <h2>QUẦN JEANS</h2>
            </div>
          </div>
          {/* Product Cards */}
          {[
            { name: 'Quần Jeans Nam Trơn Trắng Sương...', price: '540,000đ' },
            { name: 'Quần Jeans Nam Trơn Xám Sương...', price: '540,000đ' },
            { name: 'Quần Jeans Nam Trơn Đen Sương...', price: '540,000đ' },
            { name: 'Quần Jeans Nam Blue Sand Sương...', price: '540,000đ' }
          ].map((product, index) => (
            <div key={index} className='product-card'>
              <img
                src='https://product.hstatic.net/1000360022/product/id-1733a_dc0346f34ff345c4b5d2c28e22ab9d1f_master.jpg'
                alt={product.name}
                className='product-card-img'
              />
              <p className='product-card-name'>{product.name}</p>
              <p className='product-card-price price'>{product.price}</p>
            </div>
          ))}
        </div>
        <div className='see-more'>
          <button>Xem thêm</button>
        </div>
      </div>

      {/* Collection Banner */}
      <div className='collection-banner'>
        <h2>BỘ SƯU TẬP CHÍNH HÃNG TV MARVEL & DISNEY</h2>
        <div className='collection-grid'>
          {[
            {
              title: 'BETTER TOGETHER',
              img: 'https://file.hstatic.net/1000360022/file/button5-01.jpg'
            },
            {
              title: 'FIRST-TIME TEAM-UP',
              img: 'https://file.hstatic.net/1000360022/file/background.jpg'
            },
            {
              title: 'THE JOY OF FRIENDSHIP',
              img: 'https://file.hstatic.net/1000360022/file/2_copy__1__1024x1024.jpg'
            }
          ].map((item, index) => (
            <div key={index} className='collection-item'>
              <img
                src={item.img}
                alt={item.title}
                className='collection-item-img'
              />
              <div className='collection-item-text'>
                <p>Stitch</p>
                <h3>{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Combo Mix & Match Section */}
      <div className='combo-section'>
        <h2>COMBO MIX & MATCH</h2>
        <div className='combo-grid'>
          <div className='combo-item'>
            <img
              src='https://file.hstatic.net/1000360022/file/lookbook_sp-20_1024x1024.jpg'
              alt='Combo Item'
              className='combo-item-img'
            />
          </div>
          <div className='combo-item'>
            <img
              src='https://file.hstatic.net/1000360022/file/lookbook_sp-25_1024x1024.jpg'
              alt='Combo Item'
              className='combo-item-img'
            />
          </div>
          <div className='combo-item'>
            <img
              src='https://file.hstatic.net/1000360022/file/lookbook_sp-13_1024x1024.jpg'
              alt='Combo Item'
              className='combo-item-img'
            />
          </div>
          <div className='combo-item'>
            <img
              src='https://file.hstatic.net/1000360022/file/z6630583877538_8e98a2498851fdb7719afef8fe0afb32_1024x1024.jpg'
              alt='Combo Item'
              className='combo-item-img'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductContent
