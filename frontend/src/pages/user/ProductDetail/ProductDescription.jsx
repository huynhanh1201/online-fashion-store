import React, { useState } from 'react'
import { Box, DialogContent, DialogTitle, Tabs, Tab } from '@mui/material'
import ProductReview from './ProductReview' // 👉 Import file đánh giá

const ProductDescription = ({ description, productId, product }) => {
  const [tabIndex, setTabIndex] = useState(0)

  const handleChange = (event, newValue) => {
    setTabIndex(newValue)
  }

  return (
    <Box>

      <Tabs value={tabIndex} onChange={handleChange}>
        <Tab label='Mô tả sản phẩm' />
        <Tab label='Đánh giá' />
      </Tabs>

      <DialogContent dividers>
        {tabIndex === 0 && (
          <Box
            className="content-selectable"
            sx={{
              width: '100%',
              '& img': {
                width: '873px !important',
                height: '873px !important',
                display: 'block',
                margin: '8px auto',
                borderRadius: '6px',
                objectFit: 'contain'
              },
              '& p': {
                margin: '8px 0',
                lineHeight: 1.6,
                wordBreak: 'break-word'
              },
              '& ul, & ol': {
                paddingLeft: '20px',
                margin: '8px 0'
              },
              '& li': {
                marginBottom: '4px'
              },
              '& strong': {
                fontWeight: 600
              },
              '& em': {
                fontStyle: 'italic'
              },
              '& a': {
                color: '#1976d2',
                textDecoration: 'underline',
                wordBreak: 'break-all'
              },
              '& span': {
                wordBreak: 'break-word'
              },
              '& *': {
                boxSizing: 'border-box'
              }
            }}
            dangerouslySetInnerHTML={{ __html: description || '' }}
          />
        )}

        {tabIndex === 1 && <ProductReview productId={productId} avgRating={product?.avgRating || 0} />}

      </DialogContent>
    </Box>
  )
}

export default ProductDescription
