import React from 'react'
import { useState, useEffect } from 'react'
import {
  getSizePalettes,
  createSizePalette,
  updateSizePalette,
  deleteSizePalette,
  getSizePaletteById
} from '~/services/admin/sizePaletteService'

const useSizePalettes = (productId) => {
  const [sizePalettes, setSizePalettes] = useState([])
  const [loading, setLoading] = useState(false)
  const [paletteId, setPaletteId] = useState(null)

  const fetchSizePalettes = async () => {
    if (!productId) return
    setLoading(true)
    try {
      const data = await getSizePalettes(
        (productId = '6853ef5fa2331414899bfaf2')
      )
      setSizePalettes(data.sizes || [])
      setPaletteId(data.paletteId || null)
    } catch (error) {
      console.error('Error fetching size palettes:', error)
      setSizePalettes([])
      setPaletteId(null)
    } finally {
      setLoading(false)
    }
  }

  const addSizePalette = async (productId, data) => {
    try {
      const newPalette = await createSizePalette(productId, data)
      await fetchSizePalettes() // reload the palettes
      return newPalette
    } catch (error) {
      console.error('Error adding size palette:', error)
      throw error
    }
  }

  const editSizePalette = async (id, updatedData) => {
    try {
      const updatedPalette = await updateSizePalette(id, updatedData)
      await fetchSizePalettes()
      return updatedPalette
    } catch (error) {
      console.error('Error updating size palette:', error)
      throw error
    }
  }

  const removeSizePalette = async (id) => {
    try {
      await deleteSizePalette(id)
      await fetchSizePalettes()
    } catch (error) {
      console.error('Error deleting size palette:', error)
      throw error
    }
  }
  const getSizePaletteId = async (id) => {
    try {
      const palette = await getSizePaletteById(id)
      return palette
    } catch (error) {
      console.error('Error fetching size palette by ID:', error)
      throw error
    }
  }

  // useEffect(() => {
  //   fetchSizePalettes()
  // }, [productId])

  return {
    sizePalettes,
    loading,
    paletteId,
    fetchSizePalettes,
    addSizePalette,
    editSizePalette,
    removeSizePalette,
    getSizePaletteId
  }
}
export default useSizePalettes
