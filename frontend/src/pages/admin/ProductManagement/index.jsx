// components/ProductManagement.jsx
import React from 'react'
import Typography from '@mui/material/Typography'
import ProductTable from './ProductTable'
import ProductPagination from './ProductPagination'
import useProducts from '~/hook/admin/useProducts'
import {
  updateProduct,
  deleteProduct
} from '~/services/admin/productService.js'

const AddProductModal = React.lazy(() => import('./modal/AddProductModal.jsx'))
const EditProductModal = React.lazy(
  () => import('./modal/EditProductModal.jsx')
)
const DeleteProductModal = React.lazy(
  () => import('./modal/DeleteProductModal.jsx')
)
const ViewProductModal = React.lazy(
  () => import('./modal/ViewProductModal.jsx')
)

const ProductManagement = () => {
  const [page, setPage] = React.useState(1)
  const [modalType, setModalType] = React.useState(null)
  const [selectedProduct, setSelectedProduct] = React.useState(null)

  const { products, totalPages, fetchProducts, loading } = useProducts()

  React.useEffect(() => {
    fetchProducts(page)
  }, [page])

  const handleOpenModal = (type, product = null) => {
    setSelectedProduct(product)
    setModalType(type)
  }

  const handleCloseModal = () => {
    setSelectedProduct(null)
    setModalType(null)
  }

  const handleChangePage = (event, value) => setPage(value)

  const handleSaveProduct = async (id, updatedData) => {
    const result = await updateProduct(id, updatedData)
    if (result) await fetchProducts(page)
  }

  const handleDeleteProduct = async (id) => {
    const result = await deleteProduct(id)
    if (result) await fetchProducts(page)
  }

  return (
    <>
      <Typography variant='h5' sx={{ mb: 2 }}>
        Quản lý sản phẩm
      </Typography>

      <ProductTable
        products={products}
        loading={loading}
        handleOpenModal={handleOpenModal}
      />

      <React.Suspense fallback={<></>}>
        {modalType === 'add' && (
          <AddProductModal
            open
            onClose={handleCloseModal}
            onSuccess={() => fetchProducts(page)}
          />
        )}
        {modalType === 'view' && selectedProduct && (
          <ViewProductModal
            open
            onClose={handleCloseModal}
            product={selectedProduct}
          />
        )}
        {modalType === 'edit' && selectedProduct && (
          <EditProductModal
            open
            onClose={handleCloseModal}
            product={selectedProduct}
            onSave={handleSaveProduct}
          />
        )}
        {modalType === 'delete' && selectedProduct && (
          <DeleteProductModal
            open
            onClose={handleCloseModal}
            product={selectedProduct}
            onDelete={handleDeleteProduct}
          />
        )}
      </React.Suspense>

      <ProductPagination
        page={page}
        totalPages={totalPages}
        onPageChange={handleChangePage}
      />
    </>
  )
}

export default ProductManagement
