import React from 'react'
import {
  getPartners,
  createPartner,
  deletePartner,
  updatePartner,
  getPartnerById,
  restorePartner
} from '~/services/admin/Inventory/PartnerService.js'

const usePartner = () => {
  const [partners, setPartners] = React.useState([])
  const [totalPartner, setTotal] = React.useState(0)
  const [loadingPartner, setLoading] = React.useState(false)
  const [ROWS_PER_PAGE, setROWS_PER_PAGE] = React.useState(10)
  const fetchPartners = async (page = 1, limit = 10, filters = {}) => {
    setLoading(true)
    const buildQuery = (input) => {
      const query = { page, limit, ...input }
      Object.keys(query).forEach((key) => {
        if (
          query[key] === '' ||
          query[key] === undefined ||
          query[key] === null
        ) {
          delete query[key]
        }
      })
      return query
    }
    try {
      const query = buildQuery(filters)
      const { partners, total } = await getPartners(query)
      setPartners(partners)
      setTotal(total || 0)
      setLoading(false)

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

  const createNewPartner = async (data, filters = {}) => {
    try {
      const newPartner = await createPartner(data)
      if (!newPartner) {
        console.error('Không thể tạo đối tác mới')
        return null
      }

      setPartners((prev) => {
        const sort = filters?.sort
        let updated = [...prev]

        if (sort === 'newest') {
          updated = [newPartner, ...prev].slice(0, ROWS_PER_PAGE)
        } else if (sort === 'oldest') {
          if (prev.length < ROWS_PER_PAGE) {
            updated = [...prev, newPartner]
          }
          // Đủ 10 phần tử thì không thêm
        } else {
          updated = [newPartner, ...prev].slice(0, ROWS_PER_PAGE)
        }

        return updated
      })

      setTotal((prev) => prev + 1)
      return newPartner
    } catch (error) {
      console.error('Lỗi khi tạo đối tác mới:', error)
      return null
    }
  }

  const updateExistingPartner = async (id, data) => {
    try {
      const updatedPartner = await updatePartner(id, data)
      if (!updatedPartner) {
        console.error('Không thể cập nhật đối tác')
        return null
      }
      setPartners((prev) =>
        prev.map((partner) =>
          partner._id === updatedPartner._id ? updatedPartner : partner
        )
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
      setPartners((prev) => prev.filter((partner) => partner._id !== id))
      setTotal((prev) => prev - 1)
      return true
    } catch (error) {
      console.error('Error deleting partner:', error)
      return false
    }
  }
  const restore = async (id) => {
    try {
      const restoredPartner = await restorePartner(id)
      if (!restoredPartner) {
        console.error('Không thể khôi phục đối tác')
        return null
      }
      setPartners((prev) => prev.filter((partner) => partner._id !== id))
      setTotal((prev) => prev - 1)
      return restoredPartner
    } catch (error) {
      console.error('Error restoring partner:', error)
      return null
    }
  }

  const Save = (data) => {
    setPartners((prev) => prev.map((d) => (d._id === data._id ? data : d)))
  }

  return {
    partners,
    loadingPartner,
    totalPartner,
    fetchPartners,
    fetchPartnerById,
    createNewPartner,
    updateExistingPartner,
    removePartner,
    Save,
    ROWS_PER_PAGE,
    setROWS_PER_PAGE,
    restore
  }
}

export default usePartner
