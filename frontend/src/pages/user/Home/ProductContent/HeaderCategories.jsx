import React, { useState } from 'react'

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '20px',
    marginBottom: '20px',
    fontSize: '20px',
    color: '#666',
    userSelect: 'none'
  },
  itemBase: {
    position: 'relative',
    cursor: 'pointer',
    paddingBottom: '6px',
    transition: 'color 0.3s ease'
  },
  underline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: '2px',
    width: '100%',
    backgroundColor: '#1A3C7B',
    transformOrigin: 'left',
    transform: 'scaleX(0)',
    transitionProperty: 'transform',
    transitionTimingFunction: 'ease'
  },
  underlineActive: {
    transform: 'scaleX(1)',
    transitionDuration: '0.3s'
  },
  underlineInactiveFast: {
    transitionDuration: '0.15s'
  }
}

const HeaderCategories = ({
  categories,
  activeCategoryId,
  onCategoryChange
}) => {
  const [prevCategoryId, setPrevCategoryId] = useState(null)

  const handleClick = (categoryId) => {
    if (categoryId !== activeCategoryId) {
      setPrevCategoryId(activeCategoryId)
      onCategoryChange(categoryId) // Gọi callback để thông báo cho parent component
    }
  }

  return (
    <div style={styles.container}>
      {categories.map((cat) => {
        const isActive = cat._id === activeCategoryId
        const isPrev = cat._id === prevCategoryId
        return (
          <span
            key={cat._id}
            onClick={() => handleClick(cat._id)}
            style={{
              ...styles.itemBase,
              color: isActive ? '#1A3C7B' : '#666'
            }}
          >
            {cat.name}
            <span
              style={{
                ...styles.underline,
                ...(isActive
                  ? styles.underlineActive
                  : isPrev
                    ? styles.underlineInactiveFast
                    : {})
              }}
            />
          </span>
        )
      })}
    </div>
  )
}

export default HeaderCategories
