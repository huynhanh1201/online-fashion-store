import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
    selectedItems: [],
    tempCart: null,
    isBuyNow: false,
    tempQuantities: {}
  },
  reducers: {
    setCartItems(state, action) {
      state.cartItems = action.payload
    },
    setSelectedItems(state, action) {
      state.selectedItems = action.payload
    },
    setTempCart(state, action) {
      state.tempCart = action.payload
      state.isBuyNow = true
    },
    clearTempCart(state) {
      state.tempCart = null
      state.isBuyNow = false
    },
    clearSelectedItems: (state) => {
      state.selectedItems = []
    },
    setTempQuantity: (state, action) => {
      const { variantId, quantity } = action.payload
      if (!state.tempQuantities) {
        state.tempQuantities = {}
      }
      state.tempQuantities[variantId] = quantity
    },
    removeTempQuantity: (state, action) => {
      const variantId = action.payload
      delete state.tempQuantities[variantId]
    },
    clearAllTempQuantities: (state) => {
      state.tempQuantities = {}
    }
  }
})

export const {
  setCartItems,
  setSelectedItems,
  setTempCart,
  clearTempCart,
  clearSelectedItems,
  setTempQuantity,
  removeTempQuantity,
  clearAllTempQuantities
} = cartSlice.actions

export default cartSlice.reducer
