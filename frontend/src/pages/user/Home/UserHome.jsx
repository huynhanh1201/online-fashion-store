import React from 'react'
import { Box } from '@mui/material'
import Slider from './Slider/Slider'
import ProductCategories from './ProductCategories/ProductCategories'
// import ProductList from './ProductList/ProductList'
import StoreIntroduction from './StoreIntroduction/StoreIntroduction'
import CouponList from './CouponList/CouponList'
const UserHome = () => {
  return (
    <>
      <Slider />
      <ProductCategories />
      <CouponList />
      <StoreIntroduction />
    </>
  )
}

export default UserHome
