import { useEffect, useState, useMemo } from 'react'
import {
  getCart,
  addToCart,
  updateCartItem,
  deleteCartItem,
  clearCart
} from '~/services/cartService'
import { useDispatch, useSelector } from 'react-redux'
import { setCartItems } from '~/redux/cart/cartSlice'

export const useCart = () => {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const cart = useSelector(state => state.cart)
  
  // Memoize isLoggedIn để tránh re-render không cần thiết
  const isLoggedIn = useMemo(() => {
    return !!localStorage.getItem('accessToken')
  }, [])

  const fetchCart = async (options = {}) => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      setLoading(false)
      // Reset cart khi không có token
      dispatch(setCartItems([]))
      return
    }

    if (!options?.silent) setLoading(true)
    try {
      const response = await getCart()
      if (response && response.cartItems) {
        const normalizedItems = (response.cartItems || []).map(item => ({
          ...item,
          variant: typeof item.variantId === 'object' ? item.variantId : { _id: item.variantId }
        }))
        dispatch(setCartItems(normalizedItems))
      } else {
        // Nếu response không hợp lệ, reset cart
        dispatch(setCartItems([]))
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error)
      // Nếu là lỗi 401 hoặc 403 (unauthorized), reset cart
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        dispatch(setCartItems([]))
      }
    } finally {
      setLoading(false)
    }
  }


  const handleAddToCart = async (payload) => {
    try {
      const newItem = await addToCart(payload)
      if (!newItem) return false

      const newVariantId = typeof newItem.variantId === 'object' ? newItem.variantId._id : newItem.variantId

      const existingItem = cart.cartItems.find(item => {
        const itemVariantId = typeof item.variantId === 'object' ? item.variantId._id : item.variantId
        return itemVariantId === newVariantId
      })

      let updatedCartItems
      if (existingItem) {
        updatedCartItems = cart.cartItems.map(item => {
          const itemVariantId = typeof item.variantId === 'object' ? item.variantId._id : item.variantId
          if (itemVariantId === newVariantId) {
            const currentQty = Number(item.quantity) || 0
            const newQty = Number(newItem.quantity) || 0
            const totalQty = currentQty + newQty

            return {
              ...item,
              quantity: isNaN(totalQty) ? 1 : totalQty // Fallback to 1 if NaN
            }
          }
          return item
        })
      } else {
        // Đảm bảo quantity của item mới cũng hợp lệ
        const safeNewItem = {
          ...newItem,
          quantity: Number(newItem.quantity) || 1 // Fallback to 1 if invalid
        }
        updatedCartItems = [...cart.cartItems, safeNewItem]
      }

      dispatch(setCartItems(updatedCartItems))
      return true
    } catch (error) {
      console.error('Error adding to cart:', error)
      return false
    }
  }

  const handleUpdateItem = async (variantId, data) => {
    if (!data || Object.keys(data).length === 0) return

    try {
      const payload = { variantId, ...data }
      const updated = await updateCartItem(payload)

      if (Array.isArray(updated?.cartItems)) {
        const normalizedItems = updated.cartItems.map(item => ({
          ...item,
          variant: typeof item.variantId === 'object'
            ? item.variantId
            : { _id: item.variantId }
        }))
        dispatch(setCartItems(normalizedItems))
      } else {
        // Fallback: fetch lại cart nếu response không đúng format
        await fetchCart({ silent: true })
      }
    } catch (error) {
      console.error('Error updating cart item:', error?.response || error)
      // Fetch lại cart khi có lỗi để đảm bảo data consistency
      await fetchCart({ silent: true })
    }
  }




  const handleToggleSelected = async (cartItemId, selected) => {
    await handleUpdateItem(cartItemId, { selected })
  }

  const handleDeleteItem = async (cartItemId) => {
    try {
      await deleteCartItem(cartItemId)
      await fetchCart({ silent: true })
    } catch (error) {
      console.error('Error deleting cart item:', error)
    }
  }

  const handleClearCart = async () => {
    try {
      const cleared = await clearCart()
      if (cleared) {
        dispatch(setCartItems([]))
      }
    } catch (error) {
      console.error('Error clearing cart:', error)
    }
  }

  const selectedCartItems = cart.cartItems.filter(item => item.selected)
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
    note
  }) => ({
    cartItems: selectedCartItems.map(item => ({
      variantId: getVariantId(item),
      quantity: item.quantity
    })),
    shippingAddressId,
    total,
    couponId,
    couponCode,
    paymentMethod,
    note
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
    getOrderPayload
  }
}
