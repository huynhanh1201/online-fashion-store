import { useEffect, useState, useMemo } from 'react'
import {
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
} from '~/services/cartService'
import { useDispatch, useSelector } from 'react-redux'
import { setCartItems } from '~/redux/cart/cartSlice'

export const useCart = () => {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart)

  // Memoize isLoggedIn to avoid unnecessary re-renders
  const isLoggedIn = useMemo(() => {
    return !!localStorage.getItem('accessToken')
  }, [])

  const fetchCart = async (options = {}) => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      setLoading(false)
      dispatch(setCartItems([]))
      return { success: false, message: 'No access token found' }
    }

    if (!options?.silent) setLoading(true)
    try {
      const response = await getCart()
      if (response && response.cartItems) {
        const normalizedItems = (response.cartItems || []).map((item) => ({
          ...item,
          variantId: typeof item.variantId === 'object' ? item.variantId : { _id: item.variantId },
        }))
        dispatch(setCartItems(normalizedItems))
        return { success: true, cartItems: normalizedItems }
      } else {
        dispatch(setCartItems([]))
        return { success: false, message: 'Invalid cart response' }
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error)
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        dispatch(setCartItems([]))
        return { success: false, message: 'Unauthorized access' }
      }
      return { success: false, message: error?.response?.data?.message || 'Failed to fetch cart' }
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (payload) => {
    try {
      const newItem = await addToCart(payload)
      if (!newItem) return { success: false, message: 'Failed to add item to cart' }

      const newVariantId = typeof newItem.variantId === 'object' ? newItem.variantId._id : newItem.variantId

      const existingItem = cart.cartItems.find((item) => {
        const itemVariantId = typeof item.variantId === 'object' ? item.variantId._id : item.variantId
        return itemVariantId === newVariantId
      })

      let updatedCartItems
      if (existingItem) {
        updatedCartItems = cart.cartItems.map((item) => {
          const itemVariantId = typeof item.variantId === 'object' ? item.variantId._id : item.variantId
          if (itemVariantId === newVariantId) {
            const currentQty = Number(item.quantity) || 0
            const newQty = Number(newItem.quantity) || 0
            const totalQty = currentQty + newQty
            return {
              ...item,
              quantity: isNaN(totalQty) ? 1 : totalQty,
            }
          }
          return item
        })
      } else {
        const safeNewItem = {
          ...newItem,
          quantity: Number(newItem.quantity) || 1,
          variantId: typeof newItem.variantId === 'object' ? newItem.variantId : { _id: newItem.variantId },
        }
        updatedCartItems = [...cart.cartItems, safeNewItem]
      }

      dispatch(setCartItems(updatedCartItems))
      return { success: true }
    } catch (error) {
      console.error('Error adding to cart:', error)
      return { success: false, message: error?.response?.data?.message || 'Failed to add item to cart' }
    }
  }

  const handleUpdateItem = async (variantId, data) => {
    if (!data || Object.keys(data).length === 0) {
      return { success: false, message: 'No update data provided' }
    }

    try {
      const payload = { variantId, ...data }
      const updated = await updateCartItem(payload)

      // Làm mới giỏ hàng từ server bất kể API trả về gì
      const result = await fetchCart({ silent: true })
      if (result.success) {
        return { success: true, cartItems: result.cartItems }
      } else {
        throw new Error(result.message || 'Failed to fetch updated cart')
      }
    } catch (error) {
      console.error('Error updating cart item:', error)
      const result = await fetchCart({ silent: true })
      const message = error?.response?.data?.message || 'Failed to update cart item'
      return { success: false, message }
    }
  }

  const handleToggleSelected = async (cartItemId, selected) => {
    return await handleUpdateItem(cartItemId, { selected })
  }

  const handleDeleteItem = async (cartItemId) => {
    try {
      await deleteCartItem(cartItemId)
      const result = await fetchCart({ silent: true })
      return { success: result.success, message: result.message }
    } catch (error) {
      console.error('Error deleting cart item:', error)
      return { success: false, message: error?.response?.data?.message || 'Failed to delete cart item' }
    }
  }

  const handleClearCart = async () => {
    try {
      const cleared = await clearCart()
      if (cleared) {
        dispatch(setCartItems([]))
        return { success: true }
      }
      return { success: false, message: 'Failed to clear cart' }
    } catch (error) {
      console.error('Error clearing cart:', error)
      return { success: false, message: error?.response?.data?.message || 'Failed to clear cart' }
    }
  }

  const selectedCartItems = cart.cartItems.filter((item) => item.selected)
  const cartCount = cart.cartItems.reduce((total, item) => {
    const qty = Number(item.quantity) || 0
    return total + (isNaN(qty) ? 0 : qty)
  }, 0)

  const getVariantId = (item) =>
    typeof item.variantId === 'object' ? item.variantId._id : item.variantId

  const getOrderPayload = ({
    shippingAddressId,
    total,
    couponId,
    couponCode,
    paymentMethod,
    note,
  }) => ({
    cartItems: selectedCartItems.map((item) => ({
      variantId: getVariantId(item),
      quantity: item.quantity,
    })),
    shippingAddressId,
    total,
    couponId,
    couponCode,
    paymentMethod,
    note,
  })

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      fetchCart()
    }
  }, [])

  return {
    cart,
    cartCount,
    selectedItems: selectedCartItems,
    loading,
    refresh: fetchCart,
    addToCart: handleAddToCart,
    updateItem: handleUpdateItem,
    deleteItem: handleDeleteItem,
    clearCart: handleClearCart,
    toggleSelected: handleToggleSelected,
    getOrderPayload,
  }
}