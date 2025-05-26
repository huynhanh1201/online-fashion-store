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
      dispatch(setCartItems(response?.cartItems || []))
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

      const newProductId = typeof newItem.productId === 'object' ? newItem.productId._id : newItem.productId

      const existingItem = cart.cartItems.find(item => {
        const itemProductId = typeof item.productId === 'object' ? item.productId._id : item.productId
        return itemProductId === newProductId
      })

      let updatedCartItems
      if (existingItem) {
        updatedCartItems = cart.cartItems.map(item => {
          const itemProductId = typeof item.productId === 'object' ? item.productId._id : item.productId
          if (itemProductId === newProductId) {
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

  const handleUpdateItem = async (cartItemId, data) => {
    try {
      const updated = await updateCartItem(cartItemId, data)
      if (updated?.cartItems) {
        dispatch(setCartItems(updated.cartItems))
      }
    } catch (error) {
      console.error('Error updating cart item:', error)
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

  const getProductId = (item) => typeof item.productId === 'object' ? item.productId._id : item.productId

  const getOrderPayload = ({
    shippingAddressId,
    total,
    couponId,
    couponCode,
    paymentMethod,
    note
  }) => ({
    cartItems: selectedCartItems.map(item => ({
      productId: getProductId(item),
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
