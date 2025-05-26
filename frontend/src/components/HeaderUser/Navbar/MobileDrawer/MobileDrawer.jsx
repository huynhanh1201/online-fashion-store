// components/MobileDrawer.jsx
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
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 }
      }}
    >
      <Box sx={{ width: 250, p: 2 }}>
        <Typography variant='h6' sx={{ p: 2, fontWeight: 700 }}>
          ICONDEWIM™
        </Typography>
        <Divider />
        <List>
          <ListItem button component='a' href='/product'>
            <ListItemText primary='Sản phẩm' />
          </ListItem>
          <ListItem button component='a' href='/ao-nam'>
            <ListItemText primary='Áo Nam' />
          </ListItem>
          <ListItem button component='a' href='/quan-nam'>
            <ListItemText primary='Quần Nam' />
          </ListItem>
          <ListItem button component='a' href='/login'>
            <ListItemText primary='Đăng nhập' />
          </ListItem>
          <ListItem button component='a' href='/profile'>
            <ListItemText primary='Hồ sơ' />
          </ListItem>
          <ListItem button component='a' href='/logout'>
            <ListItemText primary='Đăng xuất' />
          </ListItem>
          <ListItem button component='a' href='/cart'>
            <ListItemText primary='Giỏ hàng' />
          </ListItem>
          <ListItem button component='a' href='/orders'>
            <ListItemText primary='Thông tin đơn hàng' />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  )
}

export default MobileDrawer
