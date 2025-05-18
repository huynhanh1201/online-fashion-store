import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    selectedItems: [],
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
        state.cartItems.push({ productId, quantity, checked: false }) // thêm checked mặc định false
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
      const { productId, checked } = action.payload
      const item = state.cartItems.find(i => i.productId === productId)
      if (item) {
        item.checked = checked
      }
    },

    // Add this:
    setSelectedItems: (state, action) => {
      console.log('Set selected items:', state)
      state.selectedItems = action.payload
    }
  }
})

export const {
  setCartItems,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  toggleChecked, // ✅ Sửa lại tên đúng với reducer bạn đã khai báo
  setSelectedItems
} = cartSlice.actions


export default cartSlice.reducer
