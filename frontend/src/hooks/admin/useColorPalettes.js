import { useEffect, useState } from 'react'
import {
  getColorPalettes,
  createColorPalette,
  updateColorPalette,
  deleteColorPalette,
  getColorPaletteById
} from '~/services/admin/colorPaletteService'

const useColorPalettes = (productId) => {
  const [colorPalettes, setColorPalettes] = useState([])
  const [loading, setLoading] = useState(false)
  const [paletteId, setPaletteId] = useState(null)

  const fetchColorPalettes = async () => {
    if (!productId) return
    setLoading(true)
    try {
      const data = await getColorPalettes(
        (productId = '6853ef5fa2331414899bfaf2')
      )
      setColorPalettes(data.colors)
      setPaletteId(data.paletteId)
    } catch (error) {
      console.error('Lỗi khi fetch danh sách màu:', error)
      setColorPalettes([])
      setPaletteId(null)
    } finally {
      setLoading(false)
    }
  }

  const addColorPalette = async (product, data) => {
    try {
      const newColor = await createColorPalette(product, data)
      await fetchColorPalettes() // load lại màu mới
      return newColor
    } catch (error) {
      console.error('Lỗi khi thêm màu mới:', error)
      throw error
    }
  }

  const editColorPalette = async (colorId, updatedData) => {
    try {
      const updated = await updateColorPalette(colorId, updatedData)
      await fetchColorPalettes()
      return updated
    } catch (error) {
      console.error('Lỗi khi cập nhật màu:', error)
      throw error
    }
  }

  const removeColorPalette = async (colorId) => {
    try {
      await deleteColorPalette(colorId)
      await fetchColorPalettes()
    } catch (error) {
      console.error('Lỗi khi xóa màu:', error)
      throw error
    }
  }
  const getColorPaletteId = async (colorId) => {
    try {
      const color = await getColorPaletteById(colorId)
      return color
    } catch (error) {
      console.error('Lỗi khi lấy thông tin màu:', error)
      throw error
    }
  }
  //
  // useEffect(() => {
  //   fetchColorPalettes()
  // }, [productId])

  return {
    colorPalettes,
    loading,
    paletteId,
    fetchColorPalettes,
    addColorPalette,
    editColorPalette,
    removeColorPalette,
    getColorPaletteId
  }
}

export default useColorPalettes
