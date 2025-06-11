import React from 'react'
import { Box } from '@mui/material'
import Slider from './Slider/Slider'
import ChatBot from './ChatBot/ChatBot'
import Content from './Contents/Content.jsx'
import ProductContent from './ProductContent/ProductContent.jsx'
const UserHome = () => {
  return (
    <>
      <Slider />
      <ChatBot></ChatBot>
      <Content />
      <ProductContent />
    </>
  )
}

export default UserHome
