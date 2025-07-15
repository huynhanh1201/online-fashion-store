import { useEffect, useState, useRef, useCallback } from 'react'
import * as addressService from '~/services/addressService'

export const useAddress = () => {
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchedRef = useRef(false)

  // Sử dụng useCallback để tránh lỗi dependency
  const fetchAddresses = useCallback(async (force = false) => {
    if (fetchedRef.current && !force) return
    setLoading(true)
    setError(null)
    try {
      const res = await addressService.getShippingAddresses()
      setAddresses(res.addresses || [])
      fetchedRef.current = true
    } catch (err) {
      console.error('Lỗi khi lấy địa chỉ:', err)
      setError(err.message || 'Không thể lấy địa chỉ')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAddresses()
  }, [fetchAddresses])

  const addAddress = async (data) => {
    try {
      const newAddr = await addressService.addShippingAddress(data)
      setAddresses(prev => [newAddr, ...prev])
      return newAddr
    } catch (err) {
      console.error('Lỗi thêm địa chỉ:', err)
      throw err
    }
  }

  const editAddress = async (id, data) => {
    try {
      const updated = await addressService.updateShippingAddress(id, data)
      setAddresses(prev =>
        prev.map(addr => (addr._id === id ? updated : addr))
      )
      return updated
    } catch (err) {
      console.error('Lỗi cập nhật địa chỉ:', err)
      throw err
    }
  }

  const removeAddress = async (id) => {
    try {
      await addressService.deleteShippingAddress(id)
      setAddresses(prev => prev.filter(addr => addr._id !== id))
    } catch (err) {
      console.error('Lỗi xoá địa chỉ:', err)
      throw err
    }
  }

  return {
    addresses,
    loading,
    error,
    fetchAddresses,
    addAddress,
    editAddress,
    removeAddress
  }
}
