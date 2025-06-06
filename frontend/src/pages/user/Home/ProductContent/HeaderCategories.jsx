import React, { useState } from 'react'

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '20px',
    marginBottom: '20px',
    fontSize: '16px',
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

const HeaderCategories = ({ activeTab, setActiveTab }) => {
  const tabs = ['Áo Thun', 'Áo Polo', 'Áo Sơ Mi']
  const [prevTab, setPrevTab] = useState(null)

  const handleClick = (tab) => {
    if (tab !== activeTab) {
      setPrevTab(activeTab)
      setActiveTab(tab)
    }
  }

  return (
    <div style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab === activeTab
        const isPrev = tab === prevTab
        return (
          <span
            key={tab}
            onClick={() => handleClick(tab)}
            style={{
              ...styles.itemBase,
              color: isActive ? '#1A3C7B' : '#666'
            }}
          >
            {tab}
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
