import React from 'react'
import { Typography, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import SizeTable from './SizeTable.jsx'
import SizePagination from './SizePagination'

import useSizes from '~/hooks/admin/useSize'
import { updateSize, deleteSize } from '~/services/admin/sizeService'

// Lazy load các modal
const AddSizeModal = React.lazy(() => import('./modal/AddSizeModal'))
const ViewSizeModal = React.lazy(() => import('./modal/ViewSizeModal'))
const EditSizeModal = React.lazy(() => import('./modal/EditSizeModal'))
const DeleteSizeModal = React.lazy(() => import('./modal/DeleteSizeModal'))

const SizeManagement = () => {
  const [page, setPage] = React.useState(1)
  const [selectedSize, setSelectedSize] = React.useState(null)
  const [modalType, setModalType] = React.useState(null)

  const { sizes, totalPages, fetchSizes, Loading } = useSizes()

  React.useEffect(() => {
    const loadData = async () => {
      await fetchSizes(page)
    }
    loadData()
  }, [page])

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

  const handleSaveSize = async (sizeId, updatedData) => {
    try {
      const response = await updateSize(sizeId, updatedData)
      if (response) {
        await fetchSizes(page)
      } else {
        console.log('Cập nhật không thành công')
      }
    } catch (error) {
      console.error('Lỗi:', error)
    }
  }

  const handleDeleteSize = async (sizeId) => {
    try {
      const result = await deleteSize(sizeId)
      if (result) {
        await fetchSizes(page)
      } else {
        console.log('Xoá không thành công')
      }
    } catch (error) {
      console.error('Lỗi:', error)
    }
  }

  return (
    <>
      <Typography variant='h5' sx={{ mb: 2 }}>
        Quản lý kích thước sản phẩm
      </Typography>

      <SizeTable
        sizes={sizes}
        loading={Loading}
        handleOpenModal={handleOpenModal}
        addSize={() => setModalType('add')}
      />

      <React.Suspense fallback={<></>}>
        {modalType === 'add' && (
          <AddSizeModal
            open
            onClose={handleCloseModal}
            onAdded={() => fetchSizes(page)}
          />
        )}

        {modalType === 'view' && selectedSize && (
          <ViewSizeModal open onClose={handleCloseModal} size={selectedSize} />
        )}

        {modalType === 'edit' && selectedSize && (
          <EditSizeModal
            open
            onClose={handleCloseModal}
            size={selectedSize}
            onSave={handleSaveSize}
          />
        )}

        {modalType === 'delete' && selectedSize && (
          <DeleteSizeModal
            open
            onClose={handleCloseModal}
            size={selectedSize}
            onDelete={handleDeleteSize}
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
