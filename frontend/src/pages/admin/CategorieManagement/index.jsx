import React from 'react'
import { Typography } from '@mui/material'
import { Button } from '@mui/material'
import CategoryTable from './CategoryTable'
import CategoryPagination from './CategoryPagination'
import useCategories from '~/hooks/admin/useCategories'
import { updateCategory } from '~/services/admin/categoryService'
import { deleteCategory } from '~/services/admin/categoryService'
import AddIcon from '@mui/icons-material/Add'
// Lazy load các modal
const AddCategoryModal = React.lazy(() => import('./modal/AddCategoryModal'))
const ViewCategoryModal = React.lazy(() => import('./modal/ViewCategoryModal'))
const EditCategoryModal = React.lazy(() => import('./modal/EditCategoryModal'))
const DeleteCategoryModal = React.lazy(
  () => import('./modal/DeleteCategoryModal')
)

const CategoryManagement = () => {
  const [page, setPage] = React.useState(1)
  const [limit, setLimit] = React.useState(10)
  const [filters, setFilters] = React.useState({})
  const [selectedCategory, setSelectedCategory] = React.useState(null)
  const [modalType, setModalType] = React.useState(null)

  const { categories, fetchCategories, Loading, totalPages } = useCategories()

  React.useEffect(() => {
    fetchCategories(page)
  }, [page])

  const handleChangePage = (event, value) => setPage(value)

  const handleOpenModal = (type, category) => {
    if (!category || !category._id) return
    setSelectedCategory(category)
    setModalType(type)
  }

  const handleCloseModal = () => {
    setSelectedCategory(null)
    setModalType(null)
  }

  const handleSaveCategory = async (categoryId, updatedData) => {
    try {
      const response = await updateCategory(categoryId, updatedData)
      if (response) {
        await fetchCategories()
      } else {
        console.log('Cập nhật không thành công')
      }
    } catch (error) {
      console.error('Lỗi:', error)
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    try {
      const result = await deleteCategory(categoryId)
      if (result) {
        await fetchCategories()
      } else {
        console.log('Xoá không thành công')
      }
    } catch (error) {
      console.error('Lỗi:', error)
    }
  }
  const handleFilter = (newFilters) => {
    setFilters(newFilters)
    if (Object.keys(newFilters).length > 0) {
      fetchCategories(1, limit, newFilters)
    }
  }
  return (
    <>
      <CategoryTable
        categories={categories}
        loading={Loading}
        fetchCategories={fetchCategories}
        handleOpenModal={handleOpenModal}
        addCategory={() => setModalType('add')}
        onFilter={handleFilter}
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
          <AddCategoryModal
            open
            onClose={handleCloseModal}
            onAdded={() => fetchCategories(page)}
          />
        )}
        {modalType === 'view' && selectedCategory && (
          <ViewCategoryModal
            open
            onClose={handleCloseModal}
            category={selectedCategory}
          />
        )}

        {modalType === 'edit' && selectedCategory && (
          <EditCategoryModal
            open
            onClose={handleCloseModal}
            category={selectedCategory}
            onSave={handleSaveCategory}
          />
        )}

        {modalType === 'delete' && selectedCategory && (
          <DeleteCategoryModal
            open
            onClose={handleCloseModal}
            category={selectedCategory}
            onDelete={handleDeleteCategory}
          />
        )}
      </React.Suspense>

      {/*<CategoryPagination*/}
      {/*  page={page}*/}
      {/*  totalPages={totalPages}*/}
      {/*  onPageChange={handleChangePage}*/}
      {/*/>*/}
    </>
  )
}

export default CategoryManagement
