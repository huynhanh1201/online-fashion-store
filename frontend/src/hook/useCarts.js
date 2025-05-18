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

  // Fetch dữ liệu giỏ hàng từ server
  const fetchCart = async (options = {}) => {
    if (!options?.silent) setLoading(true)
    const data = await getCart()
    dispatch(setCartItems(data?.cartItems || []))
    setLoading(false)
  }

  // Thêm sản phẩm vào giỏ hàng
  const handleAddToCart = async (payload) => {
    try {
      const newItem = await addToCart(payload)

      if (newItem) {
        const newProductId = typeof newItem.productId === 'object' ? newItem.productId._id : newItem.productId

        const existingItem = cart.cartItems.find(item => {
          const itemProductId = typeof item.productId === 'object' ? item.productId._id : item.productId
          return itemProductId === newProductId
        })

        let newCartItems
        if (existingItem) {
          newCartItems = cart.cartItems.map(item => {
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
          newCartItems = [...cart.cartItems, newItem]
        }

        dispatch(setCartItems(newCartItems))
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    }
  }

  // Cập nhật sản phẩm trong giỏ (số lượng, trạng thái selected)
  const handleUpdateItem = async (productId, data) => {
    const updated = await updateCartItem(productId, data)
    if (updated) {
      dispatch(setCartItems(updated?.cartItems || []))
    }
  }

  // Cập nhật trạng thái selected
  const handleToggleSelected = async (productId, selected) => {
    await handleUpdateItem(productId, { selected })
  }

  // Xoá một sản phẩm khỏi giỏ
  const handleDeleteItem = async (productId) => {
    await deleteCartItem(productId)
    fetchCart({ silent: true })
  }

  // Xoá toàn bộ giỏ hàng
  const handleClearCart = async () => {
    const cleared = await clearCart()
    if (cleared) {
      dispatch(setCartItems([]))
    }
  }

  // Các sản phẩm được chọn để thanh toán
  const selectedCartItems = cart.cartItems.filter(item => item.selected)

  // Số lượng sản phẩm trong giỏ
  const cartCount = cart.cartItems.reduce((total, item) => total + (Number(item.quantity) || 0), 0)

  // Tạo payload order gửi về server
  const getOrderPayload = ({
    shippingAddressId,
    total,
    couponId,
    couponCode,
    paymentMethod,
    note
  }) => {
    return {
      cartItems: selectedCartItems.map(item => ({
        productId: typeof item.productId === 'object' ? item.productId._id : item.productId,
        quantity: item.quantity
      })),
      shippingAddressId,
      total,
      couponId,
      couponCode,
      paymentMethod,
      note
    }
  }

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
