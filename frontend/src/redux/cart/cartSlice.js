import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
    selectedItems: [],
    tempCart: null,
    isBuyNow: false
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
  }
})

export const {
  setCartItems,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  toggleChecked,
  setSelectedItems,
  setTempCart,
  clearTempCart,
  clearSelectedItems
} = cartSlice.actions


export default cartSlice.reducer
