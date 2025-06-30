import React, { useRef, useState, useEffect } from 'react'
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  Badge,
  Slide,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material'
import { styled } from '@mui/system'
import { getCategories } from '~/services/categoryService'
import { getMenuConfig } from '~/services/admin/webConfig/headerService.js'
import { useTheme } from '@mui/material/styles'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'

const Menu = ({ headerRef }) => {
  const menuRef = useRef(null);
  const productMenuOpen = false;
  const megamenuColumns = 4;
  const megamenuSettings = {
    animationDuration: 300,
    columnWidth: 'auto',
    enableHoverEffects: true
  };

  const handleDrawerEnter = () => {
    // Implementation of handleDrawerEnter
  };

  const handleDrawerLeave = () => {
    // Implementation of handleDrawerLeave
  };

  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        alignItems: 'center',
        position: 'relative',
        flex: 1,
        gap: 2,
        width: '100%',
        maxWidth: '1400px',
        zIndex: 1400
      }}
    >
      {/* Menu container */}
      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0, justifyContent: 'center', position: 'relative', width: '100%', maxWidth: '1400px', mx: 'auto', height: 56, overflow: 'visible' }}>
        {/* Menu items */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0, overflow: 'visible', width: '100%', maxWidth: '1400px' }}>
          <Slide
            direction={slideDirection}
            in={isInitialized}
            key={currentRow}
            mountOnEnter
            unmountOnExit
            timeout={isInitialized ? 350 : 0}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                minHeight: 48,
                justifyContent: 'center',
                position: 'relative',
                left: 0,
                right: 0,
                top: 0,
                maxWidth: '1400px'
              }}
            >
              {menuRows[currentRow]?.map((item, index) => (
                <Box
                  key={item.label + index}
                  sx={{ display: 'inline-flex', position: 'relative', zIndex: 1410 }}
                  onMouseEnter={() => item.category && handleCategoryEnter(item.category)}
                  onMouseLeave={() => item.category && handleCategoryLeave()}
                >
                  {item.isNew ? (
                    <Badge
                      badgeContent={
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'red' }}>
                          mới
                        </span>
                      }
                      color='default'
                      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                      sx={{
                        '& .MuiBadge-badge': {
                          top: 2,
                          padding: 0,
                          minWidth: 0,
                          height: 'auto',
                          background: 'none',
                          borderRadius: 0
                        }
                      }}
                    >
                      <StyledButton href={item.url}>
                        {item.label}
                      </StyledButton>
                    </Badge>
                  ) : (
                    <StyledButton
                      href={item.url}
                      active={item.hasMegaMenu && (productMenuOpen || isDrawerHovered)}
                      ref={item.hasMegaMenu ? productButtonRef : null}
                      onMouseEnter={item.hasMegaMenu ? handleProductEnter : undefined}
                      onMouseLeave={item.hasMegaMenu ? handleProductLeave : undefined}
                    >
                      {item.label}
                    </StyledButton>
                  )}

                  {/* Category submenu */}
                  {item.category && hoveredCategory?._id === item.category._id && (
                    <Box
                      onMouseEnter={handleCategoryMenuEnter}
                      onMouseLeave={handleCategoryMenuLeave}
                      sx={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bgcolor: 'white',
                        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
                        minWidth: 200,
                        maxWidth: '95vw',
                        zIndex: 1500,
                        borderRadius: '0 0 8px 8px',
                        border: '1px solid #e2e8f0',
                        animation: 'slideDown 0.2s ease-out',
                        '@keyframes slideDown': {
                          '0%': { opacity: 0, transform: 'translateX(-50%) translateY(-10px) scaleY(0.95)' },
                          '100%': { opacity: 1, transform: 'translateX(-50%) translateY(0) scaleY(1)' }
                        }
                      }}
                    >
                      <Box sx={{ p: 2 }}>
                        {(() => {
                          if (!item.category) return null
                          const childCategories = getChildCategories(item.category)
                          return childCategories.length > 0 ? (
                            childCategories.map((child) => (
                              <Button
                                key={child._id}
                                href={`/productbycategory/${child._id}`}
                                sx={{
                                  justifyContent: 'flex-start',
                                  textAlign: 'left',
                                  color: '#222',
                                  fontWeight: 400,
                                  fontSize: '1rem',
                                  px: 2,
                                  py: 1,
                                  minWidth: 0,
                                  background: 'none',
                                  boxShadow: 'none',
                                  textTransform: 'none',
                                  borderRadius: 1,
                                  width: '100%',
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    color: '#1976d2',
                                    background: '#f8fafc',
                                    transform: 'translateX(5px)'
                                  }
                                }}
                              >
                                {child.name}
                              </Button>
                            ))
                          ) : (
                            <Typography
                              sx={{
                                color: 'text.secondary',
                                fontSize: '0.95rem',
                                fontStyle: 'italic',
                                px: 2,
                                py: 1
                              }}
                            >
                              Chưa có danh mục con
                            </Typography>
                          )
                        })()}
                      </Box>
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          </Slide>
        </Box>

        {/* Navigation arrows */}
        {shouldShowArrows && (
          <Box sx={{ display: 'flex', flexDirection: 'row', ml: 0.5 }}>
            <Button
              onClick={() => navigateRow('left')}
              disabled={!canNavigateLeft}
              sx={{
                minWidth: 8,
                width: 20,
                height: 20,
                borderRadius: '6px 0 0 6px',
                background: 'transparent',
                boxShadow: 'none',
                minHeight: 0,
                '&:hover': {
                  background: 'transparent'
                }
              }}
            >
              <ChevronLeft sx={{ fontSize: 20, color: canNavigateLeft ? '#1A3C7B' : '#ccc', fontWeight: canNavigateLeft ? 700 : 400 }} />
            </Button>
            <Button
              onClick={() => navigateRow('right')}
              disabled={!canNavigateRight}
              sx={{
                minWidth: 8,
                width: 20,
                height: 20,
                borderRadius: '0 6px 6px 0',
                background: 'transparent',
                boxShadow: 'none',
                minHeight: 0,
                '&:hover': {
                  background: 'transparent'
                }
              }}
            >
              <ChevronRight sx={{ fontSize: 20, color: canNavigateRight ? '#1A3C7B' : '#ccc', fontWeight: canNavigateRight ? 700 : 400 }} />
            </Button>
          </Box>
        )}
      </Box>

      {/* MegaMenu */}
      {(menuConfig?.mainMenu?.length > 0 || categories.length > 0) && productMenuOpen && (
        <Box
          ref={menuRef}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            maxWidth: '1400px',
            borderRadius: '0 0 8px 8px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            p: 4,
            zIndex: 1450,
            backgroundColor: 'white',
            display: 'flex',
            justifyContent: 'flex-start',
            overflow: 'hidden',
            opacity: 1,
            transform: 'scaleY(1)',
            transformOrigin: 'top',
            transition: `transform ${megamenuSettings.animationDuration}ms ease, opacity ${megamenuSettings.animationDuration}ms ease`,
            mt: 1
          }}
          onMouseEnter={handleDrawerEnter}
          onMouseLeave={handleDrawerLeave}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(${megamenuColumns}, 1fr)`,
              gap: 6,
              width: '100%'
            }}
          >
            {menuConfig?.mainMenu && menuConfig.mainMenu.length > 0 ? (
              menuConfig.mainMenu
                .filter(item => item.visible)
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((item, idx) => (
                  <Box
                    key={item.label + idx}
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: 1, 
                      alignItems: 'flex-start'
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 'bold',
                        mb: 1.2,
                        textTransform: 'uppercase',
                        fontSize: '1.08rem'
                      }}
                    >
                      {item.label}
                    </Typography>
                    {item.children && item.children.length > 0 ? (
                      item.children
                        .filter(child => child.visible)
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((child, i) => (
                          <Button
                            key={child.label + i}
                            href={child.url}
                            sx={{
                              justifyContent: 'flex-start',
                              textAlign: 'left',
                              color: '#222',
                              fontWeight: 400,
                              fontSize: '1rem',
                              px: 0,
                              minWidth: 0,
                              background: 'none',
                              boxShadow: 'none',
                              width: '100%',
                              '&:hover': {
                                color: '#1976d2',
                                transform: 'translateX(5px)',
                                transition: 'all 0.2s ease'
                              }
                            }}
                          >
                            {child.label}
                          </Button>
                        ))
                    ) : (
                      <Typography
                        sx={{
                          color: 'text.secondary',
                          fontSize: '0.95rem',
                          fontStyle: 'italic'
                        }}
                      >
                        Chưa có danh mục
                      </Typography>
                    )}
                  </Box>
                ))
            ) : (
              <Box
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 1, 
                  alignItems: 'flex-start'
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 'bold',
                    mb: 1.2,
                    textTransform: 'uppercase',
                    fontSize: '1.08rem'
                  }}
                >
                  Sản phẩm
                </Typography>
                <Button
                  href="/product"
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    color: '#222',
                    fontWeight: 400,
                    fontSize: '1rem',
                    px: 0,
                    minWidth: 0,
                    background: 'none',
                    boxShadow: 'none',
                    width: '100%',
                    '&:hover': {
                      color: '#1976d2',
                      transform: 'translateX(5px)',
                      transition: 'all 0.2s ease'
                    }
                  }}
                >
                  Tất cả sản phẩm
                </Button>
                <Button
                  href="/productnews"
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    color: '#222',
                    fontWeight: 400,
                    fontSize: '1rem',
                    px: 0,
                    minWidth: 0,
                    background: 'none',
                    boxShadow: 'none',
                    width: '100%',
                    '&:hover': {
                      color: '#1976d2',
                      transform: 'translateX(5px)',
                      transition: 'all 0.2s ease'
                    }
                  }}
                >
                  Sản phẩm mới
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default Menu 