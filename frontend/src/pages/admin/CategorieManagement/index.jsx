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
  const [selectedCategory, setSelectedCategory] = React.useState(null)
  const [modalType, setModalType] = React.useState(null)

  const { categories, totalPages, fetchCategories, Loading } = useCategories()

  React.useEffect(() => {
    const loadData = async () => {
      await fetchCategories(page)
    }
    loadData()
  }, [page])

  const handleOpenModal = (type, category) => {
    if (!category || !category._id) return
    setSelectedCategory(category)
    setModalType(type)
  }

  const handleCloseModal = () => {
    setSelectedCategory(null)
    setModalType(null)
  }

  const handleChangePage = (event, value) => setPage(value)

  const handleSaveCategory = async (categoryId, updatedData) => {
    try {
      const response = await updateCategory(categoryId, updatedData)
      if (response) {
        await fetchCategories(page)
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
        await fetchCategories(page)
      } else {
        console.log('Xoá không thành công')
      }
    } catch (error) {
      console.error('Lỗi:', error)
    }
  }

  const styles = {
    buttonAdd: {
      backgroundColor: '#001f5d',
      color: '#fff',
      marginBottom: '16px'
    }
  }

  return (
    <>
      <Typography variant='h5' sx={{ mb: 2 }}>
        Quản lý danh mục sản phẩm
      </Typography>
      <Button
        variant='contained'
        sx={styles.buttonAdd}
        startIcon={<AddIcon />}
        onClick={() => setModalType('add')}
      >
        Thêm danh mục
      </Button>
      <CategoryTable
        categories={categories}
        loading={Loading}
        handleOpenModal={handleOpenModal}
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

      <CategoryPagination
        page={page}
        totalPages={totalPages}
        onPageChange={handleChangePage}
      />
    </>
  )
}

export default CategoryManagement
