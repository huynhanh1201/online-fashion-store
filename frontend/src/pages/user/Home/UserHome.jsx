import React from 'react'
import { Box } from '@mui/material'
import Slider from './Slider/Slider'
import ProductCategories from './ProductCategories/ProductCategories'
import ProductList from './ProductList/ProductList'
import CouponList from './CouponList/CouponList'
import Content from './Contents/Content.jsx'
import ProductContent from './ProductContent/ProductContent.jsx'
const UserHome = () => {
  return (
    <>
      <Slider />
      {/*<ProductCategories />*/}
      {/*<CouponList />*/}
      {/*<ProductList />*/}
      <Content />
      <ProductContent />
    </>
  )
}

export default UserHome
