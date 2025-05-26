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
    clearSelectedItems(state) {
      state.selectedItems = []
    },
    addToCart(state, action) {
      const { productId, color, size, quantity } = action.payload
      const existing = state.cartItems.find(
        item =>
          item.productId === productId &&
          item.color === color &&
          item.size === size
      )

      if (existing) {
        existing.quantity += quantity
      } else {
        state.cartItems.push({ productId, color, size, quantity })
      }
    },
    removeFromCart(state, action) {
      const id = action.payload
      state.cartItems = state.cartItems.filter(item => item.productId !== id)
    },
    updateCartItem(state, action) {
      const { productId, color, size, quantity } = action.payload
      const item = state.cartItems.find(
        item =>
          item.productId === productId &&
          item.color === color &&
          item.size === size
      )
      if (item) {
        item.quantity = quantity
      }
    },
    toggleChecked(state, action) {
      const id = action.payload
      if (state.selectedItems.includes(id)) {
        state.selectedItems = state.selectedItems.filter(item => item !== id)
      } else {
        state.selectedItems.push(id)
      }
    },
    clearCart(state) {
      state.cartItems = []
    }
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
