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
  const [limit, setLimit] = React.useState(10)
  const [modalType, setModalType] = React.useState(null)
  const [selectedProduct, setSelectedProduct] = React.useState(null)
  const [filters, setFilters] = React.useState({
    status: 'false',
    sort: 'newest'
  })
  const {
    products,
    fetchProducts,
    loading,
    total,
    Save,
    fetchProductById,
    updateProductById,
    deleteProductById,
    createNewProduct
  } = useProducts()
  const { categories, fetchCategories } = useCategories()
  // const [showAdvancedFilter, setShowAdvancedFilter] = React.useState(false)

  const [colorPalette, setColorPalette] = React.useState(null)
  const [sizePalette, setSizePalette] = React.useState(null)
  const { getColorPaletteId } = useColorPalettes()
  const { getSizePaletteId } = useSizePalettes()

  React.useEffect(() => {
    fetchProducts(page, limit, filters)
  }, [page, limit, filters])

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

  // const handleSaveProduct = async (id, updatedData) => {
  //   try {
  //     const result = await updateProductById(id, updatedData)
  //     if (result) {
  //       const update = await fetchProductById(id)
  //       if (update) {
  //         Save(update)
  //       }
  //     }
  //     return result // Explicitly return the result
  //   } catch (error) {
  //     console.error('Error in handleSaveProduct:', error)
  //     return false // Return false on error
  //   }
  // }
  //
  // const handleDeleteProduct = async (id) => {
  //   try {
  //     const result = await deleteProductById(id)
  //     if (result) {
  //       const remove = await fetchProductById(id)
  //       if (remove) {
  //         Save(remove)
  //       }
  //     }
  //     return result // Explicitly return the result
  //   } catch (error) {
  //     console.error('Error in handleSaveProduct:', error)
  //     return false // Return false on error
  //   }
  // }

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
    <>
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
        rowsPerPage={limit}
        total={total}
        onPageChange={handleChangePage}
        onChangeRowsPerPage={(newLimit) => {
          setPage(1)
          setLimit(newLimit)
        }}
        onFilter={handleFilter}
        categories={categories}
        fetchCategories={fetchCategories}
        fetchProducts={fetchProducts}
      />

      <React.Suspense fallback={<></>}>
        {modalType === 'add' && (
          <AddProductModal
            open
            onClose={handleCloseModal}
            onSuccess={handleSave}
          />
        )}
        {modalType === 'view' && selectedProduct && (
          <ViewProductModal
            open
            onClose={handleCloseModal}
            product={selectedProduct}
            colorPalette={colorPalette}
            sizePalette={sizePalette}
          />
        )}
        {modalType === 'edit' && selectedProduct && (
          <EditProductModal
            open
            onClose={handleCloseModal}
            product={selectedProduct}
            onSave={handleSave}
          />
        )}
        {modalType === 'delete' && selectedProduct && (
          <DeleteProductModal
            open
            onClose={handleCloseModal}
            product={selectedProduct}
            onDelete={handleSave}
          />
        )}
        {modalType === 'viewDesc' && selectedProduct && (
          <ViewDescriptionModal
            open
            onClose={handleCloseModal}
            product={selectedProduct}
          />
        )}
      </React.Suspense>
    </>
  )
}

export default ProductManagement
