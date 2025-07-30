import React from 'react'
import { Box, Typography, Button, Stack } from '@mui/material'

const MenuPreview = ({ menuData, megamenuSettings }) => {
  // Lọc các main menu có visible và có children > 0
  const mainMenus = (menuData.mainMenu || [])
    .filter((item) => item.visible && item.children && item.children.length > 0)
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  // Áp dụng số cột tối đa từ megamenuSettings
  const maxColumns = megamenuSettings?.maxColumns || 4
  const columnWidth = megamenuSettings?.columnWidth || 'auto'
  const enableHoverEffects = megamenuSettings?.enableHoverEffects ?? true
  const animationDuration = megamenuSettings?.animationDuration || 350

  return (
    <Box
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Box
        sx={{
          borderRadius: '0 0 16px 16px',
          background: '#fff',
          p: 4,
          minHeight: 180,
          boxShadow: '0px 4px 10px rgba(0,0,0,0.10)',
          overflowX: 'auto',
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(mainMenus.length, maxColumns)}, 1fr)`,
          gap: 6,
          width: '100%',
          maxWidth: 1400,
          mx: 'auto',
          ...(columnWidth !== 'auto' && { gridAutoColumns: columnWidth })
        }}
      >
        {mainMenus.map((item, idx) => {
          const visibleChildren = (item.children || []).filter(
            (child) => child.visible
          )
          return (
            <Box
              key={item.label + idx}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                justifyContent: 'center'
              }}
            >
              {/* Tiêu đề cột */}
              <Typography
                sx={{
                  fontWeight: 'bold',
                  mb: 1.2,
                  textTransform: 'uppercase',
                  fontSize: '1.08rem',
                  letterSpacing: 0.5,
                  textAlign: 'center'
                }}
              >
                {item.label || 'Chưa có tên'}
              </Typography>
              {/* Các submenu */}
              {visibleChildren.length > 0 ? (
                visibleChildren.map((child, i) => (
                  <Box
                    key={child.label + i}
                    sx={{
                      color: '#222',
                      fontWeight: 400,
                      fontSize: '1rem',
                      px: 0,
                      minWidth: 0,
                      background: 'none',
                      boxShadow: 'none',
                      textAlign: 'center',
                      py: 0.5,
                      borderRadius: 1,
                      transition: enableHoverEffects
                        ? `all ${animationDuration}ms`
                        : 'none',
                      ...(enableHoverEffects && {
                        '&:hover': {
                          color: '#1976d2',
                          background: 'none',
                          transform: 'translateY(-2px)'
                        }
                      })
                    }}
                  >
                    {child.label || 'Chưa có tên'}
                  </Box>
                ))
              ) : (
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.95rem',
                    fontStyle: 'italic',
                    mt: 1,
                    textAlign: 'center'
                  }}
                >
                  Chưa có danh mục
                </Typography>
              )}
            </Box>
          )
        })}
      </Box>
      <Box
        sx={{
          mt: 3,
          p: 2,
          backgroundColor: '#f3f4f6',
          borderRadius: 2,
          textAlign: 'center',
          maxWidth: 600
        }}
      >
        <Typography variant='body2' color='text.secondary'>
          <strong>Lưu ý:</strong> Đây là minh họa cấu trúc menu. Menu thực tế sẽ
          được hiển thị theo thiết kế của website với các cài đặt: {maxColumns}{' '}
          cột, hiệu ứng hover: {enableHoverEffects ? 'bật' : 'tắt'}, thời gian
          animation: {animationDuration}ms.
        </Typography>
      </Box>
    </Box>
  )
}

export default MenuPreview
