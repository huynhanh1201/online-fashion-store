import React from 'react'
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Drawer
} from '@mui/material'

const MobileDrawer = ({ open, onClose }) => {
  return (
    <Drawer
      variant='temporary'
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true // Cải thiện hiệu năng mobile
      }}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 }
      }}
    >
      <Box
        sx={{
          width: 280,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography variant='h6' sx={{ fontWeight: 700 }}>
          ICONDEWIM™
        </Typography>

        <Divider />

        <List>
          <ListItem button component='a' href='/product'>
            <ListItemText primary='Sản phẩm' />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  )
}

export default MobileDrawer
