import React from 'react'
import { Typography, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

import ColorTable from './ColorTable'
import ColorPagination from './ColorPagination'

import useColors from '~/hooks/admin/useColor'
import { updateColor, deleteColor } from '~/services/admin/ColorService'

// Lazy load các modal
const AddColorModal = React.lazy(() => import('./modal/AddColorModal'))
const ViewColorModal = React.lazy(() => import('./modal/ViewColorModal'))
const EditColorModal = React.lazy(() => import('./modal/EditColorModal'))
const DeleteColorModal = React.lazy(() => import('./modal/DeleteColorModal'))

const ColorManagement = () => {
  const [page, setPage] = React.useState(1)
  const [selectedColor, setSelectedColor] = React.useState(null)
  const [modalType, setModalType] = React.useState(null)

  const { colors, totalPages, fetchColors, Loading } = useColors()

  React.useEffect(() => {
    const loadData = async () => {
      await fetchColors(page)
    }
    loadData()
  }, [page])

  const handleOpenModal = (type, color) => {
    if (!color || !color._id) return
    setSelectedColor(color)
    setModalType(type)
  }

  const handleCloseModal = () => {
    setSelectedColor(null)
    setModalType(null)
  }

  const handleChangePage = (event, value) => setPage(value)

  const handleSaveColor = async (colorId, updatedData) => {
    try {
      const response = await updateColor(colorId, updatedData)
      if (response) {
        await fetchColors(page)
      } else {
        console.log('Cập nhật không thành công')
      }
    } catch (error) {
      console.error('Lỗi:', error)
    }
  }

  const handleDeleteColor = async (colorId) => {
    try {
      const result = await deleteColor(colorId)
      if (result) {
        await fetchColors(page)
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
        Quản lý màu sắc sản phẩm
      </Typography>

      <ColorTable
        colors={colors}
        loading={Loading}
        handleOpenModal={handleOpenModal}
        addColor={() => setModalType('add')}
      />

      <React.Suspense fallback={<></>}>
        {modalType === 'add' && (
          <AddColorModal
            open
            onClose={handleCloseModal}
            onAdded={() => fetchColors(page)}
          />
        )}

        {modalType === 'view' && selectedColor && (
          <ViewColorModal
            open
            onClose={handleCloseModal}
            color={selectedColor}
          />
        )}

        {modalType === 'edit' && selectedColor && (
          <EditColorModal
            open
            onClose={handleCloseModal}
            color={selectedColor}
            onSave={handleSaveColor}
          />
        )}

        {modalType === 'delete' && selectedColor && (
          <DeleteColorModal
            open
            onClose={handleCloseModal}
            color={selectedColor}
            onDelete={handleDeleteColor}
          />
        )}
      </React.Suspense>

      {/*<ColorPagination*/}
      {/*  page={page}*/}
      {/*  totalPages={totalPages}*/}
      {/*  onPageChange={handleChangePage}*/}
      {/*/>*/}
    </>
  )
}

export default ColorManagement
