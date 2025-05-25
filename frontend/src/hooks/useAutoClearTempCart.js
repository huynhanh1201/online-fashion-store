import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearTempCart } from '~/redux/cart/cartSlice'

export const useAutoClearTempCart = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const isBuyNow = useSelector((state) => state.cart.isBuyNow)

  useEffect(() => {
    // Nếu đang là "Buy Now" nhưng user rời khỏi màn payment, thì clear
    const isNotPayment = !location.pathname.includes('/payment')
    if (isBuyNow && isNotPayment) {
      dispatch(clearTempCart())
    }
  }, [location.pathname])
}