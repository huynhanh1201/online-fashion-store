import { useState } from 'react'
import { validateCoupon } from '~/services/couponService'

const useCoupon = () => {
  const [voucher, setVoucher] = useState('')
  const [discount, setDiscount] = useState(0)
  const [discountMessage, setDiscountMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [couponId, setCouponId] = useState(null)

  // const handleInputChange = (value) => {
  //   setVoucher(value.toUpperCase())
  //   setError('')
  //   setDiscountMessage('')
  //   if (value.length > 10) {
  //     setError('Mã giảm giá tối đa 10 ký tự')
  //   }
  // }

  const handleApplyVoucher = async (inputVoucher, subTotal) => {
    if (!inputVoucher) {
      setError('Vui lòng nhập mã giảm giá')
      return { valid: false, message: 'Vui lòng nhập mã giảm giá' }
    }

    // if (inputVoucher.length < 5) {
    //   setError('Mã giảm giá phải có ít nhất 5 ký tự')
    //   return { valid: false, message: 'Mã giảm giá quá ngắn' }
    // }

    setLoading(true)
    setError('')
    setDiscountMessage('')

    try {
      const result = await validateCoupon(subTotal, inputVoucher)

      if (result.valid) {
        setDiscount(result.discountAmount || 0)
        setDiscountMessage(result.message || 'Áp dụng mã giảm giá thành công!')
        setCouponId(result.couponId || null)

        return result
      } else {
        setDiscount(0)
        setCouponId(null)
        setError(result.message || 'Mã giảm giá không hợp lệ hoặc đã hết hạn')
        return result
      }
    } catch (error) {
      setDiscount(0)
      setCouponId(null)
      const message = error?.response?.data?.message || error.message || 'Lỗi khi kiểm tra mã giảm giá'
      setError(message)
      return { valid: false, message }
    } finally {
      setLoading(false)
    }
  }


  return {
    voucher,
    error,
    setVoucher,
    discount,
    discountMessage,
    couponId,
    loading,
    handleApplyVoucher
  }
}

export default useCoupon
