import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
    selectedItems: [],
    tempCart: null,
    isBuyNow: false,
    tempQuantities: {},
    reorderVariantIds: [], // Lưu các variantId được thêm từ reorder
    appliedCoupon: null, // Lưu mã giảm giá được áp dụng từ Cart
    appliedDiscount: 0 // Lưu số tiền giảm giá
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
    },
    setReorderVariantIds: (state, action) => {
      state.reorderVariantIds = action.payload
    },
    clearReorderVariantIds: (state) => {
      state.reorderVariantIds = []
    },
    setAppliedCoupon: (state, action) => {
      state.appliedCoupon = action.payload.coupon
      state.appliedDiscount = action.payload.discount
    },
    clearAppliedCoupon: (state) => {
      state.appliedCoupon = null
      state.appliedDiscount = 0
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
  clearAllTempQuantities,
  setReorderVariantIds,
  clearReorderVariantIds,
  setAppliedCoupon,
  clearAppliedCoupon
} = cartSlice.actions

export default cartSlice.reducer
