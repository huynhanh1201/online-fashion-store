import { useEffect, useState } from 'react'
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

  const fetchCart = async (options = {}) => {
    if (!options?.silent) setLoading(true)
    try {
      const response = await getCart()
      const normalizedItems = (response?.cartItems || []).map(item => ({
        ...item,
        variant: typeof item.variantId === 'object' ? item.variantId : { _id: item.variantId }
      }))
      dispatch(setCartItems(normalizedItems))
    } catch (error) {
      console.error('Failed to fetch cart:', error)
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
            return {
              ...item,
              quantity: (Number(item.quantity) || 0) + (Number(newItem.quantity) || 0)
            }
          }
          return item
        })
      } else {
        updatedCartItems = [...cart.cartItems, newItem]
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
      }
    } catch (error) {
      console.error('Error updating cart item:', error?.response || error)
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
  const cartCount = cart.cartItems.reduce((total, item) => total + (Number(item.quantity) || 0), 0)

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
    fetchCart()
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
