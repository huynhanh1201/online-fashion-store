import React from 'react'
import {
  getPartners,
  createPartner,
  deletePartner,
  updatePartner,
  getPartnerById
} from '~/services/admin/Inventory/PartnerService.js'

const usePartner = () => {
  const [partners, setPartners] = React.useState([])
  const [total, setTotal] = React.useState(0)

  const fetchPartners = async (page = 1, limit = 10, filters = {}) => {
    try {
      const { partners, total } = await getPartners({
        page,
        limit,
        ...filters
      })
      setPartners(partners)
      setTotal(total || 0)
      return { partners, total }
    } catch (error) {
      console.error('Error fetching partners:', error)
      return { partners: [], total: 0 }
    }
  }

  const fetchPartnerById = async (id) => {
    try {
      const partner = await getPartnerById(id)
      return partner
    } catch (error) {
      console.error('Error fetching partner by ID:', error)
      return null
    }
  }

  const createNewPartner = async (data) => {
    try {
      const newPartner = await createPartner(data)
      setPartners((prev) => [...prev, newPartner])
      return newPartner
    } catch (error) {
      console.error('Error creating partner:', error)
      return null
    }
  }

  const updateExistingPartner = async (id, data) => {
    try {
      const updatedPartner = await updatePartner(id, data)
      setPartners((prev) =>
        prev.map((partner) => (partner.id === id ? updatedPartner : partner))
      )
      return updatedPartner
    } catch (error) {
      console.error('Error updating partner:', error)
      return null
    }
  }

  const removePartner = async (id) => {
    try {
      await deletePartner(id)
      setPartners((prev) => prev.filter((partner) => partner.id !== id))
      return true
    } catch (error) {
      console.error('Error deleting partner:', error)
      return false
    }
  }

  return {
    partners,
    total,
    fetchPartners,
    fetchPartnerById,
    createNewPartner,
    updateExistingPartner,
    removePartner
  }
}

export default usePartner
