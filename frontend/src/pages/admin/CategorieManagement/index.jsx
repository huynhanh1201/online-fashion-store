import React from 'react'
import CategoryTable from './CategoryTable'
import useCategories from '~/hooks/admin/useCategories'
import usePermissions from '~/hooks/usePermissions'
import { PermissionWrapper, RouteGuard } from '~/components/PermissionGuard'
import { useLocation } from 'react-router-dom'

// Lazy load các Chart
const AddCategoryModal = React.lazy(() => import('./modal/AddCategoryModal'))
const ViewCategoryModal = React.lazy(() => import('./modal/ViewCategoryModal'))
const EditCategoryModal = React.lazy(() => import('./modal/EditCategoryModal'))
const DeleteCategoryModal = React.lazy(
  () => import('./modal/DeleteCategoryModal')
)
const RestoreCategoryModal = React.lazy(
  () => import('./modal/RestoreCategoryModal')
)

const CategoryManagement = () => {
  const [page, setPage] = React.useState(1)
  const [selectedCategory, setSelectedCategory] = React.useState(null)

  const [modalType, setModalType] = React.useState(null)
  const { hasPermission } = usePermissions()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const searchFromUrl = queryParams.get('search') || ''
  const [filters, setFilters] = React.useState(() => ({
    destroy: 'false',
    sort: 'newest',
    ...(searchFromUrl ? { search: searchFromUrl } : {})
  }))

  const {
    categories,
    fetchCategories,
    Loading,
    totalPages,
    Save,
    add,
    update,
    remove,
    setROWS_PER_PAGE,
    ROWS_PER_PAGE,
    Restore
  } = useCategories()
  React.useEffect(() => {
    if (searchFromUrl) {
      // Xoá `search` khỏi URL sau khi đã đưa vào filters
      const newParams = new URLSearchParams(location.search)
      newParams.delete('search')
      window.history.replaceState({}, '', `${location.pathname}?${newParams}`)
    }
  }, [])
  React.useEffect(() => {
    fetchCategories(page, ROWS_PER_PAGE, filters)
  }, [page, ROWS_PER_PAGE, filters])

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
        await add(data, filters)
      } else if (type === 'edit') {
        await update(id, data)
      } else if (type === 'delete') {
        await remove(data)
      } else if (type === 'restore') {
        await Restore(data)
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
    <RouteGuard requiredPermissions={['admin:access', 'category:use']}>
      <CategoryTable
        categories={categories}
        loading={Loading}
        fetchCategories={fetchCategories}
        handleOpenModal={handleOpenModal}
        addCategory={() => setModalType('add')}
        onFilter={handleFilter}
        page={page - 1}
        rowsPerPage={ROWS_PER_PAGE}
        total={totalPages}
        onPageChange={handleChangePage}
        onChangeRowsPerPage={(newLimit) => {
          setPage(1)
          setROWS_PER_PAGE(newLimit)
        }}
        // Truyền quyền xuống component con
        permissions={{
          canCreate: hasPermission('category:create'),
          canEdit: hasPermission('category:update'),
          canDelete: hasPermission('category:delete'),
          canView: hasPermission('category:read')
        }}
        initialSearch={searchFromUrl}
        filters={filters}
      />

      <React.Suspense fallback={<></>}>
        <PermissionWrapper requiredPermissions={['category:create']}>
          {modalType === 'add' && (
            <AddCategoryModal
              open
              onClose={handleCloseModal}
              onAdded={handleSave}
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
              onSave={handleSave}
            />
          )}
        </PermissionWrapper>
        <PermissionWrapper requiredPermissions={['category:delete']}>
          {modalType === 'delete' && selectedCategory && (
            <DeleteCategoryModal
              open
              onClose={handleCloseModal}
              category={selectedCategory}
              onDelete={handleSave}
            />
          )}
        </PermissionWrapper>
        {modalType === 'restore' && selectedCategory && (
          <RestoreCategoryModal
            open
            onClose={handleCloseModal}
            category={selectedCategory}
            onRestore={handleSave}
          />
        )}
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
