import { useState, useEffect } from 'react'
import {
  getColorPalettes,
  createColorPalette
} from '~/services/admin/colorPaletteService'

const useColorPalettes = () => {
  const [colorPalettes, setColorPalettes] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchColorPalettes = async () => {
    setLoading(true)
    try {
      const data = await getColorPalettes()
      setColorPalettes(data || [])
    } catch (error) {
      console.error('Lỗi khi fetch danh sách màu:', error)
      setColorPalettes([])
    } finally {
      setLoading(false)
    }
  }

  const addColorPalette = async (data) => {
    try {
      const newColor = await createColorPalette(data)
      setColorPalettes((prev) => [...prev, newColor])
      return newColor
    } catch (error) {
      console.error('Lỗi khi thêm màu mới:', error)
      throw error
    }
  }

  useEffect(() => {
    fetchColorPalettes()
  }, [])

  return { colorPalettes, loading, fetchColorPalettes, addColorPalette }
}

export default useColorPalettes
