import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: []
  },
  reducers: {
    setCartItems: (state, action) => {
      state.cartItems = action.payload
    },
    addToCart: (state, action) => {
      const { productId, quantity } = action.payload
      const existingItem = state.cartItems.find(item => item.productId === productId)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        state.cartItems.push({ productId, quantity, checked: true }) // thêm checked mặc định true
      }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(item => item.productId !== action.payload)
    },
    updateCartItem: (state, action) => {
      const { productId, quantity } = action.payload
      const item = state.cartItems.find(item => item.productId === productId)
      if (item) {
        item.quantity = quantity
      }
    },
    clearCart: (state) => {
      state.cartItems = []
    },
    toggleChecked: (state, action) => {
      const productId = action.payload
      const item = state.cartItems.find(item => item.productId === productId)
      if (item) {
        item.checked = !item.checked
      }
    }

  }
})

export const {
  setCartItems,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  toggleChecked
} = cartSlice.actions

export default cartSlice.reducer
