import React from 'react'
import { Typography } from '@mui/material'
import { Button } from '@mui/material'
import CategoryTable from './CategoryTable'
import CategoryPagination from './CategoryPagination'
import useCategories from '~/hooks/admin/useCategories'
import usePermissions from '~/hooks/usePermissions'
import { PermissionWrapper, RouteGuard } from '~/components/PermissionGuard'
import {
  updateCategory,
  deleteCategory
} from '~/services/admin/categoryService'
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

  const { categories, fetchCategories, Loading, totalPages, Save, fetchById } =
    useCategories()
  
  const { hasPermission } = usePermissions()

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

  const handleSaveCategory = async (categoryId, updatedData) => {
    try {
      const response = await updateCategory(categoryId, updatedData)

      if (response) {
        const updatedCategory = await fetchById(categoryId)

        if (updatedCategory) {
          Save(updatedCategory)
        }
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
        const deleteCategory = await fetchById(categoryId)
        if (deleteCategory) {
          Save(deleteCategory)
        }
      } else {
        console.log('Xoá không thành công')
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
    <RouteGuard requiredPermissions={['admin:access', 'category:read']}>
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
        // Truyền quyền xuống component con
        permissions={{
          canCreate: hasPermission('category:create'),
          canEdit: hasPermission('category:update'),
          canDelete: hasPermission('category:delete'),
          canView: hasPermission('category:read')
        }}
      />

      <React.Suspense fallback={<></>}>
        <PermissionWrapper requiredPermissions={['category:create']}>
          {modalType === 'add' && (
            <AddCategoryModal
              open
              onClose={handleCloseModal}
              onAdded={() => {
                fetchCategories(page, limit, filters)
              }}
            />
          )}
        </PermissionWrapper>

        {modalType === 'view' && selectedCategory && (
          <ViewCategoryModal
            open
            onClose={handleCloseModal}
            category={selectedCategory}
          />
        )}

        <PermissionWrapper requiredPermissions={['category:update']}>
          {modalType === 'edit' && selectedCategory && (
            <EditCategoryModal
              open
              onClose={handleCloseModal}
              category={selectedCategory}
              onSave={handleSaveCategory}
            />
          )}
        </PermissionWrapper>

        <PermissionWrapper requiredPermissions={['category:delete']}>
          {modalType === 'delete' && selectedCategory && (
            <DeleteCategoryModal
              open
              onClose={handleCloseModal}
              category={selectedCategory}
              onDelete={handleDeleteCategory}
            />
          )}
        </PermissionWrapper>
      </React.Suspense>

      {/*<CategoryPagination*/}
      {/*  page={page}*/}
      {/*  totalPages={totalPages}*/}
      {/*  onPageChange={handleChangePage}*/}
      {/*/>*/}
    </RouteGuard>
  )
}

export default CategoryManagement
