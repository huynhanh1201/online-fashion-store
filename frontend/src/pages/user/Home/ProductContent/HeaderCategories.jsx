import React, { useState } from 'react'

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
    fontSize: '20px',
    color: '#666',
    userSelect: 'none'
  },
  sectionRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '20px',
    alignItems: 'center',
    marginBottom: '8px'
  },
  itemBase: {
    position: 'relative',
    cursor: 'pointer',
    paddingBottom: '6px',
    transition: 'color 0.3s ease',
    marginRight: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
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

  // Chia categories thành các mảng con, mỗi mảng tối đa 3 phần tử
  const categoriesPerRow = 3
  const rows = []
  for (let i = 0; i < categories.length; i += categoriesPerRow) {
    rows.push(categories.slice(i, i + categoriesPerRow))
  }

  const handleClick = (categoryId) => {
    if (categoryId !== activeCategoryId) {
      setPrevCategoryId(activeCategoryId)
      onCategoryChange(categoryId)
    }
  }

  return (
    <div style={styles.container}>
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} style={styles.sectionRow}>
          {row.map((cat) => {
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
      ))}
    </div>
  )
}

export default HeaderCategories
