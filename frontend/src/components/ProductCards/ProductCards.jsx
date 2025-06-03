import React from 'react'
import { Link } from 'react-router-dom' // Thêm dòng này
import '~/assets/ProductCard.css'

const renderStars = (rating) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <span className='stars'>
      {'★'.repeat(fullStars)}
      {hasHalfStar && '☆'}
      {'☆'.repeat(emptyStars)}
    </span>
  )
}

export default function ProductCard({ product }) {
  const quantity = Number(product.quantity) || 0
  const inStock = quantity < 0
  const productImage = product.image?.[0] || ''

  return (
    <Link to={`/productdetail/${product._id}`} className='product-card-link'>
      <div className='product-card'>
        <div className='product-image-wrapper'>
          <img src={productImage} alt={product.name} />
          {product.discount > 0 && (
            <div className='discount-badge'>-{product.discount}%</div>
          )}
        </div>

        <div className='product-content'>
          <h3 className='product-name'>{product.name}</h3>
          <div className='price-section'>
            <span className='current-price'>
              {product.exportPrice.toLocaleString()}₫
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
