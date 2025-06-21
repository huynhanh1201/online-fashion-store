import React from 'react'
import { Typography, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import SizeTable from './SizeTable.jsx'
import SizePagination from './SizePagination'

import useSizes from '~/hooks/admin/useSize'

// Lazy load các modal
const AddSizeModal = React.lazy(() => import('./modal/AddSizeModal'))
const ViewSizeModal = React.lazy(() => import('./modal/ViewSizeModal'))
const EditSizeModal = React.lazy(() => import('./modal/EditSizeModal'))
const DeleteSizeModal = React.lazy(() => import('./modal/DeleteSizeModal'))

const SizeManagement = () => {
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10) // Giới hạn số lượng kích thước trên mỗi trang
  const [filters, setFilters] = React.useState({
    status: 'false',
    sort: 'newest'
  }) // Bộ lọc tìm kiếm
  const [selectedSize, setSelectedSize] = React.useState(null)
  const [modalType, setModalType] = React.useState(null)

  const {
    sizes,
    totalPages,
    fetchSizes,
    Loading,
    fetchSizeById,
    Save,
    remove,
    update,
    createNewSize
  } = useSizes()

  React.useEffect(() => {
    fetchSizes(page, limit, filters)
  }, [page, limit, filters])

  const handleOpenModal = (type, size) => {
    if (!size || !size._id) return
    setSelectedSize(size)
    setModalType(type)
  }

  const handleCloseModal = () => {
    setSelectedSize(null)
    setModalType(null)
  }

  const handleChangePage = (event, value) => setPage(value)

  // const handleSaveSize = async (sizeId, updatedData) => {
  //   try {
  //     const response = await updateSize(sizeId, updatedData)
  //     if (response) {
  //       const updatedSize = await fetchSizeById(sizeId)
  //       if (updatedSize) {
  //         Save(updatedSize)
  //       }
  //     } else {
  //       console.log('Cập nhật không thành công')
  //     }
  //   } catch (error) {
  //     console.error('Lỗi:', error)
  //   }
  // }
  //
  // const handleDeleteSize = async (sizeId) => {
  //   try {
  //     const result = await deleteSize(sizeId)
  //     if (result) {
  //       const removeSize = await fetchSizeById(sizeId)
  //       if (removeSize) {
  //         Save(removeSize)
  //       }
  //     } else {
  //       console.log('Xoá không thành công')
  //     }
  //   } catch (error) {
  //     console.error('Lỗi:', error)
  //   }
  // }

  const handleSave = async (data, type, id) => {
    try {
      if (type === 'add') {
        await createNewSize(data, filters)
      } else if (type === 'edit') {
        await update(id, data)
      } else if (type === 'delete') {
        await remove(data)
      }
    } catch (error) {
      console.error('Lỗi:', error)
    }
  }

  const isEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2)

  const handleFilter = (newFilters) => {
    if (!isEqual(filters, newFilters)) {
      setPage(1)
      setFilters(newFilters)
    }
  }
  return (
    <>
      <SizeTable
        sizes={sizes}
        loading={Loading}
        handleOpenModal={handleOpenModal}
        addSize={() => setModalType('add')}
        onFilters={handleFilter}
        page={page - 1}
        rowsPerPage={limit}
        total={totalPages}
        onPageChange={handleChangePage}
        onChangeRowsPerPage={(newLimit) => {
          setPage(1)
          setLimit(newLimit)
        }}
        fetchSizes={fetchSizes}
      />

      <React.Suspense fallback={<></>}>
        {modalType === 'add' && (
          <AddSizeModal open onClose={handleCloseModal} onAdded={handleSave} />
        )}

        {modalType === 'view' && selectedSize && (
          <ViewSizeModal open onClose={handleCloseModal} size={selectedSize} />
        )}

        {modalType === 'edit' && selectedSize && (
          <EditSizeModal
            open
            onClose={handleCloseModal}
            size={selectedSize}
            onSave={handleSave}
          />
        )}

        {modalType === 'delete' && selectedSize && (
          <DeleteSizeModal
            open
            onClose={handleCloseModal}
            size={selectedSize}
            onDelete={handleSave}
          />
        )}
      </React.Suspense>

      {/*<SizePagination*/}
      {/*  page={page}*/}
      {/*  totalPages={totalPages}*/}
      {/*  onPageChange={handleChangePage}*/}
      {/*/>*/}
    </>
  )
}

export default SizeManagement
