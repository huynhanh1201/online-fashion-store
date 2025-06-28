// // components/ProductManagement.jsx
// import React from 'react'
//
// import Typography from '@mui/material/Typography'
// import Button from '@mui/material/Button'
// import Box from '@mui/material/Box'
// import AddIcon from '@mui/icons-material/Add'
//
// import ProductTable from './ProductTable'
// import ProductPagination from './ProductPagination'
//
// import useProducts from '~/hook/admin/useProducts'
//
// import { updateProduct, deleteProduct } from '~/services/admin/productService'
//
// const AddProductModal = React.lazy(() => import('./modal/AddProductModal'))
// const EditProductModal = React.lazy(() => import('./modal/EditProductModal'))
// const DeleteProductModal = React.lazy(
//   () => import('./modal/DeleteProductModal')
// )
// const ViewProductModal = React.lazy(() => import('./modal/ViewProductModal'))
//
// const ProductManagement = () => {
//   const [page, setPage] = React.useState(1)
//   const [limit] = React.useState(10)
//   const [modalType, setModalType] = React.useState(null)
//   const [selectedProduct, setSelectedProduct] = React.useState(null)
//
//   const { products, totalPages, fetchProducts, loading } = useProducts()
//
//   React.useEffect(() => {
//     fetchProducts(page, limit)
//   }, [page, limit])
//
//   const handleChangePage = (event, value) => setPage(value)
//
//   const handleOpenModal = (type, product = null) => {
//     setSelectedProduct(product)
//     setModalType(type)
//   }
//
//   const handleCloseModal = () => {
//     setSelectedProduct(null)
//     setModalType(null)
//   }
//
//   const handleSaveProduct = async (id, updatedData) => {
//     const result = await updateProduct(id, updatedData)
//     if (result) await fetchProducts(page, limit)
//   }
//
//   const handleDeleteProduct = async (id) => {
//     const result = await deleteProduct(id)
//     if (result) await fetchProducts(page, limit)
//   }
//
//   return (
//     <>
//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: 'row',
//           justifyContent: 'space-between'
//         }}
//       >
//         <Typography variant='h5' sx={{ mb: 2 }}>
//           Quản lý sản phẩm
//         </Typography>
//         <Button
//           variant='contained'
//           sx={{ mb: 2, backgroundColor: '#001f5d' }}
//           startIcon={<AddIcon />}
//           onClick={() => handleOpenModal('add')}
//         >
//           Thêm sản phẩm
//         </Button>
//       </Box>
//
//       <ProductTable
//         products={products}
//         loading={loading}
//         handleOpenModal={handleOpenModal}
//       />
//
//       <React.Suspense fallback={<></>}>
//         {modalType === 'add' && (
//           <AddProductModal
//             open
//             onClose={handleCloseModal}
//             onSuccess={() => fetchProducts(page, limit)}
//           />
//         )}
//         {modalType === 'view' && selectedProduct && (
//           <ViewProductModal
//             open
//             onClose={handleCloseModal}
//             product={selectedProduct}
//           />
//         )}
//         {modalType === 'edit' && selectedProduct && (
//           <EditProductModal
//             open
//             onClose={handleCloseModal}
//             product={selectedProduct}
//             onSave={handleSaveProduct}
//           />
//         )}
//         {modalType === 'delete' && selectedProduct && (
//           <DeleteProductModal
//             open
//             onClose={handleCloseModal}
//             product={selectedProduct}
//             onDelete={handleDeleteProduct}
//           />
//         )}
//       </React.Suspense>
//
//       <ProductPagination
//         page={page}
//         totalPages={totalPages}
//         onPageChange={handleChangePage}
//       />
//     </>
//   )
// }
//
// export default ProductManagement

import React from 'react'
import Box from '@mui/material/Box'

import ProductTable from './ProductTable'

import useProducts from '~/hooks/admin/useProducts'
import useCategories from '~/hooks/admin/useCategories'
import usePermissions from '~/hooks/usePermissions'
import { PermissionWrapper, RouteGuard } from '~/components/PermissionGuard'
import { useLocation } from 'react-router-dom'
const AddProductModal = React.lazy(() => import('./modal/AddProductModal'))
const EditProductModal = React.lazy(() => import('./modal/EditProductModal'))
const DeleteProductModal = React.lazy(
  () => import('./modal/DeleteProductModal')
)
const ViewProductModal = React.lazy(() => import('./modal/ViewProductModal'))
const ViewDesc = React.lazy(() => import('./modal/ViewDescriptionModal.jsx'))
import ViewDescriptionModal from '~/pages/admin/ProductManagement/modal/ViewDescriptionModal.jsx'
import useColorPalettes from '~/hooks/admin/useColorPalettes.js'
import useSizePalettes from '~/hooks/admin/useSizePalettes.js'

const ProductManagement = () => {
  const [page, setPage] = React.useState(1)
  const [modalType, setModalType] = React.useState(null)
  const [selectedProduct, setSelectedProduct] = React.useState(null)
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const searchFromUrl = queryParams.get('categoryId') || ''
  const [filters, setFilters] = React.useState({
    status: 'false',
    sort: 'newest',
    ...(searchFromUrl ? { categoryId: searchFromUrl } : {})
  })
  const { categories, fetchCategories } = useCategories()
  const {
    products,
    fetchProducts,
    loading,
    total,
    Save,
    updateProductById,
    deleteProductById,
    createNewProduct,
    ROWS_PER_PAGE,
    setROWS_PER_PAGE
  } = useProducts()
  React.useEffect(() => {
    if (searchFromUrl) {
      // Xoá `search` khỏi URL sau khi đã đưa vào filters
      const newParams = new URLSearchParams(location.categoryId)
      newParams.delete('categoryId')
      window.history.replaceState({}, '', `${location.pathname}?${newParams}`)
    }
  }, [])
  // Lấy trực tiếp user từ localStorage kh phải qua state, và xác thực xem có thuộc nằm trong phạm vi của permission hay không
  const { hasPermission } = usePermissions()
  console.log('hasPermission', hasPermission('product:create')) // true (admin:access và product):read)
  // const [showAdvancedFilter, setShowAdvancedFilter] = React.useState(false)

  const [colorPalette, setColorPalette] = React.useState(null)
  const [sizePalette, setSizePalette] = React.useState(null)
  const { getColorPaletteId } = useColorPalettes()
  const { getSizePaletteId } = useSizePalettes()

  React.useEffect(() => {
    fetchProducts(page, ROWS_PER_PAGE, filters)
  }, [page, ROWS_PER_PAGE, filters])

  const handleChangePage = (event, value) => setPage(value)

  const handleOpenModal = async (type, product = null) => {
    setSelectedProduct(product)
    setModalType(type)

    if (type === 'view' && product) {
      try {
        const colorPalette = await getColorPaletteId(product._id)
        const sizePalette = await getSizePaletteId(product._id)

        // Bạn có thể lưu dữ liệu này vào state nếu cần dùng ở modal
        setColorPalette(colorPalette || [])
        setSizePalette(sizePalette || [])
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu palette:', error)
      }
    }
  }
  const handleCloseModal = () => {
    setSelectedProduct(null)
    setModalType(null)
  }

  const handleSave = async (data, type, id) => {
    try {
      if (type === 'add') {
        await createNewProduct(data, filters)
      } else if (type === 'edit') {
        await updateProductById(id, data)
      } else if (type === 'delete') {
        await deleteProductById(data)
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
    <RouteGuard requiredPermissions={['admin:access', 'product:use']}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}
      ></Box>

      <ProductTable
        products={products}
        loading={loading}
        handleOpenModal={handleOpenModal}
        addProduct={() => handleOpenModal('add')}
        page={page - 1}
        rowsPerPage={ROWS_PER_PAGE}
        total={total}
        onPageChange={handleChangePage}
        onChangeRowsPerPage={(newLimit) => {
          setPage(1)
          setROWS_PER_PAGE(newLimit)
        }}
        onFilter={handleFilter}
        categories={categories}
        fetchCategories={fetchCategories}
        fetchProducts={fetchProducts}
        // Truyền quyền xuống component con
        permissions={{
          canCreate: hasPermission('product:create'),
          canEdit: hasPermission('product:update'),
          canDelete: hasPermission('product:delete'),
          canView: hasPermission('product:read')
        }}
        initialSearch={searchFromUrl}
      />

      <React.Suspense fallback={<></>}>
        <PermissionWrapper requiredPermissions={['product:create']}>
          {modalType === 'add' && (
            <AddProductModal
              open
              onClose={handleCloseModal}
              onSuccess={handleSave}
            />
          )}
        </PermissionWrapper>

        {modalType === 'view' && selectedProduct && (
          <ViewProductModal
            open
            onClose={handleCloseModal}
            product={selectedProduct}
            colorPalette={colorPalette}
            sizePalette={sizePalette}
          />
        )}

        <PermissionWrapper requiredPermissions={['product:update']}>
          {modalType === 'edit' && selectedProduct && (
            <EditProductModal
              open
              onClose={handleCloseModal}
              product={selectedProduct}
              onSave={handleSave}
            />
          )}
        </PermissionWrapper>

        <PermissionWrapper requiredPermissions={['product:delete']}>
          {modalType === 'delete' && selectedProduct && (
            <DeleteProductModal
              open
              onClose={handleCloseModal}
              product={selectedProduct}
              onDelete={handleSave}
            />
          )}
        </PermissionWrapper>

        {modalType === 'viewDesc' && selectedProduct && (
          <ViewDescriptionModal
            open
            onClose={handleCloseModal}
            product={selectedProduct}
          />
        )}
      </React.Suspense>
    </RouteGuard>
  )
}

export default ProductManagement
