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
  const [limit, setLimit] = React.useState(10) // Giới hạn số lượng màu hiển thị mỗi trang
  const [modalType, setModalType] = React.useState(null)
  const [filters, setFilters] = React.useState({
    status: 'false',
    sort: 'newest'
  })
  const {
    colors,
    totalPages,
    fetchColors,
    Loading,
    getColorId,
    saveColor,
    remove,
    update,
    createNewColor
  } = useColors()

  React.useEffect(() => {
    fetchColors(page, limit, filters)
  }, [page, limit, filters])

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

  // const handleSaveColor = async (colorId, updatedData) => {
  //   try {
  //     const response = await updateColor(colorId, updatedData)
  //     if (response) {
  //       const updatedColor = await getColorId(colorId)
  //       if (updatedColor) {
  //         saveColor(updatedColor)
  //       }
  //     } else {
  //       console.log('Cập nhật không thành công')
  //     }
  //   } catch (error) {
  //     console.error('Lỗi:', error)
  //   }
  // }
  //
  // const handleDeleteColor = async (colorId) => {
  //   try {
  //     const result = await deleteColor(colorId)
  //     if (result) {
  //       const deletedColor = await getColorId(colorId)
  //       if (deletedColor) {
  //         saveColor(deletedColor)
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
        await createNewColor(data, filters)
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
      <ColorTable
        colors={colors}
        loading={Loading}
        handleOpenModal={handleOpenModal}
        addColor={() => setModalType('add')}
        onFilters={handleFilter}
        fetchColors={fetchColors}
        page={page - 1}
        rowsPerPage={limit}
        total={totalPages}
        onPageChange={handleChangePage}
        onChangeRowsPerPage={(newLimit) => {
          setPage(1)
          setLimit(newLimit)
        }}
      />

      <React.Suspense fallback={<></>}>
        {modalType === 'add' && (
          <AddColorModal open onClose={handleCloseModal} onAdded={handleSave} />
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
            onSave={handleSave}
          />
        )}

        {modalType === 'delete' && selectedColor && (
          <DeleteColorModal
            open
            onClose={handleCloseModal}
            color={selectedColor}
            onDelete={handleSave}
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
