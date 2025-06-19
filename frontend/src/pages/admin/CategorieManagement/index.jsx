import React from 'react'
import CategoryTable from './CategoryTable'
import useCategories from '~/hooks/admin/useCategories'
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

  const {
    categories,
    fetchCategories,
    Loading,
    totalPages,
    Save,
    fetchById,
    add,
    update,
    remove
  } = useCategories()

  React.useEffect(() => {
    fetchCategories(page, limit, filters)
  }, [page, limit, filters])

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
  const handleSave = async (data, type, id) => {
    try {
      if (type === 'add') {
        await add(data)
      } else if (type === 'edit') {
        await update(id, data)
      } else if (type === 'delete') {
        await remove(data)
      }
    } catch (error) {
      console.error('Lỗi:', error)
    }
  }

  // const handleSaveCategory = async (categoryId, updatedData) => {
  //   try {
  //     await update(categoryId, updatedData)
  //   } catch (error) {
  //     console.error('Lỗi:', error)
  //   }
  // }
  //
  // const handleDeleteCategory = async (categoryId) => {
  //   try {
  //     const result = await remove(categoryId)
  //     if (result) {
  //       const deleteCategory = await fetchById(categoryId)
  //       if (deleteCategory) {
  //         Save(deleteCategory)
  //       }
  //     } else {
  //       console.log('Xoá không thành công')
  //     }
  //   } catch (error) {
  //     console.error('Lỗi:', error)
  //   }
  // }

  const isEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2)

  const handleFilter = (newFilters) => {
    if (!isEqual(filters, newFilters)) {
      setPage(1)
      setFilters(newFilters)
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
            onAdded={handleSave}
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
            onSave={handleSave}
          />
        )}

        {modalType === 'delete' && selectedCategory && (
          <DeleteCategoryModal
            open
            onClose={handleCloseModal}
            category={selectedCategory}
            onDelete={handleSave}
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
