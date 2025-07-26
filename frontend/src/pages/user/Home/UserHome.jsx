import React from 'react'
import { Box } from '@mui/material'
import Slider from './Slider/Slider'
import ChatBot from './ChatBot/ChatBot'
import Contact from './Contact/Contact'
import Content from './Contents/Content.jsx'
import ProductContent from './ProductContent/ProductContent.jsx'
import BlogHome from './BlogHome/BlogHome'
const UserHome = () => {
  return (
    <>
      <Slider />
      <Contact />
      {/* <ChatBot /> */}
      <Content />
      <ProductContent />
      <BlogHome />
    </>
  )
}

export default UserHome
