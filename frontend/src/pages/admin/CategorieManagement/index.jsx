import React from 'react'
import CategoryTable from './CategoryTable'
import useCategories from '~/hooks/admin/useCategories'
import usePermissions from '~/hooks/usePermissions'
import { PermissionWrapper, RouteGuard } from '~/components/PermissionGuard'
import { useLocation } from 'react-router-dom'

// Lazy load các Chart
const AddCategoryModal = React.lazy(
  () => import('~/pages/admin/CategorieManagement/modal/AddCategoryModal')
)
const ViewCategoryModal = React.lazy(
  () => import('~/pages/admin/CategorieManagement/modal/ViewCategoryModal')
)
const EditCategoryModal = React.lazy(
  () => import('~/pages/admin/CategorieManagement/modal/EditCategoryModal')
)
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
  const categoryIdFromUrl = queryParams.get('categoryId')
  const [filters, setFilters] = React.useState(() => ({
    destroy: 'false',
    sort: 'newest'
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
    Restore,
    fetchById
  } = useCategories()
  React.useEffect(() => {
    if (categoryIdFromUrl) {
      fetchById(categoryIdFromUrl)
    } else {
      fetchCategories(page, ROWS_PER_PAGE, filters)
    }
  }, [page, ROWS_PER_PAGE, filters, categoryIdFromUrl])
  React.useEffect(() => {
    if (categoryIdFromUrl) {
      // Xoá categoryId khỏi URL nếu cần sau khi fetch xong
      const newParams = new URLSearchParams(location.search)
      newParams.delete('categoryId')
      window.history.replaceState({}, '', `${location.pathname}?${newParams}`)
    }
  }, [])
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
  const realParentIds = React.useMemo(() => {
    return new Set(
      categories
        .map((c) => (typeof c.parent === 'object' ? c.parent?._id : c.parent))
        .filter(Boolean)
    )
  }, [categories])

  const isParentCategory = (categoryId) => {
    return categoryId && !realParentIds.has(categoryId.toString())
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
          canView: hasPermission('category:read'),
          canRestore: hasPermission('category:restore')
        }}
        filters={filters}
        isParentCategory={isParentCategory}
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
              isParentCategory={isParentCategory}
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
        <PermissionWrapper requiredPermissions={['category:restore']}>
          {modalType === 'restore' && selectedCategory && (
            <RestoreCategoryModal
              open
              onClose={handleCloseModal}
              category={selectedCategory}
              onRestore={handleSave}
            />
          )}
        </PermissionWrapper>
      </React.Suspense>
    </RouteGuard>
  )
}

export default CategoryManagement
