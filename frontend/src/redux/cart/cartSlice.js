import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
    selectedItems: [],
    tempCart: null,
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
    },
    clearTempCart(state) {
      state.tempCart = null
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
